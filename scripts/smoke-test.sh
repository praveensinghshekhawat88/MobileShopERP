#!/usr/bin/env bash
# ==============================================================================
# Mobile Shop ERP - Post-Deployment Smoke Test
# Phase 9 (Deployment) — P09-T011
#
# Verifies a freshly deployed backend is healthy and the core auth + read
# flow works, with a basic response-time budget. Intended to run right after
# `docker compose up` (or any deploy) against a live environment.
#
# Usage:
#   ./scripts/smoke-test.sh [BASE_URL] [ADMIN_MOBILE] [ADMIN_PASSWORD]
#
# Defaults target the local Docker Compose stack and the DevBootstrapRunner
# seeded admin account (dev/docker profiles only — never use these defaults
# against staging/prod).
# ==============================================================================
set -euo pipefail

SERVER_URL="${1:-http://localhost:8081}"
ADMIN_MOBILE="${2:-9999999999}"
ADMIN_PASSWORD="${3:-Admin@123456}"
API_URL="${SERVER_URL}/api/v1"
MAX_RESPONSE_MS=2000

pass=0
fail=0

check() {
  local description="$1"
  local method="$2"
  local url="$3"
  local expected_status="$4"
  local data="${5:-}"
  local auth_header="${6:-}"

  local start_ms end_ms elapsed_ms status body
  start_ms=$(date +%s%3N)

  if [ -n "$data" ]; then
    response=$(curl -s -o /tmp/smoke_body.json -w "%{http_code}" -X "$method" "$url" \
      -H "Content-Type: application/json" ${auth_header:+-H "$auth_header"} -d "$data")
  else
    response=$(curl -s -o /tmp/smoke_body.json -w "%{http_code}" -X "$method" "$url" \
      ${auth_header:+-H "$auth_header"})
  fi

  end_ms=$(date +%s%3N)
  elapsed_ms=$((end_ms - start_ms))
  status="$response"
  body=$(cat /tmp/smoke_body.json)

  # check() is always called directly (never inside `$(...)`), so pass/fail
  # counters below update the real script variables, not a subshell copy.
  # The response body is left in /tmp/smoke_body.json for the caller to read.
  if [ "$status" == "$expected_status" ]; then
    if [ "$elapsed_ms" -gt "$MAX_RESPONSE_MS" ]; then
      echo "WARN  ${description} — status ${status} OK but slow (${elapsed_ms}ms > ${MAX_RESPONSE_MS}ms)"
    else
      echo "PASS  ${description} — status ${status} (${elapsed_ms}ms)"
    fi
    pass=$((pass + 1))
  else
    echo "FAIL  ${description} — expected ${expected_status}, got ${status} (${elapsed_ms}ms)"
    echo "      body: ${body}"
    fail=$((fail + 1))
  fi
}

echo "=============================================="
echo "Mobile Shop ERP — Smoke Test"
echo "Target: ${SERVER_URL}"
echo "=============================================="

# 1. Actuator health must be UP
check "Actuator health" GET "${SERVER_URL}/actuator/health" 200

# 2. Unauthenticated protected endpoint must be rejected with a JSON ApiResponse (401)
check "Reject unauthenticated request" GET "${API_URL}/users" 401

# 3. Login must succeed and return an ApiResponse envelope with a token
check "Admin login" POST "${API_URL}/auth/login" 200 \
  "{\"mobile\":\"${ADMIN_MOBILE}\",\"password\":\"${ADMIN_PASSWORD}\"}"
login_body=$(cat /tmp/smoke_body.json)

access_token=$(echo "$login_body" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4 || true)

if [ -z "$access_token" ]; then
  echo "FAIL  Could not extract accessToken from login response — aborting authenticated checks"
  fail=$((fail + 1))
else
  # 4. Authenticated read of a core resource must succeed
  check "Authenticated read (settings)" GET "${API_URL}/settings" 200 "" \
    "Authorization: Bearer ${access_token}"

  # 5. Refresh token used as bearer must be rejected (security hardening regression check)
  refresh_token=$(echo "$login_body" | grep -o '"refreshToken":"[^"]*"' | cut -d'"' -f4 || true)
  if [ -n "$refresh_token" ]; then
    check "Reject refresh token used as bearer" GET "${API_URL}/settings" 401 "" \
      "Authorization: Bearer ${refresh_token}"
  fi
fi

echo "=============================================="
echo "Result: ${pass} passed, ${fail} failed"
echo "=============================================="

rm -f /tmp/smoke_body.json

if [ "$fail" -gt 0 ]; then
  exit 1
fi
