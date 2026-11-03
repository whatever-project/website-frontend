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
updated: 2026-11-04
round: 4
---

# Design request: หน้าแรก (Landing)

## 1. Basics
- **Purpose (one sentence):** Welcome visitors to Arcane Vale with a full-screen village scene and entry points to log in or sign up.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/`). This draft is the working copy; the live page changes only when a developer applies the design.
- **Related existing page:** /login, /signup

## 2. Attached files
Round 2: screenshot of the desired login card, showing a single parchment sheet titled "ยินดีต้อนรับกลับ", username/email and password fields, remember-me and forgot-password controls, a dark login button, and a signup link. HTML source: none. (The village background `/assets/village.jpg` already exists in the repo and is referenced, not copied.)

Round 3: the Kimi demo project "Fantasy Parchment Scroll Demo" (a 3D parchment scroll that rolls open and closed; Three.js + one GLB model). HTML source: the demo's `scroll_login_animation_v01.html`, copied to `_assets/source/` for reference only. The demo's GLB model is copied to `_assets/scroll/`.

## 2b. Changes requested
**Round 4**
- Remove the cross (X) close button from the login scroll.
- Closing now works by tapping anywhere outside the form (the dim area or the paper around the form) or pressing Esc; each rolls the sheet up first. Confirmed by the designer.

**Round 3**
- Replace the login popup with the demo's 3D parchment scroll, including all of its animation: the scroll unrolls from a tight roll, settles with a small wobble, then the form appears on the sheet; closing rolls the sheet back up.
- The full existing login form (heading, both fields, remember-me, forgot-password, button, signup link, error banners) sits on the unrolled sheet. Confirmed by the designer.
- Close with the X, the backdrop, or Esc; each plays the roll-up first (carried over from round 2; the X was removed in round 4).
- Prerequisite confirmed by the designer: they installed `three` and `@types/three`.

**Round 2**
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
- **Modals / confirmations:** login popup closes by tapping outside the form (dim area or paper around the form) or Escape; there is no X button (removed in round 4). No confirmation. "สร้างบัญชีใหม่" and "ลืมรหัสผ่าน?" keep their existing destinations.
- **Time preview:** open `/draft/landing?t=21` (any hour 0–24) to force a time.

## 6. Look and feel
- **Closest existing page:** the village scene stays as it is; the popup follows the supplied screenshot and existing parchment login styling.
- **Elements that don't exist yet:** the 3D parchment scroll (unroll, settle, roll-up) and a close control for this popup.
- **Screen priority:** both; popup must fit a 360px-wide screen without horizontal scrolling.
- **Images / illustrations:** village photo (`/assets/village.jpg`, existing); no letter illustration in the popup.

## 7. Open questions
- none for round 3; the designer confirmed the form content and that they would install `three`.
- Assumed, to confirm: the loading roll shows no visible text (screen-reader label "กำลังโหลด" only); dragging to rotate the scroll (a demo feature) is turned off so it doesn't fight the form.

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
| 2 | 2026-11-02 | Open login on landing as a parchment-unroll popup matching the supplied screenshot | centre login action, new login popup |
| 3 | 2026-11-04 | Replace the popup with the Kimi demo's 3D parchment scroll (all its animation), full existing form on the sheet | login popup |
| 4 | 2026-11-04 | Remove the cross button; close by tapping outside the form or Esc | login popup close control |
