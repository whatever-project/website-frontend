---
page: signup
status: designing
route_group: public
target_route: /signup
draft_url: /draft/signup
round: 1
updated: 2026-10-24
---

# Signup: dev context

## 1. What this page is
Baseline draft of the **already-live** `/signup` page, created so the design team can modify it. Three steps on one route (terms → account form → "verify your email"). Round 1 replicates `src/views/public/signup/index.tsx` with Thai copy hard-coded and the API call removed. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page (3 steps) + "Preview state (draft only)" switch (step 1/2/3, server-error toggle, loading toggle) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/signup.json`): `COPY`, `TERMS` (7 items), `ROMAN`, `SAMPLE_EMAIL` |

## 2b. Changes since promotion
n/a. The live page already exists; nothing in this draft differs from it yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners`, `PasswordInput` | `@/components/Parchment` | Page frame, cards, password field |
| `LetterStack` | `@/components/LetterStack` | Right-hand illustration (steps 1–2, desktop) |
| `EMAIL_RE`, `getPasswordChecks`, `validateUsername` | `@/utils/validation` | Real validation rules (same as live) |
| `routes` | `@/config/routes` | Link targets (`home`, `login`) |
| `parch-sheet`, `parch-label`, `parch-input`, `parch-check`, `parch-btn`, `wax-seal` | `src/styles/globals.css` | Cards, fields, step circles |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each step/state | no, delete on promotion |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- Live behaviour the draft leaves out: `authService.signup({ username, email, password })` → on success show `result.message` on step 3 (draft shows fixed `verifyBody`); on failure show `ApiError.message` or "Something went wrong. Please try again."
- Username error codes → message keys live in `src/views/public/signup/constants.ts` (`USERNAME_ERROR_KEYS`); the draft inlines the messages in `COPY.usernameErr`.
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("signup")`.
- Remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Step 1, not agreed | page load | Terms list, "ถัดไป" disabled |
| Step 1, agreed | checkbox ticked | "ถัดไป" enabled |
| Step 2, empty | go to step 2 | Empty form, no messages |
| Step 2, invalid | typing / blur | Red border + "✕ …" under field; username rule box on focus; password checklist on focus or when invalid |
| Loading | request in flight | Button "กำลังสร้างบัญชี…", disabled (preview toggle) |
| Error | API error | Red banner above the form (preview toggle) |
| Step 3, success | valid submit | Envelope, "ยืนยันอีเมลของคุณ", email shown |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `username` | string 3–25, `[A-Za-z0-9_.-]` | `authService.signup` | Rules in `@/utils/validation` |
| `email` | string | `authService.signup` | |
| `password` | string, 8+, digit, upper+lower | `authService.signup` | |
| `TERMS` | string[7] | fixed text | Currently in messages (`signup.terms.0..6`) |
| step-3 message | string | `signup()` response `message` | Draft uses fixed text |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Create account | `authService.signup` | Already exists; email verification link then goes to `/verify-email` |

## 8. Thai strings to move to i18n
Already in `messages/{th,en}/signup.json` (namespace `signup`): all of `pageTitle, pageSubStep1..3, stepTerms, stepAccountInfo, termsHeading, iAgree, iAgreeRequired, next, formHeading, username, email, emailPlaceholder, password, passwordPlaceholder, submit, submitting, alreadyHaveAccount, signIn, verifyHeading, verifyBody, verifyLetterSent, alreadyVerified, usernameRequirements, usernameRule1..3, passwordRequirements, passRule1..3, terms.0..6, usernameErrSpaces, usernameErrLength, usernameErrChars, emailErrFormat`. In the draft the rules are arrays (`usernameRules`, `passRules`) and username errors an object (`usernameErr`); map back to the numbered keys when promoting. Hard-coded English fallback "Something went wrong. Please try again." is not in messages.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are from the live page.
- **Open:** What does the design team want to change (terms wording, step order)?

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
