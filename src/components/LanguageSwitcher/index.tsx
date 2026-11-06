"use client"

import { useLocale } from "next-intl"
import { usePathname as useRawPathname } from "next/navigation"
import { useRouter, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { DRAFT_PREFIX } from "@/config/routes"
import { FaGlobe } from "react-icons/fa";
import { useDraftLang } from "@/components/DraftLang"

// Label for the target language, written in that language
const SWITCH_LABEL: Record<string, string> = {
  th: "เปลี่ยนเป็นภาษาไทย",
  en: "Switch to English",
}

const TONES = {
  parch: "border-[#c9ad77] text-[#6b5533] hover:border-[#8a6a35] hover:text-[#3a2c1a]",
  night: "border-amber-100/30 text-amber-100/80 hover:border-amber-100/60 hover:text-amber-50",
} as const

/**
 * 🌐 one-click toggle between th and en. Keeps the current path + query string.
 * Rendered in page headers next to the "Whatever" label. On /draft pages (no locale routing) it toggles the draft-local language instead.
 */
export default function LanguageSwitcher({ tone = "parch" }: { tone?: keyof typeof TONES }) {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const rawPathname = useRawPathname()

  const draft = useDraftLang()
  const inDraft = rawPathname === DRAFT_PREFIX || rawPathname.startsWith(`${DRAFT_PREFIX}/`)

  const current = inDraft ? draft.lang : locale
  const next = routing.locales.find((l) => l !== current) ?? routing.defaultLocale

  const switchLocale = () => {
    if (inDraft) {
      draft.toggle()
      return
    }
    router.replace(`${pathname}${window.location.search}${window.location.hash}`, { locale: next })
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      aria-label={SWITCH_LABEL[next]}
      title={SWITCH_LABEL[next]}
      className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1 font-ui text-[11px] tracking-[0.2em] uppercase transition ${TONES[tone]}`}
    >
      <span aria-hidden className="text-sm leading-none tracking-normal"><FaGlobe /></span>
      {current}
    </button>
  )
}
