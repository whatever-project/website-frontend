"use client"

import { useState } from "react"
import { useSkeleton } from "../SkeletonContext"
import SectionHead from "../SectionHead"
import { clickable } from "../clickable"
import { HonorInfo } from "../infoContent"
import { EVENTS, QUEST } from "../../_mock/copy"
import { HONOR } from "../../_mock/home"

/** SEC.03 — The Seventh Seal: main-story progress, honour roll and the upcoming-events strip. */
export default function SeventhSeal() {
  const { open, openInfo } = useSkeleton()
  const [activeEvent, setActiveEvent] = useState<number | null>(null)

  return (
    <section className="quest wrap" id="sec-quest">
      <SectionHead title={QUEST.title} sub={QUEST.sub} />
      <div className="quest-grid reveal d1">
        <div className="cell">
          <div className="c-label">
            <b>{QUEST.label}</b>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 4 }}>
            <span style={{ color: "var(--muted)" }}>{QUEST.progressLabel}</span>
            <b style={{ fontVariantNumeric: "tabular-nums" }}>{QUEST.progress}%</b>
          </div>
          <div className="pbar">
            <div style={{ width: `${QUEST.progress}%` }} />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "14px 0" }}>
            {QUEST.areas.map((a) => (
              <span className={`areachip${a.locked ? " lock" : ""}`} key={a.name}>
                {a.name}
              </span>
            ))}
          </div>
          <div className="qstat">
            {QUEST.stats.map((s) => (
              <div key={s.label}>
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" className="btn" onClick={() => open("quest")}>
              {QUEST.detail}
            </button>
            <button type="button" className="btn ghost" onClick={() => open("achieve")}>
              {QUEST.honorBtn}
            </button>
          </div>
        </div>

        <div className="cell">
          <div className="c-label">
            <b>{QUEST.honorLabel}</b>
          </div>
          <div id="honorList">
            {HONOR.map((h) => (
              <div className="roll" key={h.name} {...clickable(() => openInfo(`ความสำเร็จ — ${h.name}`, <HonorInfo entry={h} />))}>
                <div className="rune">
                  <span>✦</span>
                </div>
                <span style={{ flex: 1 }}>
                  <b style={{ fontWeight: 600 }}>{h.name}</b>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}> สำเร็จเควส “{h.quest}”</span>
                </span>
                <span style={{ fontSize: 12, color: "var(--faint)" }}>{h.when}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="sub-head reveal">เหตุการณ์สำคัญถัดไป · Upcoming Events</h3>
      <div className="vfest3 reveal d1">
        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className={`vf3${ev.live ? " live" : ""}${ev.empty ? " noev" : ""}${activeEvent === i ? " on" : ""}`}
            {...(ev.empty ? {} : clickable(() => setActiveEvent((a) => (a === i ? null : i))))}
          >
            <div className="vf3-frame">
              {ev.empty ? <span className="noev-txt">NO EVENT</span> : <span className="ph-tag">[ภาพกิจกรรม]</span>}
              <span className={`vf3-tab2${ev.empty ? " dim" : ""}`}>{ev.tab}</span>
              {!ev.empty && (
                <div className="vf3-ov">
                  <b>{ev.title}</b>
                  <p>{ev.desc}</p>
                  <span>{ev.when}</span>
                </div>
              )}
            </div>
            <div className="vf3-meta">
              <b>{ev.title}</b>
              <span>{ev.place}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
