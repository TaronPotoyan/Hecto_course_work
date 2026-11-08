#!/usr/bin/env bash
# Start the Heckto API: (optionally) bring up Postgres, run migrations, then run the server.
#
# Usage: ./start.sh [--seed] [--prod] [--no-docker]
#   --seed       also seed the catalog after migrating (idempotent)
#   --prod       build and run the compiled server instead of the watch-mode dev server
#   --no-docker  don't start the docker-compose Postgres (use your own DATABASE_URL)
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

SEED=false
PROD=false
DOCKER=true
for arg in "$@"; do
  case "$arg" in
    --seed) SEED=true ;;
    --prod) PROD=true ;;
    --no-docker) DOCKER=false ;;
    -h|--help) sed -n '2,7p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)" >&2; exit 1 ;;
  esac
done

log() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }

if [[ ! -f .env ]]; then
  log "No .env found, creating one from .env.example (edit JWT_SECRET before deploying)"
  cp .env.example .env
fi

if [[ ! -d node_modules ]]; then
  log "Installing server dependencies"
  npm install
fi

# Read DATABASE_URL host/port from .env (a variable already set in the shell wins).
read -r DB_HOST DB_PORT < <(node -e '
  const fs = require("fs");
  if (!process.env.DATABASE_URL && fs.existsSync(".env")) process.loadEnvFile(".env");
  const u = new URL(process.env.DATABASE_URL || "postgres://localhost:5432/heckto");
  console.log(u.hostname, u.port || 5432);
')

if $DOCKER; then
  log "Starting Postgres (docker compose)"
  docker compose up -d db
fi

log "Waiting for Postgres at $DB_HOST:$DB_PORT"
for i in $(seq 1 30); do
  if command -v pg_isready >/dev/null; then
    pg_isready -q -h "$DB_HOST" -p "$DB_PORT" && break
  else
    (exec 3<>"/dev/tcp/$DB_HOST/$DB_PORT") 2>/dev/null && break
  fi
  if [[ $i -eq 30 ]]; then
    echo "Postgres is not reachable at $DB_HOST:$DB_PORT" >&2
    exit 1
  fi
  sleep 1
done

log "Running migrations"
npm run db:migrate

if $SEED; then
  log "Seeding database"
  npm run db:seed
fi

if $PROD; then
  log "Building server"
  npm run build
  log "Starting server"
  exec npm start
else
  log "Starting dev server (watch mode)"
  exec npm run dev
fi
