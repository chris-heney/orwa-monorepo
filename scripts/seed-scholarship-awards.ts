/**
 * Seed Strapi with realistic scholarship applications + award nominations
 * via the same public submit path the SPAs use (upload → map*Payload → POST /submissions/…).
 *
 * Usage (from repo root):
 *   npx tsx scripts/seed-scholarship-awards.ts
 *   npx tsx scripts/seed-scholarship-awards.ts --count=10
 *   npx tsx scripts/seed-scholarship-awards.ts --only=scholarship
 *   npx tsx scripts/seed-scholarship-awards.ts --only=awards --count=5
 *   npm run seed:scholarship-awards
 *
 * Production (explicit flag required; refuses admin.orwa.org / orwa.org otherwise):
 *   npx tsx scripts/seed-scholarship-awards.ts --api=production --emails --count=12
 *   SEED_API_ENDPOINT=https://admin.orwa.org/api npx tsx scripts/seed-scholarship-awards.ts --api=production --emails
 *
 * Local loads API URL + key from apps/scholarship-application/.env (fallback: apps/awards/.env).
 * `--api=production` loads each app's .env.production instead.
 * Does not print the API key. Prefixes names with "E2E Seed" (local) or "E2E Prod" (production) + run id.
 * Notifications default OFF. Pass `--emails` / `--notify` to fire Email Manager templates.
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";
import { faker } from "@faker-js/faker";

import { mapScholarshipPayload } from "../apps/scholarship-application/src/helpers/mapScholarshipPayload";
import { scholarshipDefaultPayload } from "../apps/scholarship-application/src/helpers/scholarshipDefaultPayload";
import { mapAwardNominationPayload } from "../apps/awards/src/helpers/mapAwardNominationPayload";
import { awardDefaultPayload } from "../apps/awards/src/helpers/awardDefaultPayload";
import type { IScholarshipApplicationPayload } from "../apps/scholarship-application/src/types/types";
import type { IAwardNominationPayload } from "../apps/awards/src/types/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FIXTURES = join(__dirname, "fixtures", "seed-submissions");

const RUN_ID = faker.string.alphanumeric(8).toLowerCase();
let PREFIX = `E2E Seed ${RUN_ID}`;

type CliArgs = {
  count: number;
  only: "all" | "scholarship" | "awards";
  production: boolean;
  emails: boolean;
};

type WatersystemRow = {
  id: number | string;
  documentId?: string;
  name: string;
  county?: string;
};

type UploadResult = { id: number; documentId?: string };

function parseArgs(argv: string[]): CliArgs {
  let count = 10;
  let only: CliArgs["only"] = "all";
  let production = false;
  let emails = false;
  for (const arg of argv) {
    if (arg.startsWith("--count=")) {
      const n = Number(arg.slice("--count=".length));
      if (!Number.isFinite(n) || n < 1) {
        throw new Error(`Invalid --count: ${arg}`);
      }
      count = Math.floor(n);
    } else if (arg.startsWith("--only=")) {
      const v = arg.slice("--only=".length);
      if (v !== "scholarship" && v !== "awards" && v !== "all") {
        throw new Error(`Invalid --only (use scholarship|awards|all): ${arg}`);
      }
      only = v;
    } else if (
      arg === "--api=production" ||
      arg === "--production" ||
      arg === "--api=prod"
    ) {
      production = true;
    } else if (arg === "--emails" || arg === "--notify") {
      emails = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        [
          "Usage: npx tsx scripts/seed-scholarship-awards.ts [options]",
          "  --count=10",
          "  --only=scholarship|awards|all",
          "  --api=production   target admin.orwa.org using apps/*/.env.production",
          "  --emails|--notify  send Email Manager notifications (default: off)",
        ].join("\n")
      );
      process.exit(0);
    }
  }
  return { count, only, production, emails };
}

function isProductionHost(endpoint: string): boolean {
  try {
    const host = new URL(endpoint).hostname;
    return host === "admin.orwa.org" || host === "orwa.org";
  } catch {
    return false;
  }
}

function loadApiConfig(production: boolean): { apiBase: string; apiKey: string } {
  const candidates = production
    ? [
        join(ROOT, "apps/scholarship-application/.env.production"),
        join(ROOT, "apps/awards/.env.production"),
        join(ROOT, "apps/conference-registration/.env.production"),
      ]
    : [
        join(ROOT, "apps/scholarship-application/.env"),
        join(ROOT, "apps/scholarship-application/.env.development"),
        join(ROOT, "apps/awards/.env"),
        join(ROOT, "apps/awards/.env.development"),
      ];
  for (const file of candidates) {
    if (existsSync(file)) loadEnv({ path: file, override: false, quiet: true });
  }

  const endpoint = (
    process.env.SEED_API_ENDPOINT?.trim() ||
    process.env.VITE_API_ENDPOINT?.trim() ||
    (production ? "https://admin.orwa.org/api" : "http://localhost:13370/api")
  ).replace(/\/$/, "");
  const apiKey = process.env.VITE_API_KEY?.trim();
  if (!apiKey) {
    throw new Error(
      production
        ? "Missing VITE_API_KEY in apps/*/.env.production"
        : "Missing VITE_API_KEY in apps/scholarship-application/.env or apps/awards/.env"
    );
  }

  if (isProductionHost(endpoint) && !production) {
    throw new Error(
      `Refusing to seed production host (${new URL(endpoint).hostname}). Pass --api=production.`
    );
  }
  if (production && !isProductionHost(endpoint)) {
    throw new Error(
      `--api=production requires admin.orwa.org / orwa.org (got ${endpoint}). Set SEED_API_ENDPOINT or apps/*/.env.production.`
    );
  }

  return { apiBase: endpoint, apiKey };
}

function notificationAdmin(emails: boolean) {
  return {
    registrantNotification: emails,
    adminNotification: emails,
    customEmail: "",
    resubmit: true,
  };
}

async function apiGet<T>(
  apiBase: string,
  apiKey: string,
  pathAndQuery: string
): Promise<T> {
  const res = await fetch(`${apiBase}/${pathAndQuery}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });
  if (!res.ok) {
    throw new Error(`GET ${pathAndQuery} → ${res.status} ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

async function apiPostJson<T>(
  apiBase: string,
  apiKey: string,
  path: string,
  body: unknown
): Promise<T> {
  const res = await fetch(`${apiBase}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const json = (await res.json()) as T & { message?: string; error?: string };
  if (!res.ok || (json as { message?: string }).message === "error") {
    throw new Error(
      `POST ${path} → ${res.status} ${JSON.stringify(json).slice(0, 500)}`
    );
  }
  return json;
}

async function uploadFile(
  apiBase: string,
  apiKey: string,
  filePath: string,
  filename: string,
  mime: string
): Promise<string | number> {
  const buf = readFileSync(filePath);
  const blob = new Blob([buf], { type: mime });
  const form = new FormData();
  form.append("files", blob, filename);

  const res = await fetch(`${apiBase}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`upload ${filename} → ${res.status} ${await res.text()}`);
  }
  const data = (await res.json()) as UploadResult[];
  const file = data[0];
  if (!file) throw new Error(`upload ${filename}: empty response`);
  // Match SPA uploadService: prefer documentId, fall back to numeric id
  return file.documentId || file.id;
}

async function fetchWatersystems(
  apiBase: string,
  apiKey: string
): Promise<WatersystemRow[]> {
  const json = await apiGet<{ data: WatersystemRow[] }>(
    apiBase,
    apiKey,
    "watersystems?pagination[limit]=1000&sort=name:ASC&fields[0]=id&fields[1]=documentId&fields[2]=name&fields[3]=county"
  );
  const rows = Array.isArray(json.data) ? json.data : [];
  const usable = rows.filter((w) => w.documentId || w.id);
  if (usable.length === 0) {
    throw new Error("No watersystems returned from API");
  }
  return usable;
}

function pick<T>(arr: T[]): T {
  return arr[faker.number.int({ min: 0, max: arr.length - 1 })];
}

function phone(): string {
  return faker.helpers.fromRegExp("+1-405-[2-9][0-9]{2}-[0-9]{4}");
}

function okZip(): string {
  return faker.helpers.fromRegExp("73[0-9]{3}");
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function seedEmail(local: string): string {
  return `${local}.${RUN_ID}@e2e-seed.orwa.local`.toLowerCase();
}

const RELATIONSHIPS: Array<
  IScholarshipApplicationPayload["relationship"]
> = ["Self", "DependentChild", "DependentGrandchild"];

const EDUCATION_TYPES: Array<
  NonNullable<IScholarshipApplicationPayload["education_type"]>
> = ["FourYearCollege", "TwoYearCollege", "VocationalSchool"];

const AWARD_TYPES: Array<IAwardNominationPayload["award_type"]> = [
  "System of the Year",
  "Excellence in Operations",
  "Excellence in Management",
  "Excellence in Office Operations",
];

const OK_COUNTIES = [
  "Oklahoma",
  "Cleveland",
  "Tulsa",
  "Canadian",
  "Comanche",
  "Payne",
  "Garfield",
  "Kay",
];

type FixtureIds = {
  pdf: string | number;
  png: string | number;
  jpg: string | number;
};

async function uploadFixtures(
  apiBase: string,
  apiKey: string,
  label: string
): Promise<FixtureIds> {
  const tag = `${RUN_ID}-${label}`;
  const [pdf, png, jpg] = await Promise.all([
    uploadFile(
      apiBase,
      apiKey,
      join(FIXTURES, "minimal.pdf"),
      `${tag}.pdf`,
      "application/pdf"
    ),
    uploadFile(
      apiBase,
      apiKey,
      join(FIXTURES, "minimal.png"),
      `${tag}.png`,
      "image/png"
    ),
    uploadFile(
      apiBase,
      apiKey,
      join(FIXTURES, "minimal.jpg"),
      `${tag}.jpg`,
      "image/jpeg"
    ),
  ]);
  return { pdf, png, jpg };
}

function buildScholarshipDraft(
  index: number,
  watersystem: WatersystemRow,
  files: FixtureIds
): IScholarshipApplicationPayload {
  const relationship = RELATIONSHIPS[index % RELATIONSHIPS.length]!;
  const firstYear: "Yes" | "No" = index % 2 === 0 ? "Yes" : "No";
  const under18 = index % 3 === 0;
  const financialRows = (index % 3) + 1;

  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const applicantEmail = seedEmail(`scholarship.${index}.${first}.${last}`);

  const participantFirst =
    relationship === "Self" ? first : faker.person.firstName();
  const participantLast =
    relationship === "Self" ? last : faker.person.lastName();
  const participantEmail =
    relationship === "Self"
      ? applicantEmail
      : seedEmail(`participant.${index}.${participantFirst}`);

  const street = faker.location.streetAddress();
  const city = faker.helpers.arrayElement([
    "Oklahoma City",
    "Norman",
    "Stillwater",
    "Tulsa",
    "Edmond",
  ]);

  const draft: IScholarshipApplicationPayload = {
    ...scholarshipDefaultPayload,
    applicant_first_name: first,
    applicant_middle_name: faker.helpers.maybe(() => faker.person.middleName(), {
      probability: 0.4,
    }),
    applicant_last_name: `${PREFIX} ${last}`,
    applicant_phone: phone(),
    applicant_email: applicantEmail,
    applicant_street: street,
    applicant_city: city,
    applicant_state: "Oklahoma",
    applicant_zip: okZip(),

    system_name: watersystem.name,
    watersystem: watersystem.documentId || watersystem.id,
    relationship,
    eligible_participant_name: {
      first: participantFirst,
      last: participantLast,
    },
    eligible_participant_title: faker.helpers.arrayElement([
      "Operator",
      "Director",
      "Manager",
      "Clerk",
      "Board Member",
    ]),
    eligible_participant_phone: phone(),
    eligible_participant_email: participantEmail,
    eligible_participant_address: {
      street: faker.location.streetAddress(),
      city,
      state: "Oklahoma",
      zip: okZip(),
    },

    school_name: `${faker.company.name()} High School`,
    graduation_date: faker.date
      .between({ from: "2023-05-01", to: "2026-06-01" })
      .toISOString()
      .slice(0, 10),
    school_address: {
      street: faker.location.streetAddress(),
      city,
      state: "Oklahoma",
      zip: okZip(),
    },
    gpa: Number(faker.number.float({ min: 2.5, max: 4, fractionDigits: 2 })),
    sat_score: faker.number.int({ min: 900, max: 1550 }),
    act_score: faker.number.int({ min: 18, max: 35 }),
    transcript: files.pdf,
    test_scores: files.pdf,

    first_year: firstYear,
    credits_completed: firstYear === "No" ? faker.number.int({ min: 12, max: 90 }) : 0,
    credits_required: faker.helpers.arrayElement([60, 64, 120, 124]),
    college_gpa:
      firstYear === "No"
        ? Number(faker.number.float({ min: 2.5, max: 4, fractionDigits: 2 }))
        : 0,
    education_type: pick(EDUCATION_TYPES),
    major: faker.helpers.arrayElement([
      "Environmental Science",
      "Civil Engineering",
      "Business Administration",
      "Biology",
      "Water Resources",
    ]),
    awards: faker.helpers.maybe(() => faker.lorem.sentence(), {
      probability: 0.6,
    }),

    recommender1_name: {
      first: faker.person.firstName(),
      last: faker.person.lastName(),
    },
    recommender1_email: seedEmail(`rec1.${index}`),
    recommender1_phone: phone(),
    recommendation_letter_1: files.pdf,
    recommender2_name: {
      first: faker.person.firstName(),
      last: faker.person.lastName(),
    },
    recommender2_email: seedEmail(`rec2.${index}`),
    recommender2_phone: phone(),
    recommendation_letter_2: files.pdf,

    financial_resources: Array.from({ length: financialRows }, () => ({
      institution: faker.helpers.arrayElement([
        "Pell Grant",
        "ORWEF Scholarship",
        "State Grant",
        "Institutional Aid",
        "Private Scholarship",
      ]),
      amount: faker.number.int({ min: 250, max: 5000 }),
    })),

    essay: files.pdf,
    biography: files.pdf,
    photograph: index % 2 === 0 ? files.jpg : files.png,
    applicant_pdf: files.pdf,

    age_confirm: under18
      ? "No, I am under the age of 18"
      : "Yes, I am 18 years or older",
    applicant_certification: true,
    applicant_certification_date: todayIso(),
    guardian_name: under18
      ? { first: faker.person.firstName(), last: faker.person.lastName() }
      : { first: "", last: "" },
    guardian_certification: under18 ? true : undefined,
    guardian_certification_date: under18 ? todayIso() : undefined,

    accepted_terms: [],
    adminOptions: notificationAdmin(false),
  };

  return draft;
}

function buildAwardDraft(
  index: number,
  watersystem: WatersystemRow,
  files: FixtureIds
): IAwardNominationPayload {
  const award_type = AWARD_TYPES[index % AWARD_TYPES.length]!;
  const isSystem = award_type === "System of the Year";
  const isIndividual =
    award_type === "Excellence in Operations" ||
    award_type === "Excellence in Management" ||
    award_type === "Excellence in Office Operations";
  const typedBio = index % 2 === 0;
  const boardViaFile = index % 2 === 0;

  const nomineeFirst = faker.person.firstName();
  const nomineeLast = faker.person.lastName();
  const nomineeName = isSystem
    ? watersystem.name
    : `${nomineeFirst} ${PREFIX} ${nomineeLast}`;

  const city = faker.helpers.arrayElement([
    "Norman",
    "Oklahoma City",
    "Stillwater",
    "Enid",
    "Lawton",
  ]);
  const county =
    watersystem.county ||
    faker.helpers.arrayElement(OK_COUNTIES);

  const draft: IAwardNominationPayload = {
    ...awardDefaultPayload,
    nominee_name: nomineeName,
    email: seedEmail(`nominee.${index}.${nomineeFirst}`),
    daytime_phone: phone(),
    address: faker.location.streetAddress(),
    city,
    state: "OK",
    zip: okZip(),
    county,

    nominator_first_name: faker.person.firstName(),
    nominator_last_name: `${PREFIX} ${faker.person.lastName()}`,
    nominator_address: faker.location.streetAddress(),
    nominator_address_2: faker.helpers.maybe(() => "Suite 100", {
      probability: 0.3,
    }),
    nominator_city: city,
    nominator_state: "Oklahoma",
    nominator_zip: okZip(),
    nominator_country: "United States",
    nominator_phone: phone(),
    nominator_email: seedEmail(`nominator.${index}`),

    system_name: watersystem.name,
    watersystem: watersystem.documentId || watersystem.id,
    operation_start_date: faker.date
      .between({ from: "1975-01-01", to: "2015-01-01" })
      .toISOString()
      .slice(0, 10),
    employment_date: isIndividual
      ? faker.date
          .between({ from: "2005-01-01", to: "2022-01-01" })
          .toISOString()
          .slice(0, 10)
      : null,

    beginning_members: faker.number.int({ min: 50, max: 800 }),
    current_members: faker.number.int({ min: 100, max: 2500 }),
    clerical_employees: faker.number.int({ min: 0, max: 5 }),
    operation_maintenance_employees: faker.number.int({ min: 1, max: 12 }),
    management_employees: faker.number.int({ min: 1, max: 4 }),

    justification: faker.lorem.paragraphs(2),
    award_type,
    award_year: new Date().getFullYear(),

    biography_method: typedBio
      ? "Copy/Paste or Type Biography"
      : "Upload Biography",
    biography_text: typedBio
      ? faker.lorem.paragraphs(3)
      : undefined,
    biography_file: typedBio ? null : files.pdf,
    photographs: [files.jpg, files.png].slice(0, (index % 2) + 1),

    board_list_method: isSystem
      ? boardViaFile
        ? "File You Upload"
        : "Keyed In List"
      : "",
    board_list_file: isSystem && boardViaFile ? files.pdf : null,
    board_members:
      isSystem && !boardViaFile
        ? Array.from({ length: (index % 3) + 1 }, () => ({
            first: faker.person.firstName(),
            last: faker.person.lastName(),
            title: faker.helpers.arrayElement([
              "Chair",
              "Vice Chair",
              "Secretary",
              "Member",
              "Operator",
            ]),
          }))
        : [{ first: "", last: "", title: "" }],

    supporting_documents: index % 3 === 0 ? [files.pdf] : null,
    nomination_pdf: files.pdf,

    nomination_status: "Submitted",
    accepted_terms: [],
    adminOptions: notificationAdmin(false),
  };

  return draft;
}

type SeededScholarship = {
  index: number;
  name: string;
  relationship: string;
  documentId?: string;
  id?: unknown;
  createdAt?: string;
};

type SeededAward = {
  index: number;
  name: string;
  awardType: string;
  documentId?: string;
  id?: unknown;
  createdAt?: string;
};

async function seedScholarships(
  apiBase: string,
  apiKey: string,
  count: number,
  watersystems: WatersystemRow[],
  emails: boolean
) {
  console.log(
    `\nSeeding ${count} scholarship application(s)… emails=${emails ? "ON" : "off"}`
  );
  const created: SeededScholarship[] = [];
  const adminOptions = notificationAdmin(emails);

  for (let i = 0; i < count; i += 1) {
    const ws = watersystems[i % watersystems.length]!;
    const files = await uploadFixtures(apiBase, apiKey, `sch-${i}`);
    const draft = buildScholarshipDraft(i, ws, files);
    const payload = mapScholarshipPayload({
      ...draft,
      accepted_terms: [],
      adminOptions,
    } as IScholarshipApplicationPayload & Record<string, unknown>);

    const response = await apiPostJson<{
      message: string;
      scholarshipApplication?: {
        documentId?: string;
        id?: unknown;
        createdAt?: string;
      };
    }>(apiBase, apiKey, "submissions/scholarship-application", {
      ...payload,
      accepted_terms: [],
      adminOptions,
    });

    const row = response.scholarshipApplication;
    const name = `${draft.applicant_last_name}, ${draft.applicant_first_name}`;
    created.push({
      index: i,
      name,
      relationship: String(draft.relationship),
      documentId: row?.documentId,
      id: row?.id,
      createdAt: row?.createdAt,
    });
    console.log(
      `  [${i + 1}/${count}] ${name} (${draft.relationship}) → documentId=${row?.documentId ?? "?"} createdAt=${row?.createdAt ?? "?"}`
    );
  }

  return created;
}

async function seedAwards(
  apiBase: string,
  apiKey: string,
  count: number,
  watersystems: WatersystemRow[],
  emails: boolean
) {
  console.log(
    `\nSeeding ${count} award nomination(s)… emails=${emails ? "ON" : "off"}`
  );
  const created: SeededAward[] = [];
  const adminOptions = notificationAdmin(emails);

  for (let i = 0; i < count; i += 1) {
    const ws = watersystems[i % watersystems.length]!;
    const files = await uploadFixtures(apiBase, apiKey, `awd-${i}`);
    const draft = buildAwardDraft(i, ws, files);
    const payload = mapAwardNominationPayload({
      ...draft,
      accepted_terms: [],
      adminOptions,
    } as IAwardNominationPayload & Record<string, unknown>);

    const response = await apiPostJson<{
      message: string;
      awardNomination?: {
        documentId?: string;
        id?: unknown;
        createdAt?: string;
      };
    }>(apiBase, apiKey, "submissions/award-nomination", {
      ...payload,
      accepted_terms: [],
      adminOptions,
    });

    const row = response.awardNomination;
    created.push({
      index: i,
      name: draft.nominee_name,
      awardType: draft.award_type,
      documentId: row?.documentId,
      id: row?.id,
      createdAt: row?.createdAt,
    });
    console.log(
      `  [${i + 1}/${count}] ${draft.award_type} / ${draft.nominee_name} → documentId=${row?.documentId ?? "?"} createdAt=${row?.createdAt ?? "?"}`
    );
  }

  return created;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  PREFIX = args.production ? `E2E Prod ${RUN_ID}` : `E2E Seed ${RUN_ID}`;
  const { apiBase, apiKey } = loadApiConfig(args.production);

  console.log(`API: ${apiBase}`);
  console.log(`Run id: ${RUN_ID} (prefix "${PREFIX}")`);
  console.log(
    `Count: ${args.count}  only: ${args.only}  production: ${args.production}  emails: ${args.emails}`
  );

  const watersystems = await fetchWatersystems(apiBase, apiKey);
  console.log(`Watersystems available: ${watersystems.length}`);

  let scholarships: SeededScholarship[] = [];
  let awards: SeededAward[] = [];

  if (args.only === "all" || args.only === "scholarship") {
    scholarships = await seedScholarships(
      apiBase,
      apiKey,
      args.count,
      watersystems,
      args.emails
    );
  }
  if (args.only === "all" || args.only === "awards") {
    awards = await seedAwards(
      apiBase,
      apiKey,
      args.count,
      watersystems,
      args.emails
    );
  }

  console.log("\nDone.");
  console.log(
    `Scholarships created: ${scholarships.length}  Awards created: ${awards.length}`
  );
  console.log("\nSCHOLARSHIPS_JSON " + JSON.stringify(scholarships));
  console.log("AWARDS_JSON " + JSON.stringify(awards));
  if (scholarships.some((s) => !s.documentId)) {
    console.warn(
      "Some scholarship responses lacked documentId (check Strapi logs)."
    );
  }
  if (awards.some((a) => !a.documentId)) {
    console.warn(
      "Some award responses lacked documentId (check Strapi logs)."
    );
  }
}

main().catch((err) => {
  console.error("\nSeed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
