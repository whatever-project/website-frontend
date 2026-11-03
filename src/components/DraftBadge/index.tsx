"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { routes, DRAFT_PREFIX, DRAFT_HUB } from "@/config/routes"

/**
 * Floating button on every page.
 * Live page → "Go to Drafts" (draft hub). Draft page → "Back to Dev Tools" (draft hub).
 * Dev tools page itself → "Exit Drafts" (home).
 */
export default function DraftBadge() {
  const pathname = usePathname()
  const inDrafts = pathname === DRAFT_PREFIX || pathname.startsWith(`${DRAFT_PREFIX}/`)
  const onHub = pathname === DRAFT_HUB

  const href = onHub ? routes.home : DRAFT_HUB
  const label = onHub ? "✕ Exit Drafts" : inDrafts ? "↪ Back to Dev Tools" : "✎ Go to Drafts"

  return (
    <Link
      href={href}
      className="fixed right-4 bottom-4 z-50 rounded-full border border-[#8a6a35] bg-[#f2e7cb]/95 px-4 py-2 font-ui text-xs tracking-widest text-[#5d4626] uppercase shadow-[0_6px_18px_rgba(80,58,22,0.35)] transition hover:-translate-y-0.5 hover:text-[#3a2c1a]"
    >
      {label}
    </Link>
  )
}
