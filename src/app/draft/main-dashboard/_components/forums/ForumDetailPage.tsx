"use client"

import { useSkeleton } from "../SkeletonContext"
import Placeholder from "../Placeholder"
import { FORUM_PAGE } from "../../_mock/copy"
import { FORUMS } from "../../_mock/forums"

/** One forum: banner, sub-forum cards, thread table, pager. */
export default function ForumDetailPage() {
  const { view, openForums } = useSkeleton()
  const f = view.name === "forum" ? FORUMS[view.key] : null

  return (
    <main id="view-forum" hidden={view.name !== "forum"}>
      {f && (
        <div className="wrap">
          <div className="crumb">
            {FORUM_PAGE.crumbForums} /{" "}
            <button type="button" onClick={openForums}>
              {FORUM_PAGE.crumbAll}
            </button>{" "}
            / <span>{f.name}</span>
          </div>
          <div className="fd-head">
            <Placeholder tag={FORUM_PAGE.banner} />
            <div>
              <h2>
                {f.name} · {f.en}
              </h2>
              <div className="fd-meta">{f.meta}</div>
              <div className="fd-desc">{f.desc}</div>
            </div>
          </div>

          <div className="sec-head" style={{ marginTop: 38 }}>
            <span className="no">SUB</span>
            <h2 style={{ fontSize: 22 }}>{FORUM_PAGE.subTitle}</h2>
            <div className="rule" />
          </div>
          <div className="sub-grid">
            {f.subs.map((s) => (
              <div className="sub-card" key={s.name}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                  <h4>{s.name}</h4>
                  <span className="tag">{s.en}</span>
                </div>
                <p>{s.desc}</p>
                <span className="mono" style={{ fontSize: 11, letterSpacing: ".12em", color: "var(--faint)" }}>
                  {s.threadCount}
                  {FORUM_PAGE.threadsSuffix}
                </span>
              </div>
            ))}
          </div>

          <div className="thread-head">
            {FORUM_PAGE.head.map((h) => (
              <span key={h}>{h}</span>
            ))}
          </div>
          <div id="threadList">
            {f.threads.map((t) => (
              <div className="thread-row" key={t.title}>
                <span className="tt">
                  {t.tag && (
                    <span className="tag" style={{ marginRight: 6 }}>
                      {t.tag}
                    </span>
                  )}
                  {t.title}
                </span>
                <span className="au">{t.author}</span>
                <span className="num">{t.replies}</span>
                <span className="num">{t.views}</span>
                <span className="lp">{t.lastPost}</span>
              </div>
            ))}
          </div>
          <div className="pager">
            <span>‹</span>
            <span className="cur">1</span>
            <span>2</span>
            <span>3</span>
            <span>…</span>
            <span>›</span>
          </div>
          <button type="button" className="back-btn" onClick={openForums}>
            {FORUM_PAGE.back}
          </button>
        </div>
      )}
    </main>
  )
}
