---
page: verify-email
status: designing
route_group: public
target_route: /verify-email
draft_url: /draft/verify-email
round: 1
updated: 2026-10-24
---

# Verify email (+ verify email change): dev context

## 1. What this page is
Baseline draft of **two already-live pages combined into one draft**: `/verify-email` (after signup) and `/verify-email-change` (after changing email in account settings). They have identical layout and logic and differ only in copy, back link, button destinations and the API call. Round 1 replicates `src/views/public/verify-email/*` and `src/views/public/verify-email-change/*` with Thai copy hard-coded and no token read / API call. No design changes yet. See `DESIGN-REQUEST.md`.

Second target route: `/verify-email-change` (front-matter `target_route` holds the primary one).

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page + "Preview state (draft only)" switch: kind (signup / change) × state (loading / success / errorNoToken / errorServer) |
| `_mock/copy.ts` | Thai copy for both pages (from `src/messages/th/verify-email.json` and `verify-email-change.json`), `[TBD]` server messages, switch options |

## 2b. Changes since promotion
n/a. The live pages already exist; nothing in this draft differs from them yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `InkDivider`, `Flourish`, `WaxSeal`, `SheetCorners` | `@/components/Parchment` | Page frame and card |
| `routes` | `@/config/routes` | Link targets (`home`, `login`, `signup`, `dashboard`) |
| `parch-sheet`, `parch-label`, `parch-btn`, `parch-btn-outline` | `src/styles/globals.css` | Card, buttons |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Preview state switch | `page.tsx` (bottom of file) | Draft-only tool to view each kind/state | no, delete on promotion |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- **Keep two routes on promotion.** Both live views stay separate (`views/public/verify-email`, `views/public/verify-email-change`) because they have different endpoints and namespaces. Either keep two thin views, or extract one shared view that takes the kind as a prop and both route files use it.
- Live behaviour the draft leaves out: read `?token=` via `useSearchParams` (inside `Suspense` with `common.loading` fallback); no token → error with `noToken`; otherwise `authService.verifyEmail(token)` (signup) or `accountService.verifyEmailChange(token)` (change); show `result.message` on success, `ApiError.message` (else "Verification failed.") on error.
- Differences to preserve: back link (home vs dashboard), success button (login vs dashboard "กลับไปตั้งค่าบัญชี"), error button (signup vs dashboard).
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("verifyEmail")` / `("verifyEmailChange")`.
- Remove the Preview state switch.

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Loading | token being checked | Pulsing text (kind-specific) |
| Success | API ok | Seal "✓", heading, server message (`[TBD]`), main button |
| Error: no token | URL without `?token=` | Red heading + "ไม่มีโทเค็นยืนยัน" + outline button |
| Error: server | API rejects | Red heading + server message (`[TBD]`) + outline button |
| Empty | n/a | — |

## 7. Mock data → API entities
| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| token | string | URL `?token=` | |
| success message | string | `{ message }` in response | Wording not in repo → `[TBD]` in draft |
| error message | string | `ApiError.message` | Wording not in repo → `[TBD]` in draft |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| Verify signup email (automatic on load) | `authService.verifyEmail(token)` | Already exists |
| Verify changed email (automatic on load) | `accountService.verifyEmailChange(token)` | Already exists |

## 8. Thai strings to move to i18n
Already in messages. `verifyEmail`: `pageTitle, pageSub, loading, successHeading, errorHeading, backToSignUp, signIn, noToken`. `verifyEmailChange`: `pageTitle, pageSub, loading, successHeading, errorHeading, backToAccount, noToken`. Draft names differ: `successCta` = `signIn` / `backToAccount`; `errorCta` = `backToSignUp` / `backToAccount`. Hard-coded English fallback "Verification failed." is not in messages.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are from the live pages.
- **Open:** Wording of server success/error messages (draft shows `[TBD]`); what the design team wants to change.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: verify-email and verify-email-change combined, replica of live pages with state switch | Make an editable draft for the design team |
