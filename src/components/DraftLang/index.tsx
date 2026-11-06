"use client"

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react"

export type DraftLang = "th" | "en"

const STORAGE_KEY = "draft-lang"

interface DraftLangValue {
  lang: DraftLang
  setLang: (l: DraftLang) => void
  toggle: () => void
}

const DraftLangContext = createContext<DraftLangValue>({ lang: "th", setLang: () => {}, toggle: () => {} })

/**
 * Language state for /draft pages only (drafts have no locale routing).
 * Remembered in localStorage so it survives moving between draft pages.
 */
export function DraftLangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<DraftLang>("th")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "th" || saved === "en") setLangState(saved)
    } catch {}
  }, [])

  const setLang = useCallback((l: DraftLang) => {
    setLangState(l)
    try {
      localStorage.setItem(STORAGE_KEY, l)
    } catch {}
  }, [])

  const toggle = useCallback(() => setLang(lang === "th" ? "en" : "th"), [lang, setLang])

  return <DraftLangContext.Provider value={{ lang, setLang, toggle }}>{children}</DraftLangContext.Provider>
}

export function useDraftLang() {
  return useContext(DraftLangContext)
}
