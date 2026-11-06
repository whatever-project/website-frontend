/** Thai copy for the forgot-password draft (mirrors the live page's copy). */
export const COPY = {
  pageTitle: "ลืมรหัสผ่าน",
  pageSub: "— รีเซ็ตตราประทับของคุณ —",
  heading: "รีเซ็ตรหัสผ่าน",
  body: "กรอกอีเมลของคุณและเราจะส่งลิงก์รีเซ็ตหากมีบัญชีอยู่",
  emailLabel: "อีเมล",
  emailPlaceholder: "you@example.com",
  submit: "ส่งลิงก์รีเซ็ต",
  submitting: "กำลังส่ง…",
  successHeading: "ตรวจสอบกล่องจดหมาย",
  successBody: "หากมีบัญชีที่ใช้อีเมลนั้น ลิงก์รีเซ็ตรหัสผ่านได้ถูกส่งแล้ว ลิงก์หมดอายุภายใน 30 นาที",
  backToSignIn: "↩ กลับไปเข้าสู่ระบบ",
  /** Sample server error, shown in the "error" preview state. */
  sampleError: "Something went wrong",
}

export type ForgotState = "idle" | "loading" | "error" | "success"

export const STATE_OPTIONS: { value: ForgotState; label: string }[] = [
  { value: "idle", label: "ปกติ (กรอกอีเมล)" },
  { value: "loading", label: "กำลังส่ง" },
  { value: "error", label: "เกิดข้อผิดพลาด" },
  { value: "success", label: "ส่งสำเร็จ" },
]

/** English copy for the draft's language toggle (mirrors messages/en/forgot-password.json). */
export const COPY_EN: typeof COPY = {
  pageTitle: "Forgot Password",
  pageSub: "— Reset Your Seal —",
  heading: "Reset Your Password",
  body: "Enter your email and we'll send a reset link if an account exists.",
  emailLabel: "Email Address",
  emailPlaceholder: "you@example.com",
  submit: "Send Reset Link",
  submitting: "Sending…",
  successHeading: "Check Your Inbox",
  successBody: "If an account with that email exists, a password reset link has been sent. The link expires in 30 minutes.",
  backToSignIn: "↩ Back to Sign In",
  sampleError: "Something went wrong",
}

export const COPY_BY_LANG = { th: COPY, en: COPY_EN } as const
