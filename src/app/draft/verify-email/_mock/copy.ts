/**
 * Thai copy for the merged verify-email / verify-email-change draft (mirrors the live pages' copy).
 * Live site has two routes: /verify-email (after signup) and /verify-email-change (after changing email in account settings).
 */
export type VerifyKind = "signup" | "change"
export type VerifyState = "loading" | "success" | "errorNoToken" | "errorServer"

export const COPY: Record<
  VerifyKind,
  {
    pageTitle: string
    pageSub: string
    loading: string
    successHeading: string
    errorHeading: string
    noToken: string
    /** Label of the button on success. */
    successCta: string
    /** Label of the button on error. */
    errorCta: string
  }
> = {
  signup: {
    pageTitle: "ยืนยันอีเมล",
    pageSub: "— ผนึกสัญญา —",
    loading: "กำลังยืนยันอีเมลของคุณ…",
    successHeading: "ยืนยันอีเมลแล้ว!",
    errorHeading: "การยืนยันล้มเหลว",
    noToken: "ไม่มีโทเค็นยืนยัน",
    successCta: "เข้าสู่ระบบ",
    errorCta: "กลับไปสมัครสมาชิก",
  },
  change: {
    pageTitle: "ยืนยันการเปลี่ยนอีเมล",
    pageSub: "— อัปเดตตราประทับของคุณ —",
    loading: "กำลังยืนยันอีเมลใหม่ของคุณ…",
    successHeading: "อัปเดตอีเมลแล้ว!",
    errorHeading: "การยืนยันล้มเหลว",
    noToken: "ไม่มีโทเค็นยืนยัน",
    successCta: "กลับไปตั้งค่าบัญชี",
    errorCta: "กลับไปตั้งค่าบัญชี",
  },
}

/** The live pages show the server's message as-is on success / on API errors; wording is not in the repo. */
export const SERVER_SUCCESS_MESSAGE = "[TBD: ข้อความตอบกลับจากเซิร์ฟเวอร์เมื่อยืนยันสำเร็จ]"
export const SERVER_ERROR_MESSAGE = "[TBD: ข้อความข้อผิดพลาดจากเซิร์ฟเวอร์ เช่น โทเค็นหมดอายุ]"

export const KIND_OPTIONS: { value: VerifyKind; label: string }[] = [
  { value: "signup", label: "ยืนยันอีเมลหลังสมัคร" },
  { value: "change", label: "ยืนยันการเปลี่ยนอีเมล" },
]

export const STATE_OPTIONS: { value: VerifyState; label: string }[] = [
  { value: "loading", label: "กำลังยืนยัน" },
  { value: "success", label: "สำเร็จ" },
  { value: "errorNoToken", label: "ไม่มีโทเค็น" },
  { value: "errorServer", label: "ข้อผิดพลาดจากเซิร์ฟเวอร์" },
]
