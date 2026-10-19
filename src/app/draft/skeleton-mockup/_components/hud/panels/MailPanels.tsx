"use client"

import { useSkeleton } from "../../SkeletonContext"
import PanelShell from "./PanelShell"

/** Private letters. Clicking one marks it as read (updates the HUD badge). */
export function LettersPanel() {
  const { letters, readLetter } = useSkeleton()
  const unread = letters.filter((l) => l.unread).length
  return (
    <PanelShell id="pm" title="จดหมายส่วนตัว" tag={<span className="tag">{unread} ฉบับที่ยังไม่ได้อ่าน</span>}>
      <div id="pmList">
        {letters.map((m, i) => (
          <button type="button" className="rowbtn" key={m.subject} onClick={() => readLetter(i)}>
            {m.unread ? <span className="dot" /> : <span style={{ width: 8, flex: "none" }} />}
            <span style={{ flex: 1 }}>
              <b style={{ fontWeight: 600 }}>{m.from}</b>
              <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{m.subject}</div>
            </span>
            <span style={{ fontSize: 11.5, color: "var(--faint)" }}>{m.time}</span>
          </button>
        ))}
      </div>
      <div style={{ marginTop: 8, fontSize: 12, color: "var(--muted)" }}>คลิกจดหมายเพื่อทำเครื่องหมายว่าอ่านแล้ว · ข้อมูลจำลอง</div>
    </PanelShell>
  )
}

/** Notifications from moderators and followed threads. Clicking one marks it as read. */
export function NotificationsPanel() {
  const { notifications, readNotification } = useSkeleton()
  return (
    <PanelShell id="notif" title="การแจ้งเตือน" tag={<span className="tag">2 จากผู้ดูแล · 3 จากที่ติดตาม</span>}>
      <div id="ntList">
        {notifications.map((n, i) => (
          <button type="button" className="rowbtn" key={n.text} onClick={() => readNotification(i)}>
            {n.unread ? <span className="dot" /> : <span style={{ width: 8, flex: "none" }} />}
            <span style={{ flex: 1 }}>{n.text}</span>
            <span className="tag">{n.kind}</span>
          </button>
        ))}
      </div>
    </PanelShell>
  )
}
