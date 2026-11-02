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
updated: 2026-11-02
round: 2
---

# Design request: หน้าแรก (Landing)

## 1. Basics
- **Purpose (one sentence):** Welcome visitors to Arcane Vale with a full-screen village scene and entry points to log in or sign up.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/`). This draft is the working copy; the live page changes only when a developer applies the design.
- **Related existing page:** /login, /signup

## 2. Attached files
Round 2: screenshot of the desired login card, showing a single parchment sheet titled "ยินดีต้อนรับกลับ", username/email and password fields, remember-me and forgot-password controls, a dark login button, and a signup link. HTML source: none. (The village background `/assets/village.jpg` already exists in the repo and is referenced, not copied.)

## 2b. Changes requested
- Make the landing-page "เข้าสู่ระบบ" button open the login UI as a popup over the village instead of navigating away.
- Make the popup look like the supplied login screenshot and open with an effect like a roll of parchment unfolding from top to bottom.
- Confirmed defaults: close with an X, the backdrop, or Escape; keep existing form states and links; leave the rest of landing unchanged.

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Background | Full-screen village picture, drifting mist, colour grade that changes with time of day, twinkling stars at night, flickering window glows at night | none | existing |
| 2 | Top bar | "ARCANE VALE" label (left), language switcher (right; hidden in drafts) | Switch language (live only) | existing |
| 3 | Centre | "ยินดีต้อนรับ", big title "นักเดินทาง", subtitle "ดินแดนแห่งเวทมนตร์รอคอยการมาถึงของคุณ", two buttons "เข้าสู่ระบบ" and "สมัครสมาชิก" | Open the login popup or go to /signup | existing |
| 4 | Bottom time slider | 00:00 – 24:00 slider, "● เวลาจริง" toggle | Drag to preview any time of day; toggle real time | existing |
| 5 | Login popup | The single-card login UI from the supplied screenshot over a dimmed village backdrop | Sign in, preview form states, follow forgot-password/signup links, close the popup | supplied screenshot and existing login draft |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Hour of day | 21.5 | device clock, slider, or URL `?t=` | yes |
| Time-of-day look (grade, wash, stars, window glow) | n/a | `getTimeState` in `@/utils/timeOfDay` | yes |
| Login popup open/closed | closed | "เข้าสู่ระบบ" button and close controls | yes |
| Login fields and preview state | empty form / normal | user input and draft-only state switch | yes |

## 5. States and behaviour
- **Empty state:** empty login form when the popup opens.
- **Loading:** existing login button "กำลังเข้าสู่ระบบ…", disabled.
- **Error:** existing sample wrong-credentials, unverified-email, and generic-error states remain available in the draft.
- **Success:** no real login or navigation in the draft.
- **Validation messages:** browser's required-field checks only.
- **Buttons / actions:** "เข้าสู่ระบบ" opens the popup; "สมัครสมาชิก" → /signup; "เวลาจริง" and the slider behave as before.
- **Modals / confirmations:** login popup closes with an X, backdrop click, or Escape. No confirmation. "สร้างบัญชีใหม่" and "ลืมรหัสผ่าน?" keep their existing destinations.
- **Time preview:** open `/draft/landing?t=21` (any hour 0–24) to force a time.

## 6. Look and feel
- **Closest existing page:** the village scene stays as it is; the popup follows the supplied screenshot and existing parchment login styling.
- **Elements that don't exist yet:** top-to-bottom parchment-unroll opening effect and a close control for this popup.
- **Screen priority:** both; popup must fit a 360px-wide screen without horizontal scrolling.
- **Images / illustrations:** village photo (`/assets/village.jpg`, existing); no letter illustration in the popup.

## 7. Open questions
- none; the designer confirmed the proposed behaviour and defaults.

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
| 2 | 2026-11-02 | Open login on landing as a parchment-unroll popup matching the supplied screenshot | centre login action, new login popup |
