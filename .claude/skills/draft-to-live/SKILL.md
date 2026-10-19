---
name: draft-to-live
description: Promote an approved design draft (src/app/draft/<page>) into a live page: view + route in [locale], i18n messages (th + en), real API services, shared components, then hand off to backend. Use when the dev team picks up a page whose CONTEXT.md says ready-for-dev.
argument-hint: <page-name>
---

# draft-to-live: promote a draft to a live page

Argument: the draft folder name, e.g. `/draft-to-live profile-settings` → `src/app/draft/profile-settings/`. If missing, list `src/app/draft/*/CONTEXT.md` with their `status` and ask which one.

Conventions come from `docs/STRUCTURE.md` (§4 "Adding a new page", §5 "Page code: views/"). Read it if you haven't this session. Next.js here is v16: before writing route/layout/proxy code, check `node_modules/next/dist/docs/` as `AGENTS.md` says (`params` is async, no `middleware.ts`, etc.).

## 0. Preconditions: stop and tell the dev if any fails
1. `src/app/draft/<page>/CONTEXT.md` exists and `status: ready-for-dev`. If `designing`: say the designer hasn't approved, and stop (offer to continue only if the dev explicitly says so). If `in-dev`: someone already started; ask whether to resume.
2. `DESIGN-REQUEST.md` and `SUMMARY.th.md` exist in the same folder.
3. Read all three, plus every file in the draft. CONTEXT.md sections 3–9 tell you what is reused, what is new, what needs dev, what the mock data maps to, and which strings to translate.
4. Show the dev a short plan (target route, files you'll create, new shared components, services/endpoints needed, the **Needs dev** items) and get a go-ahead before changing anything.
5. Set `status: in-dev` in the draft's CONTEXT.md.
6. **Page already live** (a live view/route already exists at `target_route`, or `docs/handoffs/<page>/` already exists, or CONTEXT.md §2b has rows): this run is a **delta, not a new page**. Skip "Route and view" creation steps for things that exist (route entry, `routes` key, breadcrumb, message files, services). Apply only what CONTEXT.md §2b "Changes since promotion" lists, to the live files, keeping their i18n keys, `@/i18n/navigation` links, auth and service calls. Anything in the draft that exists only because drafts can't use `@/api`, auth, env or `@/i18n/navigation` is **not** a design change: don't port it. New or changed hard-coded Thai goes into the existing `messages/th|en/<page>.json` (add or edit keys only, th and en identical).
   - **Check drift first:** a dev may have edited the live page after the last promotion. Diff the live view (`src/views/<group>/<page>/`) against the draft files that §2b lists (`git diff --no-index <live file> <draft file>` works on any shell), and check `git log --oneline -- src/views/<group>/<page> "src/app/[locale]/(<group>)/<path>"` for commits newer than the last "Promoted to live" row in the Iteration log. If the live page changed, show the dev those commits and re-apply the draft's changes on top of the current live code; don't overwrite the live code with the draft.
   - Show the dev the delta (files and lines to change) as the plan in step 4.

## 1. Route and view
- View: `src/views/<group>/<page>/index.tsx`, `"use client"`, default export `<Page>View` (group from `route_group`). Add `components/`, `hooks/`, `functions/`, `constants.ts`, `types.ts` only if they have content.
- Move the draft's page body into the view. Draft `_components/*` → `views/<group>/<page>/components/*` (relative imports inside the view).
- Route entry (5 lines): `src/app/[locale]/(<group>)/<page-path>/page.tsx` renders the view. Put `generateMetadata` here if the page needs it, not in the view.
- Add the path to `routes` in `src/config/routes.ts` (camelCase key).
- Breadcrumb: add the path → key in `src/config/breadcrumbs.ts` and `breadcrumbs.<key>` in `messages/{th,en}/common.json`.
- Links: replace `next/link` with `Link` from `@/i18n/navigation`; `useRouter`, `usePathname`, `redirect` from the same module. Targets via `routes.*`.
- Remove draft-only things: the "Preview state (draft only)" control, `[TBD]` markers (ask the dev what they should say, or leave a clear `TODO` and report it).
- Auth: other `(user)` pages call `accountService.me()` and redirect to `routes.login` on failure (see `views/user/dashboard`). Follow the same pattern for `user`/`admin` pages.

## 2. Messages (i18n)
- Create `src/messages/th/<page>.json` and `src/messages/en/<page>.json`, **identical keys**, top-level key = namespace (kebab-case file, camelCase or same-as-file namespace like the others; match `login.json`).
- Th text = the draft's Thai. En text = translate; mark anything uncertain in your report so a human can review.
- Register both in `src/messages/index.ts` (import + spread in `en` and `th`).
- Use `useTranslations("<namespace>")`. No hard-coded user-facing strings remain in the view.

## 3. Shared components
- Items in CONTEXT.md §4 marked "Promote to shared? yes", or used by 2+ places, move to `src/components/<Name>/index.tsx`. Items used only here stay in the view's `components/`.
- Update `docs/ai/COMPONENTS.md` (add the new shared component and any new shared util/class) in the same change.
- New global CSS (CONTEXT.md §4 "New colours / fonts / …", §5 "Needs dev"): add to `src/styles/globals.css` only if it is genuinely shared; otherwise keep it local. Document in COMPONENTS.md.

## 4. Real data
Replace `_mock/` data with service calls. Follow the existing pattern exactly:
- Endpoint constants in `src/api/routes.ts` (new `<NAME>_ROUTES` object, `as const`).
- Types in `src/api/types/<name>.types.ts` (hand-written; shape from CONTEXT.md §7).
- Service object in `src/api/services/<name>.service.ts` using `request<T>()` from `@/api/client` (see `account.service.ts`).
- In the view: state + loading/error handling like `views/user/dashboard`: `catch (err) { err instanceof ApiError ? err.message : t("errorGeneric") }`.
- Don't add libraries (no react-query/axios). Don't call `fetch` directly.
- The backend endpoints probably **don't exist yet**. Ask the dev whether to (a) leave the page calling the new services (it will show its error state until the backend ships) or (b) keep a small clearly-marked temporary mock inside the service file (`// TODO(api): remove mock when <endpoint> ships`). Default to (a). Never add a new `NEXT_PUBLIC_*` flag without also updating `src/config/env.ts`, `.env.example` and the CI file (PR template rule).

## 5. Clean up and hand over
1. Create `docs/handoffs/<page>/` (for a delta run it already exists: refresh its copies from the draft and keep the Iteration-log rows already there) and **copy** (not move) `DESIGN-REQUEST.md`, `SUMMARY.th.md`, `CONTEXT.md` into it. In the handoff copy set `status: promoted` and add an Iteration-log row "Promoted to live". The handoff copy is the one that moves on (`api-handoff`, backend). In the draft's own `CONTEXT.md` also set `status: promoted` and add the same row, so Kimi can see the page is live.
2. **Do not delete anything in `src/app/draft/<path>/`, and keep its entry in `DRAFTS` in `src/app/draft/dev-tools/page.tsx`.** The draft stays as the design team's reference. Delete it only when the dev team explicitly says so (step 7). Live code must still not import from it. The only edits you make in the draft folder are the status/log lines above.
3. Update `docs/STRUCTURE.md`'s routes table and views list if the page is new.
4. Run `npm run lint`, `npm run typecheck`, `npm run build`. Lint has known pre-existing errors listed in `docs/STRUCTURE.md` §6; report only **new** ones, and fix those. If anything fails, say so; don't claim done.
5. Check by eye if a dev server is available: `/<page>` and `/en/<page>` both render; Thai and English text differ as expected; the draft URL `/draft/<path>` still works.
6. Run the `api-handoff` skill for this page (`/api-handoff <page>`).
7. **Deleting the draft: only on an explicit instruction from the dev team** (e.g. "delete the draft for <page>"). Never as part of this run, never on your own initiative, never because a status says `promoted` or `backend-*`, and don't suggest it unprompted. When asked: name the folder and list what will be removed, get a yes, then delete `src/app/draft/<path>/` and its `DRAFTS` line. `docs/handoffs/<page>/` keeps the three `.md` files, and Kimi can reopen the page from them (`/design-request`).

## Report to the dev
- Files created/changed (grouped), shared components added, messages keys count (th = en).
- English translations needing review; `TODO`s left; anything from **Needs dev** not done.
- Check results (lint/typecheck/build), honestly.
- Next step: `api-handoff` output and where the backend team finds it.
- The draft folder was kept for the design team and nothing in it was deleted.
