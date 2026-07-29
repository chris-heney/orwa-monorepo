#!/usr/bin/env bash
# Deploy conference-hub to WP Engine conference-hub path.
# Build with vite from this app dir (NOT nx build) to avoid baking localhost.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/apps/conference-hub"
DIST="$ROOT/dist/apps/conference-hub"
REMOTE="orwa@orwa.ssh.wpengine.net:sites/orwa/conference-hub/"
SSH=(ssh -o IdentitiesOnly=yes -i "${HOME}/.ssh/id_ed25519")

cd "$APP_DIR"
npx vite build --mode production

if [[ ! -d "$DIST/assets" ]]; then
  echo "ERROR: build output missing at $DIST"
  exit 1
fi

# Guard against localhost bake
if grep -Rql 'localhost:1337' "$DIST"/assets/*.js 2>/dev/null || \
   grep -Rql 'localhost:13370' "$DIST"/assets/*.js 2>/dev/null; then
  echo "ERROR: production bundle contains localhost API endpoint — aborting deploy"
  exit 1
fi

LOCAL_JS="$(grep -oE 'index-[A-Za-z0-9_-]+\.js' "$DIST/index.html" | head -1 || true)"
echo "Local bundle: ${LOCAL_JS:-unknown}"

rsync -avz \
  --exclude '.DS_Store' \
  --exclude 'package.json' \
  --exclude 'README.md' \
  "$DIST"/ \
  -e "${SSH[*]}" \
  "$REMOTE"

echo "Deployed to $REMOTE"
echo "--- live ---"
curl -sS "https://orwa.org/conference-hub/?v=$(date +%s)" \
  | grep -oE 'index-[A-Za-z0-9_-]+\.js' \
  | head -3
