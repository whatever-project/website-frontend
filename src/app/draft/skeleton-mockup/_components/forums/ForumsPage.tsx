"use client"

import { useState } from "react"
import { useSkeleton } from "../SkeletonContext"
import Placeholder from "../Placeholder"
import { clickable } from "../clickable"
import { FORUMS_PAGE } from "../../_mock/copy"
import { FORUMS, FORUM_KEYS, type ForumKey } from "../../_mock/forums"

interface TipState {
  key: ForumKey
  x: number
  y: number
}

/** "Main Forums" page: the four forums as big rows with a follow-the-mouse tooltip. */
export default function ForumsPage() {
  const { view, goHome, openForum } = useSkeleton()
  const [tip, setTip] = useState<TipState | null>(null)
  const tipForum = tip ? FORUMS[tip.key] : null

  return (
    <>
      <main id="view-forums" hidden={view.name !== "forums"}>
        <div className="wrap">
          <div className="page-head">
            <div className="crumb" style={{ paddingTop: 0 }}>
              <button type="button" onClick={goHome}>
                {FORUMS_PAGE.crumbHome}
              </button>{" "}
              / {FORUMS_PAGE.crumbForums}
            </div>
            <h2 style={{ marginTop: 18 }}>{FORUMS_PAGE.title}</h2>
            <div className="fd-meta">{FORUMS_PAGE.meta}</div>
          </div>
          <div style={{ marginTop: 34 }} id="forumList">
            {FORUM_KEYS.map((key) => {
              const f = FORUMS[key]
              return (
                <div
                  className="f-row reveal"
                  key={key}
                  onMouseEnter={(e) => setTip({ key, x: e.clientX, y: e.clientY })}
                  onMouseMove={(e) => setTip({ key, x: e.clientX, y: e.clientY })}
                  onMouseLeave={() => setTip(null)}
                  aria-label={`เข้าสู่ฟอรั่ม ${f.name}`}
                  {...clickable(() => openForum(key))}
                >
                  <div className="no">{f.no}</div>
                  <Placeholder tag={`[${f.en}]`} />
                  <div>
                    <div className="f-name">{f.name}</div>
                    <div className="f-th">{f.desc}</div>
                    <div className="f-meta">{f.meta}</div>
                  </div>
                  <div className="arrow">→</div>
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <div
        className={`f-tip${tip && view.name === "forums" ? " on" : ""}`}
        style={tip ? { left: Math.min(tip.x + 18, (typeof window === "undefined" ? 1280 : window.innerWidth) - 320), top: tip.y + 18 } : undefined}
        aria-hidden
      >
        <div className="tt">{FORUMS_PAGE.tooltipTitle}</div>
        <div className="desc">{tipForum?.desc}</div>
        <div className="latest">{tipForum ? `${FORUMS_PAGE.tooltipLatest}${tipForum.threads[0].title} — ${tipForum.threads[0].lastPost}` : ""}</div>
      </div>
    </>
  )
}
