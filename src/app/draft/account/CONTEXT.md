<!--
Backfilled 2026-10-15 for a draft that was made before the hand-off files existed. Facts below come from reading `page.tsx` and the live view folder only.
The original design request and the designer's words were not recorded, so DESIGN-REQUEST.md and SUMMARY.th.md do NOT exist yet.
Kimi creates them on the next /design-request round (Step 1b), then keeps this file up to date.
-->
---
page: account
status: promoted
route_group: user
target_route: /account
draft_url: /draft/account
round: 0
updated: 2026-10-15
---

# Account: dev context

## 1. What this page is
Draft of the character picker ("Choose Your Soul") with account settings. It lives at `src/app/draft/account/page.tsx` (single 974-line client component) and mock data only. The live pages are `src/views/user/account/` (picker) and `src/views/user/dashboard/` (profile, username/email/password, delete account), so the draft is a combined prototype of both. Its state at promotion time is not recorded.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Everything: mock characters/slots/prices, picker, create and buy-slot views, and four settings modals (`AccUsernameModal`, `AccPasswordModal`, `AccEmailModal`, `AccDeleteModal`) plus local copies of `InkModal`, `PassRules`, `validateUsername`, `maskEmail` |

## 2b. Changes since promotion
n/a (no revision round has been logged yet). The draft may differ from the live pages in either direction: check both before changing or promoting anything.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell`, `Flourish`, `InkDivider`, `WaxSeal`, `SheetCorners`, `PasswordInput` | `@/components/Parchment` | Frame, ornaments, password field |
| `routes` | `@/config/routes` | Link targets |

## 4. New elements
- The draft defines its own `InkModal` instead of the shared one in `@/components/Parchment`. Whether this was promoted is not recorded.

## 5. Needs dev
- none recorded

## 9. Assumptions and open questions
- **Open:** how far this draft is ahead of or behind the live `/account` and `/dashboard` views. Kimi must not rebuild from live code (draft-first rule); a dev should compare the two before the next revision is promoted.

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 0 | 2026-10-15 | `CONTEXT.md` backfilled; no design history available | Workflow update (hand-off files for older drafts) |
