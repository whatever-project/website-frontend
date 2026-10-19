"use client"

import { useEffect, useRef, useState } from "react"
import { useSkeleton } from "../../SkeletonContext"
import PanelShell from "./PanelShell"
import {
  FAIRY_ACTIVE,
  FAIRY_DONE,
  FAIRY_FRIENDS,
  FAIRY_GUIDE,
  FAIRY_NPCS,
  FAIRY_TABS,
  PLAYER,
  type FairyTabKey,
} from "../../../_mock/guide"
import { ITEMS } from "../../../_mock/hud"

/** Crystal chat room: seeded messages + the player's own (mock, local only). */
export function ChatPanel() {
  const { chat, sendChat } = useSkeleton()
  const [text, setText] = useState("")
  const logRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [chat.length])

  const send = () => {
    const v = text.trim()
    if (!v) return
    sendChat(v)
    setText("")
  }

  return (
    <PanelShell id="chat" title="ห้องคริสตัล — ห้องส่วนกลาง" tag={<span className="tag">24 ท่านในห้อง</span>}>
      <div className="chatlog" id="chatLog" ref={logRef}>
        {chat.map((m, i) => (
          <div className="msg" key={i}>
            <span className="av" />
            <span>
              <div className="nm">
                {m.name} · {m.time}
              </div>
              <div>{m.text}</div>
            </span>
          </div>
        ))}
      </div>
      <div className="msgbox">
        <input
          id="chatInput"
          placeholder="พูดผ่านคริสตัล…"
          aria-label="ข้อความ"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") send()
          }}
        />
        <button type="button" className="btn" onClick={send}>
          ส่ง
        </button>
      </div>
    </PanelShell>
  )
}

/** Inventory: 8 slots + detail box. */
export function InventoryPanel() {
  const [sel, setSel] = useState<number | null>(null)
  const item = sel !== null ? ITEMS[sel] : null
  return (
    <PanelShell id="inv" title="กระเป๋าไอเทม — ย่ามนักเดินทาง" tag={<span className="tag solid">{PLAYER.kell.toLocaleString("en-US")} อาร์เจนต์</span>}>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,68px)", gap: 8 }} id="invGrid">
          {ITEMS.map((it, i) => (
            <button type="button" className={`slot${sel === i && it ? " sel" : ""}`} key={i} aria-label={it ? it.name : "ช่องว่าง"} onClick={() => setSel(i)}>
              {it ? <span className="ph">{it.type}</span> : <span className="ph" style={{ borderStyle: "dashed" }}>ว่าง</span>}
            </button>
          ))}
        </div>
        <div id="invDetail" style={{ flex: 1, minWidth: 210, border: "1px solid var(--g3)", borderRadius: 10, padding: 12, fontSize: 12.5 }}>
          {sel === null ? (
            "เลือกไอเทมเพื่อดูรายละเอียด"
          ) : item ? (
            <>
              <b style={{ fontWeight: 600, fontSize: 14 }}>{item.name}</b> <span className="tag">{item.type}</span>
              <div style={{ color: "var(--muted)", marginTop: 6 }}>{item.desc}</div>
              <div style={{ color: "var(--faint)", marginTop: 8 }}>จำนวน: {item.qty}</div>
            </>
          ) : (
            <span style={{ color: "var(--faint)" }}>ช่องว่าง</span>
          )}
        </div>
      </div>
    </PanelShell>
  )
}

/** Guide fairy "Pip": play guide, active/finished quests, NPC notebook, friends. */
export function FairyPanel() {
  const [tab, setTab] = useState<FairyTabKey>("guide")
  return (
    <PanelShell id="fairy" title="ปิ๊บ — ภูตนำทาง" tag={<span className="tag">ผู้ช่วยของคุณ</span>}>
      <div className="tabs" id="fairyTabs">
        {FAIRY_TABS.map((t) => (
          <button type="button" key={t.key} className={`tab${tab === t.key ? " on" : ""}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div id="fairyBody" style={{ fontSize: 12.5, lineHeight: 1.8 }}>
        {tab === "guide" && (
          <>
            <p>
              <b style={{ fontWeight: 600 }}>{FAIRY_GUIDE.lead}</b>
              {FAIRY_GUIDE.text}
            </p>
            <p style={{ color: "var(--faint)" }}>{FAIRY_GUIDE.note}</p>
          </>
        )}
        {tab === "active" &&
          FAIRY_ACTIVE.map((q) => (
            <div className="roll" key={q.text}>
              <span style={{ flex: 1 }}>{q.text}</span>
              <span className={`tag${q.main ? " solid" : ""}`}>{q.tag}</span>
            </div>
          ))}
        {tab === "done" &&
          FAIRY_DONE.map((q) => (
            <div className="roll" key={q.text}>
              <span style={{ flex: 1 }}>{q.text}</span>
              <span style={{ fontSize: 12, color: "var(--faint)" }}>{q.year}</span>
            </div>
          ))}
        {tab === "npc" &&
          FAIRY_NPCS.map((n) => (
            <div className="roll" key={n.name}>
              <span className="ph" style={{ width: 28, height: 28, borderRadius: 999, padding: 0, flex: "none", fontSize: 8 }}>
                [NPC]
              </span>
              <span style={{ flex: 1 }}>
                {n.name} <span style={{ fontSize: 12, color: "var(--muted)" }}>— {n.role}</span>
              </span>
              <span className="tag">{n.tag}</span>
            </div>
          ))}
        {tab === "friends" &&
          FAIRY_FRIENDS.map((f) => (
            <div className="roll" key={f.name}>
              <span style={{ flex: 1 }}>{f.name}</span>
              <span style={{ fontSize: 12, color: "var(--faint)" }}>{f.status}</span>
            </div>
          ))}
      </div>
    </PanelShell>
  )
}
