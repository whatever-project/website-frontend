/** Mock data for the 4 main forums, their sub-forums and threads (ported from the wireframe's `forums` object). */

export type ForumKey = "kingdom" | "academy" | "under" | "archive"

export interface ForumSub {
  name: string
  en: string
  desc: string
  threadCount: number
}

export interface ForumThread {
  title: string
  author: string
  replies: number
  views: number
  lastPost: string
  /** badge before the title, "" when none */
  tag: string
}

export interface Forum {
  /** "01" … "04" */
  no: string
  name: string
  en: string
  desc: string
  meta: string
  subs: ForumSub[]
  threads: ForumThread[]
}

export const FORUM_KEYS: ForumKey[] = ["kingdom", "academy", "under", "archive"]

export const FORUMS: Record<ForumKey, Forum> = {
  kingdom: {
    no: "01",
    name: "อาณาจักรเวย์มัวร์",
    en: "THE KINGDOM",
    desc: "หัวใจของโลก — เมืองหลวงที่ปกคลุมด้วยหิมะตลอดปี ที่นี่เป็นทั้งบ้าน ตลาด และสนามรบทางการเมือง",
    meta: "กระทู้ 1,240 · สมาชิก 3,480 · อัปเดตล่าสุด 4 นาทีที่แล้ว",
    subs: [
      {
        name: "ย่านการค้า",
        en: "THE MARKETS",
        desc: "ตลาดจันทรา แผงของชำร่วย และการต่อรองที่ไม่มีใครยอมใคร",
        threadCount: 412
      },
      {
        name: "ถิ่นที่อยู่",
        en: "RESIDENCES",
        desc: "หมู่บ้านชานเมือง คฤหาสน์เก่า และห้องเช่าเหนือร้านช่างกุญแจ",
        threadCount: 238
      },
      {
        name: "ทำเนียบราชการ",
        en: "THE CIVIC HALL",
        desc: "คำสั่งศาล ตราประทับ และจดหมายราชการที่เปลี่ยนชะตาคนเป็นร้อย",
        threadCount: 196
      }
    ],
    threads: [
      {
        title: "ตลาดจันทราเปิดรับผู้เช่าแผง — ฤดูหิมะนี้",
        author: "อัครเสนาบดีเฟนน์",
        replies: 87,
        views: 1240,
        lastPost: "มิเรล · 2 นาทีที่แล้ว",
        tag: "ปักหมุด"
      },
      {
        title: "ขายบ้านหลังเก่าริมคลอง — ราคาต่อรองได้ (มีภูตติดบ้าน)",
        author: "คุณนายเฮเธอร์วิค",
        replies: 41,
        views: 803,
        lastPost: "ดอร์น · 16 นาทีที่แล้ว",
        tag: ""
      },
      {
        title: "คำสั่งศาลฉบับที่ 1127-09: เคอร์ฟิวย่านชานเมือง",
        author: "ทำเนียบราชการ",
        replies: 203,
        views: 3450,
        lastPost: "ผู้คุมหอ · 1 ชม.ที่แล้ว",
        tag: "ประกาศ"
      },
      {
        title: "รับจ้างส่งของข้ามเขต — จ่ายเป็นเงินหรือความลับ",
        author: "นักจดหมายกริฟฟอน",
        replies: 12,
        views: 210,
        lastPost: "เวน · 3 ชม.ที่แล้ว",
        tag: ""
      },
      {
        title: "บ้านพักตากอากาศใต้สะพานจันทรา — เปิดให้เยี่ยมชม",
        author: "โอเดตต์ ฟรอสต์",
        replies: 6,
        views: 98,
        lastPost: "— · เมื่อวาน",
        tag: ""
      }
    ]
  },
  academy: {
    no: "02",
    name: "สถาบันเวทมนตร์",
    en: "THE ACADEMY",
    desc: "หอคอยหกชั้นที่ครู่แรกมีเพียงชั้นเดียว — อีกห้าชั้นคือความรู้ที่ยังไม่มีผู้ใดเรียนรู้จบ",
    meta: "กระทู้ 860 · สมาชิก 2,150 · อัปเดตล่าสุด 12 นาทีที่แล้ว",
    subs: [
      {
        name: "หอคอยเรียนรู้",
        en: "THE TOWER",
        desc: "บทเรียนเวท คำถามในชั้นเรียน และงานเขียนที่อาจารย์ไม่เคยพอใจ",
        threadCount: 344
      },
      {
        name: "สนามฝึกเวท",
        en: "THE GROUNDS",
        desc: "ประลองเวท เก็บเลเวล และบันทึกสนามที่ไม่ควรลบออกจากความทรงจำ",
        threadCount: 287
      },
      {
        name: "ห้องสมุดต้องห้าม",
        en: "THE FORBIDDEN STACKS",
        desc: "เข้าได้เฉพาะผู้ผ่านคำสาบาน — หนังสือที่เลือกผู้อ่าน ไม่ใช่กลับกัน",
        threadCount: 112
      }
    ],
    threads: [
      {
        title: "สรุปข้อสอบใบอนุญาตคาถาป้องกันขั้นสาม (ฉบับรอด)",
        author: "เวน อัศวินกุญแจเก้า",
        replies: 156,
        views: 2890,
        lastPost: "มิเรล · 5 นาทีที่แล้ว",
        tag: "ปักหมุด"
      },
      {
        title: "ใครเห็นหนังสือเล่มนั้นบนชั้นสามบ้าง",
        author: "นิสิตปีสี่ที่ไม่ระบุชื่อ",
        replies: 64,
        views: 1310,
        lastPost: "ผู้คุมหอ · 40 นาทีที่แล้ว",
        tag: "ลึกลับ"
      },
      {
        title: "จับคู่ฝึกเวทธาตุน้ำ — รับสมัครผู้ไม่กลัวเปียก",
        author: "อาจารย์คอร์เวน",
        replies: 23,
        views: 412,
        lastPost: "ดอร์น · 2 ชม.ที่แล้ว",
        tag: ""
      },
      {
        title: "บันทึกสนามประลอง: ผมแพ้ให้นกฮูกของอาจารย์",
        author: "คาสเปียน รู",
        replies: 98,
        views: 1760,
        lastPost: "— · เมื่อวาน",
        tag: ""
      }
    ]
  },
  under: {
    no: "03",
    name: "ตรอกเงาใต้เมือง",
    en: "THE UNDERCROFT",
    desc: "สิ่งที่ตกลงไปใต้เวย์มัวร์ไม่ได้หายไป — มันแค่เปลี่ยนมือ ตรอกเงาไม่มีแสงแดด แต่มีทุกอย่างอื่น",
    meta: "กระทู้ 530 · สมาชิก 940 · อัปเดตล่าสุด 1 นาทีที่แล้ว",
    subs: [
      {
        name: "ตลาดมืด",
        en: "THE NIGHT MARKET",
        desc: "ของที่ไม่มีที่มา ในราคาที่ไม่มีการต่อรอง",
        threadCount: 201
      },
      {
        name: "โรงเตี๊ยมลับ",
        en: "THE HIDDEN TAVERN",
        desc: "ข่าวลือซื้อขายด้วยเหล้า และเงื่อนงำซื้อขายด้วยเงียบ",
        threadCount: 166
      },
      {
        name: "สมาคมลอบสังหรณ์",
        en: "THE WHISPER GUILD",
        desc: "รับจ้างทุกอย่าง ยกเว้นสิ่งที่คุณเพิ่งจะพูด",
        threadCount: 98
      }
    ],
    threads: [
      {
        title: "ซื้อแผนที่หอคอยฉบับจริง — รับประกันไม่มีกับดัก",
        author: "คนไร้ชื่อหน้าบ่อน้ำ",
        replies: 31,
        views: 520,
        lastPost: "— · 20 นาทีที่แล้ว",
        tag: "ระวัง"
      },
      {
        title: "รับจ้างนำทางลงใต้พิภพ — ต้องเคยได้ยินเสียงตราผ่านตัว",
        author: "พี่เลี้ยงตรอกเงา",
        replies: 47,
        views: 890,
        lastPost: "ดอร์น · 1 ชม.ที่แล้ว",
        tag: ""
      },
      {
        title: "โรงเตี๊ยมแมลงปีกทอง — คืนนี้มีดนตรีสด",
        author: "มาดามอิโตะ",
        replies: 74,
        views: 1450,
        lastPost: "มิเรล · 4 ชม.ที่แล้ว",
        tag: "งานเลี้ยง"
      }
    ]
  },
  archive: {
    no: "04",
    name: "จดหมายเหตุ",
    en: "THE ARCHIVE",
    desc: "ที่ซึ่งเรื่องราวทุกเรื่องถูกเก็บรักษา — ทั้งที่เขียนด้วยหมึก และที่เขียนด้วยเลือด",
    meta: "กระทู้ 1,860 · สมาชิก 4,020 · อัปเดตล่าสุด 30 นาทีที่แล้ว",
    subs: [
      {
        name: "ตำนานและประวัติศาสตร์",
        en: "LORE & HISTORY",
        desc: "ยุคก่อตั้ง สงครามระฆัง และความจริงที่สภาไม่อยากให้จดบันทึก",
        threadCount: 640
      },
      {
        name: "นิยายชุมชน",
        en: "COMMUNITY TALES",
        desc: "เรื่องเล่าที่ชุมชนร่วมกันแต่งต่อ บรรทัดละผู้เขียนคนละคน",
        threadCount: 512
      },
      {
        name: "โต๊ะร่ายแห่งความรู้",
        en: "THE SCRIPTORIUM",
        desc: "คู่มือกลไกเกม แบบฟอร์มตัวละคร และคำตัดสินของผู้คุมหอ",
        threadCount: 389
      }
    ],
    threads: [
      {
        title: "สรุปยุคก่อตั้งเวย์มัวร์ ฉบับอ่านจบในคืนเดียว",
        author: "ผู้คุมหอ",
        replies: 312,
        views: 5210,
        lastPost: "มิเรล · 28 นาทีที่แล้ว",
        tag: "ปักหมุด"
      },
      {
        title: "นิยายร่วมเขียน: จดหมายฉบับสุดท้ายจากวอร์ด VII — ต่อท่อนนี้",
        author: "ชุมชนนักประพันธ์",
        replies: 188,
        views: 3100,
        lastPost: "เวน · 1 ชม.ที่แล้ว",
        tag: "ร่วมเขียน"
      },
      {
        title: "คำตัดสินข้อพิพาท: ภูตผีนับเป็น NPC หรือผู้เล่น",
        author: "สภาเวทมนตร์",
        replies: 95,
        views: 1720,
        lastPost: "ผู้คุมหอ · 5 ชม.ที่แล้ว",
        tag: "กฎ"
      },
      {
        title: "แบบฟอร์มตัวละครฉบับปรับใหม่ ปี 1127 — ดาวน์โหลด",
        author: "โต๊ะร่ายแห่งความรู้",
        replies: 64,
        views: 1210,
        lastPost: "— · เมื่อวาน",
        tag: ""
      }
    ]
  }
}
