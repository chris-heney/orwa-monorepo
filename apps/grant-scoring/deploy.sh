#!/usr/bin/env bash
# Deploy grant-scoring (GApp Eval) to WP Engine grant-administration path.
# Build with vite from this app dir (NOT nx build) to avoid baking localhost.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
APP_DIR="$ROOT/apps/grant-scoring"
DIST="$ROOT/dist/apps/grant-scoring"
REMOTE="orwa@orwa.ssh.wpengine.net:sites/orwa/grant-administration/"

cd "$APP_DIR"
npx vite build --mode production

# Guard against localhost bake
if grep -Rql 'localhost:1337' "$DIST"/assets/*.js 2>/dev/null; then
  echo "ERROR: production bundle contains localhost:1337 — aborting deploy"
  exit 1
fi

rsync -avz --exclude '.DS_Store' "$DIST"/ -e 'ssh -o IdentitiesOnly=yes' "$REMOTE"
echo "Deployed to $REMOTE"
curl -sS "https://orwa.org/grant-administration/" | grep -oE 'index-[A-Za-z0-9_-]+\.js' | head -3
