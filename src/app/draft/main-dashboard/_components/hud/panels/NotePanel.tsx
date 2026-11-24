"use client"

import { useState } from "react"
import { useSkeleton } from "../../SkeletonContext"
import PanelShell from "./PanelShell"
import Placeholder from "../../Placeholder"
import { PLAYER } from "../../../_mock/guide"

/** "Write a notice" — costs 20 เคล (mock), pins a new note on the board. */
export default function NotePanel() {
  const { kell, publishNote } = useSkeleton()
  const [text, setText] = useState("")

  const send = () => {
    const v = text.trim()
    if (!v) return
    publishNote(v)
    setText("")
  }

  return (
    <PanelShell id="note" title="เขียนประกาศลงกระดาน">
      <Placeholder style={{ height: 64, marginBottom: 12 }} tag="[ตำแหน่งปัก: แถวล่างของกระดาน]" />
      <div className="status-box" style={{ marginBottom: 12 }}>
        <textarea
          id="noteInput"
          aria-label="ข้อความประกาศ"
          placeholder="เขียนประกาศของคุณ… เช่น รับซื้อแผนที่หอคอย ให้ราคาดี นัดรับที่สะพานจันทรา"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <button type="button" className="btn" id="noteSend" onClick={send}>
          เผยแพร่ — เสีย {PLAYER.noteCost} เคล
        </button>
        <span className="tag" id="kellTag">
          ยอดคงเหลือ {kell.toLocaleString("en-US")} เคล
        </span>
      </div>
      <p style={{ marginTop: 10, fontSize: 12, color: "var(--muted)" }}>ประกาศจะถูกปักบนกระดานทันทีที่เผยแพร่ · ข้อมูลจำลอง ไม่มีการหักเงินจริง</p>
    </PanelShell>
  )
}
