/**
 * Seed the award-winner collection from the transcribed orwa.org gallery in
 * apps/awards/src/data/awardWinners.ts.
 *
 * By default winners keep pointing at the images already hosted on orwa.org.
 * Pass --upload-photos to pull each image into Strapi's media library instead,
 * so the gallery no longer depends on WordPress staying up.
 *
 * Usage (from repo root):
 *   npx tsx scripts/seed-award-winners.ts --dry-run
 *   npx tsx scripts/seed-award-winners.ts
 *   npx tsx scripts/seed-award-winners.ts --upload-photos
 *   npm run seed:award-winners
 *
 * Reads API URL + key from apps/awards/.env (or SEED_API_ENDPOINT/SEED_API_KEY).
 * Refuses production hosts unless --api=production is passed.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, resolve } from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { config as loadEnv } from "dotenv";

import { AWARD_YEARS } from "../apps/awards/src/data/awardWinners";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CACHE = join(ROOT, "node_modules/.cache/orwa-award-winner-media");

/** orwa.org sits behind Cloudflare and 403s the default fetch UA. */
const DOWNLOAD_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36";

type Args = {
  dryRun: boolean;
  uploadPhotos: boolean;
  production: boolean;
  force: boolean;
};

function parseArgs(argv: string[]): Args {
  const args: Args = {
    dryRun: false,
    uploadPhotos: false,
    production: false,
    force: false,
  };
  for (const arg of argv) {
    if (arg === "--dry-run") args.dryRun = true;
    else if (arg === "--upload-photos") args.uploadPhotos = true;
    else if (arg === "--force") args.force = true;
    else if (
      arg === "--api=production" ||
      arg === "--production" ||
      arg === "--api=prod"
    )
      args.production = true;
    else if (arg === "--help" || arg === "-h") {
      console.log(
        [
          "Usage: npx tsx scripts/seed-award-winners.ts [options]",
          "  --dry-run          report what would be created, write nothing",
          "  --upload-photos    copy images into Strapi instead of linking orwa.org",
          "  --force            create rows even if a matching winner exists",
          "  --api=production   target admin.orwa.org using apps/awards/.env.production",
        ].join("\n")
      );
      process.exit(0);
    }
  }
  return args;
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
    ? [join(ROOT, "apps/awards/.env.production")]
    : [join(ROOT, "apps/awards/.env"), join(ROOT, "apps/awards/.env.development")];
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
  if (!apiKey) throw new Error("Missing VITE_API_KEY in apps/awards/.env");

  if (isProductionHost(apiBase) && !production) {
    throw new Error(
      `Refusing to seed production host (${new URL(apiBase).hostname}). Pass --api=production.`
    );
  }
  return { apiBase, apiKey };
}

async function apiGet<T>(apiBase: string, apiKey: string, path: string): Promise<T> {
  const res = await fetch(`${apiBase}/${path}`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) throw new Error(`GET ${path} → ${res.status} ${await res.text()}`);
  return res.json() as Promise<T>;
}

async function apiPost<T>(
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
  if (!res.ok) {
    throw new Error(`POST ${path} → ${res.status} ${(await res.text()).slice(0, 300)}`);
  }
  return res.json() as Promise<T>;
}

const sleep = (ms: number) => new Promise((done) => setTimeout(done, ms));

/** orwa.org's Cloudflare rate-limits bursts, so back off and retry on 429/5xx. */
async function downloadToCache(url: string): Promise<string> {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 12);
  const dest = join(CACHE, `${hash}-${basename(new URL(url).pathname)}`);
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

const MIME_BY_EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

async function uploadPhoto(
  apiBase: string,
  apiKey: string,
  url: string
): Promise<number | null> {
  try {
    const filePath = await downloadToCache(url);
    const name = basename(filePath).replace(/^[0-9a-f]{12}-/, "");
    const mime = MIME_BY_EXT[extname(name).toLowerCase()] ?? "image/jpeg";
    const form = new FormData();
    form.append("files", new Blob([readFileSync(filePath)], { type: mime }), name);

    const res = await fetch(`${apiBase}/upload`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, Accept: "application/json" },
      body: form,
    });
    if (!res.ok) throw new Error(`upload ${name} → ${res.status}`);
    const [file] = (await res.json()) as Array<{ id: number }>;
    return file?.id ?? null;
  } catch (err) {
    console.warn(`    ! photo skipped (${(err as Error).message})`);
    return null;
  }
}

function winnerKey(year: number, title: string, recipient: string): string {
  return [year, title, recipient]
    .join("|")
    .toLowerCase()
    .replace(/[^a-z0-9|]+/g, " ");
}

async function fetchExistingKeys(
  apiBase: string,
  apiKey: string
): Promise<Set<string>> {
  const keys = new Set<string>();
  for (let page = 1; page <= 20; page += 1) {
    const json = await apiGet<{
      data: Array<{ award_year?: number; title?: string; recipient?: string }>;
      meta?: { pagination?: { pageCount?: number } };
    }>(
      apiBase,
      apiKey,
      `award-winners?pagination[page]=${page}&pagination[pageSize]=100` +
        "&fields[0]=award_year&fields[1]=title&fields[2]=recipient"
    );
    const rows = Array.isArray(json.data) ? json.data : [];
    for (const row of rows) {
      if (!row.award_year || !row.title) continue;
      keys.add(winnerKey(row.award_year, row.title, row.recipient || ""));
    }
    const pageCount = json.meta?.pagination?.pageCount ?? 1;
    if (page >= pageCount || rows.length === 0) break;
  }
  return keys;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { apiBase, apiKey } = loadApiConfig(args.production);

  const rows = AWARD_YEARS.flatMap((entry) =>
    entry.winners.map((winner, index) => ({
      award_year: entry.year,
      title: winner.title,
      recipient: winner.recipient || "",
      photo_url: winner.full,
      thumbnail_url: winner.thumbnail,
      sort_order: index,
      is_published: true,
    }))
  );

  console.log(`Endpoint: ${apiBase}`);
  console.log(
    `Winners:  ${rows.length} across ${AWARD_YEARS.length} year(s)  ` +
      `photos=${args.uploadPhotos ? "upload to Strapi" : "link orwa.org"}`
  );

  if (args.dryRun) {
    for (const row of rows) {
      console.log(
        `  ${row.award_year}  ${row.title.padEnd(42)} ${row.recipient}`
      );
    }
    console.log(`\nWould create ${rows.length} winner(s).`);
    return;
  }

  const existing = args.force ? new Set<string>() : await fetchExistingKeys(apiBase, apiKey);
  let created = 0;
  let skipped = 0;
  const failures: string[] = [];

  for (const [index, row] of rows.entries()) {
    const label = `[${index + 1}/${rows.length}] ${row.award_year} ${row.title}`;
    const key = winnerKey(row.award_year, row.title, row.recipient);
    if (existing.has(key)) {
      skipped += 1;
      console.log(`${label} → already present, skipping`);
      continue;
    }

    try {
      const photo = args.uploadPhotos
        ? await uploadPhoto(apiBase, apiKey, row.photo_url)
        : null;

      await apiPost(apiBase, apiKey, "award-winners", {
        data: photo ? { ...row, photo } : row,
      });
      existing.add(key);
      created += 1;
      console.log(`${label} — ${row.recipient || "(no recipient)"}`);
    } catch (err) {
      failures.push(`${row.award_year} ${row.title}: ${(err as Error).message}`);
      console.error(`${label} → FAILED: ${(err as Error).message}`);
    }
  }

  console.log(
    `\nDone. created=${created} skipped=${skipped} failed=${failures.length}`
  );
  if (failures.length) {
    for (const failure of failures) console.error(`  ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
