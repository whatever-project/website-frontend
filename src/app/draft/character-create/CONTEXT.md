---
page: character-create
status: designing
route_group: public
target_route: /character-create
draft_url: /draft/character-create
round: 4
updated: 2026-10-16
---

# Character Create: dev context

## 1. What this page is
A 6-step character-creation wizard for Arcane Vale (public/guest, no login) ending in a "ส่งคำขอแล้ว" pending-approval screen. Steps 3–6 follow the 8 screenshots listed in `DESIGN-REQUEST.md`; steps 1–2 (terms, story intro), the calendar logic, validation, bloodline cascade, avatar picker and info panel come from the Kimi reference app (round 3). See `DESIGN-REQUEST.md` for the full request.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Wizard: step state, form state, localStorage autosave (load after mount), per-step gating, info-panel state, `PreviewBar` |
| `_components/form.ts` | `CharacterForm` type, `defaultForm`, `SAMPLE_FORM` (preview only), `sanitizeForm`, `getDisplayName`, name checks, `getBirthInfo`, step validators |
| `_components/settingCalendar.ts` | Pure helpers copied from Kimi `lib/settingCalendar.ts`: months, seasons (mid-month change), real ⇄ setting date, age → birth year |
| `_components/DraftFrame.tsx` | Page frame (own header per screenshots instead of `ParchShell`: back link + brand, per-step sub label, footer) |
| `_components/StepIndicator.tsx` | Numbered step circles 1–6 (filled = done/current) |
| `_components/StepHeading.tsx` | In-sheet step header ("STEP III — IDENTITY" + Thai title + divider) |
| `_components/SectionHeading.tsx` | "✦ …" section title + optional "รายละเอียด" pill (uses `InfoButton`) |
| `_components/InfoButton.tsx` | "ⓘ รายละเอียด" pill that opens the info panel |
| `_components/ChipSelect.tsx` | Single-select chip group (radiogroup role) |
| `_components/Field.tsx` | `parch-label` + control + hint, htmlFor/id wired |
| `_components/WizardNav.tsx` | Bottom bar: autosave note + ← ย้อนกลับ / ถัดไป → (+ "✕ …" hint line) |
| `_components/StepTerms.tsx` | Step 1: terms (scrollable) + acceptance checkbox that unlocks ถัดไป |
| `_components/StepStory.tsx` | Step 2: story intro sections (read-only) |
| `_components/StepIdentity.tsx` | Step 3: avatar picker, EN/TH names + live rules, display-name format (Kimi box: 2 `parch-check` checkboxes + live name preview), age, birth mode (real date / setting day→season→month), derived date lines, bloodline → dominant → beast race / nymph spirit |
| `_components/NameRules.tsx` | ✓/✕ rule list under a name field |
| `_components/PhotoPicker.tsx` | Modal with the 8 preset avatars |
| `_components/PhotoCircle.tsx` | Round avatar / ✦ placeholder (steps 3 and 6) |
| `_components/StepAppearance.tsx` | Step 4: appearance fields, custom extra topics (max 3, add/remove), appearance/personality textareas |
| `_components/StepBackstory.tsx` | Step 5: backstory textarea + guidance box (pill opens the backstory panel), TMI textarea |
| `_components/InfoPanel.tsx` | Slide-out right panel: topics calendar / bloodline / backstory (+ Story Intro tab), working fullscreen toggle |
| `_components/StepReview.tsx` | Step 6: review rows/blocks built from live form state (both date lines, race/spirit, custom topics) |
| `_components/SubmittedScreen.tsx` | Final pending-approval screen (WaxSeal "✓", 3-day note, กลับสู่หมู่บ้าน → `routes.home`) |
| `_components/PreviewBar.tsx` | **Draft only**: jump to step 1–6 / submitted screen, fill the Karen Mason sample, clear form |
| `_mock/options.ts` | Typed Thai option consts: bloodline types, dominant bloodlines, beast races, nymph spirits, birth modes, name formats, avatar presets (`PHOTO_PRESETS`), `MAX_CUSTOM_TOPICS` |
| `_mock/guideContent.ts` | Long Thai copy copied from Kimi `guideContent.ts`: terms, story intro, calendar / bloodline / backstory guides, `INFO_TOPICS` |
| `_assets/avatar-3.png` … `avatar-8.png` | Preset avatars copied from the Kimi app (~1.2 MB each). `avatar-1/2` are the existing `/assets/avatar-1.jpg`, `avatar-2.jpg` |

## 2b. Changes since promotion
n/a (never picked up by dev yet). Round 3 changes are listed in `DESIGN-REQUEST.md` § 2b and the Iteration log.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `Flourish`, `InkDivider`, `SheetCorners`, `WaxSeal` | `@/components/Parchment` | Ornaments, sheet corners, wax seal on the submitted screen |
| `routes` (`routes.home`) | `@/config/routes` | "กลับสู่หมู่บ้าน" links (draft uses `next/link`) |
| Classes `parch-bg`, `parch-vignette`, `parch-sheet`, `parch-label`, `parch-input`, `parch-btn`, `parch-btn-outline`, `parch-check`, `seal-stamp`, fonts `font-jimthompson` / `font-display` / `font-ui` / `font-serithai` | `src/styles/globals.css` | All styling; no new CSS added |
| `/assets/avatar-1.jpg`, `/assets/avatar-2.jpg` | `public/assets` | Two of the 8 preset avatars |
| Palette hexes from `docs/ai/COMPONENTS.md` §2 | — | Hard-coded as in other pages |

Note: the draft does NOT use `ParchShell` — the screenshots have their own header variant (per-step sub label, no language switcher), so `DraftFrame` composes the same primitives instead.

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Step circles indicator | `_components/StepIndicator.tsx` | No wizard/progress UI exists | yes — any multi-step flow will need it |
| Chip single-select | `_components/ChipSelect.tsx` | No chip/tag selector exists | yes |
| Slide-out info panel (tabs, fullscreen) | `_components/InfoPanel.tsx` | `InkModal` is a centered modal, not a side panel | maybe — useful for help/guidance panels |
| Wizard bottom bar (autosave + prev/next + hint) | `_components/WizardNav.tsx` | No wizard exists | yes (with the indicator) |
| Per-step page frame | `_components/DraftFrame.tsx` | `ParchShell` has a fixed sub and a language switcher, which the design omits | maybe — if more wizard pages appear |
| Avatar picker modal | `_components/PhotoPicker.tsx` | `InkModal` doesn't give this grid/radio layout; no avatar picker exists | maybe |
| Name rule list | `_components/NameRules.tsx` | `PassRules` (dashboard) is page-local and password-specific | maybe — same idea as `PassRules` |
| Setting-calendar helpers | `_components/settingCalendar.ts` | No calendar utility exists | yes — move to `src/utils/` |
| `Field` / `SectionHeading` / `StepHeading` / `InfoButton` / `PhotoCircle` / `StepTerms` / `StepStory` | `_components/` | Small compositions of existing classes | no (trivial) |
| `PreviewBar` | `_components/PreviewBar.tsx` | Draft-only tool | no — remove when promoting |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none — only Tailwind arbitrary values with the existing palette. Kimi's `.info-scroll-panel` slide-in keyframe was NOT ported (it is not in `globals.css`); the panel uses a Tailwind `transition-transform` instead.

## 5. Needs dev (couldn't be done inside the draft)
- `routes.characterCreate` does not exist — the dev must add the route (and a page under `src/app/[locale]/`); the dev-tools row uses the plain string `"/character-create"` (guess, confirm with designer).
- Remove `PreviewBar` (and the `SAMPLE_FORM` export) when promoting.
- Real autosave: the draft stores the form in `localStorage` (`draft:character-create`) — needs a draft-persistence endpoint or a decision to keep it local.
- Avatars: `avatar-3..8.png` sit in the draft's `_assets/` (~7 MB). Optimise and move to `public/assets` (or serve from the backend) when promoting; the form stores the preset **id**, not the URL.
- Guest access: confirm the wizard really is public/no-auth (per request) and what happens on submit for a guest (account linking?).
- Setting-year numbering is a placeholder (`CURRENT_SETTING_YEAR = 340`, anchor real year 2026 → two setting years per real year). The lore team has not finalised it; change it in one place (`settingCalendar.ts`).
- Move `settingCalendar.ts` to `src/utils/` and the long Thai copy in `_mock/guideContent.ts` to `messages/th|en/*.json`.
- `getBirthInfo` falls back to `todaySetting()` (real "now") when age is empty — fine for a draft, but the backend should own the birth-year rule.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | First visit | Empty form; step 1 locked until the terms checkbox is ticked; ถัดไป disabled on steps 3–5 until valid |
| Loading | — | Not designed (not in request) |
| Error | Invalid name / missing field | Red message + rule ticks under the name field; "✕ กรุณา…" line above ถัดไป; disabled ถัดไป |
| Restored | Reload after typing | Form restored from `localStorage` |
| Success | ยืนยันการสร้างตัวละคร | Submitted screen: wax seal ✓, "ส่งคำขอเรียบร้อยแล้ว", wait-3-days note, กลับสู่หมู่บ้าน; autosave cleared |

## 7. Mock data → API entities
The whole `CharacterForm` (see `_components/form.ts`) is the future character-creation payload.

| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| photo | preset id string | character.avatar (preset id or upload) | draft: 8 presets only (guess) |
| firstNameEn / lastNameEn / nameTh / nameFormat | string / enum | character.name* | nameFormat: `first-last` / `last-first`; EN `^[A-Z][a-z]*( [A-Z][a-z]*)*$`, TH `^[ก-๙ ]+$` |
| age | string (digits) | character.age | used to derive the setting birth year |
| birthMode / realDate / settingDay / settingSeason / settingMonth | enum / date / number / key / index | character.birthdate | store ONE canonical date (real) + derive setting date; year rule TBD |
| bloodlineType / dominant / beastRace / nymphSpirit | ids | character.bloodline* | beastRace only for `halfbeast`, nymphSpirit only for `nymph` |
| hairColor / eyeColor / skinColor / scent / height / weight | strings | character.appearance | height cm / weight kg |
| topics[] | { label, value }[] | character.customTopics | max 3 |
| appearanceNotes / personality / backstory / tmi | strings | character texts | backstory required |
| option lists (bloodlines, races, spirits) and the calendar | const lists | static config (guess) | fixed in-setting text |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| ยืนยันการสร้างตัวละคร | `POST /characters` (guess) | status pending-approval, reviewed within 3 days |
| บันทึกอัตโนมัติ | draft save endpoint or local storage (guess) | draft uses localStorage |
| เลือกรูปภาพโปรไฟล์ | none for presets; upload endpoint only if the designer wants uploads | open question |

## 8. Thai strings to move to i18n
- Frame: "กลับสู่หมู่บ้าน", "✦ Arcane Vale — ชุมชนโรลเพลย์ในหุบเขาเวทมนตร์ ✦" (already exists as `common.site.*`), step subs/titles.
- Step 1–2: all of `TERMS_SECTIONS` / `STORY_SECTIONS` (long copy, `_mock/guideContent.ts`), the acceptance sentence, the intro line.
- Step 3: "ข้อมูลประจำตัว", name labels/placeholders, name-rule messages (6), "วิธีอ่านชื่อ–นามสกุล (ภาษาไทย)", Display-Name note, "รูปแบบการแสดงชื่อ (เลือก 1 รูปแบบ)", "วันเกิด", "อายุ", birth-mode labels, select labels, "วันเกิด (สากล)" / "(เทียบเท่าเซตติ้ง)", "ประเภทสายเลือด", "สายเลือดเด่น (Dominant Bloodline)", beast race / nymph spirit labels, picker texts, all option labels.
- Step 4: field labels + placeholders + unit hints, "หัวข้อเพิ่มเติม …", "✦ เพิ่มหัวข้อเอง", textarea labels/placeholders.
- Step 5: "เรื่องราวของตัวละคร", guidance box title + 5 bullets, "ข้อมูลเพิ่มเติม …", placeholders.
- Hints: the 10 "กรุณา…" messages in `form.ts`.
- Info panel: "Information Panel", topic labels, tab labels, all guide sections (`GUIDE_CALENDAR`, `GUIDE_BLOODLINE`, `GUIDE_BACKSTORY`), footer.
- Step 6: all review row labels, "Display Name", format descriptions, "ยืนยันการสร้างตัวละคร →".
- Submitted: "ส่งคำขอแล้ว", "ส่งคำขอเรียบร้อยแล้ว", the 3-day note, the admin-review note, fallback name "ผู้พเนจรใหม่".
- Shared: "บันทึกอัตโนมัติแล้ว · {time}", "← ย้อนกลับ", "ถัดไป →", "รายละเอียด".

## 9. Assumptions and open questions
- **Assumed (designer to confirm):**
  - Target route `/character-create`, route group public (no login) — from the request, not from an existing route.
  - Round 3 follows the Kimi reference for everything the screenshots did not cover. Where they differ the earlier draft wins: spellings "ลูฮอร่า" (Kimi: "ลูกโฮรา") and "ชาวเทอร์ร่า" (Kimi: "ชาวเทอร่า"). Round 4 exception: the display-name format control (รูปแบบการแสดงชื่อ) now follows Kimi exactly (two `parch-check` checkboxes in a full-width dashed box under the photo/name grid); the round-2 ✦/☆ star design was dropped at the designer's request.
  - "ฮาล์ฟบีสต์" replaces the earlier "อาสัฟบีสต์", because the Kimi guide text gives the English "Half-Beast" (the old name was a misread of the screenshots).
  - Dominant bloodlines มนุษย์ / ผู้วิเศษ need no sub-selection (Kimi); only ฮาล์ฟบีสต์ (race) and นิมฟ์ (spirit) do.
  - Step header titles for steps 1–2 ("ข้อตกลงแห่งหุบเขา", "เนื้อเรื่องย่อ") and the sub labels "THE ACCORD" / "THE CROSSING" come from Kimi.
  - The 8 preset avatars replace the local file picker from rounds 1–2.
  - The form starts empty (screenshot example values are only loaded by the Preview bar). `SAMPLE_FORM.backstory` is a visible placeholder, not real copy.
  - Small illegible copy from the screenshots is unchanged from round 1 ("ไผ่ที่เก่า", "บันทึกแห่งหุบเขา").
- **Open:**
  - Setting-year numbering (placeholder, see §5).
  - Validation messages for fields Kimi does not validate (e.g. scent, custom topic length).
  - Whether players may upload their own picture (the Kimi version offers presets only).
  - Which of Kimi's/screenshot's spellings is final (see Assumed).

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-15 | First version: 6-step wizard + submitted screen, steps 1–2 as `[TBD]` placeholders | Initial request |
| 2 | 2026-10-15 | Step 3 display-name format: star (✦ / ☆) marker like the birthday chips, plus a filled background on the selected option | Designer revision request (see `DESIGN-REQUEST.md` round 2) |
| – | 2026-10-15 | Status synced to `ready-for-dev` and files re-synced to round 2 to match `DESIGN-REQUEST.md` (CONTEXT.md still said `designing` / round 1). The approval itself was not recorded here: confirm with the designer. | Consistency fix |
| 3 | 2026-10-16 | Filled the missing info from the Kimi reference: steps 1–2, real calendar + both date lines, bloodline cascade (half-beast race / nymph spirit), name validation, 8-avatar picker, per-step gating with hints, info panel with 3 topics + Story Intro tab + fullscreen, localStorage autosave, review step updates, draft-only Preview bar. Status set back to `designing`. | Designer asked to fill the missing info from the Kimi version |
| 4 | 2026-10-16 | รูปแบบการแสดงชื่อ in step 3 rebuilt exactly like Kimi `IdentityStep` (full-width dashed box, two checkboxes, name preview on the right); round-2 star design removed. Status stays `designing`. | Designer asked to follow the Kimi folder exactly |
