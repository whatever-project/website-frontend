---
page: landing
status: designing
route_group: public
target_route: /
draft_url: /draft/landing
round: 1
updated: 2026-10-24
---

# Landing: dev context

## 1. What this page is
Baseline draft of the **already-live** landing page `/`, created so the design team can modify it. Full-screen village scene with time-of-day colour grade, stars, window glows, title and login/signup buttons, plus a time scrubber. Round 1 replicates `src/views/public/landing/index.tsx` and `components/Stars.tsx` with Thai copy hard-coded. No design changes yet. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page (same logic as the live view; supports `?t=<hour>`) |
| `_components/Stars.tsx` | Copy of `src/views/public/landing/components/Stars.tsx` so designers can edit it (page-local in the live code too) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/landing.json` and `site.arcaneVale`) |

## 2b. Changes since promotion
n/a. The live page already exists; nothing in this draft differs from it yet.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `getTimeState` | `@/utils/timeOfDay` | Colour grade, wash, stars opacity, window glow per hour |
| `LanguageSwitcher` | `@/components/LanguageSwitcher` | Top-right (renders nothing on `/draft/*` by design) |
| `routes` | `@/config/routes` | Link targets (`login`, `signup`) |
| `gallery-btn`, `sun-slider`, `rise-in`, `rise-in-1..3`, `mist-drift`, `candle-flicker`, `star-twinkle`, fonts `font-oranienbaum`, `font-josefin`, `font-ui` | `src/styles/globals.css` | Buttons, slider, animations, type |
| `/assets/village.jpg` | `public/assets/` | Backdrop (referenced by path, as on the live page; not copied) |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| `Stars` copy | `_components/Stars.tsx` | Live copy is page-local; draft needs its own editable copy (rule 2.4) | no; on promotion fold design edits back into the live file and delete this copy |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- Swap `next/link` for `Link` from `@/i18n/navigation`, copy for `useTranslations("landing")` / `("site")`.
- Draft keeps `<img src="/assets/village.jpg">` as the live page does; if design supplies a new backdrop, dev has to place it in `public/assets/` (drafts cannot write to `public/`).
- On `/draft/*`, `LanguageSwitcher` returns null, so the language button is not visible in the draft (expected).

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Real time | default (device clock, refresh every 30 s) | Time-of-day look for the current hour; "● เวลาจริง" |
| Manual time | slider dragged or `?t=<hour>` | Look for that hour; "○ เวลาจริง" |
| Empty / Loading / Error / Success | n/a | no data |

## 7. Mock data → API entities
No API data. Hour comes from the browser clock, slider, or URL.

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| none | — | Buttons are plain links |

## 8. Thai strings to move to i18n
Already in messages (`messages/{th,en}/landing.json`, namespace `landing`): `welcome, title, subtitle, logIn, signUp, realTime, realTimeOff, timeLabel`; plus `site.arcaneVale` (in `common.json`). Image alt text "Arcane Vale Village" is hard-coded English on the live page.

## 9. Assumptions and open questions
- **Assumed (designer to confirm):** none; copy and layout are from the live page.
- **Open:** What does the design team want to change?

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page | Make an editable draft for the design team |
