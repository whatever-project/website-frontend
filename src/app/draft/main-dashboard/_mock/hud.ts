/** Mock data for the HUD panels (letters, notifications, inventory, map, calendar events, fairy guide, lore). */

export interface Letter {
  from: string
  subject: string
  time: string
  unread: boolean
}

export interface Notification {
  text: string
  /** "ผู้ดูแล" | "ติดตาม" */
  kind: string
  unread: boolean
}

export interface Item {
  name: string
  type: string
  desc: string
  qty: number
}

export interface Location {
  name: string
  desc: string
}

export const LETTERS: Letter[] = [
  {
    from: "เวน อัศวินกุญแจเก้า",
    subject: "ที่ประชุมสภาเย็นนี้ — มาด้วยมั้ย?",
    time: "1 ชม.",
    unread: true
  },
  {
    from: "ผู้คุมหอ",
    subject: "คำร้องขอเข้าวอร์ด VII อนุมัติแล้ว",
    time: "3 ชม.",
    unread: true
  },
  {
    from: "มิเรล คิว",
    subject: "ตอบ: การต่อรองบนสะพานจันทรา",
    time: "เมื่อวานนี้",
    unread: true
  },
  {
    from: "อัครเสนาบดีเฟนน์",
    subject: "ใบแจ้งหนี้แผงเช่า ประจำเดือนหิมะ",
    time: "2 วัน",
    unread: false
  }
]

export const NOTIFICATIONS: Notification[] = [
  {
    text: "ผู้คุมหอ โพสต์ใน “อพยพวอร์ด VII”",
    kind: "ผู้ดูแล",
    unread: true
  },
  {
    text: "บำรุงรักษาระบบ: วันเสาร์ 02:00–04:00 น.",
    kind: "ผู้ดูแล",
    unread: true
  },
  {
    text: "มีตอบกลับใหม่ใน “การต่อรองบนสะพานจันทรา”",
    kind: "ติดตาม",
    unread: true
  },
  {
    text: "เหตุการณ์ “แผ่นดินไหว” มีอัปเดต",
    kind: "ติดตาม",
    unread: true
  },
  {
    text: "เวน กล่าวถึงคุณใน สถาบันเวทมนตร์",
    kind: "ติดตาม",
    unread: true
  }
]

/** 8 inventory slots, `null` = empty slot */
export const ITEMS: (Item | null)[] = [
  {
    name: "ปากกาอักขระม่านหมอก",
    type: "เครื่องมือ",
    desc: "เขียนได้เฉพาะความจริง — ลำบากใจในงานเลี้ยง",
    qty: 1
  },
  {
    name: "กุญแจเงินจันทรา",
    type: "กุญแจ",
    desc: "เข้ากับลูกบิดที่คุณยังไม่เจอ",
    qty: 1
  },
  {
    name: "น้ำยาเทียนไขว้",
    type: "ของใช้",
    desc: "ฟื้นสมาธิ รสชาติเหมือนไขปลาและความมุ่งมั่น",
    qty: 4
  },
  {
    name: "เหรียญผู้พายเรือ",
    type: "ของสะสม",
    desc: "ใช้ได้หนึ่งการข้ามฟาก อย่าใช้เบา ๆ",
    qty: 1
  },
  {
    name: "สมุดบัญชีเปล่า",
    type: "บันทึก",
    desc: "หน้ากระดาษจะนับตัวเองเมื่อไม่มีใครมอง",
    qty: 2
  },
  null,
  null,
  null
]

export const LOCATIONS: Record<string, Location> = {
  lowercity: {
    name: "เมืองชั้นล่าง",
    desc: "ปลดล็อกแล้ว — บ้านของบันไดตลาดและโรงเตี๊ยมพันหลัง"
  },
  bazaar: {
    name: "ตลาดใหญ่",
    desc: "ปลดล็อกแล้ว — แผงตลาดจันทราเปิดให้เช่าสัปดาห์นี้"
  },
  moonbridge: {
    name: "สะพานจันทรา",
    desc: "ปลดล็อกแล้ว — ค่าผ่านทาง: ความลับหนึ่งชิ้น จ่ายปลายทาง"
  },
  ward7: {
    name: "วอร์ด VII",
    desc: "ปิดผนึก — ต้นกำเนิดแผ่นดินไหว ที่ประชุมสภาอาจเปิดได้เวลาพลบค่ำ"
  },
  spire: {
    name: "ยอดหอคอย",
    desc: "ปิดผนึก — ไปได้เฉพาะหลังตราที่เจ็ดถูกเย็บกลับ"
  }
}

/** day of month → events (month: เดือนหิมะ 1127, "today" = 14) */
export const CAL_EVENTS: Record<number, string[]> = {
  5: [
    "วันเปิดตลาดจันทราฤดูหิมะ"
  ],
  14: [
    "ที่ประชุมสภาเวลาพลบค่ำ",
    "แผ่นดินไหวแห่งวอร์ด VII"
  ],
  17: [
    "งานเต้นรำใต้แสงจันทร์"
  ],
  21: [
    "ตลาดจันทราปิดฤดูกาล"
  ],
  25: [
    "ประลองเวทสนามเปิด"
  ],
  28: [
    "งานเลี้ยงปิดเดือนหิมะ"
  ]
}
