export const LOGIN_COPY = {
  formHeading: "ยินดีต้อนรับกลับ",
  identifier: "ชื่อผู้ใช้หรืออีเมล",
  identifierPlaceholder: "username หรือ you@example.com",
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
  sampleApiError: "Invalid credentials",
}

export type LoginState = "idle" | "loading" | "error" | "unverified" | "generic"

export const LOGIN_STATE_OPTIONS: { value: LoginState; label: string }[] = [
  { value: "idle", label: "ปกติ" },
  { value: "loading", label: "กำลังเข้าสู่ระบบ" },
  { value: "error", label: "รหัสผ่านไม่ถูกต้อง" },
  { value: "unverified", label: "ยังไม่ยืนยันอีเมล" },
  { value: "generic", label: "ข้อผิดพลาดทั่วไป" },
]
