---
page: landing
status: designing
route_group: public
target_route: /
draft_url: /draft/landing
round: 12
updated: 2026-11-04
---

# Landing: dev context

## 1. What this page is
Revision of the already-live landing page `/`. The login button now opens a 3D parchment scroll (Three.js, from the Kimi "Fantasy Parchment Scroll Demo") over the village scene: it unrolls from a roll, settles with a damped wobble, then the login form fades in on the sheet; closing (X / backdrop / Esc) rolls it back up before dismissing. If WebGL or the model fails, a flat parchment card with the same form is shown. The form matches the round-2 screenshot and contains draft-only login state previews. The current working copy also has a draft-local TH/EN landing-copy toggle outside this round's requested popup scope. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Village scene, time controls, draft-local landing language toggle, and dialog visibility with explicit trigger-focus restoration |
| `_components/Stars.tsx` | Existing editable copy of the live page-local stars |
| `_components/LoginModal.tsx` | Dialog shell: dimmed backdrop, transparent Three.js canvas, form overlay shown once the sheet has settled, close handling (rolls up first), flat fallback card, draft-only state previews |
| `_components/LoginForm.tsx` | Login form extracted unchanged from the round-2 modal; used on the 3D sheet and in the flat fallback. Wrapped in a `<fieldset disabled>` while the sheet is still rolling |
| `_components/scrollLoginAnimation.ts` | Typed port of the demo's `scroll_login_animation_v03.js` (engine class `ScrollLoginAnimation`) |
| `_components/useScrollLoginAnimation.ts` | React hook: lazy-loads the engine (dynamic `import()`, so `three` is not in the landing bundle until the popup opens), unrolls on ready, exposes `ready / error / formActive / close()` |
| `_components/LoginModal.module.css` | Scoped backdrop, flat-fallback pop-in, canvas sizing, form reveal, loading-roll animations, reduced-motion fallback |
| `_assets/scroll/scroll_login_animation_v01.glb` | The demo's parchment model (5.8 MB), referenced via `new URL("../_assets/scroll/…glb", import.meta.url)` |
| `_assets/source/scroll_login_animation_v01.html` | Designer's HTML source: reference only, never imported |
| `_mock/copy.ts` | Bilingual landing copy for the draft toggle plus Thai login copy, login state type, and preview options |

## 2b. Changes since promotion
n/a — this draft has not previously been picked up by dev. Round 2 file-level changes are recorded in the Iteration log.

## 2d. Unused files (dev may delete)
- `page.tsx` still imports `FaSun`, `FaRegSun` and `PiClockCounterClockwise` but does not use them (the real-time toggle is text only now); remove the imports when finalising.
- `_assets/parchment-roll.svg`: not imported by any file (leftover from round 2); left on disk.

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `getTimeState` | `@/utils/timeOfDay` | Existing colour grade, wash, stars opacity, and window glow |
| `FaGlobe` | `react-icons/fa` | Icon in the current draft-local landing language toggle |
| `Flourish`, `InkDivider`, `PasswordInput` | `@/components/Parchment` | Form ornament, divider, password visibility |
| `FaGlobe` | `react-icons/fa` | Language toggle icon |
| `MdSunny` | `react-icons/md` | Slider icon, 06:00-18:00 |
| `BsMoonStarsFill` | `react-icons/bs` | Slider icon, 18:01-05:59 |
| `three` (+ `GLTFLoader`, `EffectComposer`, `RenderPass`, `SSAOPass`, `OutputPass` from `three/examples/jsm`) | npm, **newly installed by the designer/dev for this round** | 3D scroll |
| `routes` | `@/config/routes` | Signup and forgot-password link targets |
| `gallery-btn`, `sun-slider`, `rise-in`, `mist-drift`, `candle-flicker`, `star-twinkle`, `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn`, font classes | `src/styles/globals.css` | Existing scene, form, and type styling |
| `/assets/village.jpg` | `public/assets/` | Existing backdrop, referenced by path |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| `Stars` copy | `_components/Stars.tsx` | Existing live copy is page-local; retained from round 1 | no; fold design edits back into the live page-local file |
| `LoginModal` | `_components/LoginModal.tsx` | Existing `InkModal` cannot host a 3D scroll, delay the form until the sheet settles, or roll back up before closing | maybe; reuse the form with live login, but keep the dialog landing-specific unless another page needs it |
| `LoginForm` | `_components/LoginForm.tsx` | Form needed to be shared between the 3D sheet and the flat fallback | no; replace with the live login form on promotion |
| 3D scroll engine | `_components/scrollLoginAnimation.ts` | No 3D / WebGL code exists in the repo | maybe; reusable for other "scroll" popups (signup, etc.) |
| Scroll hook | `_components/useScrollLoginAnimation.ts` | Lifecycle glue between React and the engine | with the engine |
| Scroll model | `_assets/scroll/scroll_login_animation_v01.glb` | Required by the engine | with the engine; see Needs dev |
| Slider sun/moon icon | `_components/TimeSlider.module.css`, `page.tsx` | The thumb is styled in shared `globals.css` (`.sun-slider`), which drafts may not edit. The native thumb is made transparent (18 px, same size so hit area is unchanged) and a react-icon is drawn over it, positioned from the hour (`--pos`) | yes: if promoted, move this into the shared slider or a small `TimeSlider` component |
| Dialog animations | `_components/LoginModal.module.css` | Form reveal and loading roll | no initially; landing-specific |
| Login preview state switch | `_components/LoginModal.tsx` | Draft-only control for empty/loading/error/unverified/generic states | no; remove on promotion |
| Draft-local landing language toggle | `page.tsx`, `_mock/copy.ts` | Present in the current working copy outside the requested popup scope; shared `LanguageSwitcher` renders nothing on `/draft/*` | no; keep the existing live language switch when promoting |

New colours / fonts / spacing / animations / CSS:
- 3D animation (engine, from the demo): geometry-based unroll 1.65 s / roll-up 1.35 s (ease-in-out cubic), 0.85 s damped settle wobble after opening, form active 0.28 s after open, warm key + rim lights with shadows, baked per-vertex AO plus `SSAOPass`, drifting gold particles, fog. Camera is fixed (the demo's 5° "elevated" view) and fits the container **height** so the sheet stays tall on phones (sides may crop below ~480 px width).
- Under `prefers-reduced-motion` the sheet is set to fully open / fully closed immediately (no roll, no wobble).
- CSS: `backdrop-in` (200 ms), flat-fallback `pop-in` (220 ms), `formReveal` fade/scale (220–240 ms), `loadingRoll` spinner; all disabled under reduced motion.
- No new palette colours or fonts in the dialog CSS module; it uses the existing parchment palette (the loading roll uses two ivory hex values).
- The current working copy also contains landing legibility styling outside the requested popup scope; dev should compare before promotion.

## 5. Needs dev (couldn't be done inside the draft)
- **Dependencies:** add `three` and `@types/three` (0.187.0 installed locally for this round) to `package.json`. `three` is only imported from `_components/scrollLoginAnimation.ts` via dynamic `import()`.
- **Model asset:** `scroll_login_animation_v01.glb` (5.8 MB) currently lives in the draft's `_assets/` and is resolved with `new URL(..., import.meta.url)`. When promoting, simplest is `public/assets/` + a plain `/assets/…glb` URL (or keep the bundler asset). Consider preloading it (e.g. on login-button hover/focus) since first open waits on the download.
- **Intermittent request cancel:** in headless Edge + SwiftShader the model request was sometimes cancelled right after the WebGL context started ("Failed to fetch", ~50% of runs). `ScrollLoginAnimation.loadModel()` retries up to 2 more times (250/500 ms); all test runs then loaded the 3D sheet. Verify on real GPUs/browsers; the flat fallback covers a total failure.
- **Performance:** CPU vertex deformation per frame (~42k vertices) plus `SSAOPass`; `delta` is capped at 0.2 s per frame so very slow devices animate slower than real time. Consider dropping `SSAOPass` on low-end devices (AO is also baked into vertex colours).
- Apply the dialog and its scoped animation to the live landing page; no global CSS or shared-component change is required by the dialog.
- Connect submit to `authService.login({ usernameOrEmail, password })`, preserve the live 403/verify and generic error mapping, then `router.push(routes.dashboard)` on success.
- Remove the Preview state switch and draft-local landing language toggle; use the existing live language switch, locale-aware navigation, and `useTranslations` namespaces.
- Add the loading label "กำลังโหลด" (screen-reader only). There is no close-button label any more (the X was removed in round 4); consider an accessible close affordance for screen-reader/keyboard users if dev wants one (Esc works). Existing form strings can reuse the `login` messages.
- "จดจำฉัน" remains unsent, matching the current live login behaviour.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Real time | default device clock, refresh every 30 s | Existing time-of-day scene and "● เวลาจริง" |
| Manual time | slider or `?t=<hour>` | Existing selected-hour scene and "○ เวลาจริง" |
| Landing language | TH/EN button in the current draft | Landing copy switches language; login dialog remains Thai |
| Dialog closed | initial page / tap outside the form (dim area or paper) / Escape | Sheet rolls back up (~1.35 s), then the village scene without login form; focus returns explicitly to the login button |
| Loading model | open "เข้าสู่ระบบ" | Dimmed backdrop with a small rolling-paper spinner until the GLB is ready |
| Unrolling | model ready | Roll unrolls (~1.65 s) and settles (~0.3–0.85 s); form hidden and inert |
| Fallback | WebGL/model failure | Flat parchment card with the same form, interactive immediately |
| Empty | sheet settled | Empty form faded in on the sheet, identifier focused |
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
- Existing landing namespace: `welcome, title, subtitle, logIn, signUp, realTime, realTimeOff, timeLabel` (the draft's `realTime`/`realTimeOff` now take the clock string; in live next-intl use a `{time}` placeholder, e.g. "แสดงภาพตามเวลาปัจจุบัน {time} น.", and format the time with the current locale); existing `site.arcaneVale`. The current draft's English landing copy mirrors these keys.
- Reuse existing login namespace: `formHeading, identifier, identifierPlaceholder, password, passwordPlaceholder, rememberMe, forgotPassword, submit, submitting, noAccount, createOne, errorUnverified, errorGeneric, backToSignup`.
- New dialog accessibility label: "กำลังโหลด" (loading).
- Preview-state labels and the draft-local language-toggle labels are draft-only and should be removed rather than translated.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** the demo's drag-to-rotate is turned off (it would fight the form); the loading spinner has no visible text; form text keeps its normal login size instead of the demo's 9–10 px text. X/backdrop/Escape close behaviour, existing link destinations and the full-form-on-the-sheet scope were explicitly confirmed.
- No X button (removed in round 4). Any tap outside the form (dim area or the paper around it, including while the sheet is still unrolling) and Esc close the dialog; taps on the form, the fallback card and the Preview panel do not. Chosen because phones have no Esc and the sheet covers the whole screen there.
- **Open:** none for the requested dialog. The separate draft-local landing language/legibility edits are outside this request and should be compared by dev before promotion.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page | Make an editable draft for the design team |
| 2 | 2026-11-02 | `page.tsx`: login button opens a dialog and receives focus on close; `_mock/copy.ts`: added login copy/states; added `LoginModal.tsx` and `LoginModal.module.css` for the screenshot layout and unroll effect | Designer supplied the login screenshot and requested a parchment-unroll popup on landing |
| 3 | 2026-11-04 | `LoginModal.tsx` rewritten around a Three.js parchment scroll; form extracted to `LoginForm.tsx`; added `scrollLoginAnimation.ts`, `useScrollLoginAnimation.ts`, the GLB in `_assets/scroll/` and the demo HTML in `_assets/source/`; `LoginModal.module.css` reworked; Preview state panel moved to the bottom-left like the other drafts; `page.tsx` and `_mock/*` unchanged | Designer supplied the Kimi "Fantasy Parchment Scroll Demo" and asked for it to replace the login popup, with the full form on the sheet |
| 12 | 2026-11-04 | `page.tsx`: real-time button gets `cursor-pointer` | Designer asked for a pointer cursor on the button |
| 11 | 2026-11-04 | `TimeSlider.module.css`: input height 26 px (`--hit`) with -12 px vertical margins so the wrapper stays 2 px tall, the 2 px track gradient is painted in the middle via `background-size/position`; `page.tsx`: label row gets `relative z-10` so its button keeps the overlapped bottom 4 px | Designer wanted a bigger click area without changing the layout |
| 10 | 2026-11-04 | `TimeSlider.module.css`: `.moon` colour `#e6e8ff` to `#b4bbdc`, opacity 0.65, glow 4 px/0.6 to 3 px/0.25 (font-size 13 px was set by the designer directly in the file) | Designer said the moon stood out too much |
| 9 | 2026-11-04 | `TimeSlider.module.css`: `.moon` font-size 16 px to 12 px (glow 5 px to 4 px); sun unchanged | Designer asked for a smaller moon icon |
| 8 | 2026-11-04 | `page.tsx`: `MdSunny` (06:00-18:00 inclusive) / `BsMoonStarsFill` (otherwise) icon drawn over the slider thumb inside a `.wrap` div; `TimeSlider.module.css`: thumb made transparent at a fixed 18 px, icon positioning and colours, input forced to `display:block` so the icon centres on the track | Designer asked for sun/moon icons on the slider |
| 7 | 2026-11-04 | `page.tsx`: slider gets an extra CSS-module class; new `_components/TimeSlider.module.css` overrides the shared `.sun-slider` thumb size (14 px to 8 px, glow 10 px to 6 px) | Designer asked for a smaller slider circle |
| 6 | 2026-11-04 | `page.tsx`: new `clock` state (device time as HH:MM, refreshed every 5 s, empty on first render to avoid a hydration mismatch) feeds the toggle label; `_mock/copy.ts`: `realTime` / `realTimeOff` are now functions `(time) => string` (TH "แสดงภาพตามเวลาปัจจุบัน HH:MM น.", EN "Real time HH:MM") | Designer asked for the real time instead of the hard-coded label |
| 5 | 2026-11-04 | `page.tsx`: real-time toggle shows `FaSun` (on) / `FaRegSun` (off) before the label; `_mock/copy.ts`: removed the ✦/✧/○ glyph prefixes from `realTime`/`realTimeOff` (TH and EN) so the icon isn't doubled | Designer asked for sun icons on the real-time toggle |
| 4 | 2026-11-04 | `LoginModal.tsx`: removed the X button and `FaTimes` import; tap-to-close now covers everything except the form (stopPropagation moved from the sheet-sized wrapper to the form container) | Designer asked to remove the cross button; chose "tap outside the form closes" |
