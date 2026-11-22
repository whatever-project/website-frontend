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
  errorUnverified: "อีเมลของคุณยังไม่ได้รับการยืนยัน กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ",
  errorGeneric: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง",
  enterCode: "กรอกรหัสยืนยัน",
  // Thai for the API's "Invalid credentials" (the English copy below keeps the English text).
  sampleApiError: "ข้อมูลเข้าสู่ระบบไม่ถูกต้อง",
}

export type LoginState = "idle" | "loading" | "error" | "unverified" | "generic"

export const LOGIN_STATE_OPTIONS: { value: LoginState; label: string }[] = [
  { value: "idle", label: "ปกติ" },
  { value: "loading", label: "กำลังเข้าสู่ระบบ" },
  { value: "error", label: "รหัสผ่านไม่ถูกต้อง" },
  { value: "unverified", label: "ยังไม่ยืนยันอีเมล" },
  { value: "generic", label: "ข้อผิดพลาดทั่วไป" },
]

/** English copy, used when the login dialog language is English. Thai (LOGIN_COPY) is the original copy. */
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
  errorUnverified: "Your email has not been verified yet. Please verify your email before signing in.",
  errorGeneric: "Something went wrong. Please try again.",
  enterCode: "Enter verification code",
  sampleApiError: "Invalid credentials",
}

export const LOGIN_COPY_BY_LANG = { th: LOGIN_COPY, en: LOGIN_COPY_EN } as const
