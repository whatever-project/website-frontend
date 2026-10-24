/** Thai copy for the login draft (mirrors the live page's copy). */
export const COPY = {
  pageTitle: "เข้าสู่ระบบ",
  pageSub: "— ประตูสู่หุบเขา —",
  formHeading: "จดหมายเชิญกลับหมู่บ้าน",
  identifier: "ชื่อผู้ใช้หรืออีเมล",
  identifierPlaceholder: "ผู้เดินทาง หรือ you@example.com",
  password: "รหัสผ่าน",
  passwordPlaceholder: "••••••••••",
  rememberMe: "จดจำฉัน",
  forgotPassword: "ลืมรหัสผ่าน?",
  submit: "เข้าสู่ระบบ",
  submitting: "กำลังเข้าสู่ระบบ…",
  noAccount: "ยังไม่มีบัญชี?",
  createOne: "สร้างบัญชีใหม่",
  errorUnverified: "อีเมลของคุณยังไม่ได้รับการยืนยัน กรุณาตรวจสอบกล่องจดหมายก่อนเข้าสู่ระบบ",
  errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  backToSignup: "กลับไปสมัครสมาชิก →",
  /** Sample server message (live page shows the API's message as-is), used in the "error" preview state. */
  sampleApiError: "Invalid credentials",
}

export type LoginState = "idle" | "loading" | "error" | "unverified" | "generic"

export const STATE_OPTIONS: { value: LoginState; label: string }[] = [
  { value: "idle", label: "ปกติ" },
  { value: "loading", label: "กำลังเข้าสู่ระบบ" },
  { value: "error", label: "รหัสผ่านไม่ถูกต้อง" },
  { value: "unverified", label: "ยังไม่ยืนยันอีเมล" },
  { value: "generic", label: "ข้อผิดพลาดทั่วไป" },
]
