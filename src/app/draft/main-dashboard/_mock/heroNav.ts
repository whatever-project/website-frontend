import type { PageKey } from "../_components/bottomhud/menus"

/**
 * Items of the frosted-glass navigation in the hero.
 * `route` is the path the page should get once it exists; it is `null` for every page that has no real route yet,
 * so no fake link is ever rendered. Today each item runs the matching action of the draft (view / panel / scroll).
 */
export interface HeroNavItem {
  id: PageKey
  th: string
  en: string
  route: string | null
  /** what exists today */
  status: string
}

export const HERO_NAV: HeroNavItem[] = [
  { id: "home", th: "หน้าหลัก", en: "Community Dashboard", route: null, status: "this page (draft view `home`); live route TBD" },
  { id: "forums", th: "สำรวจดินแดน", en: "World Forums", route: null, status: "draft view `forums` (list + forum detail); no real route yet" },
  { id: "patch", th: "แพตช์", en: "Patch Updates", route: null, status: "opens the patch-log panel; no page yet" },
  { id: "members", th: "รายชื่อสมาชิก", en: "Members", route: null, status: "scrolls to the Members section; no page yet" },
  { id: "guide", th: "คู่มือการเล่น", en: "Guide", route: null, status: "placeholder panel [TBD]; no page yet" },
]
