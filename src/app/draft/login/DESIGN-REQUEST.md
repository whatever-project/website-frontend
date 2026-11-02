<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: login
route_group: public
route_path: /login
status: designing
created: 2026-10-24
updated: 2026-11-02
round: 2
---

# Design request: เข้าสู่ระบบ

## 1. Basics
- **Purpose (one sentence):** Let an existing user sign in with username or email and password.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/login`). This draft is the working copy; the live page changes only when a developer applies the design.
- **Related existing page:** / (login popup), /signup, /forgot-password

## 2. Attached files
Round 2: screenshot of the desired login card, showing a single parchment sheet titled "ยินดีต้อนรับกลับ", username/email and password fields, remember-me and forgot-password controls, a dark login button, and a signup link. HTML source: none.

## 2b. Changes requested
- Change the login UI to match the supplied screenshot: one centred parchment card, no separate page heading and no letter illustration beside it.
- Use the same login UI in a new popup on landing, with a parchment-unroll effect there.
- Confirmed defaults: retain the existing fields, show/hide password, preview states, forgot-password and signup behaviour.

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Login card | Single parchment sheet, heading "ยินดีต้อนรับกลับ", ornamental divider, username/email field, password field (show/hide), "จดจำฉัน" checkbox, "ลืมรหัสผ่าน?" link, submit button, "ยังไม่มีบัญชี? สร้างบัญชีใหม่" link | Sign in, go to forgot-password, go to signup | supplied screenshot and existing copy |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Username or email | username หรือ you@example.com (placeholder) | user input | yes |
| Password | (typed) | user input | yes |
| Remember me | unchecked | user input | yes |
| Error message | server message, or fixed Thai text | server / fixed text | yes |

## 5. States and behaviour
- **Empty state:** empty form.
- **Loading:** button "กำลังเข้าสู่ระบบ…", disabled.
- **Error:** red banner "⚠️ …" with the server's message (e.g. wrong credentials); fixed Thai text "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง" for non-server errors.
- **Unverified email:** amber banner "✉️ อีเมลของคุณยังไม่ได้รับการยืนยัน…" with link "กลับไปสมัครสมาชิก →".
- **Success:** live page goes to the dashboard (draft does not navigate).
- **Validation messages:** browser's required-field checks only.
- **Buttons / actions:** "เข้าสู่ระบบ" → sign in; "ลืมรหัสผ่าน?" → /forgot-password; "สร้างบัญชีใหม่" → /signup.
- **Modals / confirmations:** the standalone page has none; landing reuses this UI in its new login popup.

## 6. Look and feel
- **Closest existing page:** the supplied screenshot, using the existing parchment design system.
- **Elements that don't exist yet:** none on the standalone page; the parchment-unroll popup belongs to landing.
- **Screen priority:** both; one centred card with no desktop-only side illustration.
- **Images / illustrations:** none.

## 7. Open questions
- none; the designer confirmed the proposed behaviour and defaults.

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
| 2 | 2026-11-02 | Match the supplied single-card login screenshot and reuse the UI in the landing popup | page frame, login card, illustration removal |
