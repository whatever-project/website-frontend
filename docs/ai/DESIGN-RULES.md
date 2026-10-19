# Design-stage rules (Kimi)

Shared rules for every AI session that builds or changes a **draft** page. The Kimi agent file (`.agents/agents/kimi-designer.md`) and the design skills (`.agents/skills/design-*`) point here. Devs read this to know what a draft is guaranteed to follow.

## 1. Where Kimi may write
Only inside `src/app/draft/**`:

```
src/app/draft/<page>/
├─ page.tsx
├─ _components/        only if no existing component fits
├─ _mock/              typed mock data (Thai content)
├─ _assets/            attached images, imported statically (never public/)
├─ DESIGN-REQUEST.md
├─ SUMMARY.th.md
└─ CONTEXT.md
```
plus one line in `DRAFTS` in `src/app/draft/dev-tools/page.tsx`.

Never create or edit: `src/components`, `src/views`, `src/app/[locale]`, `src/app/layout.tsx`, `src/messages`, `src/styles/globals.css`, `src/api`, `src/config`, `src/utils`, `public/`, `package.json`, `node_modules`, any config file, or anything in `../website-backend`.

If a request seems to need a change outside the draft folder, **don't do it**. Write it in CONTEXT.md under "Needs dev" and tell the designer in the summary.

**Existing folder first, never delete.** Before creating anything, look for an existing draft (same path, similar name or same `target_route`; folders can be nested like `admin/logs`) and update it in place. **Nothing inside `src/app/draft/` is ever deleted by Kimi, and drafts are not deleted when the designer approves them, when dev promotes them or after the backend handoff.** Only the dev team deletes draft files, and only when they say so explicitly. Files a round no longer uses stay on disk and are listed in CONTEXT.md §2d.

**Live pages are changed through their draft.** A draft is kept after the page goes live, so a later change to a live page starts by finding its draft folder (`/account` → `src/app/draft/account/`) and editing it in place. Kimi logs the round in CONTEXT.md (Iteration log + §2b "Changes since promotion", which the dev applies to the live page). Kimi never rebuilds a page from its live code. If the draft folder is gone, `/design-request` restores it from `docs/handoffs/<page>/`; with neither, the page is treated as new. See `/design-request` Step 0.

## 2. Reuse before create
In this order, stop at the first that works:
1. A component in `docs/ai/COMPONENTS.md` (confirm by looking at the file in `src/components/`).
2. An existing `parch-*` / font class.
3. A composition of 1 + 2 (e.g. `ParchShell` + `parch-sheet` + `InkDivider`).
4. A copy of a page-local component into the draft's `_components/` (flag it).
5. A brand-new file in `_components/` (flag it).

Every file in steps 4–5, and every new colour, font, spacing scale or animation, goes in CONTEXT.md under **New elements** with a one-line reason, and in SUMMARY.th.md in plain words.

Draft files may **import** from `@/components/*` and `@/utils/*`. They must never **modify** them.

## 3. Use only what the designer gave you
- Sources of truth: the attached files and `DESIGN-REQUEST.md`. Nothing else.
- Don't invent copy, numbers, names, features, endpoints or flows. Use `[TBD: what is missing]` where the text should be, and list it as a question in the summary.
- Don't browse the web or copy from other sites.
- If an attachment is unclear or contradicts the request, ask the designer. Don't guess.
- Attachments that can't be read (wrong type, empty, too large): say so, don't pretend.

## 4. Draft conventions (match the repo)
- Thai-only, hard-coded copy; no `useTranslations` keys that don't exist; no messages files.
- Mock data only: no `fetch`, no `@/api/*`, no env vars.
- `next/link`, not `@/i18n/navigation` (drafts are outside locale routing). Link targets from `routes` in `@/config/routes` where the page exists.
- Page file is a client component if it uses state/handlers (`"use client"`).
- No breadcrumbs, no auth guards, no `generateMetadata`.
- Mobile and desktop: layouts must not break at 360px width.
- Accessibility basics: labelled inputs, visible focus, button vs link used correctly, alt text for meaningful images.

## 5. Finish checklist (every round)
1. `npm run check:draft` passes (nothing changed outside `src/app/draft/`).
2. `npm run typecheck` passes.
3. `SUMMARY.th.md` and `CONTEXT.md` updated, with a new line in the Iteration log.
4. Row for the page exists in `DRAFTS` in `dev-tools/page.tsx`.
5. Tell the designer the URL to open: `/draft/<page>`.

## 6. Status values (in CONTEXT.md front-matter)
`designing` → `ready-for-dev` → `in-dev` → `promoted` → `backend-todo` → `backend-in-progress` → `backend-done`

- Kimi sets `designing` on every round, and `ready-for-dev` **only when the designer explicitly approves** ("approved", "อนุมัติ", "ใช้ได้เลย").
- Dev and backend skills set the later values. The draft's `CONTEXT.md` follows up to `promoted`; after that the copy in `docs/handoffs/<page>/` carries the status.
- If the designer revises a draft whose status is `in-dev` or later, Kimi sets `designing` again and logs "Revised after dev pickup (live page not updated)"; dev then applies the delta with `draft-to-live`.

## 7. Language
- Talk to the designer in the language they use (Thai by default).
- `SUMMARY.th.md`: Thai, no code terms. Explain with what they can see and click.
- `CONTEXT.md`, `DESIGN-REQUEST.md` field labels: English. Quoted UI copy stays Thai.
