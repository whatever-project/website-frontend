export const LOGIN_COPY = {
  formHeading: "ยินดีต้อนรับกลับ",
  identifier: "ชื่อผู้ใช้หรืออีเมล",
  identifierPlaceholder: "username หรือ you@example.com",
  password: "รหัสผ่าน",
  passwordPlaceholder: "••••••••••",
  rememberMe: "จดจำฉัน",
  forgotPassword: "ลืมรหัสผ่าน?",
  submit: "ยืนยัน",
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

/** English copy, used only by the redesigned ("UI ใหม่") variant when the landing page language is English.
 *  The original login UI always uses LOGIN_COPY (Thai), exactly as before. */
export const LOGIN_COPY_EN: typeof LOGIN_COPY = {
  formHeading: "Welcome Back",
  identifier: "Username or email",
  identifierPlaceholder: "username or you@example.com",
  password: "Password",
  passwordPlaceholder: "••••••••••",
  rememberMe: "Remember me",
  forgotPassword: "Forgot password?",
  submit: "LOG IN",
  submitting: "LOGGING IN…",
  noAccount: "Don't have an account?",
  createOne: "Create one",
  errorUnverified: "Your email is not verified yet. Please check your inbox before logging in.",
  errorGeneric: "Something went wrong. Please try again.",
  backToSignup: "Back to sign up →",
  sampleApiError: "Invalid credentials",
}

export const LOGIN_COPY_BY_LANG = { th: LOGIN_COPY, en: LOGIN_COPY_EN } as const

/** Draft-only: which login UI the preview panel shows. "classic" is the original and the default. */
export type LoginUiVariant = "classic" | "new"

export const LOGIN_UI_OPTIONS: { value: LoginUiVariant; label: string }[] = [
  { value: "classic", label: "UI เดิม" },
  { value: "new", label: "UI ใหม่" },
]
