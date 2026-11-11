# GEMINI.md

> Instructions for Gemini CLI / Antigravity / Gemini Code Assist when working in this repository. **Read [AGENTS.md](./AGENTS.md) first** — it contains the complete, authoritative specification.

## Quick Summary

- **Monorepo Architecture (Code + Docs):** This repository contains **both** the runnable full-stack codebase (`apps/web/` React + Vite, `apps/backend/` Node.js + Express, `database/` PostgreSQL/Supabase) **and** the Software Project Management documentation (`docs/`, `meeting-notes/`).
- **No Duplicate Config Rule:** Use the **single root `.gitignore`** only. Never create nested `.gitignore` files, stray `.env` templates, or lock files inside `apps/web/` or `apps/backend/`. Never commit real `.env` secrets.
- **API Contract Rule:**
  - All backend endpoints under `/api/v1/...` must return `{ success: true, data }` or `{ success: false, error: { code, message } }`.
  - Frontend components must **never** hardcode mock arrays or `http://localhost:5000`; all API calls must go through `apps/web/src/services/apiClient.js`.
- **Shared Skills:** Consult `.agents/skills/backend-api-standard/SKILL.md` and `.agents/skills/frontend-api-integration/SKILL.md` before writing new endpoints or UI API integrations.
- **Git & Commit Rules (Hook Enforced):**
  - Never commit directly to `main`/`master` — create a `feature/<description>` branch first.
  - Commit messages must strictly match: `[GiaiDoan] loai: mo ta` (minimum 10 characters after `[GiaiDoan]`). See [AGENTS.md](./AGENTS.md) for valid values.
- **Response Language:** Reply to the user and author `docs/` files in Vietnamese unless instructed otherwise.

See full details in [AGENTS.md](./AGENTS.md) and team workflow in [CONTRIBUTING.md](./CONTRIBUTING.md).
