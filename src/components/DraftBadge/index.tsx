"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { routes, DRAFT_PREFIX, DRAFT_HUB } from "@/config/routes"

const LIVE_PATHS: readonly string[] = Object.values(routes)

/**
 * Floating button on every page.
 * Live page → "Go to Drafts" (draft hub). Draft page → "Exit Drafts" (matching live page, else home).
 */
export default function DraftBadge() {
  const pathname = usePathname()
  const inDrafts = pathname === DRAFT_PREFIX || pathname.startsWith(`${DRAFT_PREFIX}/`)

  const livePath = pathname.slice(DRAFT_PREFIX.length) || routes.home
  const href = inDrafts ? (LIVE_PATHS.includes(livePath) ? livePath : routes.home) : DRAFT_HUB

  return (
    <Link
      href={href}
      className="fixed right-4 bottom-4 z-50 rounded-full border border-[#8a6a35] bg-[#f2e7cb]/95 px-4 py-2 font-ui text-xs tracking-widest text-[#5d4626] uppercase shadow-[0_6px_18px_rgba(80,58,22,0.35)] transition hover:-translate-y-0.5 hover:text-[#3a2c1a]"
    >
      {inDrafts ? "✕ Exit Drafts" : "✎ Go to Drafts"}
    </Link>
  )
}
