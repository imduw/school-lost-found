# GitHub Copilot Instructions

> Follow all project rules defined in [AGENTS.md](../AGENTS.md). That file is the single source of truth for this Monorepo.

## Architecture & Scope

- **Monorepo (Code + Docs):** This repository holds both the application source code (`apps/web/`, `apps/backend/`, `database/`) and the Software Project Management documentation (`docs/`, `meeting-notes/`).
- **Tech Stack:**
  - Frontend: React 19 + Vite (`apps/web/`, dev port `5173` with `/api` proxy to `http://localhost:5000`).
  - Backend: Node.js + Express 5 (`apps/backend/`, dev port `5000`).
  - Database: Supabase PostgreSQL (`database/schema.sql`, `database/seed.sql`, queried via `pg` in `apps/backend/src/config/db.js`).

## Mandatory Rules

1. **No Duplicate Config Rule:**
   - The repository uses **one single root `.gitignore`**.
   - **Never** create nested `.gitignore` files, stray `.env` templates, or redundant lock files inside `apps/web/` or `apps/backend/`.
   - **Never** commit real `.env` secrets or office lock files (`~$*`, `.~lock.*`).

2. **API Contract Rule:**
   - **Backend (`apps/backend/`):** Every REST API endpoint under `/api/v1/...` must return `{ success: true, data }` on success or `{ success: false, error: { code, message } }` on failure. Use parameterized PostgreSQL queries (`$1, $2...`) and enforce server-side JWT/RBAC (`verifyToken`, `requireRole`).
   - **Frontend (`apps/web/`):** Never use mock data arrays or hardcode `http://localhost:5000` inside React components. All HTTP calls must go through `apps/web/src/services/apiClient.js` and dedicated service files.

3. **Workflow Skills:**
   - Backend endpoint changes: Follow `.agents/skills/backend-api-standard/SKILL.md`.
   - Frontend API integration: Follow `.agents/skills/frontend-api-integration/SKILL.md`.

4. **Git Commit Format:**
   - Do not commit directly to `main`/`master`; work on `feature/<description>` branches.
   - Commit message format enforced by `.githooks/commit-msg`: `[GiaiDoan] loai: mo ta` (e.g., `[Execution] feat: implement claim proof submission endpoint`).
