"use client"

import type { ReactNode } from "react"
import "../_styles/skeleton.css"
import { SkeletonProvider, useSkeleton } from "./SkeletonContext"
import { useReveal } from "./useReveal"
import Hud from "./hud/Hud"
import AccountPopover from "./hud/AccountPopover"
import Overlay from "./hud/Overlay"

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;0,900;1,400&family=Sarabun:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"

function SkeletonShell({ children }: { children: ReactNode }) {
  const { mini, toasts } = useSkeleton()
  const ref = useReveal<HTMLDivElement>()
  return (
    <>
      {/* React 19 hoists this into <head>. On promotion switch to next/font (see CONTEXT.md). */}
      <link rel="stylesheet" href={FONTS_HREF} precedence="skeleton-fonts" />
      <div className={`sk-root${mini ? " mini" : ""}`} ref={ref}>
        {children}
        <Hud />
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
