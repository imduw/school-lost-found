# CLAUDE.md

> Instructions for Claude Code when working in this repository. **Always read [AGENTS.md](./AGENTS.md) first** — it is the single source of truth for all project rules and workflows.

## Quick Summary

- **Monorepo Architecture (Code + Docs):** This repository contains **both** the application source code (`apps/web/` React + Vite, `apps/backend/` Node.js + Express, `database/` PostgreSQL/Supabase) **and** the Software Project Management documentation (`docs/`, `meeting-notes/`).
- **No Duplicate Config Rule:** Use the **single root `.gitignore`** only. Never create nested `.gitignore` files, stray `.env` templates, or lock files inside `apps/web/` or `apps/backend/`. Never commit real `.env` secrets.
- **API Contract Rule:**
  - Every backend endpoint under `/api/v1/...` must return `{ success: true, data }` or `{ success: false, error: { code, message } }`.
  - Frontend components must **never** use hardcoded mock data or hardcode `http://localhost:5000`; all HTTP requests must go through `apps/web/src/services/apiClient.js`.
- **Workflow Skills:** Follow `.agents/skills/backend-api-standard/SKILL.md` for backend work and `.agents/skills/frontend-api-integration/SKILL.md` for frontend integration.
- **Git & Commit Rules (Hook Enforced):**
  - Never commit directly to `main`/`master` — create a `feature/<description>` branch first.
  - Commit messages must strictly match: `[GiaiDoan] loai: mo ta` (minimum 10 characters after `[GiaiDoan]`), where `GiaiDoan` is `Init | Planning | Requirements | Design | Execution | Monitoring | Closing` and `loai` is `feat | docs | fix | chore | refactor | test | wip`.
- **Response Language:** Reply to the user in Vietnamese unless requested otherwise.

See full engineering rules in [AGENTS.md](./AGENTS.md) and team workflow in [CONTRIBUTING.md](./CONTRIBUTING.md).
