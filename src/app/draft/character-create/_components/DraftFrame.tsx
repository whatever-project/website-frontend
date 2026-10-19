import Link from "next/link"
import type { ReactNode } from "react"
import { Flourish, InkDivider } from "@/components/Parchment"
import { routes } from "@/config/routes"

interface DraftFrameProps {
  /** small caps line above the title, e.g. "— IDENTITY · STEP III OF VI —" */
  sub: string
  title: string
  children: ReactNode
}

/**
 * Page frame matching the character-create screenshots: own header
 * (← กลับสู่หมู่บ้าน / ✦ Arcane Vale) instead of ParchShell, so the
 * sub-line can change per step and no language switcher is shown.
 */
export default function DraftFrame({ sub, title, children }: DraftFrameProps) {
  return (
    <div className="parch-bg relative min-h-screen w-full overflow-x-hidden">
      <div className="parch-vignette pointer-events-none absolute inset-0 z-10" />

      <header className="relative z-20 flex items-center justify-between px-6 pt-7 sm:px-12">
        <Link
          href={routes.home}
          className="parch-label group flex items-center gap-2 whitespace-nowrap transition hover:text-[#3a2c1a]"
        >
          <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
          กลับสู่หมู่บ้าน
        </Link>
        <span className="parch-label flex items-center gap-2 whitespace-nowrap">
          <Flourish className="h-4 w-4 text-[#8a6a35]" />
          Arcane Vale
        </span>
      </header>

      <div className="relative z-20 px-6 pt-10 text-center sm:px-12">
        <p className="parch-label mb-3">{sub}</p>
        <h1
          className="font-jimthompson text-4xl tracking-tight text-[#3a2c1a] sm:text-5xl"
          style={{ textShadow: "0 1px 0 rgba(255,250,235,.6)" }}
        >
          {title}
        </h1>
        <div className="mx-auto mt-5 max-w-xs">
          <InkDivider>
            <Flourish className="h-5 w-5" />
          </InkDivider>
        </div>
      </div>

      <div className="relative z-20">{children}</div>

      <footer className="relative z-20 px-6 pt-14 pb-10 text-center sm:px-12">
        <p className="parch-label">✦ Arcane Vale — ชุมชนโรลเพลย์ในหุบเขาเวทมนตร์ ✦</p>
      </footer>
    </div>
  )
}
