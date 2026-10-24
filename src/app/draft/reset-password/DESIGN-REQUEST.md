<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: reset-password
route_group: public
route_path: /reset-password
status: designing
created: 2026-10-24
updated: 2026-10-24
round: 1
---

# Design request: รีเซ็ตรหัสผ่าน

## 1. Basics
- **Purpose (one sentence):** Let a user who opened the emailed reset link choose a new password.
- **Who sees this page:** guest (arrives from the reset email link `?token=…`)
- **Page type:** revision of an existing live page (live path: `/reset-password`). This folder is the starting copy of the live page, prepared so the design team can modify it. No design changes requested yet.
- **Related existing page:** /forgot-password, /login

## 2. Attached files
none. HTML source: none.

## 2b. Changes requested
n/a (round 1: baseline copy of the live page).

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Page header | Title "รีเซ็ตรหัสผ่าน", sub "— ยึดตราประทับคืน —", back link to login | Go back to login | copied from live page |
| 2 | Form card | Seal "⚿", heading "ตั้งรหัสผ่านใหม่", hint (min 8 characters), password field with show/hide | Type new password, press "รีเซ็ตรหัสผ่าน" | copied from live page |
| 3 | Success card | Seal "✓", "รีเซ็ตรหัสผ่านแล้ว!", note that all sessions were signed out | Wait; live page auto-redirects to login after 2.5 s | copied from live page |
| 4 | Invalid-link card | Message "โทเค็นรีเซ็ตไม่ถูกต้องหรือไม่มีอยู่", button "ขอลิงก์ใหม่ →" | Go to /forgot-password | copied from live page |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Reset token | (in URL `?token=`) | link in email | yes |
| New password | (typed) | user input | yes |
| Error message | "Reset failed" (server message shown as-is) | server | yes |

## 5. States and behaviour
- **Empty state:** form with empty password field.
- **Loading:** button "กำลังรีเซ็ต…", disabled.
- **Error:** red banner above the field.
- **Success:** success card, then redirect to /login after 2.5 s (live page only; the draft does not redirect).
- **Validation messages:** browser check for min length 8. No strength rules are shown.
- **Buttons / actions:** "รีเซ็ตรหัสผ่าน" → set new password; "ขอลิงก์ใหม่ →" → /forgot-password.
- **Modals / confirmations:** none.

## 6. Look and feel
- **Closest existing page:** /forgot-password.
- **Elements that don't exist yet:** none.
- **Screen priority:** both.
- **Images / illustrations:** none (wax seal only).

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live page for the design team | all (baseline copy) |
