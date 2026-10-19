"use client"

import Link from "next/link"
import { routes } from "@/config/routes"

/** Active design drafts. Add a line when a draft is created; keep it after dev ships the page (designers still use the draft); remove it only when the dev team explicitly deletes the draft. */
const DRAFTS = [
  { label: "Account (profile picker + account settings)", draft: "/draft/account", live: routes.account },
  { label: "สร้างตัวละคร (Character Create)", draft: "/draft/character-create", live: "/character-create" },
  { label: "หน้าหลักฟอรั่ม (Skeleton Mockup)", draft: "/draft/skeleton-mockup", live: "/skeleton-mockup" },
]

/**
 * Dev-tools draft page — draft hub and developer utilities.
 * Reached via the floating DraftBadge ("Go to Drafts") on every live page.
 */
export default function DevToolsPage() {
  return (
    <div className="parch-bg min-h-screen">
      <div className="mx-auto max-w-2xl px-6 py-16 space-y-10">
        <header>
          <h1 className="font-jimthompson text-3xl text-[#3a2c1a]">Dev Tools</h1>
          <p className="parch-label mt-1">Design drafts and internal developer utilities</p>
        </header>

        <section className="parch-sheet p-8 space-y-3">
          <h2 className="font-jimthompson text-xl text-[#3a2c1a]">Drafts</h2>
          <ul className="space-y-2 font-ui text-[13px] text-[#5d4626]">
            {DRAFTS.map((d) => (
              <li key={d.draft}>
                <Link href={d.draft} className="underline decoration-dotted hover:text-[#3a2c1a]">{d.label}</Link>
                <span className="text-[#a68d5f]"> · live: </span>
                <Link href={d.live} className="underline decoration-dotted hover:text-[#3a2c1a]">{d.live}</Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="parch-sheet p-8 space-y-3">
          <h2 className="font-jimthompson text-xl text-[#3a2c1a]">Quick Links</h2>
          <ul className="space-y-2 font-ui text-[13px] text-[#5d4626]">
            <li><Link href={routes.home} className="underline decoration-dotted hover:text-[#3a2c1a]">Landing Page</Link></li>
            <li><Link href={routes.login} className="underline decoration-dotted hover:text-[#3a2c1a]">Login</Link></li>
            <li><Link href={routes.dashboard} className="underline decoration-dotted hover:text-[#3a2c1a]">Dashboard</Link></li>
          </ul>
        </section>
      </div>
    </div>
  )
}
