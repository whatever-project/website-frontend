---
page: reset-password
status: designing
route_group: public
target_route: /reset-password
draft_url: /draft/reset-password
round: 1
updated: 2026-10-24
---

# Reset password: dev context

## 1. What this page is
Baseline draft of the **already-live** `/reset-password?token=…` page, created so the design team can modify it. Round 1 replicates `src/views/public/reset-password/index.tsx` + `components/ResetPasswordForm.tsx` with Thai copy hard-coded, no token read and no API call. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page + "Preview state (draft only)" switch (form / loading / error / success / noToken) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/reset-password.json`), sample error, preview state options |

## 2b. Changes since promotion
n/a. The live page already exists; nothing in this draft differs from it yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners`, `PasswordInput` | `@/components/Parchment` | Page frame, card, password field |
| `routes` | `@/config/routes` | Link targets (`login`, `forgotPassword`) |
| `parch-sheet`, `parch-label`, `parch-input`, `parch-btn`, `parch-btn-outline` | `src/styles/globals.css` | Card, field, buttons |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each state | no, delete on promotion |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- Live behaviour that the draft intentionally leaves out: read `?token=` via `useSearchParams` (wrap in `Suspense` with `common.loading` fallback), call `authService.resetPassword({ token, newPassword })`, and `router.push(routes.login)` 2.5 s after success.
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("resetPassword")`.
- Remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | token present, no input | Form with empty password field |
| Loading | request in flight | Button "กำลังรีเซ็ต…", disabled |
| Error | API error | Red banner with server message |
| Success | password reset | Seal "✓" card; live page redirects to login after 2.5 s |
| No token | URL has no `?token=` | "โทเค็นรีเซ็ตไม่ถูกต้องหรือไม่มีอยู่" + "ขอลิงก์ใหม่ →" |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `newPassword` | string (min 8) | `authService.resetPassword({ token, newPassword })` | Only min length is enforced client-side; signup uses stronger rules (`getPasswordChecks`), see Open |
| `sampleError` | string | `ApiError.message` | Placeholder |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Reset password | `authService.resetPassword` | Already exists; success copy says all sessions are signed out |

## 8. Thai strings to move to i18n
Already in `messages/{th,en}/reset-password.json` (namespace `resetPassword`): `pageTitle, pageSub, heading, hint, passwordLabel, passwordPlaceholder, submit, submitting, successHeading, successBody, invalidToken, requestNewLink`. The live page's hard-coded English fallback "Reset failed" is not in the messages files.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are from the live page.
- **Open:** What does the design team want to change? Should password rules match signup (8+ chars, digit, upper+lower)? Live reset page checks only length 8.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
