---
page: login
status: designing
route_group: public
target_route: /login
draft_url: /draft/login
round: 2
updated: 2026-11-02
---

# Login: dev context

## 1. What this page is
Revision of the already-live `/login` page. Round 2 replaces the two-column page with one centred parchment card matching the supplied screenshot, while retaining the existing fields, links, and draft state previews. The same visual form is used by the new landing-page dialog, which owns the unroll animation. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Centred single-card login page and in-flow draft-only Preview state switch |
| `_mock/copy.ts` | Existing Thai login copy, sample API error, login state type, and preview options |

## 2b. Changes since promotion
n/a — this draft has not previously been picked up by dev. Round 2 file-level changes are recorded in the Iteration log.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `Flourish`, `InkDivider`, `PasswordInput`, `SheetCorners` | `@/components/Parchment` | Ornament, divider, password visibility, and sheet corners |
| `routes` | `@/config/routes` | Signup and forgot-password link targets |
| `parch-bg`, `parch-vignette`, `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn`, font classes | `src/styles/globals.css` | Page background, card, fields, button, and type |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` | Existing draft-only control from round 1, now below the card so it does not cover small screens | no; remove on promotion |

New colours / fonts / spacing / animations / CSS:
- none; round 2 recomposes existing classes and removes the old shell, wax seal, and side illustration.

## 5. Needs dev (couldn't be done inside the draft)
- Apply the centred single-card layout to the live page; remove the old `ParchShell` header/footer, `WaxSeal`, and `LetterStack` usage there. No global or shared-component edits are required by this draft.
- Connect submit to `authService.login({ usernameOrEmail, password })`, then `router.push(routes.dashboard)` on success.
- Preserve error mapping: `ApiError` status 403 or message containing "verify" → amber unverified banner; other `ApiError` → its message; non-API error → `errorGeneric`.
- "จดจำฉัน" remains unsent, matching current live behaviour.
- Replace `next/link` with locale-aware navigation and copy with `useTranslations("login")`; remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | page load / Preview state | Empty centred form |
| Loading | Preview state | "กำลังเข้าสู่ระบบ…", disabled submit |
| Error | submit or Preview state | Red banner with sample `Invalid credentials` |
| Unverified | Preview state | Amber banner and "กลับไปสมัครสมาชิก →" |
| Generic error | Preview state | Red banner "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" |
| Success | live-only successful login | Redirect to dashboard; no real success in draft |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `usernameOrEmail` | string | `authService.login` | Existing login payload |
| `password` | string | `authService.login` | Existing login payload |
| `remember` | boolean | not sent | Matches current live login |
| `state` | `LoginState` | request status / `ApiError` | Draft-only preview union |
| `sampleApiError` | string | `ApiError.message` | Placeholder |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Sign in | `authService.login` | Already exists |
| Forgot-password / signup links | none | Plain navigation |

## 8. Thai strings to move to i18n
- Existing `login` namespace remains sufficient: `formHeading, identifier, identifierPlaceholder, password, passwordPlaceholder, rememberMe, forgotPassword, submit, submitting, noAccount, createOne, errorUnverified, errorGeneric, backToSignup`.
- `pageTitle` and `pageSub` are no longer displayed by this draft.
- Preview-state labels are draft-only and should be removed rather than translated.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; the designer confirmed the supplied single-card layout and retaining existing behaviour.
- **Open:** none.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
| 2 | 2026-11-02 | `page.tsx`: replaced the shell/two-column layout with one centred card, removed the wax seal and letter illustration, moved Preview state below the card; `_mock/copy.ts` unchanged | Designer supplied the screenshot and requested the matching login UI for both standalone login and the landing popup |
