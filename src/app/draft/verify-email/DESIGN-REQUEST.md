<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: verify-email
route_group: public
route_path: /verify-email
status: designing
created: 2026-10-24
updated: 2026-10-24
round: 1
---

# Design request: ยืนยันอีเมล / ยืนยันการเปลี่ยนอีเมล

## 1. Basics
- **Purpose (one sentence):** Show the result of clicking the email link that verifies a new account (`/verify-email`) or a changed email address (`/verify-email-change`).
- **Who sees this page:** anyone who opens the link from the email (guest or logged-in user)
- **Page type:** revision of two existing live pages, **combined into one draft** (live paths: `/verify-email` and `/verify-email-change`). This folder is the starting copy of the live pages, prepared so the design team can modify them. No design changes requested yet.
- **Related existing page:** /signup, /login, account settings

## 2. Attached files
none. HTML source: none.

## 2b. Changes requested
n/a (round 1: baseline copy of the live pages).

## 3. Content, top to bottom
Both pages share one layout; only the copy and the destination of the buttons differ.
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | Page header | Title + sub per page (see below), back link | Go back (home for verify-email, dashboard for verify-email-change) | copied from live pages |
| 2 | Card with seal "✉" | One of: loading text / success / error | see below | copied from live pages |
| 3 | Success | Seal "✓", success heading, **message from the server** | verify-email: "เข้าสู่ระบบ" → /login. verify-email-change: "กลับไปตั้งค่าบัญชี" → dashboard | copied; server message `[TBD]` |
| 4 | Error | Red heading "การยืนยันล้มเหลว", message (fixed "ไม่มีโทเค็นยืนยัน" when link has no token, else the server's message) | verify-email: "กลับไปสมัครสมาชิก" → /signup. verify-email-change: "กลับไปตั้งค่าบัญชี" → dashboard | copied; server message `[TBD]` |

| Page | Title | Sub | Loading text | Success heading |
|---|---|---|---|---|
| /verify-email | ยืนยันอีเมล | — ผนึกสัญญา — | กำลังยืนยันอีเมลของคุณ… | ยืนยันอีเมลแล้ว! |
| /verify-email-change | ยืนยันการเปลี่ยนอีเมล | — อัปเดตตราประทับของคุณ — | กำลังยืนยันอีเมลใหม่ของคุณ… | อัปเดตอีเมลแล้ว! |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| Verification token | (in URL `?token=`) | link in email | yes |
| Success / error message | `[TBD: server wording]` | server | yes |

## 5. States and behaviour
- **Empty state:** n/a (page verifies automatically on load).
- **Loading:** pulsing text while the token is checked.
- **Error:** no token or server rejects it (e.g. expired).
- **Success:** token accepted.
- **Validation messages:** n/a.
- **Buttons / actions:** see section 3.
- **Modals / confirmations:** none.

## 6. Look and feel
- **Closest existing page:** /forgot-password.
- **Elements that don't exist yet:** none.
- **Screen priority:** both.
- **Images / illustrations:** none (wax seal only).

## 7. Open questions
- [ ] Which changes does the design team want? (none requested yet)
- [ ] Server wording for success / error messages (not in the repo; live pages show whatever the backend returns).

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-24 | Create an editable draft of the live pages for the design team; combine verify-email and verify-email-change | all (baseline copy) |
