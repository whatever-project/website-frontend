<!--
Written by Kimi's /design-request interview. Designers normally don't fill this in by hand;
they answer Kimi's questions and Kimi saves the answers here.
Keep answers in the designer's words. Don't add anything the designer didn't say.
-->
---
page: character-create
route_group: public
route_path: /character-create
status: designing
created: 2026-10-15
updated: 2026-10-16
round: 4
---

# Design request: หน้าสร้างตัวละคร (Arcane Vale)

## 1. Basics
- **Purpose (one sentence):** หน้าสร้างตัวละครใหม่ของ Arcane Vale แบบกรอกทีละขั้น 6 ขั้น แล้วส่งคำขอเพื่อรออนุมัติ
- **Who sees this page:** guest (คนทั่วไป ไม่ต้องล็อกอิน)
- **Page type:** new page (revision round 3 of the existing draft; not live yet)
- **Replaces or extends an existing page?** none

## 2. Attached files
| File | What it is | How to use it |
|---|---|---|
| `public/test/IMG_5909.jpg` | screenshot | ขั้น 3 ข้อมูลประจำตัว (ส่วนบน): รูปโปรไฟล์, ชื่อ–นามสกุลอังกฤษ, ชื่อไทย, รูปแบบการแสดงชื่อ |
| `public/test/IMG_5910.jpg` | screenshot | ขั้น 3 (ส่วนล่าง): วันเกิด 2 ระบบ (สากล / ในเซตติ้ง), ประเภทสายเลือด, สายเลือดเด่น, สายพันธุ์, ปุ่มย้อนกลับ/ถัดไป |
| `public/test/IMG_5911.jpg` | screenshot | ขั้น 4 ลักษณะภายนอกและอุปนิสัย (ส่วนบน): สีผม/สีตา/สีผิว/กลิ่น/ส่วนสูง/น้ำหนัก, หัวข้อเพิ่มเติม (ไผ่, MBTI) |
| `public/test/IMG_5912.jpg` | screenshot | ขั้น 4 (ส่วนล่าง): ช่องเขียนลักษณะภายนอก + อุปนิสัย (ไม่บังคับ) |
| `public/test/IMG_5913.jpg` | screenshot | ขั้น 5 ประวัติตัวละคร + แผงคำแนะนำด้านขวา (information panel) |
| `public/test/IMG_5914.jpg` | screenshot | ขั้น 6 ตรวจสอบข้อมูลตัวละคร (ส่วนบน): สรุปชื่อ, วันเกิด, สายเลือด, ลักษณะ |
| `public/test/IMG_5915.jpg` | screenshot | ขั้น 6 (ส่วนล่าง): ประวัติ, ลักษณะภายนอก, อุปนิสัย, TMI, ปุ่มยืนยันการสร้างตัวละคร |
| `public/test/IMG_5916.jpg` | screenshot | หน้าสุดท้าย "ส่งคำขอแล้ว" ตราครั่งแดง รออนุมัติ 3 วัน ปุ่มกลับสู่หมู่บ้าน |
| `Kimi_Agent_K3_ Create Character/app/src/pages/characterCreate/` (`CharacterCreate.tsx`, `guideContent.ts`, `InfoScroll.tsx`) + `src/lib/settingCalendar.ts` + `public/assets/avatar-3..8.png` | reference implementation from Kimi (Vite/React). The folder `charcreate/app/` next to it is an identical copy (all 109 files match). | ข้อความจริงของขั้น 1–2 และคำแนะนำในแผงข้อมูล, สูตรปฏิทินเซตติ้ง, กฎตรวจชื่อ, ลำดับเลือกสายเลือด, รูปประจำตัวให้เลือก 8 รูป |

## 2b. Changes requested (revision rounds only; otherwise "n/a")
Round 3 — the designer asked to fill the missing information in this draft by referring to the Kimi version ("fill in the missing info in draft/character-create by referring to the kimi version").
| # | Where on the page | What changes | Attachment / text source |
|---|---|---|---|
| 1 | ขั้น 1 | ข้อตกลงและกฎแห่งหุบเขา (ติ๊กยอมรับก่อนไปต่อ) แทนที่ [TBD] | Kimi reference |
| 2 | ขั้น 2 | เนื้อเรื่องย่อแห่งจักรวาล แทนที่ [TBD] | Kimi reference |
| 3 | ขั้น 3 วันเกิด | เลือกวันเกิดได้ทั้งแบบสากล (เลือกวันที่) และแบบเซตติ้ง (วัน → ฤดู → เดือน) พร้อมแสดงวันเกิดทั้ง 2 แบบ, อายุใช้คำนวณปีเกิดในเซตติ้ง | Kimi reference |
| 4 | ขั้น 3 สายเลือด | สายเลือดเด่น "ฮาล์ฟบีสต์" ต้องเลือกสายพันธุ์ (4), "นิมฟ์" ต้องเลือกจิตวิญญาณ (3), "มนุษย์/ผู้วิเศษ" ไม่ต้องเลือกเพิ่ม | Kimi reference |
| 5 | ขั้น 3 ชื่อ | ตรวจรูปแบบชื่อ (อังกฤษ: ตัวอักษร+เว้นวรรค ขึ้นต้นด้วยตัวพิมพ์ใหญ่ / ไทย: ตัวอักษรไทย+เว้นวรรค) พร้อมรายการติ๊กถูก/ผิด | Kimi reference |
| 6 | ขั้น 3 รูปโปรไฟล์ | เลือกจากรูปที่เตรียมไว้ 8 รูป (แทนการเลือกไฟล์จากเครื่อง) | Kimi reference |
| 7 | ทุกขั้น | ปุ่มถัดไปกดไม่ได้จนกรอกครบ พร้อมข้อความ "✕ กรุณา…" บอกสิ่งที่ยังขาด (ขั้น 3, 4, 5) | Kimi reference |
| 8 | แผงข้อมูลด้านขวา | เปิดได้จากปุ่ม "รายละเอียด" 3 หัวข้อ (ระบบวันที่ / ข้อมูลสายเลือด / คำแนะนำประวัติ + แท็บ Story Intro), ปุ่มขยายเต็มจอใช้ได้ | Kimi reference |
| 9 | ทั้งหน้า | บันทึกอัตโนมัติในเครื่อง (ปิดแล้วกลับมาข้อมูลยังอยู่), ส่งคำขอแล้วจึงล้าง; ฟอร์มเริ่มต้นว่าง + แถบ "Preview (draft only)" สำหรับดูตัวอย่าง | Kimi reference |

Round 4 — the designer asked: "modify รูปแบบการแสดงชื่อ section in character-create to follow exactly from the Kimi_Agent_K3_ Create Character folder".
| # | Where on the page | What changes | Attachment / text source |
|---|---|---|---|
| 1 | ขั้น 3 — รูปแบบการแสดงชื่อ | กล่องเส้นประเต็มความกว้างใต้รูปโปรไฟล์/ช่องชื่อ: ช่องติ๊กสี่เหลี่ยม 2 ช่อง (Firstname Lastname / Lastname Firstname) เลือกได้ทีละช่อง และตัวอย่างชื่อทางขวา — แทนที่แบบรูปดาว ✦ ของรอบ 2 | Kimi reference (`IdentityStep`) |

## 3. Content, top to bottom
| # | Section | What it shows | What the user can do | Text source |
|---|---|---|---|---|
| 1 | แถบขั้นตอน | วงกลมเลข 1–6 บอกขั้นปัจจุบัน | ดูความคืบหน้า | attachment |
| 2 | ขั้น 1 ข้อตกลงและกฎแห่งหุบเขา | ภาพรวม, กฎข้อที่ I–IV, แนวทางการสร้างตัวละคร, ช่องติ๊กยอมรับ | อ่าน, ติ๊กยอมรับ | Kimi reference |
| 3 | ขั้น 2 เนื้อเรื่องย่อแห่งจักรวาล | กำเนิดจักรวาลมัลติเวิร์ส, เดอะริฟท์, มิติของ Arcane Vale, ท่านคือใคร | อ่าน | Kimi reference |
| 4 | ขั้น 3 ข้อมูลประจำตัว | รูปโปรไฟล์, ชื่อ–นามสกุล (อังกฤษ/ไทย), รูปแบบการแสดงชื่อ (ช่องติ๊กสี่เหลี่ยม 2 ช่อง ตามเวอร์ชัน Kimi), วันเกิด (สากล/เซตติ้ง), ประเภทสายเลือด, สายเลือดเด่น, สายพันธุ์/จิตวิญญาณ | กรอก/เลือกข้อมูล, เลือกรูป | attachment + Kimi reference |
| 5 | ขั้น 4 ลักษณะภายนอกและอุปนิสัย | สีผม สีตา สีผิว กลิ่นประจำตัว ส่วนสูง น้ำหนัก, หัวข้อเพิ่มเติมแบบกำหนดเอง, ช่องเขียนลักษณะภายนอก/อุปนิสัย (ไม่บังคับ) | กรอก, เพิ่ม/ลบหัวข้อเอง | attachment + Kimi reference |
| 6 | ขั้น 5 ประวัติตัวละคร | ช่องเขียนเรื่องราว, คำแนะนำการเขียน, ข้อมูลเพิ่มเติม (TMI), แผงคำแนะนำเปิดทางขวา | เขียนเรื่องราว, เปิด/ปิดแผงคำแนะนำ | attachment + Kimi reference |
| 7 | ขั้น 6 ตรวจสอบข้อมูล | สรุปทุกอย่างที่กรอก | ตรวจสอบ, กดยืนยัน | attachment |
| 8 | หน้าส่งคำขอแล้ว | ตราครั่งแดง, ชื่อตัวละคร, ข้อความรออนุมัติภายใน 3 วัน | กดกลับสู่หมู่บ้าน → หน้าแรก | attachment |

## 4. Data on the page
| Data item | Example value | Comes from | Changes? |
|---|---|---|---|
| ข้อมูลตัวละครทั้งหมด (ชื่อ, วันเกิด, สายเลือด, ลักษณะ, ประวัติ ฯลฯ) | Karen Mason / คาเรน เมสัน, 18 LUG · Mabon | ผู้ใช้กรอก (ตอนนี้บันทึกในเครื่องเท่านั้น) | yes |
| ปฏิทินในเซตติ้ง (เดือน Eiriel–Noctora, ฤดู Ostara/Litha/Mabon/Yule เปลี่ยนกลางเดือน) | Mabon (มาบอน), Lughora (ลูฮอร่า) | fixed text (เซตติ้งเกม) | no |
| ปีเกิดในเซตติ้ง | คำนวณจากอายุ (ปีปัจจุบันของเซตติ้งตั้งไว้ชั่วคราว) | คำนวณ | yes |
| ตัวเลือกสายเลือด/สายพันธุ์/จิตวิญญาณ | มนุษย์ ผู้วิเศษ ฮาล์ฟบีสต์ นิมฟ์ / ชาวเทอร์ร่า ชาวเอเวียน ชาวอควา ชาวเรพเทียล / ดรายแอด ไนแอด ออรา | fixed text | no |
| ข้อความ "บันทึกอัตโนมัติแล้ว · เวลา" | บันทึกอัตโนมัติแล้ว · 10:57:12 | เวลาที่บันทึกในเครื่อง | yes |

## 5. States and behaviour
- **Empty state:** ฟอร์มเริ่มต้นว่าง
- **Loading:** ไม่มีในดราฟต์
- **Error:** ข้อความ "✕ กรุณา…" ใต้ปุ่มถัดไปเมื่อกรอกไม่ครบ; ข้อความผิดรูปแบบใต้ช่องชื่อ [TBD: ข้อความเตือนของช่องอื่น ๆ นอกจากที่ Kimi กำหนด]
- **Success:** หน้า "ส่งคำขอเรียบร้อยแล้ว" รออนุมัติภายใน 3 วัน
- **Validation messages:** ชื่อ/นามสกุลอังกฤษ, ชื่อไทย, วันเกิด, สายเลือด, สีผม/ตา/ผิว, ส่วนสูง/น้ำหนัก, ประวัติ (ตาม Kimi reference)
- **Buttons / actions:** ย้อนกลับ → ขั้นก่อนหน้า; ถัดไป → ขั้นถัดไป (กดไม่ได้จนกรอกครบ); ยืนยันการสร้างตัวละคร → หน้าส่งคำขอแล้ว; กลับสู่หมู่บ้าน → หน้าแรก; เลือกรูปภาพโปรไฟล์ → หน้าต่างเลือกรูป; เพิ่มหัวข้อเอง (ขั้น 4); รายละเอียด → แผงคำแนะนำ
- **Modals / confirmations:** หน้าต่างเลือกรูปโปรไฟล์; แผงคำแนะนำเป็นแผงข้าง ไม่ใช่ป๊อปอัป

## 6. Look and feel
- **Closest existing page:** login / dashboard (ธีมกระดาษ parchment เดียวกัน)
- **Elements that don't exist yet:** วงกลมบอกขั้นตอน 1–6, แผงคำแนะนำสไลด์ทางขวา, ปุ่มเลือกแบบชิป (สายเลือด/สายพันธุ์), หน้าต่างเลือกรูปโปรไฟล์
- **Screen priority:** both (ต้องไม่แตกบนจอแคบ)
- **Images / illustrations:** วงกลมรูปโปรไฟล์ (เลือกจาก 8 รูป), ตราครั่งแดงตอนสำเร็จ

## 7. Open questions
- [x] ขั้นที่ 1 และ 2 หน้าตาเป็นยังไง → ตาม Kimi reference (รอบ 3)
- [x] ระบบปฏิทินในเซตติ้ง (เดือน/ฤดู) → ตาม Kimi reference (รอบ 3)
- [ ] ระบบ "ปี" ของเซตติ้งยังเป็นตัวเลขชั่วคราว (ปีปัจจุบัน = 340 อ้างอิงปี 2026) — ทีมลอร์ยังไม่สรุป
- [ ] ข้อความเตือน (validation) ของช่องอื่น ๆ นอกจากที่ Kimi กำหนด
- [ ] ยืนยันการสะกด: "ลูฮอร่า" (ภาพตัวอย่าง) หรือ "ลูกโฮรา" (Kimi); "ชาวเทอร์ร่า" หรือ "ชาวเทอร่า"
- [ ] รูปประจำตัวให้เลือกจาก 8 รูปที่เตรียมไว้ ใช่หรือไม่ (หรืออัปโหลดเอง)

## Iteration history
| Round | Date | Designer said | Sections changed |
|---|---|---|---|
| 1 | 2026-10-15 | initial request | all |
| 2 | 2026-10-15 | "แก้ไขตรงรูปแบบการแสดงชื่อ ช่องติ๊กควรเป็นรูปดาว เหมือนตรงหัวข้อวันเกิด แล้วก็มีสีพื้นหลังเวลาติ๊กด้วย" | ขั้น 3 — รูปแบบการแสดงชื่อ |
| 3 | 2026-10-16 | "fill in the missing info in draft/character-create by referring to the kimi version" (Kimi_Agent_K3_ Create Character) | ขั้น 1–2, ขั้น 3 (ชื่อ, วันเกิด, สายเลือด, รูป), ขั้น 4–5 (ตรวจกรอกครบ), แผงข้อมูล, บันทึกอัตโนมัติ |
| 4 | 2026-10-16 | "modify รูปแบบการแสดงชื่อ section in character-create to follow exactly from the Kimi_Agent_K3_ Create Character folder" | ขั้น 3 — รูปแบบการแสดงชื่อ (ย้อนรอบ 2) |
