"use client"

import { useEffect, useRef, type CSSProperties } from "react"
import { useSkeleton } from "../SkeletonContext"
import { clickable } from "../clickable"
import { HERO, MAP_MARKERS, NAV_ITEMS, type NavKey } from "../../_mock/copy"

/* Twinkling sparks: seeded so server and client render the same values (no hydration mismatch). */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const SPARKS = (() => {
  const r = mulberry32(7)
  return Array.from({ length: 26 }, () => ({
    left: (4 + r() * 92).toFixed(2),
    top: (12 + r() * 66).toFixed(2),
    size: (7 + r() * 9).toFixed(1),
    dur: (2 + r() * 3.5).toFixed(2),
    delay: (r() * 3).toFixed(2),
  }))
})()

const MAP_TEXT: CSSProperties = { fontFamily: "JetBrains Mono, monospace" }

/** Full-height hero: banner view, map view (toggled from the glass nav), and the glass nav itself. */
export default function Hero() {
  const { mapOpen, nav, navClick, goHome, openForum, view } = useSkeleton()
  const sliderRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<Partial<Record<NavKey, HTMLButtonElement | null>>>({})

  /* slide the white pill under the active nav button (measured, so done on the DOM, not in state) */
  useEffect(() => {
    const place = () => {
      const btn = btnRefs.current[nav]
      const slider = sliderRef.current
      if (!btn || !slider || btn.offsetParent === null) return
      slider.style.left = `${btn.offsetLeft}px`
      slider.style.width = `${btn.offsetWidth}px`
    }
    place()
    window.addEventListener("resize", place)
    return () => window.removeEventListener("resize", place)
  }, [nav, view.name])

  return (
    <section className={`hero${mapOpen ? " is-map" : ""}`} id="hero" style={{ padding: 0 }}>
      <button type="button" className="brandmark" onClick={goHome} aria-label="กลับสู่หน้าหลัก">
        <span className="sig">✦</span>
        <span>
          <b>{HERO.brand}</b>
          <small>{HERO.brandSub}</small>
        </span>
      </button>

      <div className="hero-banner">
        <div className="banner-ph">
          <div className="frame">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="banner-dim">{HERO.bannerDim}</div>
        </div>
        <div id="sparks" aria-hidden>
          {SPARKS.map((s, i) => (
            <span
              key={i}
              className="spark"
              style={{ left: `${s.left}%`, top: `${s.top}%`, fontSize: `${s.size}px`, animationDelay: `${s.delay}s`, "--d": `${s.dur}s` } as CSSProperties}
            >
              ✦
            </span>
          ))}
        </div>
        <div className="hero-copy">
          <div className="kicker">{HERO.kicker}</div>
          <h1>
            {HERO.titleLine1}
            <br />
            <em>{HERO.titleLine2}</em>
          </h1>
          <p>
            {HERO.taglineLine1}
            <br />
            {HERO.taglineLine2}
          </p>
        </div>
        <div className="hero-issue">
          <b>{HERO.issueTitle}</b>
          <span>
            {HERO.issueLines[0]}
            <br />
            {HERO.issueLines[1]}
            <br />
            {HERO.issueLines[2]}
          </span>
        </div>
        <div className="scroll-cue">{HERO.scrollCue}</div>
      </div>

      {/* map layer (toggled from the glass nav) */}
      <div className="hero-map">
        <div className="map-hud">
          <div className="kicker">{HERO.mapKicker}</div>
          <h2>
            {HERO.mapTitleLine1}
            <br />
            {HERO.mapTitleLine2}
          </h2>
          <p>{HERO.mapHint}</p>
        </div>
        <svg className="map-svg" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-label="แผนที่ตัวอย่าง">
          <defs>
            <pattern id="sk-mgrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M60 0H0V60" fill="none" stroke="#e6e6e3" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1440" height="900" fill="#f7f7f5" />
          <rect width="1440" height="900" fill="url(#sk-mgrid)" />
          <path d="M-40 640 C 260 560, 420 720, 700 660 S 1180 560, 1500 660" fill="none" stroke="#c9c9c6" strokeWidth="26" opacity=".7" />
          <path d="M-40 640 C 260 560, 420 720, 700 660 S 1180 560, 1500 660" fill="none" stroke="#9a9a97" strokeWidth="1" strokeDasharray="6 6" />
          <g stroke="#b5b5b2" strokeWidth="1.4" fill="none">
            <path d="M240 -20 L 300 480 L 240 920" />
            <path d="M560 -20 L 620 420 L 700 920" />
            <path d="M-20 300 L 760 340 L 1500 260" />
            <path d="M-20 480 L 620 470 L 1500 420" />
            <path d="M900 -20 L 880 460 L 980 920" />
            <path d="M1150 -20 L 1180 480 L 1120 920" />
          </g>
          <g fill="#ececea" stroke="#9a9a97" strokeWidth="1">
            <rect x="330" y="80" width="180" height="150" />
            <rect x="660" y="60" width="170" height="200" />
            <rect x="950" y="90" width="160" height="120" transform="rotate(3 1030 150)" />
            <rect x="340" y="380" width="200" height="70" />
            <rect x="740" y="380" width="110" height="70" />
            <rect x="1220" y="300" width="150" height="100" transform="rotate(-4 1295 350)" />
            <rect x="700" y="730" width="230" height="120" />
            <rect x="1020" y="500" width="120" height="120" />
            <rect x="420" y="560" width="130" height="60" transform="rotate(5 485 590)" />
          </g>
          <g transform="translate(1330,120)" stroke="#6f6f6b" fill="none">
            <circle r="34" />
            <path d="M0 -34 L8 0 L0 34 L-8 0 Z" fill="#141414" stroke="none" />
            <text y="-44" textAnchor="middle" style={MAP_TEXT} fontSize="10" fill="#141414" stroke="none" letterSpacing="2">
              N
            </text>
          </g>
          {MAP_MARKERS.map((m) => (
            <g
              key={m.key}
              className="mk"
              transform={`translate(${m.x},${m.y})`}
              aria-label={`เข้าสู่ฟอรั่ม ${m.label}`}
              {...clickable(() => openForum(m.key))}
            >
              <circle className="ring" r="14" />
              <circle className="core" r="5" />
              <text y={m.labelBelow ? 34 : -24} textAnchor="middle" style={MAP_TEXT} fontSize="11" letterSpacing="2" fill="#141414">
                {m.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <nav className="glass-nav" aria-label="ทางลัดหลัก">
        <div id="navSlider" ref={sliderRef} />
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            ref={(el) => {
              btnRefs.current[item.key] = el
            }}
            className={`gnav-btn${nav === item.key ? " active" : ""}`}
            onClick={() => navClick(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </section>
  )
}
