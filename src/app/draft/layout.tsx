"use client"

import { NextIntlClientProvider } from "next-intl"
import { messages } from "@/messages/index"
import HtmlLang from "@/components/HtmlLang"
import type { ReactNode } from "react"

interface DraftLayoutProps {
  children: ReactNode
}

/**
 * Draft layout — minimal shell, no Next.js locale routing.
 * Provides next-intl context with the default (Thai) locale so that
 * components like LanguageSwitcher work in draft pages.
 * Used for designer drafts and dev-tools only.
 */
export default function DraftLayout({ children }: DraftLayoutProps) {
  return (
    <NextIntlClientProvider locale="th" messages={messages.th}>
      <HtmlLang lang="th" />
      {children}
    </NextIntlClientProvider>
  )
}
