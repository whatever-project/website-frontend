<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: skeleton-mockup
route_group: user
route_path: "[TBD: not decided]"
status: designing
created: 2026-10-16
updated: 2026-10-16
round: 1
---

# Design request: หน้าหลักฟอรั่ม แบบ Skeleton / Wireframe ขาว-ดำ (วังวนแห่งเวย์มัวร์)

## 1. Basics
- **Purpose (one sentence):** โครงหน้าหลัก (main page) ของคอมมูนิตี้โรลเพลย์ "วังวนแห่งเวย์มัวร์ / WHATEVER" แบบ wireframe ขาว-ดำ: แบนเนอร์ + แผนที่, ข่าวด่วน/หนังสือพิมพ์, แพตช์, กระดานประกาศ, เนื้อเรื่องหลัก, กิจกรรม, โพสต์ล่าสุด, คริสตัลสถานะ, สมาชิก, หน้าฟอรั่มหลัก/ฟอรั่มย่อย และแถบ HUD ล่างจอ
- **Who sees this page:** logged-in user (HUD แสดงตัวละคร "เอเลียน วอส") — [TBD: มุมมองของแขกที่ยังไม่ล็อกอิน ไม่ได้ออกแบบไว้]
- **Page type:** new page
- **Related existing page:** none (ใกล้เคียงที่สุดคือหน้าแรก `/` แต่หน้าตาและโทนสีต่างกันโดยสิ้นเชิง)

## 2. Attached files
| File | What it is | How to use it |
|---|---|---|
| `Kimi_Agent_K3_ Create Character/veymour-athenaeum-thai-v2.html` (สำเนาอ้างอิงที่ `_assets/source/veymour-athenaeum-thai-v2.html`) | prototype HTML ไฟล์เดียว (CSS + JS ในไฟล์), wireframe "MONO WIREFRAME · V 2.2", ข้อมูลจำลองทั้งหมด | ใช้เป็นต้นแบบทั้งหมด: เลย์เอาต์ ข้อความ ข้อมูลจำลอง และพฤติกรรมของทุกปุ่ม |
| `Kimi_Agent_K3_ Create Character/crys-cisenn.jpg` (สำเนาที่ `_assets/crys-cisenn.jpg`) | รูปตัวอย่างในคริสตัลสถานะอันแรก | ใช้ตามที่ HTML อ้างถึง |

## 2b. Changes requested (revision rounds only; otherwise "n/a")
n/a (round 1). The designer asked to make the HTML "compatible with website-frontend", in a new draft folder `skeleton-mockup`, split into components and mock data.

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | แบนเนอร์หลัก + แผนที่ | ภาพแบนเนอร์ (placeholder), ชื่อ "วังวนแห่งเวย์มัวร์", จดหมายเหตุฉบับที่ IX, ประกายเวท; ชั้นแผนที่พร้อมหมุด 4 จุด; แถบเมนูกระจก (หน้าหลัก / แผนที่ / ปฏิทิน / ฟอรั่มหลัก) | สลับแบนเนอร์ ⇄ แผนที่, กดหมุดเข้าฟอรั่ม, เปิดปฏิทิน, ไปหน้าฟอรั่มหลัก | attachment |
| 2 | แถบข่าวด่วน (ticker) | ข้อความเลื่อนวน: เหตุการณ์ฉุกเฉิน / แพตช์ / สมาชิกใหม่ | กด "เหตุการณ์ฉุกเฉิน" เปิดรายละเอียด | attachment |
| 3 | The Grand Hub | กล่องเหตุการณ์ฉุกเฉิน ⇄ หนังสือพิมพ์ (ต้องหย่อนเหรียญ 20 เคลให้นกฮูก), แพตช์อัปเดต 4 รายการ, วงโคจรหมวดแพตช์ 7 หมวด + โพสต์ล่าสุดของหมวด, กระดานประกาศ + ผู้สนับสนุน, ป้ายโฆษณา 3 ช่อง | อ่านรายละเอียดแพตช์/โพสต์, เขียนประกาศ (เสีย 20 เคล), จ่ายเหรียญอ่านหนังสือพิมพ์, สลับมุมมอง | attachment |
| 4 | The Seventh Seal | เนื้อเรื่องหลัก (ความคืบหน้า 68%, พื้นที่ปลดล็อก, สถิติ), กระดานเกียรติยศ, แถบ "เหตุการณ์สำคัญถัดไป" 10 ช่อง (6 กิจกรรม + 4 ว่าง) | ดูรายละเอียดเควส, กระดานเกียรติยศ, ชี้/กดการ์ดกิจกรรมเพื่ออ่านคำอธิบาย | attachment |
| 5 | Live Updates | โพสต์ล่าสุด 10 การ์ดเลื่อนแนวนอน, คริสตัลสถานะ (stories) | เปิดโพสต์, ปลุกคริสตัลใหม่ (ข้อความ/รูป), เปิดดูคริสตัล + กดถูกใจ | attachment |
| 6 | Members | วงกลมกลุ่มผู้ใช้ 5 กลุ่ม, สมาชิกใหม่ 5 คน, สถิติ (12,480 / 79 / 983) | กดดูรายละเอียดกลุ่ม/สมาชิก | attachment |
| 7 | หน้าฟอรั่มหลัก | 4 ฟอรั่มเป็นแถวใหญ่ + ทูลทิปตามเมาส์ | กดเข้าฟอรั่ม, กลับหน้าหลักจาก breadcrumb | attachment |
| 8 | หน้าฟอรั่ม | แบนเนอร์, ฟอรั่มย่อย 3 ช่อง, ตารางกระทู้ (ผู้ตั้ง/ตอบ/อ่าน/โพสต์ล่าสุด), เลขหน้า | กลับหน้าฟอรั่มหลัก | attachment |
| 9 | ส่วนท้าย | ลิงก์ 4 คอลัมน์, ไอคอนโซเชียล 5 อัน, ที่อยู่/ช่องทางติดต่อ, ลิขสิทธิ์ | (ลิงก์ยังไม่ไปไหน) | attachment |
| 10 | HUD ล่างจอ | โดมครึ่งวงกลม: รูป/ชื่อ/เลเวลตัวละคร, ไอคอนจดหมาย/แจ้งเตือน/บัญชี, ไอคอนลัด 8 อันเรียงบนขอบโค้ง (เลื่อนซ้าย-ขวาได้), นาฬิกาในเกม; ปุ่มย่อเหลือแถบบาง | เปิดหน้าต่าง 12 แบบ: โปรไฟล์ จดหมาย แจ้งเตือน แผนที่โลก ห้องคริสตัลแชท หนังสือคาถา กระเป๋าไอเทม ภูตนำทาง ปฏิทิน เขียนประกาศ ปลุกคริสตัล และหน้าต่างรายละเอียดทั่วไป | attachment |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| ฟอรั่ม / ฟอรั่มย่อย / กระทู้ | "อาณาจักรเวย์มัวร์", 5 กระทู้ต่อฟอรั่ม | server (ตอนนี้ mock) | yes |
| แพตช์, โพสต์ล่าสุด, โพสต์ตามหมวด | "3.2.1 ความเงียบแห่งใต้พิภพ" | server | yes |
| ความคืบหน้าเนื้อเรื่อง, กระดานเกียรติยศ, กิจกรรม | 68%, "เวน อัศวินกุญแจเก้า" | server | yes |
| สมาชิกใหม่, กลุ่มผู้ใช้, สถิติสมาชิก | 12,480 / 79 / 983 | server | yes |
| กระดานประกาศ, คริสตัลสถานะ | โน้ตของผู้เล่น, ข้อความ + รูป | server + ผู้ใช้สร้างเอง | yes |
| จดหมาย, แจ้งเตือน, ไอเทม, เหรียญ (เคล), แชท | 3 ฉบับที่ยังไม่อ่าน, 1,240 เคล | server | yes |
| ข้อความหน้าเว็บ (หัวข้อ, คำโปรย, ปุ่ม) | "The Grand Hub" | fixed text | no |

## 5. States and behaviour
- **Empty state:** แถบกิจกรรมมี "No Event" 4 ช่อง; ปุ่มจำลอง "เหตุฉุกเฉิน ปิด" ซ่อนแท็บและแสดงหนังสือพิมพ์
- **Loading:** [TBD: ไม่ได้ออกแบบ]
- **Error:** [TBD: ไม่ได้ออกแบบ]
- **Success:** toast "จ่าย 20 เคล — เหลือ … เคล · ประกาศถูกปักบนกระดานแล้ว"; คริสตัลใหม่โผล่หน้าสุดและเปิดรายละเอียด
- **Validation messages:** ไม่มี (ข้อความว่างจะไม่ส่ง)
- **Buttons / actions:** ดูหัวข้อ 3; ปุ่ม/ลิงก์ที่ยังเป็นของจำลอง (เปิดโพสต์, ติดต่อ, ส่งจดหมายต้อนรับ, ดูหน้ากลุ่ม ฯลฯ) ยังไม่ไปไหน
- **Modals / confirmations:** หน้าต่างลอยครึ่งล่างจอ 12 แบบ (ปิดด้วยปุ่ม ✕, คลิกฉากหลัง หรือกด Esc); ไม่มีหน้าต่างยืนยันก่อนจ่ายเหรียญ

## 6. Look and feel
- **Closest existing page:** ไม่มี — เป็นภาษาภาพ wireframe ขาว-ดำ (ฟอนต์ Playfair Display / Sarabun / JetBrains Mono) ต่างจากธีมกระดาษ parchment
- **Elements that don't exist yet:** ทุกอย่างในหน้านี้ (ดู CONTEXT.md §4)
- **Screen priority:** both (มี breakpoint 1080 / 900 / 820 / 760 / 700 / 680 / 640 px)
- **Images / illustrations:** ทุกภาพเป็นกรอบ placeholder ลายเฉียง ยกเว้นรูปในคริสตัลอันแรก (ขาว-ดำ)

## 7. Open questions
- [ ] ที่อยู่หน้าจริงของหน้านี้ (เป็นหน้าแรกใหม่ `/` หรือหน้าอื่น?)
- [ ] มุมมองของคนที่ยังไม่ล็อกอิน (HUD, กระเป๋าเงิน, จดหมาย ฯลฯ ต้องมีอะไรบ้าง)
- [ ] นี่คือ wireframe เท่านั้น หรือจะใช้โทนขาว-ดำนี้จริง? (ถ้าใช้ต้องกำหนดสี/ฟอนต์ของจริง)
- [ ] สถานะ loading / error ของแต่ละส่วน
- [ ] หน้าต่าง 12 แบบ — แบบไหนต้องทำจริงในรอบแรก

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-16 | "make veymour-athenaeum-thai-v2.html compatible with website-frontend folder, create new folder \"skeleton-mockup\" and split into _components, _mocks, or whatever needed" | all |
