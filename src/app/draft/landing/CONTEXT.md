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


## Current file structure

(Supersedes the older file tables below where they differ. Reorganised in the Phase 0-4 architecture refactor; behaviour and visuals unchanged.)

Naming: the two login UI variants are **classic** (the original UI, "UI เดิม") and **new** (the redesigned UI with underlined inputs, "UI ใหม่").
The variant id in code is `"classic" | "new"` (`LoginUiVariant` in `_mock/login.ts`). "parchment" now only means the 3D paper/scroll.

```text
landing/
  page.tsx                          the landing page (background, time slider, language toggle, opens the login dialog;
                                    calls preloadScrollLogin / releaseScrollLogin from login-ui/scroll to warm the 3D scene)
  _components/
    landing/                        Stars.tsx, TimeSlider.module.css (landing page only)
    draft-tools/                    developer-only preview tools (dev builds only):
                                      PreviewPanel.tsx (+ .module.css): in-dialog state / UI / language / Mode (3D <-> flat) / Device switch
                                      DevicePreviewHost.tsx, DevicePreviewLauncher.tsx, DeviceButtons.tsx: the mobile / tablet DEVICE PREVIEW
                                      previewRoute.ts (URL state + presets), previewBridge.ts (host <-> iframe events), devPreviewFlag.ts, previewStyles.ts
    login-ui/                       EVERYTHING that belongs to the login dialog
      LoginModal.tsx (+ .module.css)  dialog shell: backdrop, 3D canvas, quill, preview panel; owns the UI-variant state. The CSS file keeps the shared modal behaviour only (backdrop, canvas, form reveal, flat pop-in)
      shared/                       login FORM pieces used by BOTH UIs
        LoginForm.tsx               the ONE login implementation: form state, preview-state messages, submit; picks a layout
        LoginNotice.tsx             error / unverified banner under the sheet
        loginLayoutTypes.ts         props shared by both layouts
        LoginFontFaces.module.css   only @font-face aliases ("Anupark EN", "Serithai EN", "Charm EN"); no typography rules
      classic/                      the ORIGINAL UI
        ClassicLoginLayout.tsx      markup: boxed inputs, dark rectangular button (colors only; each text has a data-typo role)
        ClassicLoginTypography.module.css  ALL typography of Classic (the one file to edit)
        ClassicLoginLayout.module.css      ALL layout of Classic: size / spacing / gaps on the 3D sheet AND the flat fallback card box
        ClassicLogin.module.css     look only (no typography, no layout): button shadow
      new/                          the NEW UI
        NewLoginLayout.tsx          markup: same layout, underlined inputs (colors only; each text has a data-typo role)
        NewLoginTypography.module.css ALL typography of New (the one file to edit)
        NewLoginLayout.module.css     ALL layout of New: size / spacing / gaps on the 3D sheet
        NewLogin.module.css         look only (no typography, no layout): underlined input look, button shadow, autofill
      scroll/                       the 3D parchment: scrollLoginAnimation.ts (Three.js engine), useScrollLoginAnimation.ts (hook + preload/release)
      quill/                        QuillFeather.tsx, QuillShadow.tsx, Quill.module.css (animation + paper-clipped cast shadow)
  _utils/assets.ts                  every asset URL in one place (the GLB URL is resolved here with new URL(..., import.meta.url))
  _mock/                            copy.ts (landing copy, TH/EN), login.ts (login copy, preview states, UI-variant options)
  _assets/scroll/Parchment_Rolling_Animation_v03.glb   the ONLY runtime model
  _archive/                         parked files as real .zip files (see _archive/README.md); not used by any code
public/assets/landing/quill/        midnight-arcane-quill.png
public/assets/village.jpg           the backdrop, shared with the live landing page
```

### Device preview (Phase 6A: preview and diagnosis only, no responsive redesign)
Inspect the real landing page and login at mobile / tablet viewport sizes without resizing the browser. Development builds only (`DEV_PREVIEW_ENABLED` in draft-tools/devPreviewFlag.ts, the same rule as the other preview controls); in a production build the URL parameters are ignored and no control is rendered.
- Open: on `/draft/landing` use the **Device** pill at the top (login closed) or the **Device** row of the Preview panel inside the login dialog. Presets: Mobile Small 375 x 667, Mobile Standard 390 x 844, Mobile Large 430 x 932, Tablet 768 x 1024, plus Custom (width x height, 240-1600). **Desktop** returns to the normal page.
- How it works: the URL of the ONE landing route selects the mode (`?device=...` host, `?embed=1` the real page inside the host's iframe, `?open=1&variant=&lang=&state=&flat=1` the login selections). The host is a toolbar plus an **iframe of the same route with exactly the device's CSS size**, so real media queries / viewport units respond (a scaled-down desktop page would not). The host does NOT mount the landing page itself, so there is only ever one 3D engine: the one inside the iframe; every device switch builds a fresh iframe (the old one is emptied first). If the viewport is larger than the window the area scrolls; it is never shrunk.
- Controls (all outside the simulated viewport): Device, Login Open / Close (Close rolls the sheet up like Esc), UI (classic / new), Lang, Mode (3D scroll / Flat fallback; the flat card is Classic only, the host says so), State (5 preview states). They survive device switches, reloads (URL) and "Desktop".
- Host <-> iframe: same origin, no postMessage. The host dispatches a CustomEvent on `iframe.contentWindow`; the embedded page dispatches status events on its own window (`previewBridge.ts`). The in-page Preview panel and launcher are not drawn inside the simulated viewport, and the global "Back to Dev Tools" badge is hidden there (embedded page only).
- Limits: the iframe has the same user agent, pixel ratio, mouse input and no browser toolbars / safe areas as the desktop window, so touch-only media (`hover: none`, `pointer: coarse`), `env(safe-area-inset-*)`, dynamic mobile toolbars (`dvh`) and real devices' font scaling are not reproduced. The Next.js dev indicator is drawn by Next itself.

### Preview the flat fallback card
The flat fallback card (a flat parchment card instead of the 3D scroll) is normally shown only when the 3D scene fails to start (`sceneError` from `useScrollLoginAnimation`, e.g. WebGL unavailable). In the draft preview panel (bottom-left, dev builds only) the **Mode** row switches between **3D scroll** and **Flat fallback** without disabling WebGL: it sets a preview-only `forceFlat` state in `LoginModal.tsx` (`flat = sceneError || forceFlat`) and reuses the same card, typography and notice as the real fallback. The 3D canvas is hidden (not unmounted) while the flat card is forced, so switching back needs no reload. The flat card exists for **Classic only**: with "UI ใหม่" selected the panel says so and the Classic card is shown (the selection is kept for 3D mode). If WebGL really fails, "3D scroll" is disabled. Closing while forced waits for the hidden scroll to roll up (~1.4 s), like the normal close.

Notice placement: on the flat fallback card the login notice (error / unverified / generic) is rendered INSIDE the card, in normal flow, between the divider and the first label (`LoginModal` passes it to `LoginForm` through the `notice` slot, `ClassicLoginLayout` renders it; `LoginNotice` placement `"in-card"`), so the card grows to fit it and no space is reserved when there is no notice. On the 3D scroll the notice is unchanged: a separate element under the bottom roll (`placement="below-sheet"`).

scroll/ and quill/ are used only by the login dialog (LoginModal; page.tsx only calls the scroll hook's preload/release), so they live inside login-ui/.

### Typography of the login UI
Each UI owns ONE typography file. Edit the variables in its sections 1-3; do not edit the last section ("applied rules").
- Classic: `_components/login-ui/classic/ClassicLoginTypography.module.css`
- New:     `_components/login-ui/new/NewLoginTypography.module.css`
- Five groups (set through `data-typo` on the elements): **heading** (h2), **body** (labels, "remember me", "forgot password", "no account?" prompt, sign-up link), **input** (typed text and placeholder), **button**, **notice** (error / unverified banner: fully independent, inherits nothing from body).
- Per group, six properties: `--<group>-font-en` / `-font-th` (Latin font / Thai font; fallbacks are appended by the file), `-weight`, `-size`, `-letter-spacing`, `-line-height`, `-word-spacing`.
  Change `--body-*` once and every body text follows (the notice does NOT follow: it has its own `--notice-*`). The placeholder always follows input.
- Exceptions (values that really differ from body): label (`--label-weight/-size/-letter-spacing`) and sign-up link (`--signup-weight` = 500). Everything else of those elements is inherited from body.
  Example, New heading letter-spacing: `--heading-letter-spacing: 0.05em;` in NewLoginTypography.module.css. Classic is not affected.
- Thai vs English: `.typography[data-lang="th"]` / `[data-lang="en"]` blocks override any variable per language (the English button weight, 4px letter-spacing and 0.8 text scale live there).
- Flat fallback card (WebGL unavailable, Classic only): `.typography.flatCard` in the Classic file.
- Not in the typography files: text colors (className in the layouts), `text-transform: uppercase` on labels and the checked-checkbox mark size (`.parch-label`, `.parch-check:checked::after` in src/styles/globals.css, read-only), spacing/padding/sizes (the layout files, below).
- Specificity: the files' rules use `.typography [data-typo=...]` (0,2,0) and win over `.parch-*` / `.font-*` in globals.css and over Tailwind utilities (those are in @layer, so any un-layered rule beats them).

### Layout of the login UI (Phase 5)
Each UI owns ONE layout file (same idea as typography). Edit the variables in its section 1 (3D sheet) or section 2 (flat fallback card, Classic only); do not edit the last section ("applied rules").
- Classic: `_components/login-ui/classic/ClassicLoginLayout.module.css`
- New:     `_components/login-ui/new/NewLoginLayout.module.css`
- Pieces (set through `data-layout` on the elements): **form-box** (width, max-height, side padding of the box on the sheet: `--form-*`), **heading** (`--heading-margin-top`), **divider** (`--divider-margin-top/-bottom`), **label** (`--label-margin-top/-bottom`), **input** (`--input-width/-height/-padding`; New also `--password-input-padding-right`), **options** row (`--options-margin-top/-bottom/-gap`, `--remember-gap`, `--checkbox-size`), **button** (`--button-width/-height/-padding`), **prompt** (`--prompt-margin-top`), **notice** (`--notice-padding`, `--notice-offset` and `--notice-max-width` under the scroll, `--notice-margin-top` inside the flat card).
- Example, Classic label-to-input spacing: `--label-margin-bottom: 0.5rem;` in ClassicLoginLayout.module.css. New is not affected. The flat fallback card has its own values in section 2 (`.layout.flatCard`), so the sheet and the card are independent.
- Flat fallback card box (Classic): `.flatCard` (`--flat-card-max-width`, `--flat-card-padding`) and `.flatPage` (`--flat-page-padding-x/-y`) in ClassicLoginLayout.module.css. Its only breakpoint (40rem, was Tailwind `sm:`) is at the end of section 2.
- Mobile (Classic, 3D sheet only): below 40rem (640px) `--label-margin-top` is 0.5rem (was 1rem; it applies to both labels, so the form is ~16px shorter) and `--form-margin-bottom` stays 0. Measured clearance at 375 and 390: top ~53px / bottom ~13px between the registration prompt and the bottom roll (originally 44/5px). Desktop, tablet, New and the flat card are unchanged.
- Kept shared in LoginModal.module.css / LoginModal.tsx: the dialog box whose size the 3D engine sets (`--sheet-w/--sheet-h`), backdrop, canvas, form reveal/hide transition, flat card pop-in. Structural Tailwind in the layouts (`block`, `flex flex-wrap items-center justify-between`, `text-center`, `cursor-pointer`) is kept; spacing and sizes are not in the markup any more.
- No rule matches a Tailwind class name any more. Removed: `.compactForm :global(.mb-7)` (matched the options row), `.compactForm :global(.mt-6)` (the prompt), `.compactForm :global(.mb-4)` (matched nothing: dead), `.compactForm :global(.text-[13px])` (nothing, typography moved earlier) and New's `.input:global(.pr-11)` (the password field: now `data-layout="password-input"`). Still referenced by their real class: `.ink-divider` (the shared InkDivider component cannot take props).
- Specificity: `.layout [data-layout=...]` is (0,2,0); it wins over `.parch-*` in globals.css and over Tailwind utilities (which are in @layer).

### Responsive rules today (inventory for the mobile design, Phase 6)
There is no mobile design yet and no mobile CSS. The only responsive rules that exist: (1) flat card / flat page padding step at 40rem (`.flatCard`, `.flatPage`, moved from Tailwind `sm:`); (2) the 3D form box is `min(80%, 23rem)` wide and 88% high of a dialog box the engine sizes from the container HEIGHT (sides may crop below ~480px); (3) the 3D notice has `max-width: min(92vw, 26rem)`. Properties that will need independent mobile values (set them per UI in the layout files, and in the typography files for text): form-box width / max-height / side padding, heading margin, label / input / button spacing and heights, options row gap, prompt margin, notice offset / max-width / padding; flat card padding and max-width. The draft Preview panel has its own responsive classes (draft-only, not part of the product).

Where to edit what (other):
- Classic-only non-typography look: `classic/ClassicLogin.module.css` and `classic/ClassicLoginLayout.tsx` (colors); shared `.parch-*` classes live in `src/styles/globals.css` (read-only).
- New-only non-typography look: `new/NewLogin.module.css` and `new/NewLoginLayout.tsx`.
- Shared logic: `login-ui/shared/LoginForm.tsx`.

Why the GLB is not under public/: src/proxy.ts (shared) sends any URL whose extension is not in its static list through i18n, and
`.glb` is not in the list, so `/assets/...glb` is rewritten to `/en/assets/...glb` and 404s. It therefore stays a bundler asset
resolved with `new URL(..., import.meta.url)` in _utils/assets.ts. Adding `glb` to that matcher would allow moving it.

## 1. What this page is
Revision of the already-live landing page `/`. The login button now opens a 3D parchment scroll (Three.js, from the Kimi "Fantasy Parchment Scroll Demo") over the village scene: it unrolls from a roll, settles with a damped wobble, then the login form fades in on the sheet; closing (X / backdrop / Esc) rolls it back up before dismissing. If WebGL or the model fails, a flat parchment card with the same form is shown. The form matches the round-2 screenshot and contains draft-only login state previews. The current working copy also has a draft-local TH/EN landing-copy toggle outside this round's requested popup scope. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Village scene, time controls, draft-local landing language toggle, and dialog visibility with explicit trigger-focus restoration |
| `_components/landing/Stars.tsx` | Existing editable copy of the live page-local stars |
| `_components/login-ui/LoginModal.tsx` | Dialog shell: dimmed backdrop, transparent Three.js canvas, form overlay shown once the sheet has settled, close handling (rolls up first), flat fallback card, draft-only state previews |
| `_components/login-ui/shared/LoginForm.tsx` | Login form extracted unchanged from the round-2 modal; used on the 3D sheet and in the flat fallback. Wrapped in a `<fieldset disabled>` while the sheet is still rolling |
| `_components/login-ui/scroll/scrollLoginAnimation.ts` | Engine class `ScrollLoginAnimation`: plays the GLB's baked morph-target clip (opening segment forwards to open, backwards to close) with real-time Three.js lighting/shadows (soft upper-left spot key, neutral fill, faint environment, neutral tone mapping) |
| `_components/login-ui/scroll/useScrollLoginAnimation.ts` | React hook: lazy-loads the engine (dynamic `import()`, so `three` is not in the landing bundle until the popup opens), unrolls on ready, exposes `ready / error / formActive / close()` |
| `_components/login-ui/LoginModal.module.css` | Scoped backdrop, flat-fallback pop-in, canvas sizing, form reveal, loading-roll animations, reduced-motion fallback |
| `_assets/scroll/Parchment_Rolling_Animation_v03.glb` | Final animated parchment (56 MB, 40 morph targets, one 6 s clip), referenced via `new URL("../_assets/scroll/…glb", import.meta.url)` (in `_utils/assets.ts`). The older `_assets/scroll/scroll_login_animation_v01.glb` is no longer referenced |
| `_archive/reference.zip` (`_assets/reference/scroll_login_animation_v01.html`) | Designer's HTML source: reference only, never imported; now archived |
| `_mock/copy.ts` | Bilingual landing copy for the draft toggle plus Thai login copy, login state type, and preview options |

## 2b. Changes since promotion
n/a — this draft has not previously been picked up by dev. Round 2 file-level changes are recorded in the Iteration log.

## 2d. Unused files (dev may delete)
- None in code. Parked, not used: everything in `_archive/` (zips of the Blender sources, older models, previews and the designer's HTML reference; see `_archive/README.md`). The unused `public/assets/landing/login-ui/wax-seal*.png` and the alternate quill PNG were deleted in the refactor. The unused icon imports in `page.tsx` were removed.

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
| `Stars` copy | `_components/landing/Stars.tsx` | Existing live copy is page-local; retained from round 1 | no; fold design edits back into the live page-local file |
| `LoginModal` | `_components/login-ui/LoginModal.tsx` | Existing `InkModal` cannot host a 3D scroll, delay the form until the sheet settles, or roll back up before closing | maybe; reuse the form with live login, but keep the dialog landing-specific unless another page needs it |
| `LoginForm` | `_components/login-ui/shared/LoginForm.tsx` | Form needed to be shared between the 3D sheet and the flat fallback | no; replace with the live login form on promotion |
| 3D scroll engine | `_components/login-ui/scroll/scrollLoginAnimation.ts` | No 3D / WebGL code exists in the repo | maybe; reusable for other "scroll" popups (signup, etc.) |
| Scroll hook | `_components/login-ui/scroll/useScrollLoginAnimation.ts` | Lifecycle glue between React and the engine | with the engine |
| Scroll model | `_assets/scroll/Parchment_Rolling_Animation_v03.glb` | Required by the engine | with the engine; see Needs dev |
| Slider sun/moon icon | `_components/landing/TimeSlider.module.css`, `page.tsx` | The thumb is styled in shared `globals.css` (`.sun-slider`), which drafts may not edit. The native thumb is made transparent (18 px, same size so hit area is unchanged) and a react-icon is drawn over it, positioned from the hour (`--pos`) | yes: if promoted, move this into the shared slider or a small `TimeSlider` component |
| Dialog animations | `_components/login-ui/LoginModal.module.css` | Form reveal and loading roll | no initially; landing-specific |
| Login preview state switch | `_components/login-ui/LoginModal.tsx` | Draft-only control for empty/loading/error/unverified/generic states | no; remove on promotion |
| Draft-local landing language toggle | `page.tsx`, `_mock/copy.ts` | Present in the current working copy outside the requested popup scope; shared `LanguageSwitcher` renders nothing on `/draft/*` | no; keep the existing live language switch when promoting |

New colours / fonts / spacing / animations / CSS:
- 3D animation (engine, from the demo): geometry-based unroll 1.65 s / roll-up 1.35 s (ease-in-out cubic), 0.85 s damped settle wobble after opening, form active 0.28 s after open, warm key + rim lights with shadows, baked per-vertex AO plus `SSAOPass`, drifting gold particles, fog. Camera is fixed (the demo's 5° "elevated" view) and fits the container **height** so the sheet stays tall on phones (sides may crop below ~480 px width).
- Under `prefers-reduced-motion` the sheet is set to fully open / fully closed immediately (no roll, no wobble).
- CSS: `backdrop-in` (200 ms), flat-fallback `pop-in` (220 ms), `formReveal` fade/scale (220–240 ms), `loadingRoll` spinner; all disabled under reduced motion.
- No new palette colours or fonts in the dialog CSS module; it uses the existing parchment palette (the loading roll uses two ivory hex values).
- The current working copy also contains landing legibility styling outside the requested popup scope; dev should compare before promotion.

## 5. Needs dev (couldn't be done inside the draft)
- **Dependencies:** add `three` and `@types/three` (0.187.0 installed locally for this round) to `package.json`. `three` is only imported from `_components/login-ui/scroll/scrollLoginAnimation.ts` via dynamic `import()`.
- **Model asset:** `Parchment_Rolling_Animation_v03.glb` (**56 MB**: mostly the 40 morph targets plus 13 MB of PNG textures; needs compression/CDN/preload before production) currently lives in the draft's `_assets/` and is resolved with `new URL(..., import.meta.url)`. When promoting, simplest is `public/assets/` + a plain `/assets/…glb` URL (or keep the bundler asset). Consider preloading it (e.g. on login-button hover/focus) since first open waits on the download.
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
| 21 | 2026-11-06 | Phase 6B.2: Classic 3D sheet on mobile (< 640px): form lifted by `--form-margin-bottom` (CSS only, `ClassicLoginLayout.module.css`) so the registration prompt no longer touches the bottom roll; desktop unchanged | Designer: prompt too close to the rolled edge on mobile |
| 20 | 2026-11-06 | Phase 6A: developer device preview (mobile / tablet viewport presets + custom) for the real landing page and login: `draft-tools/DevicePreviewHost.tsx` (toolbar + same-origin iframe of `/draft/landing?embed=1`), `DevicePreviewLauncher.tsx`, `DeviceButtons.tsx`, `previewRoute.ts`, `previewBridge.ts`, `devPreviewFlag.ts`, `previewStyles.ts`; `page.tsx` (host / embed routing, launcher), `LoginModal.tsx` (starts from the preview selections, listens to host commands, reports status), `PreviewPanel.tsx` (Device row); no responsive design change | Designer wanted to inspect the current mobile layouts before the mobile redesign (Phase 6B) |
| 19 | 2026-11-06 | Phase 5: layout of each login UI moved into one file per UI (`classic/ClassicLoginLayout.module.css`, `new/NewLoginLayout.module.css`) with per-piece variables and `data-layout` hooks; flat fallback card box and its 40rem step moved from Tailwind classes into the Classic layout file; `.compactForm` and every selector that matched Tailwind class names removed (verified: no layout value changes); notice offset / max-width / padding / margin now variables | Designer wanted Classic and New layout adjustable independently, and a clean base for the mobile design |
| 18 | 2026-11-06 | Flat fallback card only: the notice moved inside the card, above the first field label (`LoginNotice` placement `"in-card"` replaces `"inline"`; optional `notice` slot in `LoginForm` / `loginLayoutTypes.ts` / `ClassicLoginLayout.tsx`); 3D scroll notice position unchanged | Designer: in the flat fallback the notice appeared to the right of the card |
| 17 | 2026-11-06 | Draft preview panel: new "Mode" row (3D scroll / Flat fallback) to inspect the existing flat fallback card without disabling WebGL (`LoginModal.tsx` `forceFlat`, `PreviewPanel.tsx`); production fallback detection unchanged | Designer wanted to inspect the flat fallback visually |
| 16 | 2026-11-06 | Typography: `notice` is now its own fifth group (`--notice-font-en/-th/-weight/-size/-letter-spacing/-line-height/-word-spacing`) in both typography files, no longer inheriting from body | Designer: the notice uses a different font from body text |
| 15 | 2026-11-06 | Phase 4 refinement: login typography simplified from 10 roles to 4 groups (heading, body, input, button) with small documented exceptions for label, sign-up link and notice (`ClassicLoginTypography.module.css`, `NewLoginTypography.module.css`); `scroll/` and `quill/` moved from `_components/` into `_components/login-ui/` (file moves + import paths only) | Designer wanted fewer controls (one shared body font per UI) and the scroll/quill code grouped with the login feature |
| 14 | 2026-11-06 | Phase 4: typography of each login UI moved into one file per UI (`classic/ClassicLoginTypography.module.css`, `new/NewLoginTypography.module.css`) with per-role variables (heading, label, input, placeholder, remember, forgot, button, prompt, signup, notice); `data-typo` role markers added to both layouts and the notice; typography removed from `LoginModal.module.css` (.compactForm), `NewLogin.module.css` (.input) and the deleted `shared/LoginFonts.module.css` (its @font-face aliases kept in `shared/LoginFontFaces.module.css`, its Classic button shadow in `classic/ClassicLogin.module.css`); the sign-up link keeps weight 500 | Designer asked for independent, easy-to-edit typography for Classic and New |
| 13 | 2026-11-06 | Architecture refactor (no visual or behaviour change): login UI variants renamed `classic` / `new` (was `parchment`), files regrouped into `login-ui/{shared,classic,new}`, `landing/`, `draft-tools/`; unused imports and unused public assets removed; non-runtime scroll sources/previews archived as zips in `_archive/`; this file updated | Designer asked to separate Classic / New login UI, shared logic, scroll, quill and landing code |
| 12 | 2026-11-04 | `page.tsx`: real-time button gets `cursor-pointer` | Designer asked for a pointer cursor on the button |
| 11 | 2026-11-04 | `TimeSlider.module.css`: input height 26 px (`--hit`) with -12 px vertical margins so the wrapper stays 2 px tall, the 2 px track gradient is painted in the middle via `background-size/position`; `page.tsx`: label row gets `relative z-10` so its button keeps the overlapped bottom 4 px | Designer wanted a bigger click area without changing the layout |
| 10 | 2026-11-04 | `TimeSlider.module.css`: `.moon` colour `#e6e8ff` to `#b4bbdc`, opacity 0.65, glow 4 px/0.6 to 3 px/0.25 (font-size 13 px was set by the designer directly in the file) | Designer said the moon stood out too much |
| 9 | 2026-11-04 | `TimeSlider.module.css`: `.moon` font-size 16 px to 12 px (glow 5 px to 4 px); sun unchanged | Designer asked for a smaller moon icon |
| 8 | 2026-11-04 | `page.tsx`: `MdSunny` (06:00-18:00 inclusive) / `BsMoonStarsFill` (otherwise) icon drawn over the slider thumb inside a `.wrap` div; `TimeSlider.module.css`: thumb made transparent at a fixed 18 px, icon positioning and colours, input forced to `display:block` so the icon centres on the track | Designer asked for sun/moon icons on the slider |
| 7 | 2026-11-04 | `page.tsx`: slider gets an extra CSS-module class; new `_components/TimeSlider.module.css` overrides the shared `.sun-slider` thumb size (14 px to 8 px, glow 10 px to 6 px) | Designer asked for a smaller slider circle |
| 6 | 2026-11-04 | `page.tsx`: new `clock` state (device time as HH:MM, refreshed every 5 s, empty on first render to avoid a hydration mismatch) feeds the toggle label; `_mock/copy.ts`: `realTime` / `realTimeOff` are now functions `(time) => string` (TH "แสดงภาพตามเวลาปัจจุบัน HH:MM น.", EN "Real time HH:MM") | Designer asked for the real time instead of the hard-coded label |
| 5 | 2026-11-04 | `page.tsx`: real-time toggle shows `FaSun` (on) / `FaRegSun` (off) before the label; `_mock/copy.ts`: removed the ✦/✧/○ glyph prefixes from `realTime`/`realTimeOff` (TH and EN) so the icon isn't doubled | Designer asked for sun icons on the real-time toggle |
| 4 | 2026-11-04 | `LoginModal.tsx`: removed the X button and `FaTimes` import; tap-to-close now covers everything except the form (stopPropagation moved from the sheet-sized wrapper to the form container) | Designer asked to remove the cross button; chose "tap outside the form closes" |
