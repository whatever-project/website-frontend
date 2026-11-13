/** Thai copy for the landing draft. */
export const COPY = {
  whatever: "Whatever",
  welcome: "ยินดีต้อนรับ",
  title: "นักเดินทาง",
  subtitle: "ดินแดนแห่งเวทมนตร์รอคอยการมาถึงของคุณ",
  logIn: "เข้าสู่ระบบ",
  signUp: "สมัครสมาชิก",
  // `time` is the device clock as HH:MM (24 h), filled in by the page.
  realTime: (time: string) => `แสดงภาพตามเวลาปัจจุบัน ${time} น.`,
  timeLabel: "ปรับเวลาในวัน",
};

/**
 * "14:07" -> "02:07 PM", "20:07" -> "08:07 PM", "00:05" -> "12:05 AM", "12:00" -> "12:00 PM" (hour always two digits). Anything that is not H:MM (e.g. the empty string the page
 * uses before its first client tick) is returned unchanged. Formatted by hand because toLocaleTimeString puts a narrow no-break
 * space before AM/PM in newer ICU versions and differs between runtimes.
 */
function to12Hour(time24: string): string {
  const match = /^(\d{1,2}):(\d{2})$/.exec(time24);
  if (!match) return time24;
  const hour = Number(match[1]);
  return `${String(hour % 12 || 12).padStart(2, "0")}:${match[2]} ${hour < 12 ? "AM" : "PM"}`;
}

/** English copy for the draft's language toggle (landing page only; login popup stays Thai). */
export const COPY_EN: typeof COPY = {
  whatever: "Whatever",
  welcome: "Welcome",
  title: "Wayfarer",
  subtitle: "A land of magic awaits your arrival",
  logIn: "Log in",
  signUp: "Sign up",
  // Translation of the Thai "แสดงภาพตามเวลาปัจจุบัน {time} น."; `time` arrives as HH:MM (24 h) and is shown as 12 h with AM/PM.
  realTime: (time: string) =>
    `Real Time ${to12Hour(time)}`.trimEnd(),
  timeLabel: "Adjust time of day",
};

export type DraftLang = "th" | "en";

export const COPY_BY_LANG: Record<DraftLang, typeof COPY> = {
  th: COPY,
  en: COPY_EN,
};
