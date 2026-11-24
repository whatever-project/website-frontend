"use client"

import { useEffect, useRef } from "react"

/* ---- backdrop tone: what is directly behind the button, light or dark? ----
 * CSS alone cannot know this (mix-blend-mode: difference turns mid-tones into mid-grey and breaks across the frame / fixed layers), so the button
 * reads the real page: it asks the browser which elements are painted under its centre, skips the HUD itself, and takes the first one with a
 * visible background (solid colour, else the colours inside its gradient, else "dark" for pictures like the hero). The result is written to
 * `data-tone` ("light" | "dark" = the backdrop), which the CSS uses to pick the icon colour. Imperative on purpose: no React re-render. */
type Tone = "light" | "dark"

const lum = (r: number, g: number, b: number) => {
  const c = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
}

/** Colours found in a CSS colour / gradient string → average relative luminance (ignores nearly transparent stops), or null. */
function lumOf(css: string): number | null {
  const found = [...css.matchAll(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s/]+([\d.]+))?\s*\)/g)].filter((m) => (m[4] === undefined ? 1 : +m[4]) >= 0.35)
  if (!found.length) return null
  return found.reduce((s, m) => s + lum(+m[1], +m[2], +m[3]), 0) / found.length
}

function toneBehind(btn: HTMLElement): Tone {
  const r = btn.getBoundingClientRect()
  const stack = document.elementsFromPoint(r.left + r.width / 2, r.top + r.height / 2)
  for (const el of stack) {
    if (el.closest(".bh-root")) continue // the HUD (and this button) is not "the background"
    const cs = getComputedStyle(el)
    const solid = lumOf(cs.backgroundColor)
    if (solid !== null && /rgb\(|,\s*1\)/.test(cs.backgroundColor)) return solid > 0.4 ? "light" : "dark" // opaque colour
    if (cs.backgroundImage !== "none") {
      const g = lumOf(cs.backgroundImage)
      if (g !== null) return g > 0.4 ? "light" : "dark"
      if (cs.backgroundImage.includes("url(")) return "dark" // artwork (hero landscape fades to dark at its bottom)
    }
    if (solid !== null) return solid > 0.4 ? "light" : "dark"
  }
  return "dark" // page purple
}

/**
 * Expand / collapse control of the Bottom HUD: two stacked chevrons, no background, border or shadow.
 * Direction follows the real HUD state: collapsed (`mini`) → two chevrons up (expands), expanded → two chevrons down (collapses).
 */
export default function HudToggle({ mini, onToggle }: { mini: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const btn = ref.current
    if (!btn) return
    let raf = 0
    const update = () => {
      raf = 0
      /* Inside the expanded desktop bar the icon sits on the bar's own dark glass (it stays dark over any page), so it is always "dark backdrop".
         Floating states (collapsed, or the mobile layout where the handle sits on the bar's edge) read the page behind. */
      const floating = mini || getComputedStyle(btn).position === "absolute"
      btn.dataset.tone = floating ? toneBehind(btn) : "dark"
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    const scroller = document.getElementById("mf-scroll")
    scroller?.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    const timer = window.setInterval(schedule, 600) // layout / reveal animations / frame toggle change what is behind without a scroll
    return () => {
      if (raf) cancelAnimationFrame(raf)
      scroller?.removeEventListener("scroll", schedule)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
      window.clearInterval(timer)
    }
  }, [mini])

  const label = mini ? "ขยายแถบข้อมูล" : "ย่อแถบข้อมูล"
  return (
    <button ref={ref} type="button" className="bh-toggle bh-dc" data-tone="dark" aria-label={label} title={label} aria-expanded={!mini} onClick={onToggle}>
      <svg viewBox="0 0 24 24" aria-hidden focusable="false" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {mini ? (
          <>
            <path d="m6 11 6-6 6 6" />
            <path d="m6 19 6-6 6 6" />
          </>
        ) : (
          <>
            <path d="m6 5 6 6 6-6" />
            <path d="m6 13 6 6 6-6" />
          </>
        )}
      </svg>
    </button>
  )
}
