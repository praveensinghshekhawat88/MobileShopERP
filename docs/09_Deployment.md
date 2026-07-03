# Deployment Guide

Mobile Shop ERP backend — Docker, profiles, CI, and production checklist.

---

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- Java 21 (local development only)
- PostgreSQL 17 (via Docker or managed service)

Database name (locked): **`mobile_shop_erp`**

---

## Quick Start (Docker Compose)

From the repository root:

```bash
cd docker
docker compose up -d --build
```

| Service   | URL |
|-----------|-----|
| Admin UI  | http://localhost:3000 |
| API       | http://localhost:8081 |
| Swagger   | http://localhost:8081/swagger-ui.html |
| Health    | http://localhost:8081/actuator/health |
| PostgreSQL| localhost:5433 |
| pgAdmin   | http://localhost:5050 |

The admin container serves the React build on port **3000** and reverse-proxies `/api/` to the backend. Sign in at http://localhost:3000 — no separate `.env` is required for Docker Compose.

Default dev admin (created by `DevBootstrapRunner` when `dev` profile is active):

- Mobile: `9999999999`
- Password: `Admin@123456`

---

## Spring Profiles

| Profile   | Use case |
|-----------|----------|
| `dev`     | Local IDE; port 8081, SQL logging, dev bootstrap user |
| `docker`  | Container runtime; connects to `postgres` service host |
| `staging` | Pre-production; env-driven secrets, reduced logging |
| `prod`    | Production; minimal actuator exposure |

Set via `SPRING_PROFILES_ACTIVE`. Docker Compose uses `docker,dev` for local full stack.

---

## Environment Variables

| Variable | Description | Default (dev) |
|----------|-------------|---------------|
| `DB_URL` | JDBC URL | `jdbc:postgresql://localhost:5432/mobile_shop_erp` |
| `DB_USERNAME` | Database user | `erp_user` |
| `DB_PASSWORD` | Database password | `erp_password` |
| `JWT_SECRET` | HS256 signing key (≥256 bits) | **Must override in prod** |
| `JWT_EXPIRATION_MS` | Access token TTL | `28800000` |
| `SERVER_PORT` | HTTP port | `8080` (8081 in `dev` profile) |

---

## Database Migrations

Flyway runs automatically on startup (`classpath:db/migration`).

- Never modify applied migration files.
- Production: back up database before deploy; migrations apply on app start.
- Reset local DB: `docker compose down -v && docker compose up -d`

---

## CI/CD

GitHub Actions workflow `.github/workflows/ci.yml`:

- Triggers on push/PR to `main`, `master`, `develop`
- Runs `./gradlew build` in `backend/` (compile + unit tests)

---

## Production Checklist

- [ ] Set strong `JWT_SECRET` via secrets manager
- [ ] Use `SPRING_PROFILES_ACTIVE=prod`
- [ ] Restrict actuator exposure (health/info only)
- [ ] Configure HTTPS reverse proxy (nginx / load balancer)
- [ ] Enable PostgreSQL backups and connection limits
- [ ] Remove `dev` profile and pgAdmin from production compose
- [ ] Create admin user through controlled process (not dev bootstrap)

---

## Build Backend Image Only

```bash
cd backend
docker build -t mobile-shop-erp-backend .
```

## Build Admin Image Only

```bash
cd admin
docker build -t mobile-shop-erp-admin .
```

The admin image bakes `VITE_API_BASE_URL=/api/v1` so the browser uses same-origin requests; nginx proxies them to the backend. Override at build time if needed:

```bash
docker build --build-arg VITE_API_BASE_URL=/api/v1 -t mobile-shop-erp-admin .
```

Run standalone (requires external PostgreSQL):

```bash
docker run --rm -p 8080:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DB_URL=jdbc:postgresql://host.docker.internal:5432/mobile_shop_erp \
  -e DB_USERNAME=erp_user \
  -e DB_PASSWORD=erp_password \
  -e JWT_SECRET=your-production-secret-min-256-bits \
  mobile-shop-erp-backend
```

---

## OpenAPI Spec

Export at runtime: `GET /api-docs` (JSON OpenAPI 3).

---

## Postman Collection

A full Postman collection covering every endpoint (auth, all business modules, reports) lives in `postman/MobileShopERP.postman_collection.json`, with `local` and `staging` environment files alongside it. Import all three into Postman; run **Auth → Login** first — it automatically stores the access/refresh tokens as collection variables used by every other request.

---

## Post-Deployment Smoke Test

After any deploy, run `scripts/smoke-test.sh [BASE_URL] [ADMIN_MOBILE] [ADMIN_PASSWORD]` to verify:

- Actuator health reports UP
- Unauthenticated requests are correctly rejected (401)
- Admin login succeeds and returns a token
- An authenticated request succeeds
- A refresh token cannot be used as a bearer access token (security regression check)

Example against the local Docker Compose stack:

```bash
./scripts/smoke-test.sh http://localhost:8081
```

The script exits non-zero if any check fails, so it can be wired into a CI/CD deploy pipeline as a post-deploy gate.

---

*Phase 9 — Deployment documentation*
