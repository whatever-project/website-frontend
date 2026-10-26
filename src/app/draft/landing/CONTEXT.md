---
page: landing
status: ready-for-dev
route_group: public
target_route: /
draft_url: /draft/landing
round: 4
updated: 2026-10-26
---

# Landing: dev context

## 1. What this page is
Draft of the **already-live** landing page `/`, created so the design team can modify it. Full-screen village scene with time-of-day colour grade, stars, window glows, title and login/signup buttons, plus a time scrubber. Round 1 replicated `src/views/public/landing/index.tsx` and `components/Stars.tsx` with Thai copy hard-coded. Round 2 switches all Thai text to the Jim Thompson Roman typeface. See `DESIGN-REQUEST.md`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page (same logic as the live view; supports `?t=<hour>`) |
| `_components/Stars.tsx` | Copy of `src/views/public/landing/components/Stars.tsx` so designers can edit it (page-local in the live code too) |
| `_mock/copy.ts` | Thai copy (from `src/messages/th/landing.json` and `site.arcaneVale`) |
| `_assets/source/landing-fixed.html` | Designer's HTML source (round 4), layout reference for the login/signup buttons only; never imported |

## 2b. Changes since promotion
- **Round 2 (2026-10-26), `page.tsx`:** every Thai string now uses the `font-jimthompson` class (Jim Thompson Roman, already defined in `globals.css`, licensed file present at `public/fonts/JimThompsonRoman.woff2`):
  - welcome line (`{COPY.welcome}`): `font-oranienbaum` → `font-jimthompson`; removed `uppercase` (no-op on Thai).
  - main title (`{COPY.title}`): `font-oranienbaum` → `font-jimthompson`; removed `uppercase`.
  - subtitle (`{COPY.subtitle}`): `font-josefin` → `font-jimthompson`; removed `uppercase`.
  - both `gallery-btn` links ("เข้าสู่ระบบ" / "สมัครสมาชิก"): added `font-jimthompson`; removed `uppercase`.
  - "เวลาจริง" toggle button: added `font-jimthompson` (its parent row still uses `font-josefin uppercase` for the "00:00" / "24:00" labels, unchanged).
  - Untouched on purpose: "ARCANE VALE" (`font-ui`), "00:00"/"24:00" (`font-josefin`) — designer asked for Thai text only.
- **Round 3 (2026-10-26), `page.tsx`:** the two `gallery-btn` links still rendered in Oranienbaum, because `.gallery-btn` in `globals.css` sets `font-family` directly and (unlayered) beats the Tailwind utility class. Fix: dropped `font-jimthompson` from the links and set an inline `style={{ fontFamily: "'Jim Thompson Roman', 'Charmonman', 'Prompt', serif" }}` (same stack as `.font-jimthompson`). **When promoting, dev should decide between keeping the inline style or making the Thai font part of `.gallery-btn` in `globals.css` — drafts may not edit that file.**
- **Round 4 (2026-10-26), `page.tsx`:** layout of the two `gallery-btn` links ("เข้าสู่ระบบ" / "สมัครสมาชิก") only, taken from `landing-fixed.html` (`.gallery-btn`): `w-40 px-6 tracking-[0.35em]` → `min-w-44 px-8 tracking-[0.2em] whitespace-nowrap sm:tracking-[0.3em]` (min-width 176px, padding 14px 32px, no wrapping, letter-spacing .2em, .3em from 640px). Container (`mt-12 gap-5 sm:flex-row sm:gap-8`), colours, border, hover, font and routes unchanged. Status was `ready-for-dev` before this round; the live page is not updated until a dev applies this.

## 2d. Unused files (dev may delete)
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `getTimeState` | `@/utils/timeOfDay` | Colour grade, wash, stars opacity, window glow per hour |
| `LanguageSwitcher` | `@/components/LanguageSwitcher` | Top-right (renders nothing on `/draft/*` by design) |
| `routes` | `@/config/routes` | Link targets (`login`, `signup`) |
| `gallery-btn`, `sun-slider`, `rise-in`, `rise-in-1..3`, `mist-drift`, `candle-flicker`, `star-twinkle`, fonts `font-jimthompson`, `font-josefin`, `font-ui` | `src/styles/globals.css` | Buttons, slider, animations, type (`font-jimthompson` added in round 2; `font-oranienbaum` no longer used on this page) |
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
- The login/signup buttons use an inline `font-family` because `.gallery-btn` in `globals.css` sets `font-family` and overrides the utility class; a draft may not edit `globals.css`. Dev may prefer moving the font into `.gallery-btn` (or a variant class) when promoting.

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
- **Round 2 note:** Jim Thompson Roman ships at weight 400 only, so the subtitle's `font-extralight` class now has no visual effect (text renders at regular weight).

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-24 | First version: replica of the live page | Make an editable draft for the design team |
| 2 | 2026-10-26 | All Thai text switched to `font-jimthompson` (welcome, title, subtitle, both buttons, "เวลาจริง" toggle) | Designer: "ข้อความภาษาไทยทั้งหมดในหน้านี้ ให้เป็น JimThompsonRoman.woff2" |
| 3 | 2026-10-26 | Buttons still showed Oranienbaum (`.gallery-btn` overrides the utility class); fixed with an inline `fontFamily` on both links | Designer: "แก้ฟอนต์ตรงปุ่มเข้าสู่ระบบกับสมัครสมาชิกด้วย" |
| 3 | 2026-10-26 | Approved by designer ("อนุมัติ") — status `ready-for-dev` | Designer |
| 4 | 2026-10-26 | Login/signup button layout from `landing-fixed.html` (min-width, padding, no wrap, letter-spacing). Revised after dev pickup (live page not updated) | Designer: "refer layout ของปุ่มเข้าสู่ระบบและสมัครสมาชิกจากไฟล์ที่แนบ" |
| 4 | 2026-10-26 | Approved by designer ("อนุมัติ") — status `ready-for-dev` | Designer |
