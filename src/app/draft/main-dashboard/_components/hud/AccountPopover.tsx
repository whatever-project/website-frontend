"use client"

import { useSkeleton } from "../SkeletonContext"

/** Small account menu above the HUD (opened from the person icon). All entries except "profile" are placeholders. */
export default function AccountPopover() {
  const { accountOpen, open } = useSkeleton()
  return (
    <div className={`pop${accountOpen ? " on" : ""}`} id="popAccount">
      <div style={{ fontWeight: 600, marginBottom: 8 }}>บัญชีผู้ใช้</div>
      <button type="button" className="rowbtn" onClick={() => open("profile")}>
        โปรไฟล์ตัวละคร
      </button>
      <button type="button" className="rowbtn">
        ตั้งค่า — การแสดงผลและตราสัญลักษณ์
      </button>
      <button type="button" className="rowbtn">
        ค่ายคุ้มครองความเป็นส่วนตัว
      </button>
      <button type="button" className="rowbtn" style={{ border: "1px solid var(--ink)", marginTop: 6, justifyContent: "center" }}>
        ออกจากระบบ
      </button>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>จำลองเท่านั้น — ไม่มีระบบบัญชีจริง</div>
    </div>
  )
}
