---
name: design-draft
description: Build or update a page mock-up inside src/app/draft/<page>/ from DESIGN-REQUEST.md and the attached files, reusing existing components before creating anything new.
whenToUse: Called by /design-request after the request is confirmed, or run alone (/design-draft <page>) to rebuild a draft from an existing DESIGN-REQUEST.md.
---

# design-draft: build the mock-up

Input: `src/app/draft/<page>/DESIGN-REQUEST.md` (+ the designer's attachments). Output: working page files under `src/app/draft/<page>/`. **Nothing outside `src/app/draft/` may change.**

## 0. Find the existing draft first
Before creating any file, check whether `src/app/draft/<page>/` already exists (also look for a folder with a similar name or the same `target_route`, and check the `DRAFTS` array in `dev-tools/page.tsx`).
- **Exists → update in place.** List it, read `page.tsx`, `_components/`, `_mock/`, `_assets/` and the `.md` files, then edit those files. Don't recreate the folder, don't rewrite files that don't need to change, don't rename files without a reason.
- **Never delete anything in the draft folder.** Not the folder, not the `.md` files, not a component, mock or asset, not even one this round makes obsolete; only the dev team may delete, and only when they say so. If a file is no longer used, stop importing it, leave it on disk and list it in `CONTEXT.md` under "Unused files (dev may delete)". Replacing the content of a file in place is fine.
- **Missing → create it.** Only then, with the Step 3 layout. Never seed a draft by copying the live page's code.

## 1. Read before you write
1. `docs/ai/DESIGN-RULES.md` and `docs/ai/COMPONENTS.md`.
2. `DESIGN-REQUEST.md` and every attachment. Write down for yourself, per section, where its text and layout come from. If the request lists an HTML source, read it from `_assets/source/`: it is a reference for layout, copy and behaviour, not code to paste (see `/design-request`, "HTML source").
3. The **closest existing page** named in the request: read its view (`src/views/<group>/<page>/index.tsx`) and its `components/`, read-only, to copy patterns (structure, class names, spacing). Also read `src/app/draft/account/page.tsx` as an example of a draft.
4. `src/app/draft/layout.tsx` (Thai provider) so you know what's available.

## 2. Plan the reuse (write the plan down, then check it)
For every section of the page decide, in this order:
1. **Existing component** (`ParchShell`, `InkModal`, `PasswordInput`, `WaxSeal`, `InkDivider`, `SheetCorners`, …). Open the file in `src/components/` and confirm props before using.
2. **Existing class** (`parch-sheet`, `parch-input`, `parch-btn`, `parch-btn-outline`, `parch-label`, `parch-check`, font classes).
3. **Composition** of 1 + 2.
4. **Copy of a page-local component** (e.g. dashboard `Section`) into this draft's `_components/`. Flag it.
5. **New component** in `_components/<Name>.tsx`. Only if 1–4 truly don't work. Flag it.

Keep a list of everything in 4 and 5 and every new colour/font/animation. It goes in `CONTEXT.md` and `SUMMARY.th.md` (design-handoff does that).

If the design only works with a change to `globals.css`, a shared component or a config: don't change it. Approximate with Tailwind arbitrary values inside the draft, flag it under "Needs dev", and move on.

## 3. Write the files

```
src/app/draft/<page>/
├─ page.tsx             default export <Page>Draft; "use client" if it has state/handlers
├─ _components/<Name>.tsx   one component per file, PascalCase, only when step 2 requires it
├─ _mock/<name>.ts      typed mock data with Thai content, exported consts
└─ _assets/<file>       images from attachments, imported statically; _assets/source/ holds the designer's HTML source (reference only, never imported)
```

Conventions (match the repo):
- Imports: `@/components/...`, `@/utils/...`, `@/config/routes`; relative imports for the draft's own files (`./_components/X`).
- Links: `import Link from "next/link"`. Targets from `routes` where the page exists, else a plain `"#"` and a note in CONTEXT.md.
- Text: hard-coded Thai. For text the designer didn't supply, write `[TBD: what is needed]` visibly on the page (not a made-up sentence).
- Data: only from `_mock/`. No `fetch`, no `@/api`, no `process.env`.
- Images: copy attached images into `_assets/` and `import img from "./_assets/x.png"` with `next/image` or a plain `<img src={img.src}>`. Never write to `public/`.
- Styling: Tailwind utilities + `parch-*` classes + font classes, with the existing hex palette (see COMPONENTS.md §2). New values only when the attachment demands it; flag them.
- Responsive: no horizontal scroll at 360px width. Use the same breakpoints the closest page uses.
- Accessibility: every input has a label, buttons are `<button>`, links are `<Link>`, meaningful images have `alt`.
- Types: no `any`. Keep it `tsc --noEmit` clean.

### Showing every state
If the request lists more than one state (empty / loading / error / success…), add a small **"Preview state (draft only)"** control at the bottom of `page.tsx` (plain buttons driving a `useState`) so the designer can flip between states. Keep it in `page.tsx`, label it clearly, and list it in CONTEXT.md as "remove when promoting". Don't build a new shared component for it.

## 4. Register the draft on the hub
In `src/app/draft/dev-tools/page.tsx`, add one entry to the `DRAFTS` array, same shape as the existing one, **if the page's route is in `routes`**:

```ts
{ label: "<Thai or English page name>", draft: "/draft/<path>", live: routes.<key> },
```
If the live route doesn't exist yet there is no `routes.<key>`; use `live: "/<path>"` as a plain string. Don't touch anything else in that file. If the entry already exists, leave it.

## 5. Self-check before handing on
- Run `npm run typecheck` and fix errors in the draft.
- Open (mentally or with the dev server if it is running) each section: does it match the request and attachments? Is there any made-up text left?
- Run `npm run check:draft`. Fix violations.

Then continue with `design-handoff`.
