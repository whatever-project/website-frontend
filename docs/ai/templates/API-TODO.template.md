<!--
Written by the `api-handoff` skill (Claude) after the page is promoted.
Audience: backend devs working in ../website-backend. Contract-level, in the style of docs/openapi.yaml.
Everything here is a PROPOSAL from the frontend; backend may negotiate. Mark changes in "Backend notes".
-->
---
page: <kebab-case-name>
status: backend-todo       # backend-todo | backend-in-progress | backend-done
frontend_view: src/views/<group>/<page>/
frontend_services: src/api/services/<name>.service.ts
updated: YYYY-MM-DD
---

# API to-do: <Page name>

Context: see `BACKEND-CONTEXT.md` in this folder.

## Summary
| # | Method | Path | Auth | Purpose | Triggered by (UI) | Status |
|---|---|---|---|---|---|---|
| 1 | GET | `/api/<…>` | user / admin / public | | page load | ☐ |

## Endpoint details

### 1. `GET /api/<…>`
- **Auth:** cookie session; role: `user` / `admin` / none
- **Triggered by:** (UI action; file: `src/views/…`)
- **Replaces mock:** `_mock/…` (draft copy kept for the designers; not used by the live page)
- **Request**
  - Path params: 
  - Query params: 
  - Body: 
    ```json
    { }
    ```
- **Response `200`**
  ```json
  { }
  ```
  | Field | Type | Required | Notes |
  |---|---|---|---|
  | | | | |
- **Errors**
  Error body: `{ "error": "<text>" }` (what `src/api/client.ts` reads).

  | Status | When | Message shown in UI |
  |---|---|---|
  | 400 | validation | (key in `messages/*/<page>.json`) |
  | 401 | no session | redirects to `/login` |
  | 404 | | |
- **Backend notes:** 

## DB hints (suggestion for the Drizzle schema)
Check `website-backend/src/db` for existing tables first. Reuse before creating.

| Table | New or existing | Columns (type, constraints) | Relations / indexes |
|---|---|---|---|
| `<table>` | new | `id uuid pk`, … | fk → `users.id`, index on … |

Migrations needed: yes / no

## openapi.yaml snippet
```yaml
# paste-ready for website-backend/docs/openapi.yaml
```

## Frontend type mapping
Types the frontend already expects (in `src/api/types/`). Backend responses must match or the frontend types must be updated together.

```ts
// src/api/types/<name>.types.ts
```

## Definition of done
- [ ] Endpoints match this contract (or this file is updated)
- [ ] `docs/openapi.yaml` updated
- [ ] Drizzle schema + migration
- [ ] Tests
- [ ] Frontend verified against the real API
