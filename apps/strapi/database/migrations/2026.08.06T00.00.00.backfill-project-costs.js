'use strict';

/**
 * Backfill grant.project-cost rows from selected_projects + combined_cost_of_projects.
 *
 * Strapi runs migrations BEFORE schema sync, so this migration creates the
 * component + cmps join tables when missing, then fills data.
 *
 * Tier 1 — single distinct project type: 100% of combined cost, source=applicant
 * Tier 2 — multiple types: even split with remainder on first row, source=even-split
 *
 * Dedupes draft+published project-type link doubling by document_id (prefers
 * the published row for snapshot fields). Skips apps with no types or null cost.
 * Idempotent: skips applications that already have project_costs components.
 */

const COMPONENT_TABLE = 'components_grant_project_costs';
const CMPS_TABLE = 'grant_application_finals_cmps';
const COMPONENT_TYPE = 'grant.project-cost';
const FIELD = 'project_costs';

async function ensureTables(knex) {
  if (!(await knex.schema.hasTable(COMPONENT_TABLE))) {
    await knex.schema.createTable(COMPONENT_TABLE, (table) => {
      table.increments('id').unsigned().primary();
      table.integer('project_type_id').nullable();
      table.string('name').nullable();
      table.string('classification').nullable();
      // Match Strapi biginteger column shape used elsewhere (bigint).
      table.bigInteger('amount').nullable();
      table.string('source').nullable();
    });
  }

  if (!(await knex.schema.hasTable(CMPS_TABLE))) {
    await knex.schema.createTable(CMPS_TABLE, (table) => {
      table.increments('id').unsigned().primary();
      table.integer('entity_id').unsigned().nullable().index();
      table.integer('cmp_id').unsigned().nullable();
      table.string('component_type').nullable().index();
      table.string('field').nullable().index();
      table.double('order').unsigned().nullable();
    });
  }
}

/**
 * For each application, return distinct project types (by document_id),
 * preferring the published project_types row when both draft+published exist.
 */
async function loadApplicationProjects(knex) {
  const rows = await knex('grant_application_finals as gaf')
    .join(
      'grant_application_finals_selected_projects_lnk as lnk',
      'lnk.grant_application_final_id',
      'gaf.id'
    )
    .join('project_types as pt', 'pt.id', 'lnk.project_type_id')
    .whereNotNull('gaf.combined_cost_of_projects')
    .select(
      'gaf.id as application_id',
      'gaf.combined_cost_of_projects',
      'pt.id as project_type_id',
      'pt.document_id',
      'pt.name',
      'pt.classification',
      'pt.published_at',
      'lnk.project_type_ord'
    )
    .orderBy([
      { column: 'gaf.id', order: 'asc' },
      { column: 'lnk.project_type_ord', order: 'asc' },
      { column: 'pt.id', order: 'asc' },
    ]);

  /** @type {Map<number, { combined: number, types: Map<string, object> }>} */
  const byApp = new Map();

  for (const row of rows) {
    let app = byApp.get(row.application_id);
    if (!app) {
      app = {
        combined: Number(row.combined_cost_of_projects),
        types: new Map(),
      };
      byApp.set(row.application_id, app);
    }

    const docId = row.document_id || `id:${row.project_type_id}`;
    const existing = app.types.get(docId);
    const isPublished = row.published_at != null;

    // Prefer published snapshot; keep first-seen order via Map insertion order.
    if (!existing) {
      app.types.set(docId, {
        project_type_id: row.project_type_id,
        name: row.name,
        classification: row.classification,
        isPublished,
      });
    } else if (isPublished && !existing.isPublished) {
      app.types.set(docId, {
        project_type_id: row.project_type_id,
        name: row.name,
        classification: row.classification,
        isPublished,
      });
    }
  }

  return byApp;
}

async function alreadyBackfilledIds(knex) {
  const existing = await knex(CMPS_TABLE)
    .where({ component_type: COMPONENT_TYPE, field: FIELD })
    .distinct('entity_id')
    .pluck('entity_id');
  return new Set(existing.map((id) => Number(id)));
}

async function up(knex) {
  await ensureTables(knex);

  const already = await alreadyBackfilledIds(knex);
  const byApp = await loadApplicationProjects(knex);

  let tier1 = 0;
  let tier2 = 0;
  let skipped = 0;

  for (const [applicationId, app] of byApp) {
    if (already.has(applicationId)) {
      skipped += 1;
      continue;
    }

    const types = [...app.types.values()];
    if (types.length === 0 || !Number.isFinite(app.combined)) {
      skipped += 1;
      continue;
    }

    const n = types.length;
    const total = Math.round(app.combined);
    const source = n === 1 ? 'applicant' : 'even-split';
    const base = n === 1 ? total : Math.floor(total / n);
    const remainder = n === 1 ? 0 : total - base * n;

    for (let i = 0; i < n; i += 1) {
      const type = types[i];
      const amount = i === 0 ? base + remainder : base;

      const [cmpId] = await knex(COMPONENT_TABLE).insert({
        project_type_id: type.project_type_id,
        name: type.name,
        classification: type.classification,
        amount,
        source,
      });

      await knex(CMPS_TABLE).insert({
        entity_id: applicationId,
        cmp_id: cmpId,
        component_type: COMPONENT_TYPE,
        field: FIELD,
        order: i + 1,
      });
    }

    if (n === 1) tier1 += 1;
    else tier2 += 1;
  }

  console.log(
    `[backfill-project-costs] tier1=${tier1} tier2=${tier2} skipped=${skipped}`
  );
}

module.exports = { up };
