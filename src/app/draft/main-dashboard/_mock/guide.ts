/** Mock data for the fairy guide, lore library, chat room and character profile panels (from the wireframe's inline HTML). */

export interface FairyGuide {
  lead: string
  text: string
  note: string
}

export interface FairyQuest {
  text: string
  tag: string
  /** dark tag = main quest */
  main: boolean
}

export interface FairyDoneQuest {
  text: string
  year: string
}

export interface FairyNpc {
  name: string
  role: string
  tag: string
}

export interface FairyFriend {
  name: string
  status: string
}

export type FairyTabKey = "guide" | "active" | "done" | "npc" | "friends"

export const FAIRY_TABS: { key: FairyTabKey; label: string }[] = [
  { key: "guide", label: "คู่มือการเล่น" },
  { key: "active", label: "เควสที่กำลังทำ" },
  { key: "done", label: "เควสที่สำเร็จแล้ว" },
  { key: "npc", label: "สมุดบันทึก NPC" },
  { key: "friends", label: "รายชื่อเพื่อน" },
]

export const FAIRY_GUIDE: FairyGuide = {
  lead: "ยินดีที่รู้จัก นักจดหมาย",
  text: " ข้าคือปิ๊บ โพสต์ในฟอรั่มย่อยเพื่อเริ่มฉากใหม่ มองท้องฟ้าที่ HUD ให้ดี — อารมณ์ของเวย์มัวร์เปลี่ยนตามสภาพอากาศ และอย่าเซ็นสัญญาในตรอกชมพูโดยไม่อ่านหน้าสอง",
  note: "แท็บด้านบน: เควสที่กำลังทำ เควสที่ปิดจบ ทุกคนที่คุณเคยพบ และทุกคนที่พร้อมตอบจดหมายของคุณ",
}

export const FAIRY_ACTIVE: FairyQuest[] = [
  { text: "ร่วมที่ประชุมสภาเวลาพลบค่ำ", tag: "หลัก · 68%", main: true },
  { text: "ส่งเหรียญผู้พายเรือให้ครบ", tag: "เสริม · 40%", main: false },
  { text: "จับเสียงระริกใต้พิภพ", tag: "เสริม · 15%", main: false },
]

export const FAIRY_DONE: FairyDoneQuest[] = [
  { text: "เทียนเล่มหนึ่งถวายผู้พายเรือ", year: "ปี 1126" },
  { text: "ระฆังสามดัง โดยไร้ลม", year: "ปี 1126" },
]

export const FAIRY_NPCS: FairyNpc[] = [
  { name: "ผู้คุมหอ", role: "ผู้พิทักษ์แอตแลนเทียม", tag: "เคยพบ" },
  { name: "มาดามอิโตะ", role: "เจ้าของแมลงปีกทอง", tag: "เคยพบ" },
  { name: "บราเธอร์แอนสเซล", role: "ผู้พิทักษ์สุสานวอร์ด VII", tag: "เคยพบ" },
]

export const FAIRY_FRIENDS: FairyFriend[] = [
  { name: "เวน อัศวินกุญแจเก้า", status: "ออนไลน์ · สถาบันเวท" },
  { name: "มิเรล คิว", status: "ออนไลน์ · ย่านการค้า" },
  { name: "ดอร์น เอช", status: "ไม่อยู่" },
]

export type LoreKey = "seals" | "bells" | "alley"

export interface LoreEntry {
  title: string
  volume: string
  text: string
}

export const LORE: Record<LoreKey, LoreEntry> = {
  seals: {
    title: "ตราทั้งเจ็ด",
    volume: "เล่มที่ I",
    text: "ตราทั้งเจ็ดกั้นม่านหมอกไว้เหนือเวย์มัวร์ หกชิ้นสลักโดยผู้ก่อตั้ง ส่วนชิ้นที่เจ็ดมาปรากฏเอง ห้ามจดหมายเหตุเก็ง แต่ห้องเก็บของเต็มไปด้วยการเก็ง",
  },
  bells: {
    title: "ระฆังทั้งเก้าของเวย์มัวร์",
    volume: "เล่มที่ II",
    text: "เวย์มัวร์มีระฆังเก้าลูก แต่เคาะเพียงแปดลูก ว่าลูกไหนเงียบ ขึ้นอยู่กับว่าถามใคร — และการถามถือเป็นการเสียมารยาท",
  },
  alley: {
    title: "ตรอกชมพู — ประวัติศาสตร์ฝ่ายตรงข้าม",
    volume: "เล่มที่ III",
    text: "ตรอกชมพูได้ชื่อจากอุบัติเหตุสีย้อมปี 1091 และได้ชื่อเสียงจากทุกอย่างที่เกิดขึ้นหลังจากนั้น สัญญาที่เซ็นในตรอกนี้มีผลบังคับในเขตอำนาจสามแห่ง สองแห่งเป็นของคนเป็น",
  },
}

export interface ChatMessage {
  name: string
  time: string
  text: string
}

export const CHAT_SEED: ChatMessage[] = [
  { name: "มิเรล", time: "21:52", text: "แผ่นดินไหวทำหมึกหล่นใส่โต๊ะเลย มีใครเป็นเหมือนกันมั้ย" },
  { name: "ดอร์น", time: "21:53", text: "ได้ยินเสียงตราที่วอร์ด VII ดังระริกถึงสะพานจันทราเลย" },
  { name: "ผู้คุมหอ", time: "21:55", text: "ขอให้ทุกท่านสงบ ที่ประชุมสภาจะเปิดเวลาพลบค่ำ" },
]

export const PLAYER = {
  name: "เอเลียน วอส",
  title: "ผู้พิทักษ์คัมภีร์ลำดับสาม",
  circle: "วงแห่งจดหมายเงียบสงบ",
  level: 14,
  fame: "2,310",
  guild: "สภาเทียนไขว้",
  home: "หอจดหมายเหตุตะวันตก ห้อง 3B",
  joined: "เดือนหิมะ ปี 1125",
  tags: ["ความสำเร็จ 12", "กระทู้ 34", "คัมภีร์ 89"],
  kell: 1240,
  noteCost: 20,
}
