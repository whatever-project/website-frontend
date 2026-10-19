<!--
Written by the `api-handoff` skill (Claude). Audience: backend devs. Explains the "why"; API-TODO.md has the "what".
Short. Link to files instead of repeating them.
-->
---
page: <kebab-case-name>
status: backend-todo
frontend_route: /<path>
updated: YYYY-MM-DD
---

# Backend context: <Page name>

## What the page does (for someone who has never seen it)
(3–5 sentences: purpose, who uses it, the main flow.)

## Screens and flows
1. (User opens … → frontend calls … → sees …)

## Who can call what
| Role | Can do |
|---|---|
| guest | |
| user | |
| admin | |

Auth model assumed: cookie session (`credentials: "include"`), same as existing `/api/auth/*` and `/api/account/*`.

## Frontend conventions the backend must match
- Errors: on non-2xx the frontend reads `{ "error": "<text>" }` from the JSON body and throws `ApiError(error, status)` (`src/api/client.ts`); if there is no `error` field it falls back to `Request failed: <status>`. Views usually show `err.message` or a translated generic message. Keep `error` human-readable, and say in API-TODO.md if the UI needs stable error codes.
  **Heads-up:** the backend only returns this string shape under `/users`, `/api/auth`, `/api/account`, `/api/admin` (legacy list in `website-backend/src/app.ts`). Other prefixes return `{ error: { code, message } }`, which the current client can't display. Pick a prefix accordingly, or agree on a client change.
- 204 responses are supported (client returns `undefined`).
- Dates: ISO 8601 strings, UTC.
- Pagination / sorting / filtering needs: 

## Business rules found in the design
(Rules the designer or dev stated: limits, cooldowns, validation. Quote the source.)
- 

## Open questions for backend
- [ ] 

## Where to look
| What | Path |
|---|---|
| Endpoint contract | `API-TODO.md` (this folder) |
| Original design request | `DESIGN-REQUEST.md` (this folder) |
| Frontend view | `website-frontend/src/views/<group>/<page>/` |
| Frontend services / types | `website-frontend/src/api/services/`, `src/api/types/` |
| Existing similar backend module | `website-backend/src/modules/<…>` |
