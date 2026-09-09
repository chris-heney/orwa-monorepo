/**
 * Push the versioned "Grant Award Letter" email body
 * (scripts/fixtures/email-templates/grant-award-letter.html) into Strapi.
 *
 * The template itself lives in the `email-template` collection and is edited
 * through member-manager (Email Templates). This script exists so the body
 * can be reviewed in git and applied to local + production without pasting
 * into the rich-text editor by hand.
 *
 * Usage (from repo root):
 *   npx tsx scripts/update-grant-award-letter-template.ts --dry-run
 *   npx tsx scripts/update-grant-award-letter-template.ts                 # local Strapi (http://localhost:13370/api)
 *   npx tsx scripts/update-grant-award-letter-template.ts --api=production
 *
 * Auth (one of):
 *   STRAPI_API_TOKEN=...                       (API token with email-template find/update)
 *   STRAPI_USER=... STRAPI_PASSWORD=...        (users-permissions login, same as member-manager)
 *   --token=... / --user=... --password=...
 *
 * Options:
 *   --endpoint=https://host/api   override the API base
 *   --dry-run                     fetch + diff only, no write
 *
 * The previous body is always written to tmp/email-template-backups/ before
 * the update so it can be restored.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const FIXTURE = join(__dirname, "fixtures", "email-templates", "grant-award-letter.html");
const BACKUP_DIR = join(ROOT, "tmp", "email-template-backups");

const TEMPLATE_NAME = "Grant Award Letter";
const REQUIRED_TAGS = [
  "{point_of_contact.first}",
  "{point_of_contact.last}",
  "{application_id}",
  "{approved_projects}",
  "{legal_entity_name}",
];
const REQUIRED_TEXT = ["September 1, 2028"];

type Args = {
  api: "local" | "production";
  endpoint: string;
  dryRun: boolean;
  token?: string;
  user?: string;
  password?: string;
};

function parseArgs(argv: string[]): Args {
  const get = (name: string) =>
    argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
  const api = get("api") === "production" ? "production" : "local";
  const endpoint =
    get("endpoint") ??
    (api === "production" ? "https://admin.orwa.org/api" : "http://localhost:13370/api");
  return {
    api,
    endpoint: endpoint.replace(/\/+$/, ""),
    dryRun: argv.includes("--dry-run"),
    token: get("token") ?? process.env.STRAPI_API_TOKEN,
    user: get("user") ?? process.env.STRAPI_USER,
    password: get("password") ?? process.env.STRAPI_PASSWORD,
  };
}

async function bearer(args: Args): Promise<string> {
  if (args.token) return args.token;
  if (args.user && args.password) {
    const res = await fetch(`${args.endpoint}/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier: args.user, password: args.password }),
    });
    if (!res.ok) throw new Error(`Login failed: ${res.status} ${await res.text()}`);
    const json = (await res.json()) as { jwt: string };
    return json.jwt;
  }
  throw new Error(
    "No credentials. Set STRAPI_API_TOKEN, or STRAPI_USER + STRAPI_PASSWORD (or --token / --user --password)."
  );
}

type Template = {
  id: number;
  documentId: string;
  email_name: string;
  subject: string;
  body: string;
  updatedAt: string;
};

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const body = readFileSync(FIXTURE, "utf8").trim();

  const missingTags = REQUIRED_TAGS.filter((tag) => !body.includes(tag));
  const missingText = REQUIRED_TEXT.filter((text) => !body.includes(text));
  if (missingTags.length || missingText.length) {
    throw new Error(
      `Fixture is missing required content: ${[...missingTags, ...missingText].join(", ")}`
    );
  }
  if (/\$\{/.test(body)) {
    // `${tag}` is the member-manager currency-format syntax; this template has
    // no dollar figures, so any occurrence is a typo.
    throw new Error("Fixture contains a `${...}` currency tag; the award letter has none.");
  }

  const auth = await bearer(args);
  const headers = { Authorization: `Bearer ${auth}`, "Content-Type": "application/json" };

  const listRes = await fetch(
    `${args.endpoint}/email-templates?filters[email_name][$eq]=${encodeURIComponent(TEMPLATE_NAME)}&fields[0]=email_name&fields[1]=subject&fields[2]=body&fields[3]=updatedAt`,
    { headers }
  );
  if (!listRes.ok) throw new Error(`List failed: ${listRes.status} ${await listRes.text()}`);
  const list = (await listRes.json()) as { data: Template[] };
  if (list.data.length !== 1) {
    throw new Error(`Expected exactly one "${TEMPLATE_NAME}" template, found ${list.data.length}`);
  }
  const current = list.data[0];

  console.log(`[${args.api}] ${args.endpoint}`);
  console.log(`Template: ${current.email_name} (documentId ${current.documentId}, id ${current.id})`);
  console.log(`Subject (unchanged): ${current.subject}`);
  console.log(`Current body: ${current.body.length} chars, updated ${current.updatedAt}`);
  console.log(`New body:     ${body.length} chars`);
  console.log(`Old deadline present: ${/September 1, 2027/.test(current.body)} → new: ${/September 1, 2028/.test(body)}`);

  if (current.body.trim() === body) {
    console.log("Body already up to date; nothing to do.");
    return;
  }

  if (!existsSync(BACKUP_DIR)) mkdirSync(BACKUP_DIR, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backup = join(BACKUP_DIR, `${args.api}-${current.documentId}-${stamp}.html`);
  writeFileSync(backup, current.body);
  console.log(`Backed up previous body → ${backup}`);

  if (args.dryRun) {
    console.log("--dry-run: not writing.");
    return;
  }

  const putRes = await fetch(`${args.endpoint}/email-templates/${current.documentId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify({ data: { body } }),
  });
  if (!putRes.ok) throw new Error(`Update failed: ${putRes.status} ${await putRes.text()}`);

  const verifyRes = await fetch(
    `${args.endpoint}/email-templates/${current.documentId}?fields[0]=body&fields[1]=updatedAt`,
    { headers }
  );
  const verify = (await verifyRes.json()) as { data: Template };
  const ok = verify.data.body.trim() === body;
  console.log(ok ? `Updated (updatedAt ${verify.data.updatedAt}).` : "WARNING: read-back body differs!");
  if (!ok) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
