/**
 * Import real ORWA award nominations from a Gravity Forms CSV export into Strapi
 * via the same public submit path the SPA uses (upload → mapAwardNominationPayload
 * → POST /submissions/award-nomination).
 *
 * Unlike seed-scholarship-awards.ts (which fabricates data with faker), this script
 * replays actual historical submissions, including the photographs and biography
 * files still hosted on orwa.org.
 *
 * Usage (from repo root):
 *   npx tsx scripts/seed-awards-from-csv.ts --file=~/Downloads/orwa-awards-nomination-form-final-2026-08-20.csv
 *   npx tsx scripts/seed-awards-from-csv.ts --file=... --dry-run
 *   npx tsx scripts/seed-awards-from-csv.ts --file=... --limit=5 --skip-media
 *   npm run seed:awards-csv -- --file=...
 *
 * Production (explicit flag required; refuses admin.orwa.org / orwa.org otherwise):
 *   npx tsx scripts/seed-awards-from-csv.ts --file=... --api=production
 *
 * Local loads API URL + key from apps/awards/.env (fallback: apps/scholarship-application/.env).
 * `--api=production` loads each app's .env.production instead.
 * Notifications default OFF — pass --emails to fire Email Manager templates.
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

import { mapAwardNominationPayload } from "../apps/awards/src/helpers/mapAwardNominationPayload";
import { awardDefaultPayload } from "../apps/awards/src/helpers/awardDefaultPayload";
import type { IAwardNominationPayload } from "../apps/awards/src/types/types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DEFAULT_CACHE = join(ROOT, "node_modules/.cache/orwa-awards-csv-media");

/** orwa.org sits behind Cloudflare and 403s the default fetch UA. */
const DOWNLOAD_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

type CliArgs = {
  file: string;
  limit: number | null;
  dryRun: boolean;
  skipMedia: boolean;
  backfillMedia: boolean;
  emails: boolean;
  production: boolean;
  force: boolean;
  year: number | null;
  cacheDir: string;
};

type WatersystemRow = {
  id: number | string;
  documentId?: string;
  name: string;
  county?: string;
};

type MediaId = string | number;
/**
 * The intake controller resolves either form, but REST media relations only
 * accept the numeric id — so keep both and let the caller choose.
 */
type UploadedFile = { id: number; documentId?: string };

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function expandHome(p: string): string {
  return p.startsWith("~/") ? join(homedir(), p.slice(2)) : p;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = {
    file: "",
    limit: null,
    dryRun: false,
    skipMedia: false,
    backfillMedia: false,
    emails: false,
    production: false,
    force: false,
    year: null,
    cacheDir: DEFAULT_CACHE,
  };

  for (const arg of argv) {
    if (arg.startsWith("--file=")) {
      args.file = resolve(expandHome(arg.slice("--file=".length)));
    } else if (arg.startsWith("--limit=")) {
      const n = Number(arg.slice("--limit=".length));
      if (!Number.isFinite(n) || n < 1) throw new Error(`Invalid --limit: ${arg}`);
      args.limit = Math.floor(n);
    } else if (arg.startsWith("--year=")) {
      const n = Number(arg.slice("--year=".length));
      if (!Number.isFinite(n)) throw new Error(`Invalid --year: ${arg}`);
      args.year = Math.floor(n);
    } else if (arg.startsWith("--cache-dir=")) {
      args.cacheDir = resolve(expandHome(arg.slice("--cache-dir=".length)));
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--skip-media" || arg === "--no-media") {
      args.skipMedia = true;
    } else if (arg === "--backfill-media") {
      args.backfillMedia = true;
    } else if (arg === "--emails" || arg === "--notify") {
      args.emails = true;
    } else if (arg === "--force") {
      args.force = true;
    } else if (
      arg === "--api=production" ||
      arg === "--production" ||
      arg === "--api=prod"
    ) {
      args.production = true;
    } else if (arg === "--help" || arg === "-h") {
      console.log(
        [
          "Usage: npx tsx scripts/seed-awards-from-csv.ts --file=<export.csv> [options]",
          "  --file=PATH        Gravity Forms award-nomination CSV export (required)",
          "  --limit=N          import only the first N usable rows",
          "  --year=YYYY        force award_year (default: derived from Entry Date)",
          "  --dry-run          parse + report, submit nothing",
          "  --skip-media       do not download/upload photographs or biography files",
          "  --backfill-media   attach photos to existing nominations that have none",
          "  --cache-dir=PATH   downloaded media cache (default: node_modules/.cache/…)",
          "  --force            submit even if a matching nomination already exists",
          "  --emails|--notify  send Email Manager notifications (default: off)",
          "  --api=production   target admin.orwa.org using apps/*/.env.production",
        ].join("\n")
      );
      process.exit(0);
    }
  }

  if (!args.file) throw new Error("Missing --file=<path to CSV export>");
  if (!existsSync(args.file)) throw new Error(`CSV not found: ${args.file}`);
  return args;
}

// ---------------------------------------------------------------------------
// API config (mirrors seed-scholarship-awards.ts)
// ---------------------------------------------------------------------------

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
        join(ROOT, "apps/awards/.env.production"),
        join(ROOT, "apps/scholarship-application/.env.production"),
      ]
    : [
        join(ROOT, "apps/awards/.env"),
        join(ROOT, "apps/awards/.env.development"),
        join(ROOT, "apps/scholarship-application/.env"),
        join(ROOT, "apps/member-manager/.env.development"),
      ];
  for (const file of candidates) {
    if (existsSync(file)) loadEnv({ path: file, override: false, quiet: true });
  }

  const endpoint = (
    process.env.SEED_API_ENDPOINT?.trim() ||
    process.env.VITE_API_ENDPOINT?.trim() ||
    (production ? "https://admin.orwa.org/api" : "http://localhost:13370/api")
  ).replace(/\/$/, "");
  const apiBase = endpoint.endsWith("/api") ? endpoint : `${endpoint}/api`;

  const apiKey = (process.env.SEED_API_KEY || process.env.VITE_API_KEY)?.trim();
  if (!apiKey) {
    throw new Error(
      production
        ? "Missing VITE_API_KEY in apps/*/.env.production"
        : "Missing VITE_API_KEY in apps/awards/.env (or export SEED_API_KEY=…)"
    );
  }

  if (isProductionHost(apiBase) && !production) {
    throw new Error(
      `Refusing to seed production host (${new URL(apiBase).hostname}). Pass --api=production.`
    );
  }
  if (production && !isProductionHost(apiBase)) {
    throw new Error(
      `--api=production requires admin.orwa.org / orwa.org (got ${apiBase}).`
    );
  }

  return { apiBase, apiKey };
}

// ---------------------------------------------------------------------------
// CSV parsing (RFC 4180 — quoted fields carry embedded commas and newlines)
// ---------------------------------------------------------------------------

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') inQuotes = true;
    else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") field += char;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// ---------------------------------------------------------------------------
// Row → payload
// ---------------------------------------------------------------------------

type SystemJson = {
  id?: number | string;
  name?: string;
  county?: string;
  email?: string;
  phone?: string;
  address_physical_line1?: string;
  address_physical_line2?: string;
  address_physical_city?: string;
  address_physical_state?: string;
  address_physical_zip?: string;
};

const AWARD_TYPES = new Set<IAwardNominationPayload["award_type"]>([
  "System of the Year",
  "Water/Wastewater System of the Year",
  "Excellence in Operations",
  "Excellence in Management",
  "Excellence in Office Operations",
]);

/**
 * Nominations open through early January for that same year's conference, so a
 * January entry belongs to its own year and anything later to the next one.
 */
function awardYearFromEntryDate(entryDate: string): number | null {
  const match = /^(\d{4})-(\d{2})/.exec(entryDate.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  return month === 1 ? year : year + 1;
}

function parseSystemJson(raw: string): SystemJson {
  if (!raw.trim()) return {};
  try {
    return JSON.parse(raw) as SystemJson;
  } catch {
    return { name: raw.trim() };
  }
}

function joinName(...parts: string[]): string {
  return parts.map((p) => p.trim()).filter(Boolean).join(" ");
}

function toInt(raw: string): number | undefined {
  const value = raw.trim();
  if (!value) return undefined;
  const numeric = Number(value.replace(/[,\s]/g, ""));
  return Number.isFinite(numeric) ? Math.round(numeric) : undefined;
}

function toDate(raw: string): string | null {
  const value = raw.trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

function normalizeState(raw: string): string {
  const value = raw.trim();
  if (!value) return "";
  return /^oklahoma$/i.test(value) ? "OK" : value.toUpperCase();
}

function splitUrls(raw: string): string[] {
  return raw
    .split(",")
    .map((url) => url.trim())
    .filter((url) => /^https?:\/\//i.test(url));
}

type ParsedRow = {
  entryId: string;
  entryDate: string;
  awardType: IAwardNominationPayload["award_type"];
  awardYear: number;
  systemName: string;
  systemId?: number | string;
  nomineeName: string;
  draft: IAwardNominationPayload;
  photoUrls: string[];
  biographyUrl: string | null;
  boardListUrl: string | null;
};

function buildRow(
  header: string[],
  cells: string[],
  forcedYear: number | null
): { row: ParsedRow } | { skip: string; entryId: string } {
  const col = (name: string, occurrence = 0): string => {
    let seen = -1;
    for (let i = 0; i < header.length; i += 1) {
      if (header[i] === name) {
        seen += 1;
        if (seen === occurrence) return (cells[i] ?? "").trim();
      }
    }
    return "";
  };

  const entryId = col("Entry Id");
  const entryDate = col("Entry Date");

  const rawAwardType = col("Please select the type of award");
  if (!AWARD_TYPES.has(rawAwardType as IAwardNominationPayload["award_type"])) {
    return { skip: `unknown award type "${rawAwardType}"`, entryId };
  }
  const awardType = rawAwardType as IAwardNominationPayload["award_type"];
  const isSystemAward = awardType.endsWith("System of the Year");

  const system = parseSystemJson(col("System Name ()"));
  const systemName = (system.name || "").trim();

  const nomineeName =
    joinName(
      col("Nominee Name (Prefix)"),
      col("Nominee Name (First)"),
      col("Nominee Name (Middle)"),
      col("Nominee Name (Last)"),
      col("Nominee Name (Suffix)")
    ) || (isSystemAward ? systemName : "");

  const justification = col("What makes the nominee deserving of this award?");

  if (!nomineeName || !systemName || !justification) {
    const missing = [
      !nomineeName && "nominee name",
      !systemName && "system name",
      !justification && "justification",
    ]
      .filter(Boolean)
      .join(", ");
    return { skip: `missing ${missing}`, entryId };
  }

  const awardYear = forcedYear ?? awardYearFromEntryDate(entryDate);
  if (!awardYear) return { skip: `unparseable entry date "${entryDate}"`, entryId };

  const boardMembers = header
    .map((name, i) => ({ name, i }))
    .filter((c) => /^Board Members & Employees \d+$/.test(c.name))
    .map((c) => (cells[c.i] ?? "").trim())
    .filter(Boolean)
    .map((cell) => {
      const [first = "", last = "", title = ""] = cell.split("|");
      return { first: first.trim(), last: last.trim(), title: title.trim() };
    });

  const nominatorEmail = col("Nominator's  Email") || col("Nominator's Email");
  const nominatorPhone = col("Nominator's Phone");

  // The form never collected a nominee address — the system's physical address is
  // the closest truth, with the nominator's contact details as the fallback.
  const draft: IAwardNominationPayload = {
    ...awardDefaultPayload,
    nominee_name: nomineeName,
    email: system.email || nominatorEmail,
    daytime_phone: system.phone || nominatorPhone,
    address:
      joinName(
        system.address_physical_line1 || "",
        system.address_physical_line2 || ""
      ) || col("Nominator's Address (Street Address)"),
    city: system.address_physical_city || col("Nominator's Address (City)"),
    state:
      normalizeState(system.address_physical_state || "") ||
      normalizeState(col("Nominator's Address (State / Province)")) ||
      "OK",
    zip:
      system.address_physical_zip ||
      col("Nominator's Address (ZIP / Postal Code)"),
    county: system.county || undefined,

    nominator_first_name: joinName(
      col("Nominator's Name (Prefix)"),
      col("Nominator's Name (First)"),
      col("Nominator's Name (Middle)")
    ),
    nominator_last_name: joinName(
      col("Nominator's Name (Last)"),
      col("Nominator's Name (Suffix)")
    ),
    nominator_address: col("Nominator's Address (Street Address)"),
    nominator_address_2: col("Nominator's Address (Address Line 2)"),
    nominator_city: col("Nominator's Address (City)"),
    nominator_state: col("Nominator's Address (State / Province)"),
    nominator_zip: col("Nominator's Address (ZIP / Postal Code)"),
    nominator_country: col("Nominator's Address (Country)") || "United States",
    nominator_phone: nominatorPhone,
    nominator_email: nominatorEmail,

    system_name: systemName,
    award_name_printed: isSystemAward ? systemName : nomineeName,
    watersystem: undefined, // resolved against the target Strapi below
    operation_start_date: toDate(col("Date system began operation")),
    employment_date: toDate(col("Date Employed")),

    beginning_members: toInt(col("Number of beginning meter connections")),
    current_members: toInt(col("Number of current meter connections:")),
    clerical_employees: toInt(col("Clerical Employees")),
    operation_maintenance_employees: toInt(
      col("Operation & Maintenance Employees")
    ),
    management_employees: toInt(col("Management Employees")),

    justification,
    award_type: awardType,
    award_year: awardYear,

    biography_method:
      (col("How would you like to provide your biography?") as
        | IAwardNominationPayload["biography_method"]) || "",
    // The export ships two "Biography" columns: the upload URL, then the typed text.
    biography_text: col("Biography", 1) || undefined,
    biography_file: null,
    photographs: null,

    board_list_method: boardMembers.length
      ? "Keyed In List"
      : ((col("Provide Board Members & Employee List via") as
          | IAwardNominationPayload["board_list_method"]) || ""),
    board_list_file: null,
    board_members: boardMembers.length ? boardMembers : undefined,

    nomination_status: "Submitted",
    accepted_terms: [],
  };

  return {
    row: {
      entryId,
      entryDate,
      awardType,
      awardYear,
      systemName,
      systemId: system.id,
      nomineeName,
      draft,
      photoUrls: splitUrls(col("Photographs")),
      biographyUrl: splitUrls(col("Biography", 0))[0] ?? null,
      boardListUrl:
        splitUrls(col("Upload Board Member & Employee List"))[0] ?? null,
    },
  };
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

async function apiGet<T>(
  apiBase: string,
  apiKey: string,
  pathAndQuery: string
): Promise<T> {
  const res = await fetch(`${apiBase}/${pathAndQuery}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${apiKey}` },
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
  const json = (await res.json()) as T & { message?: string };
  if (!res.ok || json.message === "error") {
    throw new Error(
      `POST ${path} → ${res.status} ${JSON.stringify(json).slice(0, 500)}`
    );
  }
  return json;
}

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".pdf": "application/pdf",
  ".doc": "application/msword",
  ".docx":
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};

function cachePathFor(cacheDir: string, url: string): string {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  const name = decodeURIComponent(basename(new URL(url).pathname));
  return join(cacheDir, `${hash}-${name}`);
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** orwa.org's Cloudflare rate-limits bursts, so back off and retry on 429/5xx. */
async function downloadToCache(cacheDir: string, url: string): Promise<string> {
  const dest = cachePathFor(cacheDir, url);
  if (existsSync(dest)) return dest;

  let lastStatus = 0;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    if (attempt > 0) await sleep(1000 * 2 ** (attempt - 1));

    const res = await fetch(url, {
      headers: { "User-Agent": DOWNLOAD_UA, Accept: "*/*" },
    });
    if (res.ok) {
      const buffer = Buffer.from(await res.arrayBuffer());
      if (buffer.length === 0) throw new Error(`download ${url} → empty body`);
      mkdirSync(dirname(dest), { recursive: true });
      writeFileSync(dest, buffer);
      return dest;
    }

    lastStatus = res.status;
    if (res.status !== 429 && res.status < 500) break;
  }
  throw new Error(`download ${url} → ${lastStatus}`);
}

async function uploadFile(
  apiBase: string,
  apiKey: string,
  filePath: string
): Promise<UploadedFile> {
  const name = basename(filePath).replace(/^[0-9a-f]{12}-/, "");
  const mime = MIME_BY_EXT[extname(name).toLowerCase()] ?? "application/octet-stream";
  const form = new FormData();
  form.append("files", new Blob([readFileSync(filePath)], { type: mime }), name);

  const res = await fetch(`${apiBase}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
    body: form,
  });
  if (!res.ok) throw new Error(`upload ${name} → ${res.status} ${await res.text()}`);

  const [file] = (await res.json()) as UploadedFile[];
  if (!file) throw new Error(`upload ${name}: empty response`);
  return file;
}

/** Downloads + uploads, returning null (with a warning) if the source is gone. */
async function importRemoteFile(
  apiBase: string,
  apiKey: string,
  cacheDir: string,
  url: string
): Promise<UploadedFile | null> {
  try {
    return await uploadFile(apiBase, apiKey, await downloadToCache(cacheDir, url));
  } catch (err) {
    console.warn(`    ! media skipped (${(err as Error).message})`);
    return null;
  }
}

/** Match the SPA upload service: prefer documentId, fall back to numeric id. */
const submitId = (file: UploadedFile): MediaId => file.documentId || file.id;

// ---------------------------------------------------------------------------
// Watersystem matching
// ---------------------------------------------------------------------------

function normalizeSystemName(name: string): string {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

async function fetchWatersystems(
  apiBase: string,
  apiKey: string
): Promise<Map<string, WatersystemRow>> {
  const byName = new Map<string, WatersystemRow>();
  for (let page = 1; page <= 20; page += 1) {
    const json = await apiGet<{
      data: WatersystemRow[];
      meta?: { pagination?: { pageCount?: number } };
    }>(
      apiBase,
      apiKey,
      `watersystems?pagination[page]=${page}&pagination[pageSize]=100&sort=name:ASC` +
        "&fields[0]=id&fields[1]=documentId&fields[2]=name&fields[3]=county"
    );
    const rows = Array.isArray(json.data) ? json.data : [];
    for (const row of rows) {
      const key = normalizeSystemName(row.name || "");
      if (key && !byName.has(key)) byName.set(key, row);
    }
    const pageCount = json.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount || rows.length === 0) break;
  }
  return byName;
}

// ---------------------------------------------------------------------------
// Duplicate detection
// ---------------------------------------------------------------------------

function nominationKey(nominee: string, type: string, year: number): string {
  return `${normalizeSystemName(nominee)}|${type}|${year}`;
}

type ExistingRow = { documentId: string; photoCount: number };

async function fetchExisting(
  apiBase: string,
  apiKey: string
): Promise<Map<string, ExistingRow> | null> {
  try {
    const found = new Map<string, ExistingRow>();
    for (let page = 1; page <= 20; page += 1) {
      const json = await apiGet<{
        data: Array<{
          documentId?: string;
          nominee_name?: string;
          award_type?: string;
          award_year?: number;
          photographs?: unknown[] | null;
        }>;
        meta?: { pagination?: { pageCount?: number } };
      }>(
        apiBase,
        apiKey,
        `award-nominations?pagination[page]=${page}&pagination[pageSize]=100` +
          "&fields[0]=nominee_name&fields[1]=award_type&fields[2]=award_year" +
          "&populate[photographs][fields][0]=id"
      );
      const rows = Array.isArray(json.data) ? json.data : [];
      for (const row of rows) {
        if (!row.nominee_name || !row.award_type || !row.award_year) continue;
        const key = nominationKey(
          row.nominee_name,
          row.award_type,
          row.award_year
        );
        if (found.has(key)) continue;
        found.set(key, {
          documentId: row.documentId || "",
          photoCount: Array.isArray(row.photographs)
            ? row.photographs.length
            : 0,
        });
      }
      const pageCount = json.meta?.pagination?.pageCount ?? 1;
      if (page >= pageCount || rows.length === 0) break;
    }
    return found;
  } catch (err) {
    console.warn(
      `Could not read existing nominations for duplicate checks (${(err as Error).message}).`
    );
    return null;
  }
}

async function apiPutJson(
  apiBase: string,
  apiKey: string,
  path: string,
  body: unknown
): Promise<void> {
  const res = await fetch(`${apiBase}/${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`PUT ${path} → ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // A dry run never talks to Strapi, so it must not demand an API key.
  const api = args.dryRun ? null : loadApiConfig(args.production);

  console.log(`CSV:      ${args.file}`);
  console.log(`Endpoint: ${api?.apiBase ?? "(dry run — no API calls)"}`);
  console.log(
    `Mode:     ${args.dryRun ? "DRY RUN" : "IMPORT"}  media=${args.skipMedia ? "off" : "on"}  emails=${args.emails ? "ON" : "off"}`
  );

  const rows = parseCsv(readFileSync(args.file, "utf8").replace(/^﻿/, ""));
  const header = rows[0] ?? [];
  const dataRows = rows
    .slice(1)
    .filter((row) => row.some((cell) => cell.trim() !== ""));

  const parsed: ParsedRow[] = [];
  const skipped: Array<{ entryId: string; reason: string }> = [];
  for (const cells of dataRows) {
    const result = buildRow(header, cells, args.year);
    if ("skip" in result) skipped.push({ entryId: result.entryId, reason: result.skip });
    else parsed.push(result.row);
  }

  console.log(
    `\nParsed ${parsed.length} usable row(s) of ${dataRows.length}; ${skipped.length} skipped.`
  );
  for (const s of skipped) console.log(`  - entry ${s.entryId}: ${s.reason}`);

  const selected = args.limit ? parsed.slice(0, args.limit) : parsed;

  const adminOptions = {
    registrantNotification: args.emails,
    adminNotification: args.emails,
    customEmail: "",
    resubmit: true,
  };

  if (args.dryRun) {
    const photos = selected.reduce((n, r) => n + r.photoUrls.length, 0);
    const bios = selected.filter((r) => r.biographyUrl).length;
    console.log(
      `\nWould submit ${selected.length} nomination(s): ${photos} photo(s), ${bios} biography file(s).`
    );
    for (const row of selected) {
      console.log(
        `  ${row.awardYear}  ${row.awardType.padEnd(32)}  ${row.nomineeName} — ${row.systemName} ` +
          `(entry ${row.entryId}, ${row.photoUrls.length} photo(s))`
      );
    }

    const [sample] = selected;
    if (sample) {
      const payload = mapAwardNominationPayload({
        ...sample.draft,
        adminOptions,
      } as IAwardNominationPayload & Record<string, unknown>) as Record<string, unknown>;
      console.log(`\nSample payload for entry ${sample.entryId}:`);
      for (const [key, value] of Object.entries(payload)) {
        if (value === undefined || value === null || value === "") continue;
        const rendered =
          typeof value === "string" ? value : JSON.stringify(value);
        console.log(
          `  ${key.padEnd(32)} ${rendered.length > 90 ? `${rendered.slice(0, 90)}…` : rendered}`
        );
      }
    }
    return;
  }

  const { apiBase, apiKey } = api!;
  const watersystems = await fetchWatersystems(apiBase, apiKey);
  console.log(`Loaded ${watersystems.size} watersystem(s) for name matching.`);

  const existing =
    args.force && !args.backfillMedia ? null : await fetchExisting(apiBase, apiKey);

  let created = 0;
  let duplicates = 0;
  let backfilled = 0;
  const failures: Array<{ entryId: string; error: string }> = [];

  for (const [index, row] of selected.entries()) {
    const label = `[${index + 1}/${selected.length}] ${row.awardYear} ${row.nomineeName}`;
    const key = nominationKey(row.nomineeName, row.awardType, row.awardYear);
    const match = existing?.get(key);

    if (match) {
      // Backfill exists because orwa.org rate-limits bursts: a first pass can
      // create the record but lose some photos to 429s.
      const needsPhotos =
        args.backfillMedia &&
        !args.skipMedia &&
        match.documentId &&
        match.photoCount === 0 &&
        row.photoUrls.length > 0;

      if (!needsPhotos) {
        duplicates += 1;
        console.log(
          `${label} → already present, skipping (use --force to re-import)`
        );
        continue;
      }

      try {
        const ids: number[] = [];
        for (const url of row.photoUrls) {
          const file = await importRemoteFile(
            apiBase,
            apiKey,
            args.cacheDir,
            url
          );
          if (file) ids.push(file.id);
        }
        if (ids.length === 0) {
          console.warn(`${label} → backfill found no usable photos`);
          continue;
        }
        await apiPutJson(apiBase, apiKey, `award-nominations/${match.documentId}`, {
          data: { photographs: ids },
        });
        match.photoCount = ids.length;
        backfilled += 1;
        console.log(`${label} → backfilled ${ids.length} photo(s)`);
      } catch (err) {
        failures.push({ entryId: row.entryId, error: (err as Error).message });
        console.error(`${label} → BACKFILL FAILED: ${(err as Error).message}`);
      }
      continue;
    }

    try {
      const match = watersystems.get(normalizeSystemName(row.systemName));
      if (!match) {
        console.warn(`    ! no watersystem match for "${row.systemName}"`);
      }

      let photographs: MediaId[] | null = null;
      let biographyFile: MediaId | null = null;
      let boardListFile: MediaId | null = null;

      if (!args.skipMedia) {
        const uploaded: Array<UploadedFile | null> = [];
        for (const url of row.photoUrls) {
          uploaded.push(
            await importRemoteFile(apiBase, apiKey, args.cacheDir, url)
          );
        }
        const ids = uploaded
          .filter((file): file is UploadedFile => file != null)
          .map(submitId);
        photographs = ids.length ? ids : null;

        if (row.biographyUrl) {
          const file = await importRemoteFile(
            apiBase,
            apiKey,
            args.cacheDir,
            row.biographyUrl
          );
          biographyFile = file ? submitId(file) : null;
        }
        if (row.boardListUrl) {
          const file = await importRemoteFile(
            apiBase,
            apiKey,
            args.cacheDir,
            row.boardListUrl
          );
          boardListFile = file ? submitId(file) : null;
        }
      }

      const draft: IAwardNominationPayload = {
        ...row.draft,
        watersystem: match?.documentId || match?.id || row.systemId,
        // Media fields are typed as uploaded-file objects, but the intake controller
        // resolves bare upload ids too — same shape the SPA sends after an upload.
        photographs: photographs as unknown as IAwardNominationPayload["photographs"],
        biography_file:
          biographyFile as unknown as IAwardNominationPayload["biography_file"],
        board_list_file:
          boardListFile as unknown as IAwardNominationPayload["board_list_file"],
        adminOptions,
      };

      const payload = mapAwardNominationPayload(
        draft as IAwardNominationPayload & Record<string, unknown>
      );

      const response = await apiPostJson<{
        message: string;
        awardNomination?: { documentId?: string; id?: unknown; createdAt?: string };
      }>(apiBase, apiKey, "submissions/award-nomination", {
        ...payload,
        accepted_terms: [],
        adminOptions,
      });

      created += 1;
      existing?.set(key, {
        documentId: response.awardNomination?.documentId || "",
        photoCount: photographs?.length ?? 0,
      });
      console.log(
        `${label} — ${row.awardType} → documentId=${response.awardNomination?.documentId ?? "?"} ` +
          `photos=${photographs?.length ?? 0}`
      );
    } catch (err) {
      failures.push({ entryId: row.entryId, error: (err as Error).message });
      console.error(`${label} → FAILED: ${(err as Error).message}`);
    }
  }

  console.log(
    `\nDone. created=${created} backfilled=${backfilled} duplicates=${duplicates} ` +
      `failed=${failures.length} skipped=${skipped.length}`
  );
  if (failures.length) {
    for (const f of failures) console.error(`  entry ${f.entryId}: ${f.error}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
