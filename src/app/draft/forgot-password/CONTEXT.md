---
page: forgot-password
status: designing
route_group: public
target_route: /forgot-password
draft_url: /draft/forgot-password
round: 1
updated: 2026-10-24
---

# Forgot password: dev context

## 1. What this page is
Baseline draft of the **already-live** `/forgot-password` page, created so the design team can modify it. Single card with one email field; on submit it shows a "check your inbox" card. Round 1 is a copy of `src/views/public/forgot-password/index.tsx` with Thai copy hard-coded and the API call removed. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page + "Preview state (draft only)" switch (idle / loading / error / success) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/forgot-password.json`), sample error, preview state options |

## 2b. Changes since promotion
n/a. The live page already exists; nothing in this draft differs from it yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners` | `@/components/Parchment` | Page frame and card |
| `routes` | `@/config/routes` | Link targets (`login`) |
| `parch-sheet`, `parch-label`, `parch-input`, `parch-btn`, `parch-btn-outline` | `src/styles/globals.css` | Card, field, buttons |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each state | no, delete on promotion |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- Wire submit to `authService.forgotPassword({ email })` (`src/api/services/auth.service.ts`), show `ApiError.message` on failure.
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("forgotPassword")`.
- Remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | page load | Form with empty email |
| Loading | request in flight | Button "กำลังส่ง…", disabled |
| Error | API error | Red banner with server message above the form |
| Success | request accepted | Seal "✉" card "ตรวจสอบกล่องจดหมาย" + back-to-login button |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| `email` | string | `authService.forgotPassword({ email })` | Success wording is deliberately generic (does not reveal if the account exists). Link expires in 30 min (stated in copy). |
| `sampleError` | string | `ApiError.message` | Placeholder only |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Send reset link | `authService.forgotPassword` (`AUTH_ROUTES` in `src/api/routes.ts`) | Already exists |

## 8. Thai strings to move to i18n
Already in `messages/{th,en}/forgot-password.json` (namespace `forgotPassword`): `pageTitle, pageSub, heading, body, emailLabel, emailPlaceholder, submit, submitting, successHeading, successBody, backToSignIn`. Any new/changed wording from design must be added there. The live page's hard-coded English fallback "Something went wrong" is not in the messages files.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are taken from the live page.
- **Open:** What does the design team want to change?

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page with state switch | Make an editable draft for the design team |
