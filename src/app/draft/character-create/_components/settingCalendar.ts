// Ported from the Kimi reference app (src/lib/settingCalendar.ts). Pure helpers, no framework imports.
// Draft difference: month 4 Thai name is "ลูฮอร่า" (as in the design screenshots); Kimi's file had "ลูกโฮรา". See CONTEXT.md §9.
// ---------------------------------------------------------------------------
// Setting calendar (Arcane Vale world time)
//
// The setting clock runs faster than the real world: one setting YEAR lasts
// only 6 setting months (half a real year). Real-world dates map 1:1 for the
// day number; only the month is renamed:
//
//   Real Jan → Eiriel   Real Apr → Lughora
//   Real Feb → Beltael  Real May → Brumora
//   Real Mar → Heliel   Real Jun → Noctora
//   (then Jul starts Eiriel again — two setting years per real year)
//
// Seasons follow the wheel of the year, switching MID-MONTH per the
// official season-change table (real dates, applied 1:1 to setting months):
//
//   Ostara (Spring)  → 1 Eiriel – 15 Beltael    (1 JAN – 15 FEB / 1 JUL – 15 AUG)
//   Litha  (Summer)  → 16 Beltael – 31 Heliel   (16 FEB – 31 MAR / 16 AUG – 30 SEP)
//   Mabon  (Autumn)  → 1 Lughora – 15 Brumora   (1 APR – 15 MAY / 1 OCT – 15 NOV)
//   Yule   (Winter)  → 16 Brumora – 30 Noctora  (16 MAY – 30 JUN / 16 NOV – 31 DEC)
//
// NOTE: Setting "Year" numbering is not finalised by the lore team yet
// (Year ยังไม่คิด) — the epoch below is a placeholder and centralised here
// so it can be swapped in one place later.
// ---------------------------------------------------------------------------

export interface SettingMonth {
  key: string;
  en: string;
  th: string;
  num: number; // 1..6
}

export const SETTING_MONTHS: SettingMonth[] = [
  { key: 'eiriel', en: 'Eiriel', th: 'ไอริเอล', num: 1 },
  { key: 'beltael', en: 'Beltael', th: 'เบลทาเอล', num: 2 },
  { key: 'heliel', en: 'Heliel', th: 'เฮลิเอล', num: 3 },
  { key: 'lughora', en: 'Lughora', th: 'ลูฮอร่า', num: 4 },
  { key: 'brumora', en: 'Brumora', th: 'บรูมอรา', num: 5 },
  { key: 'noctora', en: 'Noctora', th: 'น็อกทอรา', num: 6 },
];

export const SETTING_SEASONS = [
  { key: 'ostara', en: 'Ostara', th: 'ออสตารา', desc: 'ฤดูใบไม้ผลิ' },
  { key: 'litha', en: 'Litha', th: 'ลิธา', desc: 'ฤดูร้อน' },
  { key: 'mabon', en: 'Mabon', th: 'มาบอน', desc: 'ฤดูใบไม้ร่วง' },
  { key: 'yule', en: 'Yule', th: 'ยูล', desc: 'ฤดูหนาว' },
] as const;

export type SettingSeasonKey = (typeof SETTING_SEASONS)[number]['key'];

/**
 * Season-change table (ตามรูปอ้างอิง "ตารางเปลี่ยนฤดูกาล").
 * firstHalf  = ครั้งปีแรก (real JAN–JUN ↔ setting Eiriel–Noctora)
 * secondHalf = ครั้งปีหลัง (real JUL–DEC — เดือนเซตติ้งวนกลับมาชื่อเดิม)
 */
export const SEASON_TRANSITIONS: {
  key: SettingSeasonKey;
  en: string; // real-world season name (Spring / Summer / …)
  firstHalf: string; // setting-date range, ครั้งปีแรก
  firstHalfReal: string; // real-date range, ครั้งปีแรก
  secondHalfReal: string; // real-date range, ครั้งปีหลัง
}[] = [
  { key: 'ostara', en: 'Spring', firstHalf: '1 Eiriel – 15 Beltael', firstHalfReal: '1 JAN – 15 FEB', secondHalfReal: '1 JUL – 15 AUG' },
  { key: 'litha', en: 'Summer', firstHalf: '16 Beltael – 31 Heliel', firstHalfReal: '16 FEB – 31 MAR', secondHalfReal: '16 AUG – 30 SEP' },
  { key: 'mabon', en: 'Autumn', firstHalf: '1 Lughora – 15 Brumora', firstHalfReal: '1 APR – 15 MAY', secondHalfReal: '1 OCT – 15 NOV' },
  { key: 'yule', en: 'Winter', firstHalf: '16 Brumora – 30 Noctora', firstHalfReal: '16 MAY – 30 JUN', secondHalfReal: '16 NOV – 31 DEC' },
];

/** season for a setting date — boundaries split mid-month per SEASON_TRANSITIONS */
export function seasonForDate(day: number, monthIdx: number): SettingSeasonKey {
  switch (monthIdx) {
    case 0: // Eiriel (Jan) — Ostara ทั้งเดือน
      return 'ostara';
    case 1: // Beltael (Feb) — Ostara ถึงวันที่ 15, แล้วเข้า Litha
      return day <= 15 ? 'ostara' : 'litha';
    case 2: // Heliel (Mar) — Litha ทั้งเดือน (ถึงวันที่ 31)
      return 'litha';
    case 3: // Lughora (Apr) — Mabon ทั้งเดือน
      return 'mabon';
    case 4: // Brumora (May) — Mabon ถึงวันที่ 15, แล้วเข้า Yule
      return day <= 15 ? 'mabon' : 'yule';
    default: // Noctora (Jun) — Yule ทั้งเดือน (ถึงวันที่ 30)
      return 'yule';
  }
}

export function seasonInfo(key: SettingSeasonKey) {
  return SETTING_SEASONS.find((s) => s.key === key)!;
}

export interface SettingDate {
  day: number; // 1..31 (follows the real-world day number)
  monthIdx: number; // 0..5 → SETTING_MONTHS
  year: number; // setting year
}

/**
 * Setting years are kept to AT MOST 3 digits (หลัก 3 ตามบรีฟ).
 * Anchor: real year 2026 ↔ setting year 340 (ปีปัจจุบันของเซตติ้ง),
 * with two setting years per real year. Birth years therefore compute
 * naturally from age: ปีเกิด = ปีปัจจุบันของเซตติ้ง − อายุ.
 */
export const CURRENT_SETTING_YEAR = 340;
export const ANCHOR_REAL_YEAR = 2026;

function clampSettingYear(y: number): number {
  return Math.min(999, Math.max(1, Math.round(y)));
}

/** real Date → setting date */
export function realToSetting(d: Date): SettingDate {
  const realYear = d.getFullYear();
  const realMonth = d.getMonth(); // 0..11
  const half = Math.floor(realMonth / 6); // 0 = Jan–Jun, 1 = Jul–Dec
  return {
    day: d.getDate(),
    monthIdx: realMonth % 6,
    year: clampSettingYear(CURRENT_SETTING_YEAR + (realYear - ANCHOR_REAL_YEAR) * 2 + half),
  };
}

/** setting date → real-world Date (best-effort; clamps day to the real month length) */
export function settingToReal(sd: SettingDate): Date {
  const cycles = sd.year - CURRENT_SETTING_YEAR; // may be negative
  const realYear = ANCHOR_REAL_YEAR + Math.floor(cycles / 2);
  const half = ((cycles % 2) + 2) % 2;
  const realMonth = half * 6 + sd.monthIdx;
  const clamped = new Date(ANCHOR_REAL_YEAR, sd.monthIdx + 1, 0).getDate();
  return new Date(realYear, realMonth, Math.min(sd.day, clamped));
}

/** setting date of "today" in the real world */
export function todaySetting(): SettingDate {
  return realToSetting(new Date());
}

/** setting year N setting-years ago from today (for the age field) */
export function birthYearFromAge(age: number): number {
  return clampSettingYear(todaySetting().year - age);
}

/** real-world length of the month backing a setting month (Eiriel=Jan … Noctora=Jun) */
export function settingMonthLength(monthIdx: number): number {
  return new Date(ANCHOR_REAL_YEAR, monthIdx + 1, 0).getDate();
}

/** months valid for a given season + birth day (ผลจากการเปลี่ยนฤดูกาลกลางเดือน) */
export function monthsForSeason(day: number, season: SettingSeasonKey): number[] {
  return SETTING_MONTHS.map((_, i) => i).filter(
    (i) => day <= settingMonthLength(i) && seasonForDate(day, i) === season,
  );
}

/** seasons that still have at least one valid month for the chosen day */
export function seasonsForDay(day: number): SettingSeasonKey[] {
  return SETTING_SEASONS.map((s) => s.key).filter((k) => monthsForSeason(day, k).length > 0);
}

const REAL_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatRealDate(d: Date): string {
  return `${d.getDate()} ${REAL_MONTHS_EN[d.getMonth()]} ${d.getFullYear()}`;
}

const REAL_MONTHS_SHORT = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

/** "18 OCT 1999" */
export function formatRealDateShort(d: Date): string {
  return `${d.getDate()} ${REAL_MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`;
}

/** "17 Eiriel 4052 · ฤดูใบไม้ผลิ (Ostara)" — ฤดูกาลคำนวณจาก วัน+เดือน ตามตารางเปลี่ยนฤดู */
export function formatSettingDate(sd: SettingDate): string {
  const m = SETTING_MONTHS[sd.monthIdx];
  const season = seasonInfo(seasonForDate(sd.day, sd.monthIdx));
  return `${sd.day} ${m.en} ${sd.year} · ${season.desc} (${season.en})`;
}

/** "18 LUG · Mabon 318" */
export function formatSettingDateShort(sd: SettingDate): string {
  const m = SETTING_MONTHS[sd.monthIdx];
  const season = seasonInfo(seasonForDate(sd.day, sd.monthIdx));
  return `${sd.day} ${m.en.slice(0, 3).toUpperCase()} · ${season.en} ${sd.year}`;
}

/** real date (yyyy-mm-dd input value) → setting date, or null when empty/invalid */
export function realInputToSetting(value: string): SettingDate | null {
  if (!value) return null;
  const d = new Date(`${value}T00:00:00`);
  if (Number.isNaN(d.getTime())) return null;
  return realToSetting(d);
}

/** weekday name for a real date (Thai) */
const WEEKDAYS_TH = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];

export function weekdayTh(d: Date): string {
  return WEEKDAYS_TH[d.getDay()];
}
