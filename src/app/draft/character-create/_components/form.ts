import {
  birthYearFromAge,
  formatRealDateShort,
  formatSettingDateShort,
  realInputToSetting,
  settingToReal,
  todaySetting,
  type SettingSeasonKey,
} from "./settingCalendar"

export type NameFormat = "first-last" | "last-first"
export type BirthMode = "" | "real" | "setting"

export interface CustomTopic {
  label: string
  value: string
}

export interface CharacterForm {
  /** preset id from PHOTO_PRESETS ("" = not chosen yet) */
  photo: string
  firstNameEn: string
  lastNameEn: string
  nameTh: string
  nameFormat: NameFormat
  age: string
  birthMode: BirthMode
  /** yyyy-mm-dd, used when birthMode = "real" */
  realDate: string
  /** 0 = not chosen */
  settingDay: number
  settingSeason: "" | SettingSeasonKey
  /** index into SETTING_MONTHS, -1 = not chosen */
  settingMonth: number
  bloodlineType: string
  dominant: string
  beastRace: string
  nymphSpirit: string
  hairColor: string
  eyeColor: string
  skinColor: string
  scent: string
  height: string
  weight: string
  topics: CustomTopic[]
  appearanceNotes: string
  personality: string
  backstory: string
  tmi: string
}

export type FormPatch = Partial<CharacterForm>

export function defaultForm(): CharacterForm {
  return {
    photo: "",
    firstNameEn: "",
    lastNameEn: "",
    nameTh: "",
    nameFormat: "first-last",
    age: "",
    birthMode: "",
    realDate: "",
    settingDay: 0,
    settingSeason: "",
    settingMonth: -1,
    bloodlineType: "",
    dominant: "",
    beastRace: "",
    nymphSpirit: "",
    hairColor: "",
    eyeColor: "",
    skinColor: "",
    scent: "",
    height: "",
    weight: "",
    topics: [],
    appearanceNotes: "",
    personality: "",
    backstory: "",
    tmi: "",
  }
}

/** Example values from the design screenshots (Karen Mason). Used only by the draft-only "Preview" bar. */
export const SAMPLE_FORM: CharacterForm = {
  ...defaultForm(),
  photo: "avatar-3",
  firstNameEn: "Karen",
  lastNameEn: "Mason",
  nameTh: "คาเรน เมสัน",
  age: "27",
  birthMode: "setting",
  settingDay: 18,
  settingSeason: "mabon",
  settingMonth: 3,
  bloodlineType: "pure",
  dominant: "halfbeast",
  beastRace: "terra",
  hairColor: "แพลตินัมบลอนด์",
  eyeColor: "เฮเซลนัท",
  skinColor: "ขาว",
  scent: "กลิ่นสบู่",
  height: "159",
  weight: "45",
  topics: [
    { label: "ไผ่", value: "ไผ่ที่เก่า" },
    { label: "MBTI", value: "INFJ" },
  ],
  appearanceNotes: "",
  personality: "",
  // placeholder only — the real text is the player's; needed so step 5 validates in the preview
  backstory: "[ข้อความตัวอย่างสำหรับดูหน้าจอเท่านั้น]",
  tmi: "",
}

/** Merge a (possibly old / corrupted) stored value onto the defaults. */
export function sanitizeForm(raw: unknown): CharacterForm {
  if (!raw || typeof raw !== "object") return defaultForm()
  return { ...defaultForm(), ...(raw as Partial<CharacterForm>) }
}

/** Display name in the format the user picked. "" when nothing is entered yet. */
export function getDisplayName(form: CharacterForm): string {
  const first = form.firstNameEn.trim()
  const last = form.lastNameEn.trim()
  return form.nameFormat === "first-last" ? `${first} ${last}`.trim() : `${last} ${first}`.trim()
}

/* ------------------------------------------------------------------ */
/* name validation (ported from the Kimi reference app)                */
/* ------------------------------------------------------------------ */

export interface NameCheck {
  /** English: letters + space only / Thai: Thai letters + space only */
  lang: boolean
  /** first letter of each word capitalised (English only) */
  capital: boolean
  /** no digits / special characters */
  noSpecial: boolean
  message: string | null
}

export function checkEnglishName(v: string): NameCheck {
  if (!v) return { lang: false, capital: false, noSpecial: false, message: null }
  const lang = /^[A-Za-z ]+$/.test(v)
  const capital = /^[A-Z][a-z]*(\s[A-Z][a-z]*)*$/.test(v)
  let message: string | null = null
  if (!lang) message = "✕ ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษและช่องว่าง (space) เท่านั้น ห้ามมีตัวเลขหรืออักขระพิเศษ"
  else if (!capital) message = "✕ ตัวอักษรตัวแรกของชื่อ/นามสกุลต้องเป็นตัวพิมพ์ใหญ่ (Capital Letter) เช่น Karen Mason"
  return { lang, capital, noSpecial: lang, message }
}

export function checkThaiName(v: string): NameCheck {
  if (!v) return { lang: false, capital: false, noSpecial: false, message: null }
  const lang = /^[ก-๙ ]+$/.test(v)
  const message = lang ? null : "✕ ใช้ได้เฉพาะตัวอักษรภาษาไทยและช่องว่าง (space) เท่านั้น"
  return { lang, capital: lang, noSpecial: lang, message }
}

/* ------------------------------------------------------------------ */
/* birthdate (shared by StepIdentity and StepReview)                    */
/* ------------------------------------------------------------------ */

export interface BirthInfo {
  /** "18 OCT 1999", or null while incomplete */
  realLine: string | null
  /** "18 LUG · Mabon 313", or null while incomplete */
  settingLine: string | null
  complete: boolean
}

export function getBirthInfo(form: CharacterForm): BirthInfo {
  const ageNum = /^\d+$/.test(form.age) ? parseInt(form.age, 10) : null
  const birthYear = ageNum !== null ? birthYearFromAge(ageNum) : todaySetting().year

  if (form.birthMode === "real") {
    const setting = realInputToSetting(form.realDate)
    if (!setting) return { realLine: null, settingLine: null, complete: false }
    return {
      realLine: formatRealDateShort(new Date(`${form.realDate}T00:00:00`)),
      settingLine: formatSettingDateShort(setting),
      complete: true,
    }
  }

  if (form.birthMode === "setting" && form.settingDay > 0 && form.settingSeason !== "" && form.settingMonth >= 0) {
    const sd = { day: form.settingDay, monthIdx: form.settingMonth, year: birthYear }
    return {
      realLine: formatRealDateShort(settingToReal(sd)),
      settingLine: formatSettingDateShort(sd),
      complete: true,
    }
  }

  return { realLine: null, settingLine: null, complete: false }
}

/* ------------------------------------------------------------------ */
/* per-step validation → drives the disabled "ถัดไป" and the ✕ hint     */
/* ------------------------------------------------------------------ */

export interface StepCheck {
  valid: boolean
  /** first thing that is missing, shown as "✕ …" (null when valid) */
  hint: string | null
}

export function validateIdentity(form: CharacterForm): StepCheck {
  const first = checkEnglishName(form.firstNameEn)
  const last = checkEnglishName(form.lastNameEn)
  const thai = checkThaiName(form.nameTh)
  const namesValid =
    form.firstNameEn !== "" &&
    form.lastNameEn !== "" &&
    form.nameTh !== "" &&
    !first.message &&
    !last.message &&
    !thai.message
  const birth = getBirthInfo(form)
  const needsBeast = form.dominant === "halfbeast"
  const needsNymph = form.dominant === "nymph"

  if (!namesValid) return { valid: false, hint: "กรุณากรอกชื่อ นามสกุล และวิธีอ่านภาษาไทยให้ครบถ้วนและถูกต้อง" }
  if (!birth.complete)
    return { valid: false, hint: form.birthMode === "" ? "กรุณาเลือกรูปแบบวันเกิด" : "กรุณาระบุวันเกิดให้ครบถ้วน" }
  if (form.bloodlineType === "") return { valid: false, hint: "กรุณาเลือกประเภทสายเลือด" }
  if (form.dominant === "") return { valid: false, hint: "กรุณาเลือกสายเลือดเด่น" }
  if (needsBeast && form.beastRace === "") return { valid: false, hint: "กรุณาเลือกสายพันธุ์ของฮาล์ฟบีสต์" }
  if (needsNymph && form.nymphSpirit === "") return { valid: false, hint: "กรุณาเลือกจิตวิญญาณของนิมฟ์" }
  return { valid: true, hint: null }
}

export function validateAppearance(form: CharacterForm): StepCheck {
  if ([form.hairColor, form.eyeColor, form.skinColor].some((v) => v.trim() === ""))
    return { valid: false, hint: "กรุณากรอกสีผม สีตา และสีผิว" }
  if (form.height.trim() === "" || form.weight.trim() === "")
    return { valid: false, hint: "กรุณากรอกส่วนสูงและน้ำหนัก (ตัวเลขเท่านั้น)" }
  return { valid: true, hint: null }
}

export function validateBackstory(form: CharacterForm): StepCheck {
  return form.backstory.trim() === ""
    ? { valid: false, hint: "กรุณากรอกประวัติตัวละคร" }
    : { valid: true, hint: null }
}
