/** Mock data for the home view (patch notes, posts, orbit categories, honour roll, members, patrons, notice board, roles). */

export interface Patch {
  version: string
  title: string
  category: string
  date: string
  body: string
}

export interface Post {
  title: string
  author: string
  forum: string
  /** "6 นาที" — shown as "<age>ที่แล้ว" */
  age: string
  replies: number
  views: number
}

export interface OrbitPost {
  title: string
  time: string
}

export interface HonorEntry {
  name: string
  quest: string
  when: string
}

export interface Citizen {
  name: string
  role: string
  place: string
  joined: string
}

export interface Patron {
  name: string
  since: string
}

export interface BoardPost {
  title: string
  poster: string
  tag: string
}

export interface Role {
  name: string
  members: number
  online: number
}

export const PATCHES: Patch[] = [
  {
    version: "3.2.1",
    title: "ความเงียบแห่งใต้พิภพ",
    category: "ระบบ",
    date: "14 ต.ค.",
    body: "ใต้พิภพบังคับใช้ช่วงเวลาเงียบสงบ 22:00–06:00 ตามเวลาโลก ค่ายกันเสียงถูกปรับใหม่เพื่อให้ฉากที่เริ่มก่อนเคอร์ฟิวดำเนินต่อได้โดยไม่สะดุด"
  },
  {
    version: "3.2.0",
    title: "ปรับสมดุล: การผูกพันวิญญาณคู่",
    category: "สมดุล",
    date: "9 ต.ค.",
    body: "การผูกพันวิญญาณคู่คำนวณจากความยาวฉาก แทนจำนวนโพสต์ — ฉากยาวให้ +2 แต้มต่อบท และสแปมไม่ได้อะไรเลย"
  },
  {
    version: "3.1.9",
    title: "ตลาดจันทรากลับมาเปิด",
    category: "อีเวนต์",
    date: "4 ต.ค.",
    body: "ตลาดจันทราเปิดทุกวันจันทร์ถึงวันเสาร์ ตลอดเดือนหิมะนี้ สมัครเช่าแผงได้ที่ทำเนียบราชการในอาณาจักร"
  },
  {
    version: "3.1.8",
    title: "แก้ปัญหาพอร์ทัลคลาดเคลื่อนในปีกตะวันตก",
    category: "แก้บั๊ก",
    date: "1 ต.ค.",
    body: "แก้ไขกรณีพอร์ทัลส่งผู้อ่านไปยังกระทู้ปีที่ผิด (ขออภัยผู้ที่ไปร่วมงานเลี้ยงในปี 1099 โดยไม่ได้ตั้งใจ)"
  }
]

export const POSTS: Post[] = [
  {
    title: "การต่อรองบนสะพานจันทรา",
    author: "มิเรล คิว",
    forum: "ย่านการค้า",
    age: "6 นาที",
    replies: 14,
    views: 312
  },
  {
    title: "อพยพวอร์ด VII — กระทู้เช็กชื่อผู้รอด",
    author: "ผู้คุมหอ",
    forum: "ทำเนียบราชการ",
    age: "22 นาที",
    replies: 87,
    views: 1240
  },
  {
    title: "ดอกเบี้ยเงินฝากแข็งตัว คิดยังไง",
    author: "ดอร์น เอช",
    forum: "ย่านการค้า",
    age: "1 ชม.",
    replies: 6,
    views: 98
  },
  {
    title: "เสียงระริกใต้พิภพตอบกลับ — บันทึกสนาม",
    author: "เอเลียน วอส",
    forum: "ใต้พิภพ",
    age: "2 ชม.",
    replies: 31,
    views: 455
  },
  {
    title: "รับสมัครผู้ร่วมฉากที่ประชุมสภาเวลาพลบค่ำ",
    author: "เวน อัศวินกุญแจเก้า",
    forum: "สถาบันเวทมนตร์",
    age: "4 ชม.",
    replies: 9,
    views: 210
  },
  {
    title: "สรุปยุคก่อตั้งเวย์มัวร์ ฉบับอ่านจบในคืนเดียว",
    author: "ผู้คุมหอ",
    forum: "จดหมายเหตุ",
    age: "28 นาที",
    replies: 312,
    views: 5210
  },
  {
    title: "คำสั่งศาลฉบับที่ 1127-09: เคอร์ฟิวย่านชานเมือง",
    author: "ทำเนียบราชการ",
    forum: "ทำเนียบราชการ",
    age: "3 ชม.",
    replies: 203,
    views: 3450
  },
  {
    title: "สรุปข้อสอบใบอนุญาตคาถาป้องกันขั้นสาม (ฉบับรอด)",
    author: "เวน อัศวินกุญแจเก้า",
    forum: "สถาบันเวทมนตร์",
    age: "5 ชม.",
    replies: 156,
    views: 2890
  },
  {
    title: "นิยายร่วมเขียน: จดหมายฉบับสุดท้ายจากวอร์ด VII",
    author: "ชุมชนนักประพันธ์",
    forum: "จดหมายเหตุ",
    age: "6 ชม.",
    replies: 188,
    views: 3100
  },
  {
    title: "โรงเตี๊ยมแมลงปีกทอง — คืนนี้มีดนตรีสด",
    author: "มาดามอิโตะ",
    forum: "ตรอกเงา",
    age: "7 ชม.",
    replies: 74,
    views: 1450
  }
]

export const ORBIT_CATS = [
  "UX/UI",
  "Lore & Story",
  "Bloodkin",
  "System",
  "Quest",
  "Events",
  "Balance"
]

/** category → latest posts shown under the orbit diagram */
export const ORBIT_DATA: Record<string, OrbitPost[]> = {
  "UX/UI": [
    {
      title: "ปรับเมนูตั้งค่าใหม่ทั้งหมด",
      time: "2 ชม."
    },
    {
      title: "ธีมกลางคืนของห้องสนทนา",
      time: "5 ชม."
    },
    {
      title: "ทางลัดคีย์บอร์ดบนกระดานประกาศ",
      time: "เมื่อวาน"
    }
  ],
  "Lore & Story": [
    {
      title: "ตำนานตราที่เจ็ด ฉบับเต็ม",
      time: "28 นาที"
    },
    {
      title: "จดหมายฉบับสุดท้ายจากวอร์ด VII",
      time: "1 ชม."
    },
    {
      title: "สายเลือดแห่งผู้พิทักษ์คัมภีร์",
      time: "3 ชม."
    }
  ],
  Bloodkin: [
    {
      title: "สายเลือดบริสุทธิ์ยังคงแข็งแกร่งไหม",
      time: "40 นาที"
    },
    {
      title: "รายชื่อสายเลือดที่หายไปในสงครามระฆัง",
      time: "2 ชม."
    },
    {
      title: "ลูกผสมม่านหมอก: กฎใหม่",
      time: "เมื่อวาน"
    }
  ],
  System: [
    {
      title: "ความเงียบแห่งใต้พิภพ — คู่มือเคอร์ฟิว",
      time: "14 ต.ค."
    },
    {
      title: "พอร์ทัลคลาดเคลื่อน สรุปสาเหตุ",
      time: "1 ต.ค."
    },
    {
      title: "ค่ายกันเสียงทำงานอย่างไร",
      time: "3 วัน"
    }
  ],
  Quest: [
    {
      title: "ตราที่เจ็ด: บทที่ 12 “พลบค่ำ”",
      time: "20 นาที"
    },
    {
      title: "ส่งเหรียญผู้พายเรือ — เช็กลิสต์",
      time: "4 ชม."
    },
    {
      title: "เควสลับสนามฝึกเวทเปิดแล้ว",
      time: "1 วัน"
    }
  ],
  Events: [
    {
      title: "ตลาดจันทราสัปดาห์สุดท้าย",
      time: "6 ชม."
    },
    {
      title: "งานเต้นรำใต้แสงจันทร์ — รายชื่อคู่",
      time: "1 วัน"
    },
    {
      title: "ล่าสมบัติใต้พิภพ (จำกัดเวลา)",
      time: "2 วัน"
    }
  ],
  Balance: [
    {
      title: "ปรับสมดุลคาถาป้องกันขั้นสาม",
      time: "9 ต.ค."
    },
    {
      title: "วิญญาณคู่: จากโพสต์เป็นฉาก",
      time: "8 ต.ค."
    },
    {
      title: "แพตช์โน้ตย้อนหลังทั้งหมด",
      time: "รายสัปดาห์"
    }
  ]
}

export const HONOR: HonorEntry[] = [
  {
    name: "เวน อัศวินกุญแจเก้า",
    quest: "ความเงียบของระฆังทั้งเก้า",
    when: "2 ชม.ที่แล้ว"
  },
  {
    name: "ดอร์น ฮัลโลเวย์",
    quest: "สามบัญชี คำโกหกเดียว",
    when: "5 ชม.ที่แล้ว"
  },
  {
    name: "มิเรล คิว",
    quest: "เทียนเล่มหนึ่งถวายผู้พายเรือ",
    when: "เมื่อวานนี้"
  },
  {
    name: "บราเธอร์แอนสเซล",
    quest: "สิ่งที่หลับอยู่ใต้วอร์ด VII",
    when: "2 วันที่แล้ว"
  }
]

export const CITIZENS: Citizen[] = [
  {
    name: "อิโซลด์ เวน",
    role: "ผู้ถักตำนาน",
    place: "เมืองชั้นล่าง",
    joined: "8 ก.ค."
  },
  {
    name: "คาสเปียน รู",
    role: "ผู้เคาะระฆัง",
    place: "สถาบันเวท",
    joined: "8 ก.ค."
  },
  {
    name: "โอเดตต์ ฟรอสต์",
    role: "ช่างวาดแผนที่",
    place: "สะพานจันทรา",
    joined: "7 ก.ค."
  },
  {
    name: "ไซลัส เกรย์",
    role: "ผู้พิทักษ์สุสาน",
    place: "ตรอกเงา",
    joined: "6 ก.ค."
  },
  {
    name: "ลูเซีย มาร์ช",
    role: "นักเล่นนิทาน",
    place: "ย่านการค้า",
    joined: "5 ก.ค."
  }
]

export const PATRONS: Patron[] = [
  {
    name: "ตระกูลอาร์เจนติ",
    since: "PATRON SINCE 1123"
  },
  {
    name: "สภาเทียนไขว้",
    since: "PATRON SINCE 1124"
  },
  {
    name: "มอธ แอนด์ มิร์เรอร์",
    since: "PATRON SINCE 1125"
  },
  {
    name: "ไปรษณีย์กริฟฟอนเวย์มัวร์",
    since: "PATRON SINCE 1126"
  },
  {
    name: "โรงกลั่นยาราตรี",
    since: "PATRON SINCE 1127"
  }
]

/** Detail for the 3 notes that open a panel (static notes point at one by index). */
export const BOARDS: BoardPost[] = [
  {
    title: "เช่าแผงเทียน ตลาดจันทรา",
    poster: "อัครเสนาบดีเฟนน์",
    tag: "การค้า"
  },
  {
    title: "สอนอักขระม่านหมอก — ระฆังแรกฟรี",
    poster: "แม่ชีคอร์เวน",
    tag: "การสอน"
  },
  {
    title: "แมลงปีกทอง รับนักดนตรี",
    poster: "มาดามอิโตะ",
    tag: "กิลด์"
  }
]

export const ROLES: Role[] = [
  {
    name: "Wate Spirits",
    members: 2318,
    online: 21
  },
  {
    name: "Avera",
    members: 1846,
    online: 17
  },
  {
    name: "Ever",
    members: 3102,
    online: 15
  },
  {
    name: "Wanderer",
    members: 2954,
    online: 16
  },
  {
    name: "Daevarn",
    members: 2260,
    online: 10
  }
]

/** pixel slots where a player's new note is pinned on the board (cycles) */
export const NOTE_SLOTS: { l: number; t: number }[] = [
  {
    l: 36,
    t: 336
  },
  {
    l: 256,
    t: 336
  },
  {
    l: 476,
    t: 336
  },
  {
    l: 696,
    t: 336
  },
  {
    l: 916,
    t: 336
  }
]
