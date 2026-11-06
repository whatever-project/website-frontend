"use client"

import { NextIntlClientProvider } from "next-intl"
import { messages } from "@/messages/index"
import HtmlLang from "@/components/HtmlLang"
import { DraftLangProvider, useDraftLang } from "@/components/DraftLang"
import type { ReactNode } from "react"

interface DraftLayoutProps {
  children: ReactNode
}

function DraftIntl({ children }: { children: ReactNode }) {
  const { lang } = useDraftLang()
  return (
    <NextIntlClientProvider locale={lang} messages={messages[lang]}>
      <HtmlLang lang={lang} />
      {children}
    </NextIntlClientProvider>
  )
}

/**
 * Draft layout — minimal shell, no Next.js locale routing.
 * Language (th/en) lives in DraftLangProvider; the shared shell strings
 * (ParchShell header/footer) follow it through next-intl, and each draft page
 * swaps its own mock copy with useDraftLang().
 * Used for designer drafts and dev-tools only.
 */
export default function DraftLayout({ children }: DraftLayoutProps) {
  return (
    <DraftLangProvider>
      <DraftIntl>{children}</DraftIntl>
    </DraftLangProvider>
  )
}
