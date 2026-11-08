#!/usr/bin/env bash
# Build and run the Heckto API in production mode.
#
# Usage: ./run-prod.sh [--docker] [--seed] [--skip-build]
#   --docker      start the bundled docker-compose Postgres first
#   --seed        seed the catalog after migrating (idempotent)
#   --skip-build  reuse the existing dist/ build
#
# Config comes from .env (DATABASE_URL, JWT_SECRET, CORS_ORIGIN, ...).
# Variables already set in the shell override .env, e.g. PORT=3001 ./run-prod.sh
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

DOCKER=false
SEED=false
BUILD=true
for arg in "$@"; do
  case "$arg" in
    --docker) DOCKER=true ;;
    --seed) SEED=true ;;
    --skip-build) BUILD=false ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)" >&2; exit 1 ;;
  esac
done

log() { printf '\033[1;35m==>\033[0m %s\n' "$*"; }

if [[ ! -f .env ]]; then
  echo "Missing server/.env. Copy .env.example to .env and set DATABASE_URL and JWT_SECRET." >&2
  exit 1
fi

if [[ ! -d node_modules ]]; then
  log "Installing server dependencies"
  npm ci
fi

if $DOCKER; then
  log "Starting Postgres (docker compose)"
  docker compose up -d --wait db
fi

if $BUILD; then
  log "Building server"
  npm run build
fi

log "Running migrations"
node dist/db/migrate.js

if $SEED; then
  log "Seeding database"
  npm run db:seed
fi

log "Starting API"
exec node dist/index.js
