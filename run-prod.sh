#!/usr/bin/env bash
# Build and run Heckto in production mode: API (server/) + SSR frontend.
#
# Usage: ./run-prod.sh [--no-api] [--skip-build]
#   --no-api      don't start the API; use one already running at $API_URL
#   --skip-build  reuse the existing dist/ build of the frontend
#
# Env: PORT     frontend port              (default 4300)
#      API_URL  where the API is reachable (default http://localhost:3000)
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")"

export PORT="${PORT:-4300}"
export API_URL="${API_URL:-http://localhost:3000}"

START_API=true
BUILD=true
for arg in "$@"; do
  case "$arg" in
    --no-api) START_API=false ;;
    --skip-build) BUILD=false ;;
    -h|--help) sed -n '2,10p' "$0"; exit 0 ;;
    *) echo "Unknown option: $arg (see --help)" >&2; exit 1 ;;
  esac
done

log() { printf '\033[1;32m==>\033[0m %s\n' "$*"; }

if [[ ! -d node_modules ]]; then
  log "Installing frontend dependencies"
  npm ci
fi

if $BUILD; then
  log "Building frontend"
  npm run build
fi

API_PID=""
cleanup() {
  if [[ -n "$API_PID" ]]; then
    kill "$API_PID" 2>/dev/null || true
    wait "$API_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT
trap 'exit 130' INT TERM

if $START_API; then
  log "Starting API (migrations + compiled server)"
  # The API reads its own PORT from server/.env; don't pass the frontend's PORT through.
  env -u PORT ./server/run-prod.sh --docker &
  API_PID=$!

  log "Waiting for API at $API_URL"
  for i in $(seq 1 60); do
    curl -fs "$API_URL/api/products" >/dev/null 2>&1 && break
    if ! kill -0 "$API_PID" 2>/dev/null; then
      echo "API exited during startup" >&2
      exit 1
    fi
    if [[ $i -eq 60 ]]; then
      echo "API did not become ready at $API_URL" >&2
      exit 1
    fi
    sleep 1
  done
fi

log "Starting frontend on http://localhost:$PORT (API: $API_URL)"
node dist/Heckto/server/server.mjs
