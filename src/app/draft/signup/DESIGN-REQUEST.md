<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: signup
route_group: public
route_path: /signup
status: designing
created: 2026-10-24
updated: 2026-10-24
round: 1
---

# Design request: สมัครสมาชิก

## 1. Basics
- **Purpose (one sentence):** Let a new visitor accept the terms, create an account, and be told to verify their email.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/signup`). This folder is the starting copy of the live page, prepared so the design team can modify it. No design changes requested yet.
- **Related existing page:** /login, /verify-email

## 2. Attached files
none. HTML source: none.

## 2b. Changes requested
n/a (round 1: baseline copy of the live page).

## 3. Content, top to bottom
The page has three steps on one route.
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Page header + step indicator | Title "สมัครสมาชิก", sub changes per step, circles 1 "ข้อกำหนด" and 2 "ข้อมูลบัญชี" (hidden on step 3) | none | copied from live page |
| 2 | Step 1: Terms | "ข้อกำหนดและเงื่อนไข", scrollable list of 7 numbered terms (I–VII), checkbox "ฉันได้อ่านและยอมรับ… (จำเป็น)", "ถัดไป" button, letter illustration (desktop) | Tick the checkbox, go to step 2 | copied from live page |
| 3 | Step 2: Account form | Seal "✦", heading "ทะเบียนนักเดินทาง", username, email, password (show/hide), rule boxes, "สร้างบัญชี" button, "มีบัญชีอยู่แล้ว? เข้าสู่ระบบ" | Fill in and submit; go to login | copied from live page |
| 4 | Step 3: Verify email | Envelope icon, "ยืนยันอีเมลของคุณ", "สร้างบัญชีแล้ว! …", "ส่งจดหมายยืนยันไปที่ <email>", "ยืนยันแล้ว? เข้าสู่ระบบ" | Go to login | copied from live page |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Username | (typed) | user input | yes |
| Email | wanderer@example.com (placeholder) | user input | yes |
| Password | (typed) | user input | yes |
| Terms (7 items) | see `_mock/copy.ts` | fixed text | no |
| Server message on step 3 | live page shows the server's message; the draft shows the fixed text "สร้างบัญชีแล้ว! …" | server | yes |

## 5. States and behaviour
- **Empty state:** step 1 with checkbox unticked and "ถัดไป" disabled.
- **Loading:** button "กำลังสร้างบัญชี…", disabled.
- **Error:** red banner at the top of the form with the server's message.
- **Success:** step 3.
- **Validation messages:**
  - Username: no spaces; 3–25 characters; only A–Z, 0–9, `_ . -`. Rule box appears while the field is focused.
  - Email: "กรุณากรอกอีเมลให้ถูกต้อง".
  - Password: at least 8 characters; at least one digit; upper and lower case. Checklist with ✓/✕ appears on focus or when invalid.
  - Errors are shown as "✕ …" under the field; the field border turns red.
- **Buttons / actions:** "ถัดไป" → step 2; "สร้างบัญชี" → create account; "เข้าสู่ระบบ" → /login.
- **Modals / confirmations:** none.

## 6. Look and feel
- **Closest existing page:** /login (same two-column layout).
- **Elements that don't exist yet:** none.
- **Screen priority:** both (illustration hidden below the `lg` breakpoint).
- **Images / illustrations:** letter scene (`/assets/letter-scene.png`, existing), inline envelope icon.

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
