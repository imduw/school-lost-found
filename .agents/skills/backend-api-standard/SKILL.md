---
name: backend-api-standard
description: Standard workflow for implementing or updating Node.js + Express 5 + Supabase PostgreSQL REST API endpoints in apps/backend/. Use whenever adding routes, controllers, authentication checks, or database queries in the backend.
---

# Backend API Standard (`apps/backend`)

Follow this checklist whenever creating or modifying REST API endpoints in `apps/backend/`.

## 1. Architecture & File Layout

- **Routes (`apps/backend/src/routes/*.routes.js`):** Define HTTP paths and attach authentication/authorization middlewares (`verifyToken`, `optionalAuth`, `requireRole`). Keep business logic out of route files.
- **Controllers (`apps/backend/src/controllers/*.controller.js`):** Handle input validation, business rules, SQL queries via `pool` (`src/config/db.js`), and response formatting.
- **App Entry (`apps/backend/src/app.js`):** Mount new route files under `/api/v1`. Never add HTML views or frontend templates to `apps/backend/`.

## 2. Mandatory API Contract

Every endpoint MUST return one of these two JSON envelopes:

- **Success (`200`, `201`):**
  ```json
  { "success": true, "data": { ... } }
  ```
- **Error (`400`, `401`, `403`, `404`, `409`, `500`):**
  ```json
  { "success": false, "error": { "code": "ERROR_CODE", "message": "Clear error message" } }
  ```

Standard HTTP status codes & error codes:
- `400 VALIDATION_ERROR`: Missing required fields, invalid enum/date/ID format.
- `401 UNAUTHENTICATED` / `INVALID_CREDENTIALS`: Missing, invalid, or revoked Bearer JWT token, or wrong password.
- `403 FORBIDDEN`: Authenticated user lacks ownership or required role (`USER` vs `MODERATOR` / `ADMIN`).
- `404 ITEM_NOT_FOUND` / `CLAIM_NOT_FOUND` / `ROUTE_NOT_FOUND`: Resource does not exist.
- `409 STATE_CONFLICT` / `EMAIL_EXISTS`: Invalid state transition or concurrency collision.

## 3. PostgreSQL / Supabase Query Rules

- Use **parameterized queries** (`$1, $2, ...`) via `pool.query(...)` — never string-concatenate user inputs into SQL.
- Use **PostgreSQL syntax only** (e.g., `ILIKE`, `NOW() - INTERVAL '1 day'`, `ON CONFLICT (...) DO UPDATE`, `TIMESTAMPTZ`).
- For concurrent state transitions (e.g., accepting a claim and creating a handover), use a database transaction (`const client = await pool.connect(); await client.query('BEGIN'); ... SELECT ... FOR UPDATE ... COMMIT / ROLLBACK`).
- **Proof Privacy:** Never expose `claim_proofs` content in public item listing or detail endpoints; restrict proof access strictly to the claimant (`claimant_id === req.user.id`) and `MODERATOR`/`ADMIN`.

## 4. Config & Security Guardrails

- Do NOT create a `.gitignore` or commit `.env` inside `apps/backend/`. Use the root `.gitignore` and keep only `.env.example` in Git.
- Always use `bcryptjs` for password hashing/comparison and `jsonwebtoken` with `process.env.JWT_SECRET`.

## 5. Verification Before Finishing

Run syntax validation on all modified JS files from the repository root:
```bash
node -c apps/backend/src/app.js apps/backend/src/routes/*.js apps/backend/src/controllers/*.js apps/backend/src/middlewares/*.js
```
