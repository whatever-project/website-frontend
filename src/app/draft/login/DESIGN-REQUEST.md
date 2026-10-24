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
updated: 2026-10-24
round: 1
---

# Design request: เข้าสู่ระบบ

## 1. Basics
- **Purpose (one sentence):** Let an existing user sign in with username or email and password.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/login`). This folder is the starting copy of the live page, prepared so the design team can modify it. No design changes requested yet.
- **Related existing page:** /signup, /forgot-password

## 2. Attached files
none. HTML source: none.

## 2b. Changes requested
n/a (round 1: baseline copy of the live page).

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Page header | Title "เข้าสู่ระบบ", sub "— ประตูสู่หุบเขา —", back link to home | Go back to home | copied from live page |
| 2 | Login card (left) | Seal "✦", heading "จดหมายเชิญกลับหมู่บ้าน", username/email field, password field (show/hide), "จดจำฉัน" checkbox, "ลืมรหัสผ่าน?" link, submit button, "ยังไม่มีบัญชี? สร้างบัญชีใหม่" link | Sign in, go to forgot-password, go to signup | copied from live page |
| 3 | Letter illustration (right, desktop only) | Decorative letter scene image | none | existing image |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Username or email | ผู้เดินทาง / you@example.com (placeholder) | user input | yes |
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
- **Modals / confirmations:** none.

## 6. Look and feel
- **Closest existing page:** /signup (same two-column layout).
- **Elements that don't exist yet:** none.
- **Screen priority:** both (illustration hidden below the `lg` breakpoint).
- **Images / illustrations:** letter scene (`/assets/letter-scene.png`, existing).

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
