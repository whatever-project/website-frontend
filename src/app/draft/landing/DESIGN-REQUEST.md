<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: landing
route_group: public
route_path: /
status: designing
created: 2026-10-24
updated: 2026-10-24
round: 1
---

# Design request: หน้าแรก (Landing)

## 1. Basics
- **Purpose (one sentence):** Welcome visitors to Arcane Vale with a full-screen village scene and entry points to log in or sign up.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/`). This folder is the starting copy of the live page, prepared so the design team can modify it. No design changes requested yet.
- **Related existing page:** /login, /signup

## 2. Attached files
none. HTML source: none. (The village background `/assets/village.jpg` already exists in the repo and is referenced, not copied.)

## 2b. Changes requested
n/a (round 1: baseline copy of the live page).

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Background | Full-screen village picture, drifting mist, colour grade that changes with time of day, twinkling stars at night, flickering window glows at night | none | existing |
| 2 | Top bar | "ARCANE VALE" label (left), language switcher (right; hidden in drafts) | Switch language (live only) | copied from live page |
| 3 | Centre | "ยินดีต้อนรับ", big title "นักเดินทาง", subtitle "ดินแดนแห่งเวทมนตร์รอคอยการมาถึงของคุณ", two buttons "เข้าสู่ระบบ" and "สมัครสมาชิก" | Go to /login or /signup | copied from live page |
| 4 | Bottom time slider | 00:00 – 24:00 slider, "● เวลาจริง" toggle | Drag to preview any time of day; toggle real time | copied from live page |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Hour of day | 21.5 | device clock, slider, or URL `?t=` | yes |
| Time-of-day look (grade, wash, stars, window glow) | n/a | `getTimeState` in `@/utils/timeOfDay` | yes |

## 5. States and behaviour
- **Empty state:** n/a.
- **Loading:** n/a (stars appear after the page mounts).
- **Error:** n/a.
- **Success:** n/a.
- **Validation messages:** n/a.
- **Buttons / actions:** "เข้าสู่ระบบ" → /login; "สมัครสมาชิก" → /signup; "เวลาจริง" toggles following the device clock (updates every 30 s); dragging the slider turns real time off.
- **Modals / confirmations:** none.
- **Time preview:** open `/draft/landing?t=21` (any hour 0–24) to force a time.

## 6. Look and feel
- **Closest existing page:** none (only full-screen page without the parchment frame).
- **Elements that don't exist yet:** none.
- **Screen priority:** both.
- **Images / illustrations:** village photo (`/assets/village.jpg`, existing).

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
