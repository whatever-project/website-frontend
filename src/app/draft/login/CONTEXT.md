---
page: login
status: designing
route_group: public
target_route: /login
draft_url: /draft/login
round: 1
updated: 2026-10-24
---

# Login: dev context

## 1. What this page is
Baseline draft of the **already-live** `/login` page, created so the design team can modify it. Round 1 replicates `src/views/public/login/index.tsx` with Thai copy hard-coded and the API call removed. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page + "Preview state (draft only)" switch (idle / loading / error / unverified / generic) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/login.json`), sample API error, preview state options |

## 2b. Changes since promotion
n/a. The live page already exists; nothing in this draft differs from it yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners`, `PasswordInput` | `@/components/Parchment` | Page frame, card, password field |
| `LetterStack` | `@/components/LetterStack` | Right-hand illustration (desktop) |
| `routes` | `@/config/routes` | Link targets (`home`, `signup`, `forgotPassword`) |
| `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn` | `src/styles/globals.css` | Card, fields, checkbox, button |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each state | no, delete on promotion |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- Live behaviour the draft leaves out: `authService.login({ usernameOrEmail, password })`, then `router.push(routes.dashboard)`.
- Error mapping on live page: `ApiError` with `status === 403` or message containing "verify" → amber unverified banner; other `ApiError` → its message; non-API error → `errorGeneric`. Keep this when promoting.
- "จดจำฉัน" checkbox: live page keeps state but does not pass it to the API (not wired).
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("login")`.
- Remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | page load | Empty form |
| Loading | request in flight | Button "กำลังเข้าสู่ระบบ…", disabled |
| Error | `ApiError` (not 403) | Red banner with server message |
| Unverified | 403 / message includes "verify" | Amber banner + link "กลับไปสมัครสมาชิก →" |
| Generic error | non-API error | Red banner "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" |
| Success | login OK | Live: redirect to dashboard (draft: none) |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `usernameOrEmail` | string | `authService.login` | |
| `password` | string | `authService.login` | |
| `remember` | boolean | not sent | See §5 |
| `sampleApiError` | string | `ApiError.message` | Placeholder |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Sign in | `authService.login` | Already exists |

## 8. Thai strings to move to i18n
Already in `messages/{th,en}/login.json` (namespace `login`): `pageTitle, pageSub, formHeading, identifier, identifierPlaceholder, password, passwordPlaceholder, rememberMe, forgotPassword, submit, submitting, noAccount, createOne, errorUnverified, errorGeneric, backToSignup`. Labels use `htmlFor` in the draft (live page has none), harmless to keep.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are from the live page.
- **Open:** What does the design team want to change?

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
