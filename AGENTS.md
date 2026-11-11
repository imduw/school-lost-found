# AGENTS.md

Instructions for AI coding agents (Claude Code, Gemini CLI, Antigravity, Cursor, GitHub Copilot, Codex, etc.) working in this repository.

## 1. Project Architecture: Monorepo (Code + Documentation)

**PRIMARY CONSTRAINT:** This repository follows a **Monorepo architecture** containing **both** the runnable full-stack application source code AND the Software Project Management documentation for the **"School Lost & Found"** project.

### Directory Structure

```text
school-lost-found/
├── .gitignore                 # SINGLE root .gitignore for the entire Monorepo
├── .githooks/                 # Shared team Git hooks (commit-msg, pre-commit, pre-push)
├── .github/                   # Copilot instructions, PR/Issue templates, CODEOWNERS
├── .agents/skills/            # Shared AI agent workflow skills
├── .vscode/tasks.json         # Parallel dev runner (Frontend :5173 + Backend :5000)
├── apps/
│   ├── web/                   # Frontend: React 19 + Vite (port 5173, proxies /api -> :5000)
│   └── backend/               # Backend: Node.js + Express 5 + PostgreSQL (port 5000)
├── database/                  # Canonical PostgreSQL/Supabase DDL (schema.sql) & DML (seed.sql)
├── docs/                      # Project Management docs (01-khoi-tao .. 06-ban-giao, references)
└── meeting-notes/             # Weekly/sprint meeting minutes (YYYY-MM-DD-topic.md)
```

---

## 2. Mandatory Monorepo Rules

### A. No Duplicate Config Rule
- **Single Root `.gitignore`:** This Monorepo uses **one single `.gitignore` at the repository root**.
- **DO NOT** create nested `.gitignore` files inside `apps/web/`, `apps/backend/`, or `database/`.
- **DO NOT** leave stray `.env` files, duplicate config files, or LibreOffice/editor lock files (`~$*`, `.~lock.*`) inside subdirectories. Only `.env.example` templates are allowed to be committed to Git. Never commit real `.env` files containing secrets or database credentials.

### B. API Contract Rule (Backend <-> Frontend)
- **Backend Standard Envelope (`apps/backend`):**
  Every REST API endpoint under `/api/v1/...` **MUST** return the standardized JSON envelope:
  - Success: `{ "success": true, "data": ... }`
  - Error: `{ "success": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }`
- **Frontend Service Layer (`apps/web`):**
  - Components and pages **MUST NOT** use hardcoded mock data arrays once integrated, and **MUST NOT** hardcode `http://localhost:5000` directly inside components.
  - All HTTP requests **MUST** go through `apps/web/src/services/apiClient.js` and dedicated service modules (e.g., `itemService.js`), which automatically attach JWT tokens and use `/api/v1` (via Vite proxy in dev) or `VITE_API_URL` (in production).
- **Database Consistency (`database/` & `apps/backend`):**
  - The database runs on **Supabase (PostgreSQL)**. Always use PostgreSQL-compatible SQL (`BIGSERIAL`, `TIMESTAMPTZ`, `$1/$2` parameterized queries via `pg`) — never MySQL-only syntax.

---

## 3. Git & Commit Conventions (Enforced by Hooks)

- **Branching:** Never commit directly to `main` or `master`. Create a feature/fix/chore branch first (e.g., `feature/<short-description>`).
- **Commit Message Format (Mandatory — checked by `.githooks/commit-msg`):**
  ```text
  [GiaiDoan] loai: mo ta (toi thieu 10 ky tu)
  ```
  - `GiaiDoan`: `Init | Planning | Requirements | Design | Execution | Monitoring | Closing`
  - `loai`: `feat | docs | fix | chore | refactor | test | wip`
  - Example: `[Execution] feat: add claim submission endpoint and proof privacy check`
- **Hook Integrity:** Do not delete or alter `.githooks/` unless explicitly instructed by the user.
- **Documentation Integrity:** When adding project management documents under `docs/`, follow the existing Vietnamese markdown structure and style.

---

## 4. Shared Agent Skills

Before implementing new Backend endpoints or connecting Frontend views to APIs, consult the shared skills in `.agents/skills/`:
- **Backend API Standard:** `.agents/skills/backend-api-standard/SKILL.md`
- **Frontend API Integration:** `.agents/skills/frontend-api-integration/SKILL.md`

---

## 5. Communication Language

- Chat responses and project management documentation in `docs/` should be written in **Vietnamese** unless the user requests otherwise.
- Code identifiers, API contracts, and agent instruction files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.agents/skills/`) follow this English engineering specification.
