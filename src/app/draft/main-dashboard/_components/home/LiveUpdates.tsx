"use client"

import { useSkeleton } from "../SkeletonContext"
import SectionHead from "../SectionHead"
import Placeholder from "../Placeholder"
import { clickable } from "../clickable"
import { CrystalInfo, PostInfo } from "../infoContent"
import { LIVE } from "../../_mock/copy"
import { POSTS } from "../../_mock/home"

/** SEC.04 — Live Updates: horizontal latest-post cards + the stories-style crystal rail. */
export default function LiveUpdates() {
  const { openInfo, openPanel, crystals, crystalFresh } = useSkeleton()

  return (
    <section className="wrap" id="sec-posts">
      <SectionHead title={LIVE.title} sub={LIVE.sub} />
      <div className="lp-grid reveal d1">
        <div className="cell posts-cell">
          <div className="c-label">
            <b>{LIVE.postsLabel}</b>
          </div>
          <div className="post-track" id="postTrack">
            {POSTS.map((p) => (
              <div className="post-card" key={p.title} {...clickable(() => openInfo(p.title, <PostInfo post={p} />))}>
                <Placeholder tag="[ภาพกระทู้]" />
                <h5>{p.title}</h5>
                <div className="pm">
                  {p.author} · {p.forum}
                  <br />
                  {p.age}ที่แล้ว
                </div>
                <div className="rr">
                  <span>{p.replies} ตอบกลับ</span>
                  <span>{p.views} อ่าน →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="status-cell reveal d1" style={{ marginTop: 26 }}>
        <div className="c-label">
          <b>{LIVE.crystalLabel}</b>
          <button type="button" className="nl-btn" onClick={() => openPanel("crys")}>
            {LIVE.wake}
          </button>
        </div>
        <div className="crystal-rail" id="crystalRail">
          {crystals.map((c, i) => (
            <div
              className={`crys${crystalFresh && i === 0 ? " new" : ""}`}
              key={`${c.name}|${c.time}|${c.text.slice(0, 16)}`}
              {...clickable(() => openInfo(`Crystal — ${c.name}`, <CrystalInfo crystal={c} />))}
            >
              <div className="crys-ring">
                <div className="crys-gem">
                  {c.img ? (
                    // eslint-disable-next-line @next/next/no-img-element -- may be a user-uploaded data URL
                    <img src={c.img} alt="" />
                  ) : (
                    "[รูป]"
                  )}
                </div>
              </div>
              <b>{c.name}</b>
              <span>{c.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
