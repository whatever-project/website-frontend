"use client"

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode } from "react"

const STORAGE_KEY = "draft-landing-preview-pos"
const SIZE_KEY = "draft-landing-preview-size"
const KEEP_VISIBLE = 48 // px of the panel that must stay on screen
const MIN_W = 240
const MIN_H = 110

/**
 * Draft-only floating panel that can be dragged out of the way (it covers the form's bottom-left corner). Press on the panel's
 * background or title and drag; buttons, inputs, labels and links keep working normally. The offset is applied as a translate on top of
 * the panel's own fixed position, clamped so the panel can never be dragged off screen, and remembered in localStorage.
 * The grip in the bottom-right corner resizes it (min `MIN_W` x `MIN_H`, never larger than the window); once resized, the content scrolls inside if it no longer fits.
 */
export default function DraggablePanel({ className, children, onClick }: { className: string; children: ReactNode; onClick?: (event: React.MouseEvent<HTMLDivElement>) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const offsetRef = useRef(offset)
  const drag = useRef<{ startX: number; startY: number; baseX: number; baseY: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [size, setSize] = useState<{ w: number; h: number } | null>(null)
  const sizeRef = useRef<{ w: number; h: number } | null>(null)
  const resize = useRef<{ startX: number; startY: number; baseW: number; baseH: number; top: number; left: number; baseOffY: number } | null>(null)

  const clamp = useCallback((x: number, y: number) => {
    const el = ref.current
    if (!el) return { x, y }
    // Rect at zero offset = current rect minus the current offset.
    const rect = el.getBoundingClientRect()
    const baseLeft = rect.left - offsetRef.current.x
    const baseTop = rect.top - offsetRef.current.y
    const minX = KEEP_VISIBLE - rect.width - baseLeft
    const maxX = window.innerWidth - KEEP_VISIBLE - baseLeft
    const minY = -baseTop
    const maxY = window.innerHeight - KEEP_VISIBLE - baseTop
    return { x: Math.min(maxX, Math.max(minX, x)), y: Math.min(maxY, Math.max(minY, y)) }
  }, [])

  const apply = useCallback((next: { x: number; y: number }) => {
    offsetRef.current = next
    setOffset(next)
  }, [])

  // Restore the remembered position (after mount, so the server and first client render match).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { x: number; y: number }
      if (typeof saved.x === "number" && typeof saved.y === "number") apply(clamp(saved.x, saved.y))
    } catch {}
  }, [apply, clamp])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SIZE_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { w: number; h: number }
      if (typeof saved.w === "number" && typeof saved.h === "number") {
        sizeRef.current = saved
        setSize(saved)
      }
    } catch {}
  }, [])

  // Keep it reachable if the window is resized smaller.
  useEffect(() => {
    const onResize = () => apply(clamp(offsetRef.current.x, offsetRef.current.y))
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [apply, clamp])

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    if ((e.target as HTMLElement).closest("button, input, select, textarea, a, label, [data-resize-grip]")) return
    drag.current = { startX: e.clientX, startY: e.clientY, baseX: offsetRef.current.x, baseY: offsetRef.current.y }
    setDragging(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current
    if (!d) return
    apply(clamp(d.baseX + e.clientX - d.startX, d.baseY + e.clientY - d.startY))
  }
  const endDrag = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!drag.current) return
    drag.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offsetRef.current))
    } catch {}
  }

  const onGripDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !ref.current) return
    e.stopPropagation()
    const rect = ref.current.getBoundingClientRect()
    resize.current = { startX: e.clientX, startY: e.clientY, baseW: rect.width, baseH: rect.height, top: rect.top, left: rect.left, baseOffY: offsetRef.current.y }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onGripMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = resize.current
    if (!r) return
    // The panel is anchored by its bottom-left corner, so a taller panel would grow UPWARD. Keep the top-left corner fixed instead:
    // the grip follows the pointer, and the vertical offset compensates for the height change.
    const next = {
      w: Math.round(Math.min(window.innerWidth - r.left, Math.max(MIN_W, r.baseW + e.clientX - r.startX))),
      h: Math.round(Math.min(window.innerHeight - r.top, Math.max(MIN_H, r.baseH + e.clientY - r.startY))),
    }
    sizeRef.current = next
    setSize(next)
    apply({ x: offsetRef.current.x, y: r.baseOffY + (next.h - r.baseH) })
  }
  const onGripUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!resize.current) return
    resize.current = null
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
    try {
      localStorage.setItem(SIZE_KEY, JSON.stringify(sizeRef.current))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(offsetRef.current))
    } catch {}
  }

  return (
    <div
      ref={ref}
      className={`${className} ${size ? "has-[[aria-expanded=false]]:h-auto!" : ""} ${dragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
      style={{
        // `translate` (not `transform`): the panel's pop-in animation owns `transform` and would override it.
        translate: `${offset.x}px ${offset.y}px`,
        touchAction: "none",
        ...(size ? { width: size.w, height: size.h, maxWidth: "none" } : null),
      }}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      title="ลากเพื่อย้ายตำแหน่ง"
    >
      <div className={size ? "h-full overflow-auto" : ""}>{children}</div>
      {/* resize grip, bottom-right corner (outside the scrolling area so it never scrolls away) */}
      <div
        data-resize-grip
        role="separator"
        aria-label="ปรับขนาดกล่อง"
        title="ลากเพื่อปรับขนาด"
        onPointerDown={onGripDown}
        onPointerMove={onGripMove}
        onPointerUp={onGripUp}
        onPointerCancel={onGripUp}
        className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
        style={{ touchAction: "none" }}
      >
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" className="text-[#8a6a35]">
          <path d="M14 6 6 14M14 10l-4 4M14 2 2 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" fill="none" />
        </svg>
      </div>
    </div>
  )
}
