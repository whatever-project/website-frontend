/** Thai copy for the landing draft. */
export const COPY = {
  arcaneVale: "Whatever",
  welcome: "ยินดีต้อนรับ",
  title: "นักเดินทาง",
  subtitle: "ดินแดนแห่งเวทมนตร์รอคอยการมาถึงของคุณ",
  logIn: "เข้าสู่ระบบ",
  signUp: "สมัครสมาชิก",
  realTime: "● เวลาจริง",
  realTimeOff: "○ เวลาจริง",
  timeLabel: "ปรับเวลาในวัน",
}

/** English copy for the draft's language toggle (landing page only; login popup stays Thai). */
export const COPY_EN: typeof COPY = {
  arcaneVale: "Whatever",
  welcome: "Welcome",
  title: "Wayfarer",
  subtitle: "A land of magic awaits your arrival",
  logIn: "Log in",
  signUp: "Sign up",
  realTime: "● Real time",
  realTimeOff: "○ Real time",
  timeLabel: "Adjust time of day",
}

export type DraftLang = "th" | "en"

export const COPY_BY_LANG: Record<DraftLang, typeof COPY> = { th: COPY, en: COPY_EN }
