---
page: landing
status: designing
route_group: public
target_route: /
draft_url: /draft/landing
round: 2
updated: 2026-11-02
---

# Landing: dev context

## 1. What this page is
Revision of the already-live landing page `/`. The login button now opens a parchment login dialog over the village scene with a top-to-bottom unroll animation. The dialog matches the supplied screenshot and contains draft-only login state previews. The current working copy also has a draft-local TH/EN landing-copy toggle outside this round's requested popup scope. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Village scene, time controls, draft-local landing language toggle, and dialog visibility with explicit trigger-focus restoration |
| `_components/Stars.tsx` | Existing editable copy of the live page-local stars |
| `_components/LoginModal.tsx` | New accessible dialog, login form, close behaviour, and draft-only state previews |
| `_components/LoginModal.module.css` | New scoped backdrop, parchment-unroll, and moving-roll animations with reduced-motion fallback |
| `_mock/copy.ts` | Bilingual landing copy for the draft toggle plus Thai login copy, login state type, and preview options |

## 2b. Changes since promotion
n/a — this draft has not previously been picked up by dev. Round 2 file-level changes are recorded in the Iteration log.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `getTimeState` | `@/utils/timeOfDay` | Existing colour grade, wash, stars opacity, and window glow |
| `FaGlobe` | `react-icons/fa` | Icon in the current draft-local landing language toggle |
| `Flourish`, `InkDivider`, `PasswordInput`, `SheetCorners` | `@/components/Parchment` | Dialog ornament, divider, password visibility, and sheet corners |
| `routes` | `@/config/routes` | Signup and forgot-password link targets |
| `gallery-btn`, `sun-slider`, `rise-in`, `mist-drift`, `candle-flicker`, `star-twinkle`, `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn`, font classes | `src/styles/globals.css` | Existing scene, form, and type styling |
| `/assets/village.jpg` | `public/assets/` | Existing backdrop, referenced by path |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| `Stars` copy | `_components/Stars.tsx` | Existing live copy is page-local; retained from round 1 | no; fold design edits back into the live page-local file |
| `LoginModal` | `_components/LoginModal.tsx` | Existing `InkModal` cannot apply the requested unroll animation to its sheet or provide the specified close control and responsive state panel | maybe; reuse the form with live login, but keep the dialog landing-specific unless another page needs it |
| Dialog animations | `_components/LoginModal.module.css` | No existing parchment-unroll or travelling-roll animation | no initially; landing-specific |
| Login preview state switch | `_components/LoginModal.tsx` | Draft-only control for empty/loading/error/unverified/generic states | no; remove on promotion |
| Draft-local landing language toggle | `page.tsx`, `_mock/copy.ts` | Present in the current working copy outside the requested popup scope; shared `LanguageSwitcher` renders nothing on `/draft/*` | no; keep the existing live language switch when promoting |

New colours / fonts / spacing / animations / CSS:
- New scoped animations: `backdrop-in` (300 ms), `sheet-unroll` (950 ms clip reveal), and `roll-down` (950 ms moving rolled edge); disabled under `prefers-reduced-motion`.
- No new palette colours or fonts in the dialog CSS module; it uses the existing parchment palette.
- The current working copy also contains landing legibility styling outside the requested popup scope; dev should compare before promotion.

## 5. Needs dev (couldn't be done inside the draft)
- Apply the dialog and its scoped animation to the live landing page; no global CSS or shared-component change is required by the dialog.
- Connect submit to `authService.login({ usernameOrEmail, password })`, preserve the live 403/verify and generic error mapping, then `router.push(routes.dashboard)` on success.
- Remove the Preview state switch and draft-local landing language toggle; use the existing live language switch, locale-aware navigation, and `useTranslations` namespaces.
- Add the new close-label translation "ปิดหน้าต่างเข้าสู่ระบบ". Existing form strings can reuse the `login` messages.
- "จดจำฉัน" remains unsent, matching the current live login behaviour.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Real time | default device clock, refresh every 30 s | Existing time-of-day scene and "● เวลาจริง" |
| Manual time | slider or `?t=<hour>` | Existing selected-hour scene and "○ เวลาจริง" |
| Landing language | TH/EN button in the current draft | Landing copy switches language; login dialog remains Thai |
| Dialog closed | initial page / X / backdrop / Escape | Village scene without login form; focus returns explicitly to the login button |
| Empty | open "เข้าสู่ระบบ" | Empty form, unrolled parchment dialog, identifier focused |
| Loading | Preview state | "กำลังเข้าสู่ระบบ…", disabled submit |
| Error | submit or Preview state | Red banner with sample `Invalid credentials` |
| Unverified | Preview state | Amber banner and "กลับไปสมัครสมาชิก →" |
| Generic error | Preview state | Red banner "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" |
| Success | live-only successful login | Redirect to dashboard; no real success in draft |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `hour` | number | browser clock / slider / URL | No API |
| `lang` | `DraftLang` | draft-local UI state | Landing copy only; no API |
| `loginOpen` | boolean | local UI state | No API |
| `usernameOrEmail` | string | `authService.login` | Existing login payload |
| `password` | string | `authService.login` | Existing login payload |
| `remember` | boolean | not sent | Matches current live login |
| `state` | `LoginState` | request status / `ApiError` | Draft-only preview union |
| `sampleApiError` | string | `ApiError.message` | Placeholder |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Sign in | `authService.login` | Already exists; then redirect to dashboard |
| Open/close dialog, time controls, language toggle, links | none | Local UI or plain navigation |

## 8. Thai strings to move to i18n
- Existing landing namespace: `welcome, title, subtitle, logIn, signUp, realTime, realTimeOff, timeLabel`; existing `site.arcaneVale`. The current draft's English landing copy mirrors these keys.
- Reuse existing login namespace: `formHeading, identifier, identifierPlaceholder, password, passwordPlaceholder, rememberMe, forgotPassword, submit, submitting, noAccount, createOne, errorUnverified, errorGeneric, backToSignup`.
- New dialog accessibility label: "ปิดหน้าต่างเข้าสู่ระบบ".
- Preview-state labels and the draft-local language-toggle labels are draft-only and should be removed rather than translated.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none for the requested dialog; X/backdrop/Escape close behaviour and existing link destinations were explicitly confirmed.
- **Open:** none for the requested dialog. The separate draft-local landing language/legibility edits are outside this request and should be compared by dev before promotion.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page | Make an editable draft for the design team |
| 2 | 2026-11-02 | `page.tsx`: login button opens a dialog and receives focus on close; `_mock/copy.ts`: added login copy/states; added `LoginModal.tsx` and `LoginModal.module.css` for the screenshot layout and unroll effect | Designer supplied the login screenshot and requested a parchment-unroll popup on landing |
