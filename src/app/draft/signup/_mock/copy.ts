/** Thai copy for the signup draft (mirrors the live page's copy). */
export const COPY = {
  pageTitle: "สมัครสมาชิก",
  pageSubStep1: "— การลงทะเบียน ✦ ขั้นตอนที่ 1 จาก 2 —",
  pageSubStep2: "— การลงทะเบียน ✦ ขั้นตอนที่ 2 จาก 2 —",
  pageSubStep3: "— ยืนยันอีเมล —",
  stepTerms: "ข้อกำหนด",
  stepAccountInfo: "ข้อมูลบัญชี",
  termsHeading: "ข้อกำหนดและเงื่อนไข",
  iAgree: "ฉันได้อ่านและยอมรับข้อกำหนดและเงื่อนไขแล้ว",
  iAgreeRequired: "(จำเป็น)",
  next: "ถัดไป",
  formHeading: "ทะเบียนนักเดินทาง",
  username: "ชื่อผู้ใช้",
  email: "อีเมล",
  emailPlaceholder: "wanderer@example.com",
  password: "รหัสผ่าน",
  passwordPlaceholder: "••••••••••",
  submit: "สร้างบัญชี",
  submitting: "กำลังสร้างบัญชี…",
  alreadyHaveAccount: "มีบัญชีอยู่แล้ว?",
  signIn: "เข้าสู่ระบบ",
  verifyHeading: "ยืนยันอีเมลของคุณ",
  verifyBody: "สร้างบัญชีแล้ว! กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ",
  verifyLetterSent: "ส่งจดหมายยืนยันไปที่",
  alreadyVerified: "ยืนยันแล้ว?",
  usernameRequirements: "ข้อกำหนดชื่อผู้ใช้",
  usernameRules: ["3–25 ตัวอักษร", "ตัวอักษรภาษาอังกฤษ (A–Z), ตัวเลข (0–9) และ _ . -", "ห้ามมีช่องว่าง"],
  passwordRequirements: "ข้อกำหนดรหัสผ่าน",
  passRules: ["อย่างน้อย 8 ตัวอักษร", "มีตัวเลขอย่างน้อยหนึ่งตัว", "มีทั้งตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก"],
  usernameErr: {
    spaces: "ชื่อผู้ใช้ต้องไม่มีช่องว่าง",
    length: "ชื่อผู้ใช้ต้องมี 3–25 ตัวอักษร",
    chars: "ใช้ได้เฉพาะ A–Z, 0–9 และ _ . - เท่านั้น",
  },
  emailErrFormat: "กรุณากรอกอีเมลให้ถูกต้อง",
  /** Sample server error, shown by the "error" preview toggle on step 2. */
  sampleError: "Something went wrong. Please try again.",
}

export const TERMS = [
  "สมาชิกต้องมีอายุ 13 ปีขึ้นไปและรับผิดชอบบัญชีของตนเอง",
  "เคารพผู้เล่นทุกคน — ห้ามคุกคาม กลั่นแกล้ง หรือใช้ภาษาที่ไม่เหมาะสมทั้งในและนอกตัวละคร (IC/OOC)",
  "การโรลเพลย์ต้องไม่ละเมิดลิขสิทธิ์และต้องอยู่ในโลกเวทมนตร์ของชุมชน",
  "ห้ามทำ Metagaming, Godmoding และ Powerplaying โดยเด็ดขาด",
  "ชุมชนนี้เป็นพื้นที่สร้างสรรค์ — ห้ามเนื้อหาทางเพศหรือความรุนแรงที่ชัดเจน",
  "ให้ทีมผู้ดูแลระบบและผู้ดำเนินการตัดสินข้อพิพาท — การตัดสินของพวกเขาเป็นที่สิ้นสุด",
  "การละเมิดกฎอาจส่งผลให้ถูกระงับหรือยกเลิกบัญชีโดยไม่ต้องแจ้งล่วงหน้า",
]

export const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII"]

/** Email shown on the step-3 screen when the form wasn't filled in (preview only). */
export const SAMPLE_EMAIL = "wanderer@example.com"
