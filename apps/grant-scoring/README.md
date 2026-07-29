# Grant Scoring (GApp Eval)

Committee / ORWA / DEQ evaluation tool. Production path: `https://orwa.org/grant-administration/`.

## Dev

```bash
npx nx serve grant-scoring
# or: npm run start:scoring
# http://localhost:4206/?key=<public_key>
```

## Production build / deploy

```bash
cd apps/grant-scoring
npx vite build --mode production
# guard: grep -c 'localhost:1337' ../../dist/apps/grant-scoring/assets/*.js
./deploy.sh
# or rsync dist/apps/grant-scoring/ to sites/orwa/grant-administration/
```

Do **not** use `nx build` for production — it can bake localhost from env files.

## Env

See `.env.example`. Uses `VITE_API_KEY` (legacy `VITE_API_TOKEN` still accepted).

## Related

- Directory / scoresheet viewer: `apps/grant-scoring-directory` → `/application-search`
- Tokens managed in member-manager Grant Manager → Tokens tab
