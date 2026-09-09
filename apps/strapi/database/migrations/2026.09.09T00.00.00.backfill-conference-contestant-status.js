'use strict';

const TABLE = 'conference_contestants';
const COLUMN = 'status';

async function up(knex) {
  if (!(await knex.schema.hasTable(TABLE))) return;

  if (!(await knex.schema.hasColumn(TABLE, COLUMN))) {
    await knex.schema.table(TABLE, (table) => {
      table.string(COLUMN).defaultTo('active');
    });
  }

  await knex(TABLE)
    .whereNull(COLUMN)
    .orWhere(COLUMN, '')
    .update({ [COLUMN]: 'active' });
}

module.exports = { up };
