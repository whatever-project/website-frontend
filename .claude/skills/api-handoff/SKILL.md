---
name: api-handoff
description: After a page is promoted, write the backend to-do (API-TODO.md with contract + DB hints) and BACKEND-CONTEXT.md in docs/handoffs/<page>/, derived from the services and types the frontend now uses.
argument-hint: <page-name>
---

# api-handoff: backend to-do and context

Argument: page name. Works from `docs/handoffs/<page>/` (created by `draft-to-live`). Templates: `docs/ai/templates/API-TODO.template.md` and `BACKEND-CONTEXT.template.md`.

**Source of truth is the frontend code as promoted**, not the designer's wishes: read the page's view, the new/changed `src/api/routes.ts`, `src/api/services/*.service.ts` and `src/api/types/*.types.ts`, plus `CONTEXT.md` §7 and `DESIGN-REQUEST.md`.

## 1. Read (read-only)
1. `docs/handoffs/<page>/{CONTEXT.md,DESIGN-REQUEST.md}` (stop if missing, or if `status` is not `promoted`).
2. The live view in `src/views/<group>/<page>/` and every service method it calls. List each call: method, path, request body/params, response type, which UI action triggers it, and which error cases the view handles.
3. Backend (read-only, `../website-backend`; if the folder isn't there, say so and skip the DB/overlap checks):
   - `docs/openapi.yaml`: which of these endpoints already exist, naming and error conventions.
   - `src/modules/*` and `src/db/*`: existing modules and Drizzle tables you can reuse.
   - `docs/architecture.md`.

## 2. Write `docs/handoffs/<page>/API-TODO.md`
Use the template. Rules:
- One row in the summary table per endpoint; one detail section each. Mark endpoints that **already exist** and only need a change ("exists, extend: add field X") separately from new ones.
- Paths, field names and types must match what the frontend actually sends/expects (copy from the types file). If the design implies something the frontend code doesn't use, put it under "Open questions", not in the contract.
- Auth: cookie session; state the role required (public / user / admin), following how similar existing endpoints are guarded.
- Errors: status codes the view handles + the `{ "error": "<text>" }` body the client reads. **Backend caveat:** `website-backend/src/app.ts` returns that string shape only under `/users`, `/api/auth`, `/api/account`, `/api/admin`; any other prefix returns `{ "error": { "code", "message" } }`, which `src/api/client.ts` can't read (it would show `[object Object]`). Prefer endpoints under those four prefixes, or add to API-TODO.md "Open questions": "new prefix → backend adds it to the legacy list, or frontend updates `client.ts`".
- **DB hints**: tables/columns/relations as a **suggestion**, reusing existing tables first (name the existing table). Include types, nullability, FKs, indexes. Say whether a migration is needed.
- **openapi.yaml snippet**: paste-ready, same style as the existing file.
- **Frontend type mapping**: the TypeScript types from `src/api/types/`.
- Definition-of-done checklist from the template.
- Mark guesses as "guess". Don't invent business rules; quote CONTEXT.md/DESIGN-REQUEST.md for any rule.

## 3. Write `docs/handoffs/<page>/BACKEND-CONTEXT.md`
Use the template. Explain the page to someone who has never seen it (purpose, user flow, roles), business rules with their source, frontend conventions the backend must match, and open questions. Link to files instead of repeating them. Keep it to roughly one screen.

## 4. Status and delivery
1. Set `status: backend-todo` in `CONTEXT.md`, `API-TODO.md` and `BACKEND-CONTEXT.md` front-matter **under `docs/handoffs/<page>/`**, and add an Iteration-log row "API handoff written". Leave `src/app/draft/<page>/` untouched: it stays as the design team's reference (its status remains `promoted`).
2. **Don't write into the backend repo from here.** Tell the dev how backend picks it up: open Claude Code in `website-backend` (a sibling folder of `website-frontend`) and run `/implement-from-handoff <page>`, which reads `../website-frontend/docs/handoffs/<page>/`. If the backend team works from a different checkout, they copy the folder `docs/handoffs/<page>/`.
3. Add a one-line row to `docs/handoffs/README.md` (create it with a table `page | status | route | updated` if it doesn't exist) so the backend team has one index of pending work.
4. Leave the draft folder alone. It is deleted only if the dev team explicitly asks.

## Report
List endpoints (new vs existing), tables suggested, open questions for backend, and anything in the frontend that will be broken until the backend ships.
