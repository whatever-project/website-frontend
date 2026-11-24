"use client"

import { useEffect, useRef, type PointerEvent } from "react"
import { useFrameVisible } from "./useFrameVisible"
import { useShowDashboardContent } from "./useShowDashboardContent"

const POS_KEY = "md-preview-dock"


/**
 * TEMPORARY preview dock (to be replaced by the real player-settings screen): three switches: "frame" (frameVisible), "cloud drift" and "dashboard content" (showDashboardContent).
 * Rendered by the shell, outside the frame layers, so it stays reachable in both modes. It can be dragged anywhere on the screen
 * (press and move on the dock; a click without moving still toggles). The position is remembered in localStorage and kept inside the viewport.
 * Position changes are written straight to the element's style (no React re-render).
 */
export default function FrameToggle() {
  const [frameVisible, setFrameVisible] = useFrameVisible()
  const [showContent, setShowContent] = useShowDashboardContent()
  const dock = useRef<HTMLDivElement>(null)
  const drag = useRef<{ px: number; py: number; l: number; t: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)

  const place = (l: number, t: number) => {
    const el = dock.current
    if (!el) return
    const w = el.offsetWidth
    const h = el.offsetHeight
    const left = Math.min(Math.max(0, l), Math.max(0, window.innerWidth - w))
    const top = Math.min(Math.max(0, t), Math.max(0, window.innerHeight - h))
    el.style.left = `${left}px`
    el.style.top = `${top}px`
    el.style.right = "auto"
    return { left, top }
  }

  /* restore the saved position after mount, and keep it on screen when the window is resized */
  useEffect(() => {
    const el = dock.current
    if (!el) return
    let saved: { l: number; t: number } | null = null
    try {
      const raw = window.localStorage.getItem(POS_KEY)
      saved = raw ? JSON.parse(raw) : null
    } catch {
      saved = null
    }
    if (saved && Number.isFinite(saved.l) && Number.isFinite(saved.t)) place(saved.l, saved.t)
    const onResize = () => {
      if (el.style.left) place(parseFloat(el.style.left), parseFloat(el.style.top))
    }
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [])

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const r = e.currentTarget.getBoundingClientRect()
    drag.current = { px: e.clientX, py: e.clientY, l: r.left, t: r.top, moved: false }
  }
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.px
    const dy = e.clientY - d.py
    if (!d.moved && Math.hypot(dx, dy) < 5) return
    if (!d.moved) {
      d.moved = true
      try {
        e.currentTarget.setPointerCapture(e.pointerId)
      } catch {
        /* pointer already gone */
      }
      e.currentTarget.dataset.dragging = "1"
    }
    place(d.l + dx, d.t + dy)
  }
  const onUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current
    drag.current = null
    delete e.currentTarget.dataset.dragging
    if (d?.moved) {
      suppressClick.current = true // the click that follows a drag must not flip a switch
      window.setTimeout(() => (suppressClick.current = false), 0)
      try {
        window.localStorage.setItem(POS_KEY, JSON.stringify({ l: parseFloat(e.currentTarget.style.left), t: parseFloat(e.currentTarget.style.top) }))
      } catch {
        /* ignore */
      }
    }
  }
  const guard = (fn: () => void) => () => {
    if (!suppressClick.current) fn()
  }

  return (
    <div ref={dock} className="fv-dock" role="group" aria-label="ตัวควบคุมสำหรับทดสอบ (ลากเพื่อย้ายตำแหน่งได้)" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
      <button
        type="button"
        role="switch"
        aria-checked={frameVisible}
        className="fv-toggle"
        title={frameVisible ? "ซ่อนกรอบตกแต่ง (ลากเพื่อย้ายได้)" : "แสดงกรอบตกแต่ง (ลากเพื่อย้ายได้)"}
        onClick={guard(() => setFrameVisible(!frameVisible))}
      >
        <span className="fv-label">แสดงกรอบตกแต่ง</span>
        <span className="fv-track" aria-hidden>
          <span className="fv-knob" />
        </span>
      </button>
      <button type="button" role="switch" aria-checked={showContent} className="fv-toggle" title="แสดงการ์ดแดชบอร์ด (ลากเพื่อย้ายได้)" onClick={guard(() => setShowContent(!showContent))}>
        <span className="fv-label">แสดงการ์ดแดชบอร์ด</span>
        <span className="fv-track" aria-hidden>
          <span className="fv-knob" />
        </span>
      </button>
    </div>
  )
}