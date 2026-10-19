"use client"

import { useState } from "react"
import { useSkeleton } from "../SkeletonContext"
import { clickable } from "../clickable"
import { OrbitPostInfo, PatchInfo } from "../infoContent"
import { PATCH_CELL } from "../../_mock/copy"
import { ORBIT_CATS, ORBIT_DATA, PATCHES } from "../../_mock/home"

const tagCls = (category: string) => `tag${category === "อีเวนต์" ? " solid" : ""}`

/** Left list: latest patch notes. Click a title for the patch detail. */
export function PatchNotesCell() {
  const { openInfo } = useSkeleton()
  return (
    <div className="cell cell-patch">
      <div className="c-label">
        <b>{PATCH_CELL.label}</b>
      </div>
      <div id="patchList">
        {PATCHES.map((p) => (
          <div className="patch-item" key={p.version}>
            <div className="ver">
              <span>
                {p.version} — {p.date}
              </span>
              <span className={tagCls(p.category)}>{p.category}</span>
            </div>
            <h4 {...clickable(() => openInfo(`แพตช์ ${p.version} — ${p.title}`, <PatchInfo patch={p} />))}>{p.title}</h4>
            <p>{p.body.slice(0, 64)}…</p>
            <div className="bars">
              <i />
              <i />
              <i />
              <i />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Orbit of 7 category circles around the PATCH core, with the latest posts of the chosen category below. */
export function PatchOrbitCell() {
  const { open, openInfo } = useSkeleton()
  const [cat, setCat] = useState<string>(ORBIT_CATS[0])
  const posts = ORBIT_DATA[cat]

  return (
    <div className="cell cell-post">
      <div className="c-label">
        <b>{PATCH_CELL.orbitLabel}</b>
      </div>
      <div className="patch-orbit" id="patchOrbit">
        <div className="orbit-ring" />
        <button type="button" className="orbit-core" onClick={() => open("patchlog")}>
          <b>PATCH</b>
          <span>{PATCH_CELL.coreVersion}</span>
        </button>
        {ORBIT_CATS.map((c, i) => {
          const a = -90 + i * (360 / ORBIT_CATS.length)
          const [first, second] = c.split(" & ")
          return (
            <button
              type="button"
              key={c}
              className={`orbit-sat${c === cat ? " on" : ""}`}
              data-tip={ORBIT_DATA[c][0].title}
              style={{ transform: `rotate(${a}deg) translateY(-130px) rotate(${-a}deg)` }}
              onClick={() => setCat(c)}
            >
              {second ? (
                <>
                  {first}
                  <br />
                  &amp; {second}
                </>
              ) : (
                c
              )}
            </button>
          )
        })}
      </div>
      <div className="orbit-preview" id="orbitPreview">
        <div className="op-head">
          <span className="tag solid">{cat}</span>
          <span className="op-sub">โพสต์ล่าสุดในหมวด · {posts.length} รายการ</span>
        </div>
        {posts.map((p) => (
          <div
            className="feed-row"
            key={p.title}
            style={{ paddingLeft: 2, paddingTop: 6, paddingBottom: 6 }}
            {...clickable(() => openInfo(`${cat} — ${p.title}`, <OrbitPostInfo category={cat} post={p} />))}
          >
            <b>{p.title}</b>
            <span>{p.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
