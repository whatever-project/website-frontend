/** Thai copy for the reset-password draft (mirrors the live page's copy). */
export const COPY = {
  pageTitle: "รีเซ็ตรหัสผ่าน",
  pageSub: "— ยึดตราประทับคืน —",
  heading: "ตั้งรหัสผ่านใหม่",
  hint: "เลือกรหัสผ่านที่แข็งแกร่ง (อย่างน้อย 8 ตัวอักษร)",
  passwordLabel: "รหัสผ่านใหม่",
  passwordPlaceholder: "อย่างน้อย 8 ตัวอักษร",
  submit: "รีเซ็ตรหัสผ่าน",
  submitting: "กำลังรีเซ็ต…",
  successHeading: "รีเซ็ตรหัสผ่านแล้ว!",
  successBody: "เซสชันทั้งหมดถูกออกจากระบบแล้ว กำลังนำไปยังหน้าเข้าสู่ระบบ…",
  invalidToken: "โทเค็นรีเซ็ตไม่ถูกต้องหรือไม่มีอยู่",
  requestNewLink: "ขอลิงก์ใหม่ →",
  /** Sample server error, shown in the "error" preview state. */
  sampleError: "Reset failed",
}

export type ResetState = "noToken" | "form" | "loading" | "error" | "success"

export const STATE_OPTIONS: { value: ResetState; label: string }[] = [
  { value: "form", label: "ฟอร์มตั้งรหัสผ่านใหม่" },
  { value: "loading", label: "กำลังรีเซ็ต" },
  { value: "error", label: "เกิดข้อผิดพลาด" },
  { value: "success", label: "สำเร็จ" },
  { value: "noToken", label: "ลิงก์ไม่ถูกต้อง" },
]
