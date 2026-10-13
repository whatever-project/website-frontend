"use client"

import { useEffect } from "react"

/**
 * Keeps <html lang> in sync on client-side navigation (e.g. after the 🌐 toggle).
 * The root layout sets it on the first render only; it doesn't re-render on soft navigation.
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])
  return null
}
