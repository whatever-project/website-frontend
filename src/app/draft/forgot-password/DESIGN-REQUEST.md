<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: forgot-password
route_group: public
route_path: /forgot-password
status: designing
created: 2026-10-24
updated: 2026-10-24
round: 1
---

# Design request: ลืมรหัสผ่าน

## 1. Basics
- **Purpose (one sentence):** Let a user who forgot their password ask for a reset link by email.
- **Who sees this page:** guest
- **Page type:** revision of an existing live page (live path: `/forgot-password`). This folder is the starting copy of the live page, prepared so the design team can modify it. No design changes requested yet.
- **Related existing page:** /login, /reset-password

## 2. Attached files
none. HTML source: none.

## 2b. Changes requested
n/a (round 1: baseline copy of the live page; the designer has not asked for changes yet).

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Page header | Title "ลืมรหัสผ่าน", sub "— รีเซ็ตตราประทับของคุณ —", back link to login | Go back to login | copied from live page |
| 2 | Request card | Seal "?", heading, one-line explanation, email field | Type email, press "ส่งลิงก์รีเซ็ต" | copied from live page |
| 3 | Footer link | "↩ กลับไปเข้าสู่ระบบ" | Go to login | copied from live page |
| 4 | Success card | Seal "✉", "ตรวจสอบกล่องจดหมาย", link-expires-in-30-minutes note, button back to login | Go to login | copied from live page |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Email typed by the user | you@example.com | user input | yes |
| Error message | "Something went wrong" (server message is shown as-is) | server | yes |

## 5. States and behaviour
- **Empty state:** form with empty email field.
- **Loading:** button reads "กำลังส่ง…" and is disabled.
- **Error:** red banner above the field with the server's message.
- **Success:** card is replaced by the "ตรวจสอบกล่องจดหมาย" card (the page never says whether the email exists).
- **Validation messages:** browser's built-in email check only.
- **Buttons / actions:** "ส่งลิงก์รีเซ็ต" → request reset link; "กลับไปเข้าสู่ระบบ" → /login.
- **Modals / confirmations:** none.

## 6. Look and feel
- **Closest existing page:** /login, /reset-password (same Parchment card).
- **Elements that don't exist yet:** none.
- **Screen priority:** both.
- **Images / illustrations:** none (wax seal only).

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
