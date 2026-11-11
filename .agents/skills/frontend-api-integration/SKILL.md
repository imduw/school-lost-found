---
name: frontend-api-integration
description: Standard workflow for building React 19 + Vite UI pages and connecting them to Backend REST APIs in apps/web/. Use whenever adding pages, services, auth flows, or replacing mock data with live API calls.
---

# Frontend API Integration (`apps/web`)

Follow this checklist whenever creating or updating React components, pages, or API services in `apps/web/`.

## 1. API Client & Service Layer Rules

- **No Hardcoded URLs or Raw `fetch` in Components:** Components and pages in `apps/web/src/pages/` MUST NEVER hardcode `http://localhost:5000` or import mock arrays from `src/data/mock/` for integrated features.
- **Always Use `apiClient.js`:** Put all API calls in `apps/web/src/services/*.js` using the shared `apiClient` (`apps/web/src/services/apiClient.js`), which automatically:
  - Uses `import.meta.env.VITE_API_URL || '/api/v1'` (routed via Vite `/api` proxy in `vite.config.js` during local development).
  - Attaches `Authorization: Bearer <token>` from `localStorage`.
- **Standard Error Propagation:** Extract error messages with `getApiErrorMessage(error, fallback)` and rethrow with `{ cause: error }` so ESLint's `preserve-caught-error` rule passes:
  ```javascript
  try {
    const res = await apiClient.get('/items')
    return res.data.data
  } catch (error) {
    throw new Error(getApiErrorMessage(error, 'Failed to load items'), { cause: error })
  }
  ```

## 2. React 19 & State Rules

- **Authentication State:** Always read user session and role (`ADMIN`, `MODERATOR`, `USER`, `GUEST`) via `useAuth()` (`src/contexts/useAuth.js`).
- **Avoid Synchronous `setState` in `useEffect`:** ESLint enforces `react-hooks/set-state-in-effect`. Never call `setLoading(true)` synchronously at the top of a `useEffect` body — initialize `loading` state as `true` or set loading inside user event handlers, and update state inside `.then() / .catch() / .finally()` callbacks with a `cancelled` cleanup flag.
- **Navigation:** Use React Router `<Link>` or `useNavigate()` rather than full-page `<a href="...">` reloads for internal routes.

## 3. Config Guardrails

- **Do NOT create `apps/web/.gitignore`** or nested config overrides. All ignores belong in the single root `.gitignore`.
- **Do NOT commit `.env` files.** Only `.env.example` may be committed.

## 4. Verification Before Finishing

After any edit in `apps/web/`, run both ESLint and production build from the repository root and confirm 0 errors:
```bash
npm --prefix apps/web run lint && npm --prefix apps/web run build
```
