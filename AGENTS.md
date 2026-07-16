# AGENTS.md

## Learned User Preferences

- When asked to "stage/commit/push/deploy", commit only the changes relevant to the request; leave unrelated in-progress work unstaged and keep test artifacts (`.playwright-mcp/`, screenshots, editor state files) out of version control.
- Group uncommitted work into small logical commits with scoped prefixes, e.g. `strapi: ...`, `member-manager: ...`, `associate: add "Drone Cleaning" to category enum`.
- "Deploy" implicitly includes the server-side step (pull + restart on the production host, or rsync for frontends), not just pushing the image/bundle.
- Verify frontend changes visually in a headless browser before deploying; a clean typecheck/build alone is not sufficient.
- Non-destructive production smoke tests after deploy are welcome (e.g. re-sending a previously failing request with unchanged business values).

## Learned Workspace Facts

- Strapi backend deploy: `npx nx run strapi:docker-push` (builds and pushes image to GHCR), then `ssh root@admin.orwa.org "cd /var/opt/orwa-monorepo && docker compose pull strapi && docker compose up -d strapi"`. The live compose file is `/var/opt/orwa-monorepo/docker-compose.yml` (not `/var/opt/admin.orwa.org`); the production Strapi container is named `orwa-admin-v5`.
- Frontends (member-manager, conference-registration, etc.) deploy as static production bundles rsynced over SSH to WP Engine (`orwa.ssh.wpengine.net`, install `orwa`), e.g. `sites/orwa/conference-registration/` serves orwa.org/conference-registration. Avoid `rsync --delete`. The README's `npm run deploy` reference is stale.
- CRITICAL frontend-build pitfall: `nx build <app>` auto-loads the app's tracked `.env` (with `VITE_API_ENDPOINT=http://localhost:1337`) into `process.env` before invoking vite, and OS-level env vars take priority over `.env.production` — so `nx build` silently bakes localhost into production bundles even though a direct `npx vite build` in the app dir is correct (this shipped a broken member-manager login on 2026-07-16). member-manager's dev env was renamed to `.env.development` (vite dev still loads it; nx no longer injects it). Other apps still have the trap: build them with `npx vite build` from the app dir or rename their `.env` too, and ALWAYS `grep -c 'localhost:1337' dist/assets/*.js` before rsyncing.
- After rsyncing a frontend to WP Engine, `orwa.org` serves the old `index.html` for up to ~10 min (`cache-control: max-age=600` + Cloudflare edge cache). Verify with `curl -s https://orwa.org/<app>/ | grep -o 'index\.[a-f0-9]*\.js'` until the new hash appears; `wp cache flush` over SSH only clears the object cache, not the page/CDN cache.
- Local dev Strapi (`apps/strapi/.env`) connects to MySQL on port 3307 (container `orwa-mig-mysql`, database `strapi_prod` — a migration copy of production), NOT the docker-compose MySQL on 3306. Production DB is MySQL in the `nextcloud-mysql` container (network `db_db`, database `strapi_prod_v5`).
- The repo recently migrated Strapi v4 -> v5. A `global::numeric-id-compat` middleware (`apps/strapi/src/middlewares/numeric-id-compat.ts`) rewrites numeric entity ids in URLs and numeric relation ids in request bodies to documentIds, and strips unknown body keys. Body rewriting requires it to be registered after `strapi::body` in `config/middlewares.ts`.
- Strapi 5 rejects unknown body fields with 400 "Invalid key ..." (v4 silently stripped them), and returns `null` (not `undefined`) for empty media/relation fields — guard with `!= null`, not `!== undefined`.
- member-manager's custom data provider still addresses Strapi entries by numeric id; its grant dashboard fans out hundreds of parallel `getOne ?populate=*` requests, which can overload the server and surface as `net::ERR_FAILED` in the browser (not CORS, not the documentId change).
- conference-registration reads `VITE_API_ENDPOINT` and API key from `.env.production` (production API is `https://admin.orwa.org/api`); the dev `.env` key gets 401s against production. Build/serve with `--mode production` when testing against production data.
- Changes to Strapi content-type schemas (e.g. `apps/strapi/src/api/associate/content-types/associate/schema.json`) regenerate `apps/strapi/types/generated/contentTypes.d.ts`, which should be committed alongside.
- The activity-feed Strapi plugin (`apps/strapi/src/plugins/activity-feed`) has TypeScript server code compiled with `npx tsc -p tsconfig.server.json` from the plugin directory; lifecycle hooks there must null-guard relation lookups.
- `npx nx serve <app>` can hang when its output is piped; running the app's vite binary directly with an explicit port is more reliable for headless testing.
- `member-manager` has ~130 pre-existing `tsc --noEmit` errors in unrelated modules (training, soonerwarn, Highcharts typings); Vite builds don't typecheck, so these are not regressions.
