"use client"

import { useSkeleton } from "../SkeletonContext"
import type { PageKey } from "./menus"

/**
 * Page switching shared by every navigation surface (hero panel, bottom HUD menus).
 * This draft has no real routes: "pages" are the views / panels held in SkeletonContext.
 * When real routes exist, change the cases below to router pushes (see _mock/heroNav.ts for the planned paths).
 */
export function usePageNav() {
  const { nav, view, mapOpen, navClick, goHome, open, openInfo } = useSkeleton()

  const currentPage: PageKey | null = view.name !== "home" ? "forums" : nav === "map" && mapOpen ? "places" : nav === "home" ? "home" : null

  const goPage = (key: PageKey) => {
    switch (key) {
      case "home":
        navClick("home")
        return
      case "forums":
        navClick("forums")
        return
      case "places":
        if (view.name !== "home") goHome()
        navClick("map")
        return
      case "patch":
        open("patchlog")
        return
      case "members": {
        const scroll = () => document.getElementById("sec-members")?.scrollIntoView({ behavior: "smooth", block: "start" })
        if (view.name !== "home") {
          goHome()
          window.setTimeout(scroll, 400)
        } else scroll()
        return
      }
      case "guide":
        openInfo("คู่มือการเล่น", <p style={{ lineHeight: 1.9 }}>[TBD: เนื้อหาคู่มือการเล่น — ยังไม่มีหน้าจริงสำหรับเมนูนี้]</p>)
        return
    }
  }

  return { currentPage, goPage }
}
