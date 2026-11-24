"use client"

import type { ReactNode } from "react"
import { useFrameVisible } from "./useFrameVisible"

/**
 * Viewport-fixed ornamental frame around a scrolling page (desktop ≥ 901px; narrower screens fall back to a normal page).
 *
 *  - `.mf-frame`  : decorative layer, `position: fixed`, only draws summer-main-frame.png (nine-slice, no pointer events).
 *  - `.mf-scroll` : the scroll container. It sits inside the frame's safe insets and is clipped at the hanging flowers,
 *                   so content can never run under the golden border. The frame is NOT part of the scrolling content.
 *
 * All geometry comes from the CSS variables in `_styles/frame.css` (`--u` = one source pixel of the artwork at the current screen size).
 * Reusable: wrap any page's content with <PageFrame> and import frame.css.
 */
export default function PageFrame({ children }: { children: ReactNode }) {
  const [frameVisible] = useFrameVisible()
  /* the scroll container is always rendered (same element, so the page content keeps its state and scroll position); when the frame is off,
     the frame layers are not rendered at all and `.sk-root.no-frame` (frameless.css) turns the container into a normal page flow */
  return (
    <>
      <div className="mf-scroll" id="mf-scroll" tabIndex={0} role="region" aria-label="เนื้อหาหน้าเว็บ">
        <div className="mf-inner">{children}</div>
      </div>
      {frameVisible && (
        <>
          {/* corner decorations: above the page, below the HUD and the frame */}
          {/* eslint-disable @next/next/no-img-element -- static decorative overlays, sized in CSS from the frame scale */}
          <img className="mf-corner mf-corner-l" src="/assets/main-dashboard/main-element-left.png" alt="" aria-hidden draggable={false} />
          <img className="mf-corner mf-corner-r" src="/assets/main-dashboard/main-element-right.png" alt="" aria-hidden draggable={false} />
          {/* eslint-enable @next/next/no-img-element */}
          <div className="mf-frame" aria-hidden />
        </>
      )}
    </>
  )
}
