---
page: signup
status: designing
route_group: public
target_route: /signup
draft_url: /draft/signup
round: 18
updated: 2026-11-17
---

# Signup: dev context

## 1. What this page is
Baseline draft of the **already-live** `/signup` page, created so the design team can modify it. Three steps on one route (terms → account form → "verify your email"). Round 1 replicates `src/views/public/signup/index.tsx` with Thai copy hard-coded and the API call removed. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page (3 steps) + "Preview state (draft only)" switch (step 1/2/3, server-error toggle, loading toggle) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/signup.json`): `COPY`, `TERMS` (7 items), `ROMAN`, `SAMPLE_EMAIL` |
| `_mock/verify.ts` | Copy (th + en) and mock constants for the email-verification modal: `MOCK_CODE` (`123456`), `MAX_ATTEMPTS` (5), `RESEND_COOLDOWN_SECONDS` (60), preview options |
| `_components/verify/VerifyEmailModal.tsx` | The verification modal: shell (dialog, focus trap, Esc/X) + views `code`, `change` (change email), `verified`; `variant` `signup` or `login` |
| `_components/verify/PaperLetter.tsx` | The real `/assets/paper.png` drawn as a stretchable 9-slice (CSS `border-image`) so the sheet grows with its content |
| `_components/verify/CodeInput.tsx` | The six single-digit boxes (paste, autofill, auto-submit) |

## 2b. Changes since promotion
Round 18 (verification modal, UX only; apply to the live modal when it is wired): **verification is mandatory, the dialog is dismissible, and nobody is trapped in it.**
- `×` and `Esc` switch the SAME dialog to an exit confirmation ("ยืนยันอีเมลภายหลัง?": **กลับไปยืนยันอีเมล** = stay, **ไว้ภายหลัง** = close); it is not a second modal (round 32). `Esc` inside the confirmation = stay. Backdrop click does nothing. "Later" shows no toast, deletes nothing and does not send a new code. On the verified screen there is no `×` (round 21); `Esc` goes to the next page at once (nothing left to confirm).
- Signup: after "Later" step 2 shows an amber notice "อีเมลของคุณยังไม่ได้รับการยืนยัน … ใส่รหัสยืนยัน" that reopens the modal (same idea as the login popup's notice). Pending address is tracked in the page (`pendingEmail`, updated by `onEmailChanged`, cleared by `onVerified`).
- Two separate clocks, both deadline based (correct after the tab was in the background): "รหัสนี้ใช้ได้อีก 4:32 นาที" (code validity, hidden once expired) and "ไม่ได้รับอีเมล? ส่งรหัสอีกครั้งได้ใน 0:42" (resend cooldown).
- Expired / 5 wrong attempts: the primary button becomes **ส่งรหัสใหม่** (disabled while the resend cooldown runs, with the countdown visible).
- Resend and change email have a loading state ("กำลังส่ง…"), are guarded against double clicks, and a failed send shows "ไม่สามารถส่งรหัสได้ในขณะนี้ กรุณาลองอีกครั้ง" **without** restarting any timer. Preview option "ส่งรหัสไม่สำเร็จ" (`resendfail`) makes the first send fail.
- Change email: button "ส่งรหัสยืนยันไปยังอีเมลใหม่", back link "← กลับไปยืนยันอีเมล"; address is trimmed before validation.
- `CodeInput`: Thai (๐-๙) and full-width digits are converted; pasting text containing a standalone 6-digit number uses that number.
- New copy keys (th + en): `noEmail, validFor, resending, newCodeCta, sendFailed, confirmTitle, confirmBody, confirmStay, confirmLeave, resumeBefore, resumeAction`; `sentAfter` removed.

Round 5: the verification modal's paper is the real `paper.png` again (9-slice via `border-image`), with every element of the modal fitting on the sheet (the paper grows taller when needed; min height = the original landscape proportion). Layout tweaks: wider paper (`max-w-[42rem]`), resend countdown and spam hint share one row, one reserved message slot for the error / "new code sent" line. Dev-only preview URL param `&verify=wrong|locked|expired|resend|change|verified` (signup) and `?verify=code|...` (login).

Round 4 (apply to `src/views/public/signup/index.tsx` and `src/views/public/login/`): **email verification by 6-digit code** (UI only here; back end in 5a).
- Signup step 3 is a modal (paper letter, over the dimmed step 2 form) with: code entry (6 boxes), wrong-code / locked / expired messages, resend countdown, spam hint, "Wrong email? Change it", a change-email view, and an "Email verified" view with Continue. Esc and an X close it back to step 2 (the pending account is kept; re-submitting the form overwrites it). Backdrop click does not close.
- The round-2 popup (paper.png box + resend email field) is replaced by this flow.
- Login: wired into the **landing page's login popup** (`draft/landing/_components/login-ui/LoginModal.tsx`; see `draft/landing/CONTEXT.md` round 13), not `/draft/login`, which the designer no longer uses. An unverified account opens the same modal over the login sheet (`variant="login"`: blue info notice, "Verify and log in", "Use a different account"); the amber notice stays when the modal is closed and gets an "Enter verification code" button.

Round 3: all three buttons (Next, Create Account, Resend) use the landing login dialog's button style: Montserrat (Latin) + Jim Thompson Roman (Thai), 16px, 0.22em spacing, padding `10px 0 12px`, softer shadow, uppercase labels (English only in effect; Thai has no case); in English weight 500, 4px spacing and the label `<span>` scaled to 0.8. Live page: add the `.signup-btn` rules (or reuse the login page's button style once it is shared) and wrap button labels in `<span>`; `lang` must be set on an ancestor.

Round 2 (apply to `src/views/public/signup/index.tsx`):
- Step 3 is no longer a separate screen: it is a modal popup (fixed overlay, dimmed + blurred) over the step 2 form, which stays rendered behind it (`inert`). The wizard circles and page title stay visible, step 2 highlighted. The popup is not dismissable; the only exit is the "Sign in" link. Body scroll is locked while open.
- Paper letter box widened (`max-w-[46rem]`) and gets a "resend" block: editable email input (prefilled with the signup email) + "ส่งอีกครั้ง" button + status line. Below 640px the block sits in a small card under the paper, because the paper image cannot grow taller.
- New copy keys: `resendLabel`, `resendButton`, `resendDone` (th + en).

## 2d. Unused files (dev may delete)
- `COPY` keys no longer used: `verifyHeading`, `verifyBody`, `verifyLetterSent`, `alreadyVerified`, `resendLabel`, `resendButton`, `resendDone` (replaced by `_mock/verify.ts`).

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners`, `PasswordInput` | `@/components/Parchment` | Page frame, cards, password field |
| `LetterStack` | `@/components/LetterStack` | Right-hand illustration (steps 1–2, desktop) |
| `EMAIL_RE`, `getPasswordChecks` | `@/utils/validation` | Real validation rules (same as live) |
| `validateUsername` (draft-local) | `_utils/validateUsername.ts` | NOT the shared one: the draft rule is letters and digits only (the shared `validateUsername` in `@/utils/validation`, used by the live signup, also allows `_ . -`); same signature and error codes |
| `routes` | `@/config/routes` | Link targets (`home`, `login`) |
| `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn`, `wax-seal` | `src/styles/globals.css` | Cards, fields, step circles |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each step/state | no, delete on promotion |
| `.signup-btn` rules | `page.tsx` (`SIGNUP_FONT_CSS`) | Local copy of the button rules in `draft/landing/_components/login-ui/classic/*.module.css`; those modules are scoped to the whole login form (labels, inputs, body) so they cannot be applied here. `.parch-btn` still gives colour/border/hover/disabled | yes (a shared "login-style" button class) |
| `VerifyEmailModal` | `_components/verify/VerifyEmailModal.tsx` | `InkModal` has no `role="dialog"`/`aria-modal`, close button, Esc, focus trap, and closes on backdrop click; the designer wants the paper letter, not the card | yes (shared modal for signup + login + later account email change) |
| `PaperLetter` | `_components/verify/PaperLetter.tsx` | `paper.png` is a fixed 1372x808 sheet; the modal needs a paper that grows with its content. Solved with a 9-slice (`border-image`, `container-type: inline-size`, sizes in `cqw`), so the torn edges and stains keep their size and only the pale centre stretches | yes |
| `CodeInput` | `_components/verify/CodeInput.tsx` | No OTP input exists | yes |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- `VERIFY_CSS` inside `VerifyEmailModal.tsx` (scoped under `.verify-modal`): code boxes, the login-dialog-style button (copy of `.signup-btn`), 44px text-link buttons, close button.
- `PaperLetter`: slice numbers measured from `paper.png` (alpha bounding box x 62-1433, y 296-1103; stain band about 120px): `border-image-slice: 416 186 516 182 fill`. Needs container query units (`cqw`), supported by all current browsers.
- (Rounds 10-11: the modal has no blue info notice; the unverified-login variant uses the signup layout with its own first sentence.)

## 5. Needs dev (couldn't be done inside the draft)
- Live behaviour the draft leaves out: `authService.signup({ username, email, password })` → on success show `result.message` on step 3 (draft shows fixed `verifyBody`); on failure show `ApiError.message` or "Something went wrong. Please try again."
- Username error codes → message keys live in `src/views/public/signup/constants.ts` (`USERNAME_ERROR_KEYS`); the draft inlines the messages in `COPY.usernameErr`.
- Username rule: the draft allows letters and digits only (`_utils/validateUsername.ts`, no `_ . -`). The shared `validateUsername` (`src/utils/validation.ts`, used by the live signup), the live `signup.json` message and the backend still allow `_ . -`: align them when promoting (and replace the draft file with the shared util). `draft/account/page.tsx` has its own copy that also still allows `_ . -`.
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("signup")`.
- Remove the Preview state switch.
- Wire `VerifyEmailModal` to the real endpoints (5a): replace the `MOCK_CODE` check in `submitCode`, the countdown start, `freshCode` (resend) and `submitNewEmail` (change email) with API calls; replace the local `email` state with the pending user's email from the server; the verified screen redirects to the live character selection route (3 s countdown, no button) only after the server confirmed verification and issued the session; a returning user who already has a character needs a different target (make it a prop of the modal).
- Remove the Preview state switch and the `_mock/verify.ts` mock constants and preview options.
- **Login dialog on this page (round 31):** "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" opens the landing draft's login dialog (`../landing/_components/login-ui/LoginModal`, props `closeOnSignup`, `showPreviewPanel={false}`) instead of linking to `/login`. For the live page: make that dialog a shared component and open it from here (or keep the link to `/login`); details in `draft/landing/CONTEXT.md` section 5 ("Make the login dialog a shared component"). Not done in the draft.

### 5b. Username availability check (database): back-end requirements (draft uses a mock)
The draft shows, under the username field, "Great! This username is available" (TH "สามารถใช้ชื่อผู้ใช้นี้ได้ เยี่ยมเลย!") or "This username is already taken" (TH "ชื่อผู้ใช้นี้มีคนใช้แล้ว") once the username passes client validation. The answer comes from `_mock/usernames.ts` (`checkUsernameAvailable`, fake 400 ms latency; mock taken names: `admin`, `test`, `user`, `whatever`, `wanderer`, compared case-insensitively). The real thing needs the database:
- **Endpoint (missing):** `GET /auth/username-available?username=<name>` (or `POST /auth/check-username`) returning `{ "available": boolean }`; add `authService.checkUsername(name)` and call it where the draft calls `checkUsernameAvailable`.
- **Server rules:** re-validate the username with the same rule as the draft (letters and digits only, 3 to 25 characters, no spaces; see the username rule note above); an invalid name is a 400, not "taken". Then look it up in the users table. Uniqueness must be case-insensitive (unique index on `lower(username)` or a `citext` column), so `Admin` and `admin` are the same name. Reserved names (`admin`, `support`, `moderator`, ...) are reported as not available.
- **The check is advisory, signup is the authority:** `POST signup` must enforce the same uniqueness atomically (unique constraint) and return a conflict (for example 409 `username_taken`) if two people pick the name at the same time; the UI maps that response to the "already taken" message on the username field and keeps the form values.
- **Abuse and privacy:** the endpoint tells anyone which usernames exist, so rate-limit it per IP (and per session), return nothing but `available` (no email, id or account details), and do not log the names as personal data.
- **Frontend behaviour to keep when wiring it:** only call after client validation passes (the draft does not call for an invalid name); 400 ms debounce after typing stops; ignore a response that is not for the current text (the draft stores `{ name, ok }` and compares); while a check is pending, or if it fails (network / 5xx), keep the normal hint and do not block submit; block "สร้างบัญชี" only when the answer is `taken`.
- **Copy to move to i18n:** `usernameHint`, `usernameAvailable`, `usernameTaken` (th + en, in `_mock/copy.ts`), plus the new conflict message if the signup response uses its own key.

### 5a. Email verification: back-end requirements (from the designer's spec; NOT built in the draft)
**Core rule:** a user cannot get a session until their email is verified. Verification is a 6-digit code typed into the modal; sign-up and log-in both lead to the same code step.

**Endpoints** (adjust to repo conventions): `POST /auth/signup`, `/auth/login`, `/auth/verify-email`, `/auth/resend-code`, `/auth/change-email`. Missing today: `src/api` has none of the last three (and the current signup sends a link, not a code).
| UI action | Call | Success | Errors the UI expects |
|---|---|---|---|
| Create account | `signup` | pending user (`email_verified_at = null`), code emailed, **no session**, pending-token cookie set; UI opens the code modal | validation errors as today |
| Log in, correct password, unverified | `login` | **no session**, fresh code emailed (respecting the cooldown), result `verification_required` + pending-token cookie; UI opens the code modal (login variant) | wrong credentials: the same generic error as any failed login |
| Submit code | `verify-email` | `email_verified_at` set, **session issued**, UI shows "Email verified" | `invalid_code` + `attemptsLeft`; `expired_code`; `too_many_attempts` (code dead, must resend) |
| Resend | `resend-code` | new code, old one invalid, attempts reset to 5. **When the current code is already dead (`too_many_attempts` or expired) the server must accept a resend immediately** (the UI enables "send a new code" at once); still rate-limited per IP/email with a lifetime cap per registration | `cooldown` + seconds left (only while the current code is still alive) |
| Change email | `change-email` | pending user's email updated, old code invalidated, attempts reset, new code sent, UI returns to the code step with the new address | invalid / unchanged email |

**Pending-verification token:** no session exists yet, so verify / resend / change-email identify the pending user by a short-lived **signed httpOnly SameSite cookie** issued at sign-up and at unverified login. Never accept a bare email or user id from the client for these actions.

**Codes:** cryptographically random; store only a hash; 5-minute expiry; single use; issuing a new code invalidates the previous one; constant-time compare. **Attempts:** max 5 wrong guesses per code, then the code is dead (user must resend); return `attemptsLeft`. **Resend:** 60-second cooldown, enforced server-side (the UI countdown is only a hint).

**Rate limits** by IP and by email on sign-up, login, verify, resend and change-email.

**Edge cases:** sign-up with an email that is already *pending* overwrites the pending record (new password, new code), no error. Sign-up with an email that is already *verified* shows the same "check your email" step and sends that address a "you already have an account" email instead of a code (don't leak that it exists). Login checks email + password FIRST; never reveal whether the email exists or is unverified before the password is correct. Enforce "verified" server-side on every authenticated endpoint, not just in the UI.

**Clean-up:** scheduled job deleting accounts that stay unverified for more than 72 hours.

**Email:** subject `<code> is your [TBD: app name] verification code`; the code in large type; "expires in 5 minutes"; "if you didn't sign up, ignore this email"; optionally a magic link that verifies in one tap. SPF/DKIM/DMARC assumed configured. Stack, auth approach and email provider were left as placeholders in the spec: dev to confirm.

**Needed by the round-18 UX (the draft cannot do these):**
- *Resume after refresh / closing the browser / "Later":* every pending-flow response (`signup`, unverified `login`, `verify-email` errors, `resend-code`, `change-email`) and a new `GET /auth/pending` return the same state: `{ maskedEmail, attemptsLeft, expiresInSeconds, resendInSeconds }`. The modal renders only from it and the page reopens the modal when a pending cookie exists. The draft keeps this in component state, which is lost on refresh.
- *Access control:* an unverified user never gets a session; any attempt to reach the app must route back into the modal (server-side check, UI is only a hint).
- *Other tab / device:* refetch `pending` on window focus (or poll) so a modal left open notices that the email was verified elsewhere.
- *Errors:* the server returns machine-readable codes (`invalid_code`, `expired_code`, `too_many_attempts`, `cooldown`, `delivery_failed`, `rate_limited`, `pending_expired`); the UI shows its own generic wording and never raw provider/server text. A failed send must not start the cooldown.
- *Browser Back:* integrate with the live route/state of the signup page (the draft does not push history entries).
- *Verified screen:* `×`/`Esc` navigate onward like Continue, only after the server confirmed verification.

**Tests to write:** sign-up creates no session; correct code creates a session; wrong code decrements attempts; the 6th attempt is rejected; expired code; resend cooldown; old code invalid after resend; change-email invalidates the old code; unverified login returns `verification_required` with no session; wrong password on an unverified account gives the generic error; already-verified email at sign-up doesn't leak.

**Mock rules in the draft** (all constants in `_mock/verify.ts`): `123456` is the only correct code, `MAX_ATTEMPTS` = 5, `RESEND_COOLDOWN_SECONDS` = 60, `CODE_EXPIRY_MINUTES` = 5. The "It expires in 5 minutes." text is built from the same constant, and the draft really expires the code after that time (the modal switches to the "expired" state; Resend and Change email issue a new code and restart the timer).

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Step 1, not agreed | page load | Terms list, "ถัดไป" disabled |
| Step 1, agreed | checkbox ticked | "ถัดไป" enabled |
| Step 2, empty | go to step 2 | Empty form, no messages |
| Wizard, step 1 | page load | Circle 1 current (number, dark), circle 2 upcoming; nothing clickable |
| Wizard, step 2 | Next | Circle 1 shows ✓ (completed) and is a button "กลับไปที่ขั้นตอน: ข้อกำหนด" (click = back to step 1); circle 2 current, not clickable (never forward) |
| Wizard, step 3 | Create account | Both circles show ✓; the indicator is inert behind the verification modal |
| Step 2, back | click "← ย้อนกลับ" (outline button left of "สร้างบัญชี", bottom of the card) | Returns to step 1 (terms); going forward again shows the form with what was typed and the agreement still ticked |
| Step 2, invalid | typing / blur | Red border + red message under field (no "✕" prefix on the username and email messages); one-line rules hint under the field (always visible); when a rule is broken the same line becomes the red "✕ …" error message; password checklist on focus or when invalid; password checklist on focus or when invalid |
| Username available | valid username, not taken, 400 ms after typing stops (mock check) | The one-line helper under the field turns green: "สามารถใช้ชื่อผู้ใช้นี้ได้ เยี่ยมเลย!" / "Great! This username is available" |
| Username taken | valid username that exists (mock: `admin`, `test`, `user`, `whatever`, `wanderer`) | Helper turns red "ชื่อผู้ใช้นี้มีคนใช้แล้ว" / "This username is already taken", the input border is red, "สร้างบัญชี" does not submit |
| Username checking | right after typing, until the answer arrives | The normal grey hint stays (no spinner, no layout change); a check is only started for a name that passes validation |
| Loading | request in flight | Button "กำลังสร้างบัญชี…", disabled (preview toggle) |
| Error | API error | Red banner above the form (preview toggle) |
| Verify modal, code entry | valid submit | Paper-letter modal over the dimmed step 2: "We sent a 6-digit code to <email>. It expires in 5 minutes.", 6 boxes (first focused), "Verify email" button (always enabled except while verifying; the code is also submitted by itself on the 6th digit), resend countdown "Resend code in 1:00", spam hint, "Wrong email? Change it", X |
| Verify modal, incomplete code | "Verify email" / Enter with fewer than 6 digits | "✕ Please enter all 6 digits" (กรุณากรอกรหัสให้ครบ 6 หลัก) under the boxes, boxes red, focus on the first empty box; no attempt is consumed; the message clears on the next keystroke. The same button is the retry after a real request failure |
| Verify modal, verifying | 6th digit typed / Verify pressed | Boxes disabled, button "Verifying…" (about 0.6 s fake delay) |
| Verify modal, wrong code | any code except `123456` | All boxes red + `role="alert"` line directly under the boxes (nothing reserved: the paper grows by one line) "✕ That code isn't right. N attempts left." (same plain 13px line style as the green "✓ A new code was sent."); boxes cleared and refocused |
| Verify modal, locked | 5 wrong codes | "Too many wrong attempts. Please request a new code."; the line above the boxes says "This code can no longer be used" (no validity countdown, no resend countdown); boxes disabled; the primary button "Send a new code" is enabled immediately, even during the 60 s cooldown |
| Verify modal, expired | Preview "รหัสหมดอายุ", or 5 minutes after the code was issued (mock timer, restarted by resend / change email) | "This code has expired. Please request a new one to verify your email."; boxes disabled, the primary button is "Send a new code" (round 18) |
| Verify modal, resend ready | countdown reaches 0 | "Resend code" link (announced once to screen readers); resend clears boxes/errors, resets attempts, restarts the countdown, shows "A new code was sent." |
| Verify modal, change email | "Wrong email? Change it" | Current address, "New email" field (format + "must differ" errors), "Send new code", "Back to code entry"; submit returns to code entry with the new address and a fresh state |
| Verify modal, verified | correct code `123456` | Wax seal, "Email verified", body, then NO button: "กำลังนำคุณไปยังหน้าเลือกตัวละครใน 3 วินาที..." counting 3 → 2 → 1, then one automatic navigation (draft: `/draft/account`, a stand-in; live: the character selection page). No × on this screen; Esc goes there at once (same single guarded call). Only if navigation has not happened 4 s after the countdown ended, the fallback appears: the sentence "คุณสามารถไปยังหน้าเลือกตัวละครได้โดยตรง" and an underlined text link "ไปยังหน้าเลือกตัวละคร" in the same style as "เปลี่ยนอีเมล" (rounds 22-23). The Preview button "ยืนยันแล้ว" holds at "3 วินาที..." and never redirects, so the screen can be inspected; the Preview button "ยืนยันแล้ว (redirect ไม่ทำงาน)" (`redirectfail`) shows the fallback link state |
| Verify modal, exit confirmation | X / Esc (Preview "ยืนยันอีเมลภายหลัง?") | The same paper and backdrop: only the content changes (180 ms fade-in) to the heading "ยืนยันอีเมลภายหลัง?", the description, the primary button "กลับไปยืนยันอีเมล" (not auto-focused: focus moves to the heading, which shows no outline) and the link-style "ไว้ภายหลัง". No × on this screen (the two buttons are the only choices); Esc toggles verification <-> confirmation (never closes directly); backdrop click does nothing. Going back keeps digits, attempts and timers and focuses the first empty box (or the email field / heading in the other views) |
| Verify modal, closed | "ไว้ภายหลัง" in the confirmation | Back to step 2 (form values kept) with an amber notice and "ใส่รหัสยืนยัน" that reopens the modal; no toast; backdrop click does nothing |
| Verify modal, resend failed | Preview "ส่งรหัสไม่สำเร็จ", then Resend | "✕ ไม่สามารถส่งรหัสได้ในขณะนี้ กรุณาลองอีกครั้ง"; timers unchanged; retry works |
| Landing login popup, unverified | submit in the popup with an identifier containing "unverified", or Preview "ยังไม่ยืนยันอีเมล" | Same modal and the same layout as signup, with its own first sentence ("Your email isn't verified yet. We sent a new 6-digit code to <email>." then "It expires in 5 minutes."; the form's amber notice is behind it), button "Verify and log in", extra link "Use a different account" |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `username` | string 3–25, `[A-Za-z0-9_.-]` | `authService.signup` | Rules in `@/utils/validation` |
| `usernameAvailable` | boolean | missing: `GET /auth/username-available?username=` | Draft: `_mock/usernames.ts`; case-insensitive; see 5b |
| `email` | string | `authService.signup` | |
| `password` | string, 8+, digit, upper+lower | `authService.signup` | |
| `TERMS` | string[7] | fixed text | Currently in messages (`signup.terms.0..6`) |
| step-3 message | string | `signup()` response `message` | The modal now uses fixed copy; the code text does not come from the server |
| `code` | 6 digits | `verify-email` | Draft accepts only `123456` |
| `attemptsLeft` | number | `verify-email` error | Draft: starts at 5, decrements per wrong code |
| `secondsLeft` (resend) | number | `resend-code` error / response | Draft: fixed 60 s |
| pending `email` | string | pending-token cookie / server | Draft keeps it in modal state |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Check username (while typing) | missing: `GET /auth/username-available` | New, debounced; see 5b. `signup` must also return a conflict (409) if the name was taken meanwhile |
| Create account | `authService.signup` | Already exists; email verification link then goes to `/verify-email` |
| Verify code | missing: `POST /auth/verify-email` | New. See 5a |
| Resend code | missing: `POST /auth/resend-code` | New. See 5a |
| Change pending email | missing: `POST /auth/change-email` | New. See 5a |
| Log in with an unverified email | `authService.login` must return `verification_required` | Changes the current 403 / "verify" handling. See 5a |

## 8. Thai strings to move to i18n
**Round 20:** added `redirecting(n), redirectingSr, redirectFallback`; removed `continue`.

**Round 19 addition:** `codeInvalid`.

**Round 18 additions** (same file, th + en): `noEmail, validFor(time), resending, newCodeCta, sendFailed, confirmTitle, confirmBody, confirmStay, confirmLeave, resumeBefore, resumeAction`; reworded `resendIn, expired, newCodeSent, sendNewCode, backToCode`; `sentAfter` removed.

**New (round 4), all in `_mock/verify.ts` (`VERIFY_COPY` th, `VERIFY_COPY_EN`), none in `messages/` yet** (Thai wording is the draft author's, to be reviewed): `close, title, sentBefore, sentAfter, loginNoticeBefore, codeLabel, digitLabel(n), verify, verifyLogin, verifying, wrongCode(left), locked, expired, resendIn(time), resend, resendReady, newCodeSent, spamHint, changeBefore, changeLink, useDifferent, changeTitle, currentEmail, newEmail, newEmailPlaceholder, sendNewCode, backToCode, emailErrFormat, emailErrSame, verifiedTitle, verifiedBody, continue`. The functions (`digitLabel`, `wrongCode`, `resendIn`) become ICU messages with placeholders. The preview-option labels are draft-only.

Already in `messages/{th,en}/signup.json` (namespace `signup`): all of `pageTitle, pageSubStep1..3, stepTerms, stepAccountInfo, termsHeading, iAgree, iAgreeRequired, next, formHeading, username, email, emailPlaceholder, password, passwordPlaceholder, submit, submitting, alreadyHaveAccount, signIn, verifyHeading, verifyBody, verifyLetterSent, alreadyVerified, usernameRequirements, usernameRule1..3, passwordRequirements, passRule1..3, terms.0..6, usernameErrSpaces, usernameErrLength, usernameErrChars, emailErrFormat`. In the draft the rules are arrays (`usernameRules`, `passRules`) and username errors an object (`usernameErr`); map back to the numbered keys when promoting. Hard-coded English fallback "Something went wrong. Please try again." is not in messages.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):**
  - Username rule: the hint "English letters (A-Z) and digits only", the error message and the draft validator now agree (letters and digits only, `_ . -` are errors). The live validator and the backend still allow `_ . -` (see section 5).
  - The paper is stretched vertically when the content is tall (about 1.1x on desktop, up to about 3x of the pale centre on a phone with the login notice); the stained edges stretch slightly with it. Looks fine in screenshots at 360 / 1280px; designer to confirm.
  - Signup stays a 2-step page (terms, account form with username); the spec's "sign up modal" is not modalised. The login variant lives in the landing page's login popup (the standalone `/draft/login` page is no longer used).
  - Closing (Esc / X) returns to step 2 on signup and to the login popup (with the unverified notice) on login; backdrop click does not close (to avoid losing the "check your email" message). Closing on signup keeps the pending account; re-submitting overwrites it (per the spec).
  - After a wrong code the boxes are cleared; the red state clears on the first new keystroke.
  - All new Thai and English copy (including "Check your spam folder", the blue notice text and the lock-out message) is the draft author's wording, not supplied by the designer.
  - "Continue" links to `routes.dashboard` ("app/onboarding" is not specified).
  - The resend countdown starts at 60 s on open (also on login, where the real server decides).
- **Answered (round 20):** after verification the user is sent automatically to the character selection page (draft: the redirect goes to `/draft/account` as a stand-in, while the copy says "Character Selection" / "หน้าเลือกตัวละคร"). **Open:** the live target for users who already have a character (login variant).

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
| 2 | 2026-11-15 | Step 3 is now a popup + overlay over step 2; added resend email field + button | Designer request |
| 3 | 2026-11-15 | All buttons restyled to match the landing login dialog's button | Designer request |
| 45 | 2026-11-23 | Gap between the wizard stepper and the panel is the same at every viewport, 48px as on desktop (`py-12` top padding of `.signup-wrap`): it was 32px on tablet (640 to 1023px, `padding: 2rem`) and 28px on phones (under 640px, `padding: 1.75rem 1rem 1.5rem`); both media queries in the `<style>` block of `page.tsx` now use a 3rem top padding (side and bottom padding unchanged); applies to step 1 and step 2 | Designer request |
| 44 | 2026-11-23 | Wizard connector: the "✦" star between the two circles (it showed under 1024px: Mobile S / M / L and Tablet) is removed; the connector is one plain line at every width (colour, widths and position unchanged; 1024px and wider looked like this already) | Designer request |
| 43 | 2026-11-23 | Wizard step indicator on phones (window under 640px: Mobile S / M / L) now has the same sizes as the other viewports: 32px circles, 14px numbers and labels, 14px gap between circle and label, connector offset 16px; the compact phone overrides in the `<style>` block of `page.tsx` were removed (the -0.25rem top margin and the connector width, 64px under 640px, are unchanged) | Designer request |
| 42 | 2026-11-23 | Step 2: username availability. After the username passes validation (and 400 ms after typing stops) the helper under the field says "Great! This username is available" / "สามารถใช้ชื่อผู้ใช้นี้ได้ เยี่ยมเลย!" (green) or "This username is already taken" / "ชื่อผู้ใช้นี้มีคนใช้แล้ว" (red, red border, submit blocked). Mock in `_mock/usernames.ts` (taken: admin, test, user, whatever, wanderer); new copy keys `usernameAvailable`, `usernameTaken`; the database check is written up in section 5b | Designer request |
| 41 | 2026-11-23 | Step 2: the red "✕" prefix is removed from the username and email error messages (the text stays red, the input keeps its red border); the password rules keep their ✓/✕ icons | Designer request |
| 40 | 2026-11-23 | Step 2: username rule tightened to letters and digits only (no special characters: `_ . -` are now errors, shown with the existing `chars` message "ใช้ได้เฉพาะ A–Z และ 0–9 เท่านั้น"); draft-local validator `_utils/validateUsername.ts` (the shared `@/utils/validation` is unchanged, so the live signup still accepts `_ . -`); EN `chars` message changed to "Only A–Z and 0–9 are allowed" because the old one listed `_ . -` | Designer request |
| 39 | 2026-11-23 | Step 2: the username requirements box ("ข้อกำหนดชื่อผู้ใช้") is replaced by a one-line hint under the field, always visible (muted, `COPY.usernameHint`: "โปรดใช้เฉพาะตัวอักษรภาษาอังกฤษ (A-Z) และตัวเลขเท่านั้น" / "Please use only English letters (A-Z) and digits."; the hint no longer mentions length or spaces, those come up as the red error message); when `validateUsername` fails, the same line turns into the red error message (no "✕" prefix since row 41) (`usernameErr`, shown after typing) and the input keeps its red border; no focus state any more; the old keys `usernameRequirements` / `usernameRules` stay in the copy (they exist in `messages/*/signup.json`) but the draft no longer uses them; new key `usernameHint` | Designer request |
| 38 | 2026-11-23 | Step 1 and step 2, window 1280px and up (where the illustration shows): the illustration is smaller, 480px wide (was 560px; it now fills its 30rem grid column, `.signup-art` rule, no `-mr-6` overhang) and step 2 gets the same `.signup-art` class; both panels are 64px wider: step 1 up to 40rem = 640px (`xl:grid-cols-[minmax(0,40rem)_minmax(0,30rem)]`, was 36rem at 1400px and up and 1.35fr below), step 2 32rem = 512px (was 28rem); the gap panel to illustration stays 52px (`xl:gap-13`); the 1400px special case is gone, so the step 1 panel no longer changes width at 1400px; supersedes the column sizes and image width in rows 34 to 36; below 1280px nothing changes | Designer request |
| 37 | 2026-11-23 | Step 2: the "← ย้อนกลับ" text link above the card is replaced by an outline Back button on the left of the submit button (40% / 60% from 640px; stacked under 640px with the submit on top; both disabled in the "creating account" state); same behaviour (returns to step 1, typed values and the ticked agreement kept); supersedes row 16 for the position; new `.signup-btn-back` rules in the `<style>` block of `page.tsx` | Designer request |
| 36 | 2026-11-23 | Step 2 gets the same changes as step 1: the illustration is hidden below 1280px; from 1024 to 1279px the form is a single column, `max-w-3xl` (48rem, 768px) and centred (below 1024px it is still `max-w-md`); the two-column grid (28rem + 35rem) starts at 1280px (`xl:`) with a 28px grid gap, which plus the image's 24px overhang is the same 52px gap as step 1; this also removes the overflow the fixed columns had at 1024px | Designer request |
| 35 | 2026-11-23 | Step 1: the right illustration is hidden below 1280px (Tablet Landscape 1024 x 768 included; it was hidden below 1024px before). From 1024 to 1279px step 1 is a single column like the tablet: the terms sheet is capped at `max-w-3xl` (48rem, 768px) and centred, the two-column grid, its 52px gap and the illustration start at 1280px (`xl:`); 1280px and wider (Laptop, Desktop HD) are unchanged | Designer request |
| 34 | 2026-11-23 | Step 1: the right illustration (`LetterStack`) is as wide as its grid column (+24px), at most 560px (`.signup-art` container-query rule in the `<style>` block of `page.tsx`), and the grid gap is `lg:gap-13` (52px) from 1024px and `min-[1400px]:gap-7` (28px) from 1400px (plus the image's 24px overhang), so the gap between the terms panel and the illustration is 52px at every width from 1024px up (Tablet Landscape, Laptop, Desktop HD) and it never overlaps the panel; still hidden below 1024px; the shared `LetterStack` is not changed | Designer request |
| 33 | 2026-11-23 | Device preview presets changed (shared with the landing draft): Mobile S is now 360x800; new Tablet Landscape, Laptop and Desktop HD buttons; Custom limit 1920 | Designer request |
| 32 | 2026-11-17 | Exit confirmation is no longer a second modal on top of the first: X / Esc switch the content of the one verification dialog to "ยืนยันอีเมลภายหลัง?" (same paper, same backdrop, 180 ms content fade-in, reduced-motion respected); Esc goes back (no × on the confirmation); verification state is kept; new Preview option `exit`; `confirmTitle` reworded; "ไว้ภายหลัง" uses the `.verify-small` size (13px) like the other links | Designer request |
| 31 | 2026-11-17 | "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" (step 2) is a button that opens the landing page's login dialog over the signup page (sign-up links inside it close it; its own Preview panel is hidden). Turning that dialog into a shared component is only documented for the dev | Designer request |
| 30 | 2026-11-17 | "ยืนยันอีเมล" is always clickable (it was grey almost always, because the code auto-submits on the 6th digit): clicking with fewer than 6 digits shows "กรุณากรอกรหัสให้ครบ 6 หลัก", reddens the boxes and focuses the first empty one (`CodeInput` got `focusIndex`); new copy key `codeIncomplete` | Designer request |
| 29 | 2026-11-17 | Disabled primary buttons in the verification modal (grey "ยืนยันอีเมล", "ส่งรหัสใหม่" while sending, etc.) show the not-allowed cursor instead of the pointer | Designer request |
| 28 | 2026-11-17 | Redirect-fallback link "ไปยังหน้าเลือกตัวละคร" uses the `.verify-small` font size and line height like the other verification links | Designer request |
| 27 | 2026-11-17 | Change-email view: the "อีเมลใหม่" label (`.verify-label`) has the same look as "อีเมลปัจจุบัน" (13px, normal weight and spacing, same colour) | Designer request |
| 26 | 2026-11-17 | Change-email view: the "← กลับไปยืนยันอีเมล" link has `mt-5` above it (the same 20px gap as in the code view) | Designer request |
| 25 | 2026-11-17 | Only the control that is busy is dimmed: the "เปลี่ยนอีเมล" and "← กลับไปยืนยันอีเมล" links keep their colour during a resend / send (guarded in the click handler, `aria-disabled`, no native `disabled`) | Designer request |
| 24 | 2026-11-17 | Verification links (`.verify-link`: resend, change email, use different account, back, later, redirect fallback) are plain inline hyperlinks: no 44px block or side padding, they follow the surrounding font, tap target kept with an invisible `::after`; the resend block is one centred stack with an even 12px rhythm in every state (so the spam hint has the same spacing everywhere; replaces the earlier `mt-2` tweak, which was reverted) | Designer request |
| 23 | 2026-11-17 | Redirect-fallback action restyled as the underlined text link used by "อีเมลผิด? เปลี่ยนอีเมล" (was a primary button); the spam hint "กรุณาตรวจสอบโฟลเดอร์ Spam…" is always on its own line (resend-ready and send-failed states now match the code-entry state) | Designer request |
| 22 | 2026-11-17 | Redirect-fallback state: sentence "คุณสามารถไปยังหน้าเลือกตัวละครได้โดยตรง" plus a primary button "ไปยังหน้าเลือกตัวละคร" instead of a text link; new key `redirectFallbackText`, `redirectFallback` is now the button label | Designer request |
| 21 | 2026-11-17 | Verified screen: the × is removed (the page redirects by itself; Esc still goes on); new Preview state "ยืนยันแล้ว (redirect ไม่ทำงาน)" shows the redirect-fallback link | Designer request |
| 20 | 2026-11-17 | Verified state: "ดำเนินการต่อ" button removed; Thai countdown "กำลังนำคุณไปยังหน้าเลือกตัวละครใน N วินาที..." (3 → 1) then one automatic redirect; the body shows the verified address in bold followed by "ได้รับการยืนยันเป็นที่เรียบร้อย" on the same line (wraps only when too long); less space above the countdown; stall fallback link; copy keys `redirecting, redirectingSr, redirectFallback` added, `continue` removed | Designer request |
| 19 | 2026-11-17 | Out of attempts: the line above the boxes says the code can no longer be used, "send a new code" is enabled immediately (the resend cooldown only applies while a code is alive); Continue and X / Esc on the verified screen go to a draft page (changed to `/draft/account` in round 20) | Designer request (screenshot) |
| 18 | 2026-11-17 | Verification modal UX: working X / Esc with an exit confirmation (stay / later), resume notice on step 2, separate code-validity and resend countdowns (deadline based), "send a new code" as the primary action when expired or locked, loading + failure states for resend and change email, clearer change-email wording, Thai-numeral and sentence paste handling in `CodeInput` | Designer request (UX spec) |
| 17 | 2026-11-15 | Wizard circles: a completed step (the user is past it) shows a ✓ icon instead of its number and, if the modal is not open, is a button that goes back to that step (back only, never forward; values are kept); on step 3 both circles show ✓ and the indicator stays inert behind the modal; new copy key `goBackToStep` (th + en) for the button's accessible name | Designer request |
| 16 | 2026-11-15 | Step 2 has a "← ย้อนกลับ" (Back) text link just above the parchment card, outside it, left-aligned with the card, that returns to step 1 (typed values and the ticked agreement are kept); new copy key `back` (th + en) | Designer request |
| 15 | 2026-11-15 | Device preview host (Mobile S/M/L, Tablet, Custom) has the verification-modal state row on step 3, like the desktop Preview panel: `previewBridge.ts` gets `verify` (`&verify=<id>`, written only on step 3), `DevicePreviewHost.tsx` the row, `page.tsx` handles it in the host event and keeps it when entering device mode | Designer request |
| 14 | 2026-11-15 | Wrong-code / too-many-attempts / expired message (and the "new code sent" line) now sit tight under the code boxes like the error under the email field in the change-email view: no reserved empty slot, the paper grows a little when a message appears; boxes-to-button gap is 20px when there is none | Designer request |
| 13 | 2026-11-15 | Verification modal: seal check mark fixed at 24px on every page (the signup page's `.font-display` rule had shrunk it); more space above the resend row, less space between the resend/spam row and the "Change email / Use a different account" links | Designer request |
| 12 | 2026-11-15 | Code expiry changed from 10 to 5 minutes: new `CODE_EXPIRY_MINUTES` constant drives the "expires in N minutes" text and a mock expiry timer in `VerifyEmailModal.tsx`; back-end notes (5a) updated | Designer request |
| 11 | 2026-11-15 | Unverified-login variant gets its own wording back ("Your email isn't verified yet. We sent a new 6-digit code to <email>.") inside the signup-style layout | Designer request |
| 10 | 2026-11-15 | Unverified-login variant uses the same intro text and layout as the signup variant (blue info notice removed) | Designer request |
| 9 | 2026-11-15 | Error line under the code boxes restyled like the "✓ new code sent" line (plain 13px text with a ✕ prefix, no SVG icon) | Designer request |
| 8 | 2026-11-15 | Verification modal: the six code boxes now span the full content width (same as notice and button); paper 10% narrower (`max-w-[37.8rem]`); info notice and close X softened to blend with the paper | Designer request (screenshot) |
| 7 | 2026-11-15 | Draft-only Preview panel is collapsible (shared `landing/_components/draft-tools/PreviewCollapse.tsx`); the verification-modal preview buttons show the selected state (red, `aria-pressed`) | Designer request |
| 6 | 2026-11-15 | Login variant moved from `/draft/login` (no longer used; reverted) to the landing page's login popup | Designer request |
| 5 | 2026-11-15 | Modal paper is the real `paper.png` again (9-slice), all content fits on it; tighter layout; `verify` preview URL param | Designer request |
| 4 | 2026-11-15 | Step 3 is now the email-verification modal (6-digit code, resend countdown, change-email, verified, login variant) on a code-drawn paper letter; replaces the round-2 popup and resend field. Back-end rules written up in 5a | Designer's verification spec (UI only; functionality for dev) |
