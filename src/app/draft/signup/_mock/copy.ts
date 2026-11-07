/** Thai copy for the signup draft (mirrors the live page's copy). */
export const COPY = {
  pageTitle: "สมัครสมาชิก",
  stepTerms: "ข้อกำหนด",
  stepAccountInfo: "ลงทะเบียน",
  termsHeading: "ข้อกำหนดและเงื่อนไข",
  iAgree: "ฉันได้อ่านและยอมรับข้อกำหนดและเงื่อนไขแล้ว",
  iAgreeRequired: "(จำเป็น)",
  scrollToAccept: "เลื่อนอ่านข้อกำหนดให้ถึงข้อสุดท้ายก่อน จึงจะกดยอมรับได้",
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
  usernameRules: ["3 – 25 ตัวอักษร", "ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ (A–Z) และตัวเลข (0–9)", "ห้ามมีช่องว่างและอักขระพิเศษอื่น ๆ"],
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

/** English copy for the draft's language toggle (mirrors messages/en/signup.json; terms translate the Thai draft terms above). */
export const COPY_EN: typeof COPY = {
  pageTitle: "Sign Up",
  stepTerms: "Terms",
  stepAccountInfo: "Registry",
  termsHeading: "Terms & Conditions",
  iAgree: "I have read and agree to the Terms & Conditions",
  iAgreeRequired: "(Required)",
  scrollToAccept: "Scroll to the last term to enable the checkbox.",
  next: "Next",
  formHeading: "Wayfarer Registry",
  username: "Username",
  email: "Email Address",
  emailPlaceholder: "wanderer@example.com",
  password: "Password",
  passwordPlaceholder: "••••••••••",
  submit: "Create Account",
  submitting: "Creating account…",
  alreadyHaveAccount: "Already have an account?",
  signIn: "Sign in",
  verifyHeading: "Verify Your Email",
  verifyBody: "Account created! Please verify your email before signing in.",
  verifyLetterSent: "A verification letter was sent to",
  alreadyVerified: "Already verified?",
  usernameRequirements: "Username Requirements",
  usernameRules: ["3 – 25 characters", "Only English letters (A–Z) and digits (0–9) are allowed", "No spaces or other special characters"],
  passwordRequirements: "Password Requirements",
  passRules: ["At least 8 characters", "At least one number", "Both uppercase and lowercase letters"],
  usernameErr: {
    spaces: "Username must not contain spaces",
    length: "Username must be 3–25 characters",
    chars: "Only A–Z, 0–9 and _ . - are allowed",
  },
  emailErrFormat: "Please enter a valid email address",
  sampleError: "Something went wrong. Please try again.",
}

export const TERMS_EN: typeof TERMS = [
  "Members must be 13 years or older and are responsible for their own accounts.",
  "Respect all players — no harassment, bullying, or inappropriate language in or out of character (IC/OOC).",
  "Roleplay must not infringe on copyrights and must stay within the community's magical world.",
  "Metagaming, Godmoding, and Powerplaying are strictly prohibited.",
  "This is a creative community — no explicit sexual or violent content.",
  "The moderation and operations team settles disputes — their decision is final.",
  "Violations may result in account suspension or termination without prior notice.",
]

export const COPY_BY_LANG = { th: COPY, en: COPY_EN } as const
export const TERMS_BY_LANG = { th: TERMS, en: TERMS_EN } as const
