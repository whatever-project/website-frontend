"use client"

import PanelShell from "./PanelShell"
import Placeholder from "../../Placeholder"
import { PLAYER } from "../../../_mock/guide"

/** Character profile card (opened from the avatar or the account menu). */
export default function ProfilePanel() {
  const rows: [string, string][] = [
    ["เลเวล", String(PLAYER.level)],
    ["ชื่อเสียง", PLAYER.fame],
    ["กิลด์", PLAYER.guild],
    ["ที่พัก", PLAYER.home],
    ["เข้าร่วม", PLAYER.joined],
  ]
  return (
    <PanelShell id="profile" title="โปรไฟล์ตัวละคร">
      <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
        <Placeholder style={{ width: 130, height: 160 }} tag="[ภาพเหมือน]" />
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{PLAYER.name}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10 }}>
            {PLAYER.title} · {PLAYER.circle}
          </div>
          <div style={{ fontSize: 12.5, display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 14px" }}>
            {rows.map(([k, v]) => (
              <span key={k} style={{ display: "contents" }}>
                <span>{k}</span>
                <span>{v}</span>
              </span>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", gap: 6, flexWrap: "wrap" }}>
            {PLAYER.tags.map((t, i) => (
              <span className={`tag${i === 0 ? " solid" : ""}`} key={t}>
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </PanelShell>
  )
}
