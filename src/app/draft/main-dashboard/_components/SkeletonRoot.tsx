"use client"

import type { ReactNode } from "react"
import "../_styles/skeleton.css"
import "../_styles/fantasy.css"
import "../_styles/frame.css"
import "../_styles/hud-compact.css"
import "../_styles/frameless.css"
import "../_styles/sky-mist.css"
import "../_styles/hud-toggle.css"
import { SkeletonProvider, useSkeleton } from "./SkeletonContext"
import { useReveal } from "./useReveal"
import BottomHud from "./bottomhud/BottomHud"
import PageFrame from "./frame/PageFrame"
import FrameToggle from "./frame/FrameToggle"
import { useFrameVisible } from "./frame/useFrameVisible"
import { useCloudDrift } from "./frame/useCloudDrift"
import { useShowDashboardContent } from "./frame/useShowDashboardContent"
import AccountPopover from "./hud/AccountPopover"
import Overlay from "./hud/Overlay"

function SkeletonShell({ children }: { children: ReactNode }) {
  const { mini, toasts } = useSkeleton()
  const [frameVisible] = useFrameVisible()
  const [cloudDrift] = useCloudDrift()
  const [showDashboardContent] = useShowDashboardContent()
  /* the key makes useReveal observe the sections that appear when the preview flag turns on (otherwise they stay at opacity 0 forever) */
  const ref = useReveal<HTMLDivElement>(showDashboardContent ? "content" : "hero-only")
  return (
    <>
      {/* Fonts: Jim Thompson Roman (English + headings, @font-face in fantasy.css) + IBM Plex Sans Thai (Thai body, @import in globals.css). */}
      <div className={`sk-root${mini ? " mini" : ""}${frameVisible ? "" : " no-frame"}${cloudDrift ? "" : " no-drift"}${showDashboardContent ? "" : " sk-preview"}`} ref={ref}>
        <PageFrame>{children}</PageFrame>
        {/* preview-only switch for the decorative frame (frameVisible) */}
        <FrameToggle />
        {/* Bottom game HUD replaces the old left sidebar. The earlier dome (hud/Hud.tsx) is no longer rendered. */}
        <BottomHud />
        <AccountPopover />
        <Overlay />
        {toasts.map((t) => (
          <div className="toast" role="status" key={t.id}>
            {t.text}
          </div>
        ))}
      </div>
    </>
  )
}

/** Scope + providers for the wireframe: all CSS is prefixed with `.sk-root`, all state lives in SkeletonContext. */
export default function SkeletonRoot({ children }: { children: ReactNode }) {
  return (
    <SkeletonProvider>
      <SkeletonShell>{children}</SkeletonShell>
    </SkeletonProvider>
  )
}
