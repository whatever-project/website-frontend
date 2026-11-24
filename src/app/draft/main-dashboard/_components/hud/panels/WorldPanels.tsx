"use client"

import { useState, type ReactNode } from "react"
import PanelShell from "./PanelShell"
import Placeholder from "../../Placeholder"
import { LORE, type LoreKey } from "../../../_mock/guide"
import { CAL_EVENTS, LOCATIONS } from "../../../_mock/hud"

const MAP_TAGS: { key: string; label: string; left: string; top: string; locked?: boolean }[] = [
  { key: "lowercity", label: "เมืองชั้นล่าง", left: "22%", top: "30%" },
  { key: "bazaar", label: "ตลาดใหญ่", left: "45%", top: "55%" },
  { key: "moonbridge", label: "สะพานจันทรา", left: "70%", top: "25%" },
  { key: "ward7", label: "วอร์ด VII · ปิดผนึก", left: "32%", top: "74%", locked: true },
  { key: "spire", label: "ยอดหอคอย · ปิดผนึก", left: "80%", top: "70%", locked: true },
]

/** World map with 5 pins; picking one shows its description. */
export function MapPanel() {
  const [sel, setSel] = useState<string | null>(null)
  const loc = sel ? LOCATIONS[sel] : null
  return (
    <PanelShell id="map" title="แผนที่โลก — เวย์มัวร์และแดนม่านหมอก">
      <div style={{ position: "relative" }}>
        <Placeholder style={{ height: 320 }} tag="[แผนที่โลก — ลายเส้นแบบวาดมือ]" />
        {MAP_TAGS.map((t) => (
          <button
            type="button"
            key={t.key}
            className={`maptag${t.locked ? " lock" : ""}${sel === t.key ? " sel" : ""}`}
            style={{ left: t.left, top: t.top }}
            onClick={() => setSel(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div id="locInfo" style={{ marginTop: 12, border: "1px solid var(--g3)", borderRadius: 10, padding: 12, fontSize: 12.5 }}>
        {loc ? (
          <>
            <b style={{ fontWeight: 600 }}>{loc.name}</b>
            <div style={{ color: "var(--muted)" }}>{loc.desc}</div>
          </>
        ) : (
          "เลือกสถานที่บนแผนที่เพื่อดูข้อมูล"
        )}
      </div>
    </PanelShell>
  )
}

/** Lore library: three volumes, pick one to read its summary. */
export function LorePanel() {
  const [sel, setSel] = useState<LoreKey | null>(null)
  const keys = Object.keys(LORE) as LoreKey[]
  return (
    <PanelShell id="lore" title="ห้องสมุดตำนาน — สารานุกรมม่านหมอก">
      <div style={{ fontSize: 12.5, display: "flex", flexDirection: "column", gap: 8 }}>
        {keys.map((k) => (
          <button type="button" className="rowbtn" key={k} onClick={() => setSel(k)}>
            <b style={{ fontWeight: 600 }}>{LORE[k].title}</b>
            <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--faint)" }}>{LORE[k].volume}</span>
          </button>
        ))}
      </div>
      <div id="loreBody" style={{ marginTop: 10, borderTop: "1px solid var(--hair)", paddingTop: 10, fontSize: 12.5, color: "var(--muted)" }}>
        {sel ? <p>{LORE[sel].text}</p> : "เลือกบทความเพื่ออ่านสรุป"}
      </div>
    </PanelShell>
  )
}

const TODAY = 14
const DEFAULT_CAL_INFO: ReactNode = `เลือกวันที่ที่มีจุดเพื่อดูกิจกรรม · วันนี้คือวันที่ ${TODAY}`

/** Event calendar for one mock month (เดือนหิมะ 1127). */
export function CalendarPanel() {
  const [info, setInfo] = useState<ReactNode>(DEFAULT_CAL_INFO)

  const pickDay = (d: number) => {
    const ev = CAL_EVENTS[d]
    setInfo(
      <>
        <b style={{ fontWeight: 600 }}>วันที่ {d} เดือนหิมะ 1127</b>
        {ev ? (
          <div style={{ marginTop: 4, color: "var(--muted)" }}>
            {ev.map((x, i) => (
              <span key={x}>
                {i > 0 && <br />}• {x}
              </span>
            ))}
          </div>
        ) : (
          <div style={{ marginTop: 4, color: "var(--faint)" }}>ไม่มีกิจกรรมในวันนี้</div>
        )}
      </>,
    )
  }

  return (
    <PanelShell id="cal" title="ปฏิทินกิจกรรม — เดือนหิมะ 1127">
      <div className="cal-head">
        <button
          type="button"
          className="cal-nav"
          aria-label="เดือนก่อน"
          onClick={() => setInfo("เดือนก่อนหน้า — ตัวอย่างนี้จำลองเฉพาะเดือนหิมะ 1127")}
        >
          ‹
        </button>
        <b>เดือนหิมะ · FROSTFALL 1127</b>
        <button
          type="button"
          className="cal-nav"
          aria-label="เดือนถัดไป"
          onClick={() => setInfo("เดือนถัดไป — ตัวอย่างนี้จำลองเฉพาะเดือนหิมะ 1127")}
        >
          ›
        </button>
      </div>
      <div className="cal-dow">
        {["จัน", "อัง", "พุธ", "พฤ", "ศุก", "เสาร์", "อาทิ"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="cal-grid" id="calGrid">
        {Array.from({ length: 35 }, (_, i) => {
          const d = i - 1
          const ok = d >= 1 && d <= 30
          return (
            <button
              type="button"
              key={i}
              className={`cal-day${ok && CAL_EVENTS[d] ? " has" : ""}${d === TODAY ? " today" : ""}`}
              disabled={!ok}
              onClick={() => pickDay(d)}
            >
              {ok ? d : ""}
            </button>
          )
        })}
      </div>
      <div className="cal-info" id="calInfo">
        {info}
      </div>
    </PanelShell>
  )
}
