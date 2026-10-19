---
name: design-handoff
description: After a draft is built, run the checks and write SUMMARY.th.md (Thai, for non-developers) and CONTEXT.md (English, for the dev team) in the draft folder.
whenToUse: Called by /design-request after design-draft, or run alone (/design-handoff <page>) to regenerate the summary and context files for an existing draft.
---

# design-handoff: summary for designers, context for devs

Both files are **overwritten in place** every round. History lives in the Iteration log (CONTEXT.md) and Iteration history (DESIGN-REQUEST.md).

The draft folder itself is **never deleted or recreated** by this skill, and no file in it is deleted: it stays as the design team's reference until the dev team explicitly says to delete it. Files a round no longer uses stay on disk and go under "Unused files (dev may delete)" in `CONTEXT.md`. If `CONTEXT.md` / `SUMMARY.th.md` already exist, update them, and keep rows that others added to the Iteration log (for example "Promoted to live").

Everything you write must be true of the files that exist right now. Check the folder; don't write from memory of what you intended.

## 1. Gather the facts
- List `src/app/draft/<page>/` recursively.
- From `page.tsx` and `_components/`: which `@/components/*`, `@/utils/*`, `@/config/*` imports are used (these are the **reused** items); which files are in `_components/` (new or copied).
- From `_mock/`: the shape of the mock data.
- From `page.tsx` + `_components/`: every Thai string, every button/link and what it does, every state.
- From `DESIGN-REQUEST.md`: open `[TBD]` items and assumptions.

### Revision of a page that is already with dev or live (status `in-dev`, `promoted`, `backend-todo` or `backend-done` before this round)
- The draft folder is the working copy of the live page. Work out what **this round** changed in the draft (compare against the previous `CONTEXT.md` and `DESIGN-REQUEST.md` § "Changes requested"; list the files you edited). Do not diff against live code.

## 2. Write `SUMMARY.th.md`
Start from `docs/ai/templates/SUMMARY.th.template.md`. Rules:
- **Thai**, plain words. No file paths, no component or CSS names. Say "กรอบหน้ากระดาษ", "ปุ่มหลักสีน้ำตาลเข้ม", "หน้าต่างป๊อปอัป" not `ParchShell`.
- Describe what the designer can **see and click**, in page order.
- **ใช้ของเดิม / ของใหม่**: be honest. Every new element costs dev time; say which ones and why existing ones didn't fit.
- **สิ่งที่เดาไว้**: every assumption and every `[TBD]`.
- **ยังไม่ใช่ของจริง**: mock data, Thai only, no backend.
- **Revision round:** add a section "เปลี่ยนจากรอบก่อน" (template § 2b) listing, in plain Thai and in page order, what changed in this round (changed / added / removed). If the page is already live, say that the live page is not updated until a developer applies the change.
- Keep it under one screen where possible. Update the round number, date and status line.

## 3. Write `CONTEXT.md`
Start from `docs/ai/templates/CONTEXT.template.md` and fill every section (write "none" when empty, don't delete sections). Rules:
- English; UI copy stays Thai.
- For a revision round, fill **§2b Changes since promotion**: per file, what changed and why. This is what the dev applies to the live page, so be exact; keep earlier rounds' rows and add this round's with the round number. Write "n/a" while the page has never been picked up by dev.
- **Unused files (dev may delete)**: files in the draft that nothing imports any more, or "none". Never delete them yourself.
- Front-matter: `status: designing` (unless the designer has just approved, see `/design-request`), `round`, `updated`, `route_group`, `target_route`, `draft_url`. An older `CONTEXT.md` that still has `origin` / `based_on` lines or a §2c: leave those lines as they are. If the existing status is `in-dev` / `promoted` / `backend-*` and the designer chose to revise anyway, set `designing` and add the Iteration-log row "Revised after dev pickup (live page not updated)".
- **Reused** table: real import paths, taken from the code.
- **New elements**: each file in `_components/` and each new colour/font/animation/class, with the reason and a promote-to-shared suggestion (yes if it would obviously be reused by other pages).
- **Needs dev**: anything that would have required changes outside the draft (global CSS, shared component changes, new route constants, new env). Also the preview-state control if you added one ("remove when promoting").
- **Mock data → API entities** and **User actions that will need an endpoint**: these feed the later `api-handoff`. Infer from the mock and the request; mark guesses as "guess".
- **Thai strings to move to i18n**: group by section.
- **Iteration log**: append one row for this round: what changed and who asked. Never delete old rows.

## 4. Verify
1. `npm run typecheck` passes.
2. `npm run check:draft` passes (no changes outside `src/app/draft/`).
3. Every file listed in CONTEXT.md exists; every file in the draft folder is listed.
4. SUMMARY.th.md and CONTEXT.md agree with each other (same new elements, same assumptions).

If a check fails, fix it and re-run before reporting. If you can't fix it, say exactly what failed in the summary under "ยังไม่ใช่ของจริง / ปัญหาที่พบ" and tell the designer.

Return to `/design-request` Step 4.
