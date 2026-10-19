---
name: design-request
description: Start or continue a page design. Kimi first looks for an existing draft folder of the page and continues it; otherwise it interviews the designer with a few simple questions. It builds the mock-up in the draft folder, and writes a Thai summary plus a dev context file. Use for every new page and every revision round.
whenToUse: The designer types /design-request (optionally followed by a page name or a note), or asks to design, mock up, change or revise a page.
---

# /design-request: the one command for the design team

You run the whole design flow from one command: **find the draft → interview (only what is needed) → build → hand-off summary → ask for feedback**. The designer should never need to know about the other skills or write a prompt.

Read `docs/ai/DESIGN-RULES.md` and `docs/ai/COMPONENTS.md` now if you have not in this session. The hard rules in `.agents/agents/kimi-designer.md` apply (write only inside `src/app/draft/`).

Extra text after the command (e.g. `/design-request หน้าโปรไฟล์ใหม่`) is the designer's first hint about the page. Use it as an answer, don't ask for it again.

## Step 0: set up and find the draft
1. Run `npm run check:draft -- --snapshot` (records the starting point for the guard).
2. **Look for an existing draft before creating anything.** Find every `DESIGN-REQUEST.md` / `CONTEXT.md` under `src/app/draft/` (folders can be nested, e.g. `admin/logs`; ignore `dev-tools`). Match on the folder path, the page name and `target_route`, not only on the exact spelling (e.g. "สร้างตัวละคร" = `character-create`). This also applies to a page that is **already live**: draft folders are never deleted, so the draft of a live page is normally still there. Also list `docs/handoffs/*/` (read-only) in case a dev deleted a draft.
   - **A draft folder matches (or the designer names it) → ITERATION mode** (Step 1b). This includes a folder that exists but has no `DESIGN-REQUEST.md` yet (half-finished round, or an older draft made before the hand-off files existed): read what is there and continue in that same folder.
   - **Only `docs/handoffs/<page>/` matches** (a dev deleted the draft) → tell the designer in plain words, and ask whether to reopen it as a revision. If yes, recreate `src/app/draft/<path>/` with the same path, seeded from the three handoff files (copy, don't move), and go to Step 1b.
   - **Nothing matches → NEW draft** (Step 1). Never rebuild a live page by copying its live code; build from the interview and the attachments.
   - Several match and the designer didn't say which → list them in plain words and ask which one, or whether this is a new page.
   - Never create a second folder for a page that already has one. Never delete anything in a draft folder; only the dev team deletes draft files, and only when they say so.
3. Attachments = the files the designer attached or mentioned **in this conversation**. Don't search the repo or the disk for other references. If they say "see the attached file" and you can't see one, say so and ask them to attach it again.
   - The **HTML source** (optional) is an attachment too: an `.html` file attached, a file path the designer gives, or HTML code pasted into the chat. See "HTML source" below.

## Step 1 (NEW): interview
Ask in **rounds**, 2 to 4 short questions each, in the designer's language. Wait for the answers before the next round. Skip questions that are already answered by the command text or attachments, and say what you understood from the attachments first ("จากไฟล์แนบ เห็นว่า…").

**Round 1: basics**
1. ชื่อหน้า (ภาษาอังกฤษตัวพิมพ์เล็ก เช่น `profile-settings`) and one sentence on what the page is for.
2. Who sees it: คนทั่วไปที่ยังไม่ล็อกอิน / ผู้ใช้ที่ล็อกอินแล้ว / แอดมิน. (This decides `public` / `user` / `admin`.)
3. What did you attach, and what is each file for? (mockup / screenshot / ข้อความจริง / แบรนด์ / อื่น ๆ)
3b. Is there an HTML source for this page? "มีโค้ด HTML ต้นแบบของหน้านี้ไหม (ไม่บังคับ)? แนบไฟล์ .html หรือวางโค้ดมาได้ ถ้าไม่มี ข้ามได้เลย (ถ้าไม่มี ฉันจะออกแบบจากคำตอบและไฟล์แนบอื่น)". Ask it for a brand-new page and for a page that already exists. Never insist on it.

**Round 2: content**
4. What sections are on the page, from top to bottom?
5. For each section: what does it show, and what can the user do there?
6. Where does the text come from: in the attachments, written here, or should I leave `[TBD]`?

**Round 3: data and behaviour**
7. Which things on the page are real information that changes (lists, numbers, names, status), and which are fixed text?
8. What should happen when: there is nothing to show / it is loading / something goes wrong / it succeeds?
9. What does each button or link do? Any pop-ups or confirmations?

**Round 4: look**
10. Which existing page is closest in feeling (login, dashboard, account, …)?
11. Is there anything that doesn't exist on the site yet (a new kind of card, chart, banner…)?
12. Mobile first, desktop first, or both equally?

Do not ask all rounds if the answers are obvious. Offer a default ("ถ้าไม่ตอบ ฉันจะใช้ …") for anything optional.

### HTML source (optional)
Applies in Step 1 and Step 1b. If the designer has none or skips the question, say nothing more and continue as normal.
- **Read it first**, then tell the designer what you understood ("จาก HTML เห็นว่า…": sections, views/states, text, interactions). Skip interview questions it already answers; the Confirm step still happens before building.
- It is a **reference for layout, copy and behaviour, not code to paste.** Rebuild it with existing components and classes as `design-draft` says. Anything in it that breaks the draft rules (fetch/API calls, env, external scripts, tracking) becomes mock data or a flagged `[TBD]`.
- **Save a copy** (don't move it) as `src/app/draft/<page>/_assets/source/<original-name>.html`; pasted code goes in `source.html`. On a later round, add the new file beside the old one (e.g. `source-r2.html`); never delete or overwrite an earlier source.
- Can't be read, empty, or too large to read: say so plainly and ask for another way to share it. Don't pretend you read it.

**Confirm.** Restate the request in plain Thai as a short list: page, who sees it, sections, behaviours, HTML source (given / none), what is reused vs possibly new, open `[TBD]` items. Ask "ถูกต้องไหม? พิมพ์ 'ใช่' หรือบอกว่าจะแก้ตรงไหน". Don't build before a yes.

Then save `src/app/draft/<page>/DESIGN-REQUEST.md` from `docs/ai/templates/DESIGN-REQUEST.template.md`, in the designer's words, `status: designing`, round 1. Go to Step 2.

## Step 1b (ITERATION): continue the existing draft, ask only what changed
1. Read `DESIGN-REQUEST.md`, `SUMMARY.th.md` and `CONTEXT.md` of the page, and the files already in the folder. The build step updates these files in place; never start over from live code.
   - If one of the three `.md` files is missing (older draft), read the page's code, create the missing file from its template, and say so in the Iteration log ("hand-off files added").
   - If `status` is `in-dev`, `promoted`, `backend-todo` or `backend-done`, the page is already live or with the dev team. Tell the designer in plain Thai that the draft here is the working copy of that page, and that changes made here do **not** change the live page until a developer applies them. Ask whether they still want to change it. If yes, continue; if no, stop and just point them to `/draft/<path>`.
   - The live page may have been edited by a developer after the draft was promoted. You can't tell from here, so don't guess: the change list you write in `CONTEXT.md` §2b lets the dev compare before applying.
2. Ask: "รอบนี้อยากเปลี่ยนอะไร ตรงส่วนไหน?" (plus "มีไฟล์แนบใหม่ไหม?" and "มี HTML ต้นแบบใหม่ หรือ HTML ของหน้าปัจจุบัน ไหม (ไม่บังคับ)?"). Handle an HTML source as described in "HTML source (optional)" above, whether the page is a draft or already live. If the answer is about something big (new section, new data), ask 1–2 follow-ups from the interview above. Otherwise don't re-interview.
3. Restate the change in one or two lines and get a yes.
4. Update `DESIGN-REQUEST.md`: edit the affected sections, fill § "Changes requested" for this round, add a row to **Iteration history**, bump `round` and `updated`. If the page was already with dev, set `status: designing` and say in the history row "Revised after dev pickup (live page not updated)". Go to Step 2.

## Step 2: build
Open `.agents/skills/design-draft/SKILL.md` and follow it exactly.

## Step 3: hand-off files
Open `.agents/skills/design-handoff/SKILL.md` and follow it exactly. It runs the checks and writes `SUMMARY.th.md` and `CONTEXT.md` (including the Iteration-log row for this round).

## Step 4: report and ask for feedback
Reply in Thai, short:
1. Where to look: เปิด `/draft/<page>` (or "กดปุ่ม Go to Drafts มุมขวาล่างของเว็บ แล้วเลือกหน้านี้").
2. The 3–5 most important points from `SUMMARY.th.md`, in your own words, including any **new elements** and **assumptions** that need confirming.
3. If any check failed or anything could not be done, say so plainly.
4. Ask: "พอใจหรือยัง? ถ้าอยากแก้ พิมพ์ `/design-request` แล้วบอกจุดที่อยากแก้ ถ้าพอใจแล้วพิมพ์ 'อนุมัติ'".

## Approval
When the designer clearly approves ("อนุมัติ", "approved", "ใช้ได้เลย", "ส่งให้ dev"):
1. Re-run `npm run check:draft` and `npm run typecheck`. If they fail, fix first and tell the designer.
2. Set `status: ready-for-dev` in `CONTEXT.md` and `DESIGN-REQUEST.md`; update the status line in `SUMMARY.th.md`; add an Iteration-log row "Approved by designer".
3. Tell the designer in Thai that the page is ready for the dev team, and where the files are (`src/app/draft/<page>/`). Add that the draft stays in place after the dev team picks it up (it is deleted only if the dev team says so), so they can open `/draft/<path>` any time as a reference and make later changes there. Do not do anything outside the draft folder.

A request for more changes after approval sets the status back to `designing`.

## Never
- Don't build from guesses. Ask, or use `[TBD]`.
- Don't ask for or mention technical details (file names, components, CSS) unless the designer asks.
- Don't edit outside `src/app/draft/`.
- Don't create a new draft folder before checking for an existing one, and never delete anything inside a draft folder, whatever the status. Only the dev team deletes draft files, and only when they say so.
- Don't rebuild a live page from its live code. The draft folder is the source for later changes.
- Don't require an HTML source, and don't paste its code verbatim into the draft.
