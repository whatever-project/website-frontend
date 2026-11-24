import type { ReactNode } from "react"
import type { OpenKey } from "../SkeletonContext"
import { BookIcon, CompassIcon, MapIcon, PurseIcon, QuestIcon, UserIcon } from "../icons"

/** Pages reachable from the World Navigation menu (this draft switches views with state, there are no real routes yet). */
export type PageKey = "home" | "forums" | "places" | "patch" | "members" | "guide"

export type MenuAction = { type: "page"; key: PageKey } | { type: "open"; key: OpenKey } | { type: "soon" }

export interface HudMenuItem {
  id: string
  label: string
  hint: string
  icon: ReactNode
  action: MenuAction
}

const s = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const

export const IC = {
  home: <svg {...s}><path d="M3 20h18M5 20V11l7-6 7 6v9M9 20v-5a3 3 0 0 1 6 0v5M12 5V2" /></svg>,
  forums: <svg {...s}><path d="M21 12a8 8 0 0 1-11.5 7.2L4 20l1-4.6A8 8 0 1 1 21 12Z" /></svg>,
  pin: <svg {...s}><path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.4" /></svg>,
  patch: <svg {...s}><path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5" /></svg>,
  members: <svg {...s}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 20" /></svg>,
  guide: <svg {...s}><path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5C17 4 14 4.5 12 6ZM12 6v14.5" /></svg>,
  bag: <svg {...s}><path d="M6 8h12l1 12H5zM9 8V6a3 3 0 0 1 6 0v2" /></svg>,
  bank: <svg {...s}><path d="m3 10 9-6 9 6M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" /></svg>,
  globe: <svg {...s}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" /></svg>,
  shield: <svg {...s}><path d="M12 3l8 3v6c0 4.5-3.2 8.2-8 9-4.8-.8-8-4.5-8-9V6z" /></svg>,
  chevronDown: <svg {...s}><path d="m6 9 6 6 6-6" /></svg>,
  chevronUp: <svg {...s}><path d="m6 15 6-6 6 6" /></svg>,
  close: <svg {...s}><path d="M6 6l12 12M18 6 6 18" /></svg>,
  leaf: <svg {...s}><path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14ZM5 19l7-7" /></svg>,
  sun: <svg {...s}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5" /></svg>,
  moon: <svg {...s}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5Z" /></svg>,
}

/** World Navigation: switches the page. */
export const WORLD_MENU: HudMenuItem[] = [
  { id: "home", label: "หน้าหลัก", hint: "Home · The Grand Hub", icon: IC.home, action: { type: "page", key: "home" } },
  { id: "forums", label: "ฟอรั่ม", hint: "Forums", icon: IC.forums, action: { type: "page", key: "forums" } },
  { id: "places", label: "สถานที่", hint: "Locations", icon: IC.pin, action: { type: "page", key: "places" } },
  { id: "patch", label: "แพตช์อัปเดต", hint: "Patch Updates", icon: IC.patch, action: { type: "page", key: "patch" } },
  { id: "members", label: "สมาชิก", hint: "Members", icon: IC.members, action: { type: "page", key: "members" } },
  { id: "guide", label: "คู่มือการเล่น", hint: "Guide", icon: IC.guide, action: { type: "page", key: "guide" } },
]

/** Personal & Gameplay: opens the existing in-game panels; unbuilt systems are marked "Coming Soon". */
export const PERSONAL_MENU: HudMenuItem[] = [
  { id: "inv", label: "กระเป๋าไอเทม", hint: "Inventory", icon: IC.bag, action: { type: "open", key: "inv" } },
  { id: "wallet", label: "กระเป๋าเงิน", hint: "Wallet", icon: <PurseIcon />, action: { type: "open", key: "purse" } },
  { id: "bank", label: "ธนาคารและห้องนิรภัย", hint: "Bank & Vault", icon: IC.bank, action: { type: "soon" } },
  { id: "quests", label: "เควส", hint: "Quests", icon: <QuestIcon />, action: { type: "open", key: "quest" } },
  { id: "explore", label: "สำรวจ", hint: "Exploration", icon: <CompassIcon />, action: { type: "soon" } },
  { id: "spell", label: "หนังสือคาถา", hint: "Spellbook", icon: <BookIcon />, action: { type: "open", key: "lore" } },
  { id: "map", label: "แผนที่โลก", hint: "World Map", icon: <MapIcon />, action: { type: "open", key: "map" } },
  { id: "profile", label: "โปรไฟล์ตัวละคร", hint: "Character Profile", icon: <UserIcon />, action: { type: "open", key: "profile" } },
]

export type HudMenuId = "world" | "personal"

export const MENUS: Record<HudMenuId, { title: string; sub: string; items: HudMenuItem[] }> = {
  world: { title: "นำทางโลก", sub: "World Navigation", items: WORLD_MENU },
  personal: { title: "ตัวละครและเกม", sub: "Personal & Gameplay", items: PERSONAL_MENU },
}
