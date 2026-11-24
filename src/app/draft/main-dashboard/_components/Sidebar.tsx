"use client"

import { useState, useSyncExternalStore, type ReactNode } from "react"
import { useSkeleton, type OpenKey } from "./SkeletonContext"
import { BellIcon, BookIcon, CompassIcon, FairyIcon, GemIcon, KeyIcon, MailIcon, MapIcon, PurseIcon, QuestIcon, UserIcon } from "./icons"
import { HERO } from "../_mock/copy"
import { PLAYER } from "../_mock/guide"

type PageKey = "home" | "places" | "patch" | "members" | "guide"

const svg = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true } as const

/** Page navigation (top group). */
const PAGES: { key: PageKey; th: string; en: string; icon: ReactNode }[] = [
  { key: "home", th: "หน้าหลัก", en: "The Grand Hub", icon: <svg {...svg}><path d="M3 20h18M5 20V11l7-6 7 6v9M9 20v-5a3 3 0 0 1 6 0v5M12 5V2" /></svg> },
  { key: "places", th: "สถานที่", en: "Locations", icon: <svg {...svg}><path d="M12 21s-6.5-5.4-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15.6 12 21 12 21Z" /><circle cx="12" cy="10.5" r="2.4" /></svg> },
  { key: "patch", th: "Patch Update", en: "Patch Notes & Log", icon: <svg {...svg}><path d="M6 3h9l4 4v14H6zM15 3v4h4M9 12h7M9 16h5" /></svg> },
  { key: "members", th: "รายชื่อสมาชิก", en: "Members", icon: <svg {...svg}><circle cx="9" cy="8" r="3" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0M16 5.2a3 3 0 0 1 0 5.6M17.5 14.4A5.5 5.5 0 0 1 20.5 20" /></svg> },
  { key: "guide", th: "คู่มือการเล่น", en: "Guide", icon: <svg {...svg}><path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5C17 4 14 4.5 12 6ZM12 6v14.5" /></svg> },
]

/** Game tools: the shortcuts that used to live on the floating Task Bar rim. */
const TOOLS: { key: string; label: string; open: OpenKey; icon: ReactNode; badge?: string; meta?: string }[] = [
  { key: "map", label: "แผนที่โลก", open: "map", icon: <MapIcon /> },
  { key: "chat", label: "คริสตัลแชท", open: "chat", icon: <GemIcon /> },
  { key: "lore", label: "หนังสือคาถา", open: "lore", icon: <BookIcon /> },
  { key: "inv", label: "กระเป๋าไอเทม", open: "inv", icon: <KeyIcon />, badge: "2" },
  { key: "purse", label: "กระเป๋าเงิน", open: "purse", icon: <PurseIcon />, meta: PLAYER.kell.toLocaleString("en-US") },
  { key: "fairy", label: "ภูตนำทาง", open: "fairy", icon: <FairyIcon /> },
  { key: "quest", label: "บันทึกเควส", open: "quest", icon: <QuestIcon /> },
  { key: "compass", label: "เข็มทิศ", open: "map", icon: <CompassIcon /> },
]

/* Collapsed state is remembered per browser. It is an external store so the server render stays "expanded"
   and the saved value is applied on hydration without an effect; if storage is blocked it lives in memory. */
const STORE_KEY = "md-side-collapsed"
let collapsedNow: boolean | null = null
const collapsedListeners = new Set<() => void>()
function getCollapsed(): boolean {
  if (collapsedNow === null) {
    try {
      collapsedNow = window.localStorage.getItem(STORE_KEY) === "1"
    } catch {
      collapsedNow = false
    }
  }
  return collapsedNow
}
function setCollapsed(next: boolean) {
  collapsedNow = next
  try {
    window.localStorage.setItem(STORE_KEY, next ? "1" : "0")
  } catch {
    /* storage blocked: keep it in memory only */
  }
  collapsedListeners.forEach((fn) => fn())
}
function subscribeCollapsed(fn: () => void) {
  collapsedListeners.add(fn)
  return () => {
    collapsedListeners.delete(fn)
  }
}

/**
 * Left sidebar: its own sticky grid column, collapsible (248px ↔ 76px icon rail, remembered per browser).
 * Zones: page navigation · game tools (ex Task Bar) · player card with mail / notifications / account.
 * Below 900px it becomes an off-canvas drawer (always expanded).
 * Only "home" and "places" are real destinations on this page; the rest open the existing panels or placeholders.
 */
export default function Sidebar() {
  const { nav, view, mapOpen, navClick, goHome, open, openInfo, letters, notifications } = useSkeleton()
  const [drawer, setDrawer] = useState(false)
  const collapsed = useSyncExternalStore(subscribeCollapsed, getCollapsed, () => false)
  const toggleCollapsed = () => setCollapsed(!collapsed)

  const active: PageKey | null = view.name !== "home" ? null : nav === "map" && mapOpen ? "places" : nav === "home" ? "home" : null
  const unreadLetters = letters.filter((l) => l.unread).length
  const unreadNotifs = notifications.filter((n) => n.unread).length

  const selectPage = (key: PageKey) => {
    setDrawer(false)
    switch (key) {
      case "home":
        navClick("home")
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
  const run = (k: OpenKey) => {
    setDrawer(false)
    open(k)
  }

  return (
    <>
      <button type="button" className="md-burger" aria-label="เปิดเมนูหลัก" aria-expanded={drawer} onClick={() => setDrawer((v) => !v)}>
        <svg {...svg}>
          <path d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>
      {drawer && <div className="md-scrim" onClick={() => setDrawer(false)} aria-hidden />}

      <aside className={`md-side${collapsed ? " collapsed" : ""}${drawer ? " open" : ""}`} aria-label="เมนูหลัก">
        <div className="md-head">
          <button type="button" className="md-logo" onClick={goHome} aria-label="กลับสู่หน้าหลัก" title={collapsed ? "กลับสู่หน้าหลัก" : undefined}>
            <span className="md-logo-star" aria-hidden>
              ✦
            </span>
            <b>{HERO.brand}</b>
            <small>ROLEPLAY WORLD</small>
          </button>
          <button
            type="button"
            className="md-collapse"
            aria-label={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
            aria-expanded={!collapsed}
            title={collapsed ? "ขยายเมนู" : "ย่อเมนู"}
            onClick={toggleCollapsed}
          >
            <svg {...svg}>
              <path d="m15 6-6 6 6 6" />
            </svg>
          </button>
        </div>

        <div className="md-scroll">
          <nav aria-label="หน้าหลักของเว็บ">
            <ul className="md-list">
              {PAGES.map((it) => (
                <li key={it.key}>
                  <button
                    type="button"
                    className={`md-item${active === it.key ? " active" : ""}`}
                    aria-current={active === it.key ? "page" : undefined}
                    title={collapsed ? it.th : undefined}
                    onClick={() => selectPage(it.key)}
                  >
                    <span className="md-ico">{it.icon}</span>
                    <span className="md-txt">
                      <b>{it.th}</b>
                      <small>{it.en}</small>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md-group" role="presentation">
            <span>เครื่องมือ · TOOLS</span>
          </div>
          <ul className="md-list md-tools" aria-label="เครื่องมือในเกม">
            {TOOLS.map((t) => (
              <li key={t.key}>
                <button type="button" className="md-item md-tool" title={collapsed ? t.label : undefined} onClick={() => run(t.open)}>
                  <span className="md-ico">
                    {t.icon}
                    {t.badge && <span className="badge">{t.badge}</span>}
                  </span>
                  <span className="md-txt">
                    <b>{t.label}</b>
                  </span>
                  {t.meta && <span className="md-meta">{t.meta}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="md-user">
          <button type="button" className="md-me" onClick={() => run("profile")} title={collapsed ? `${PLAYER.name} — โปรไฟล์ตัวละคร` : undefined} aria-label="โปรไฟล์ตัวละคร">
            <span className="md-avatar" aria-hidden>
              <UserIcon />
            </span>
            <span className="md-me-txt">
              <b>{PLAYER.name}</b>
              <small>
                เลเวล {PLAYER.level} · {PLAYER.title}
              </small>
            </span>
          </button>
          <div className="md-quick">
            <button type="button" aria-label="จดหมายส่วนตัว" title="จดหมายส่วนตัว" onClick={() => run("pm")}>
              <MailIcon />
              {unreadLetters > 0 && <span className="badge">{unreadLetters}</span>}
            </button>
            <button type="button" aria-label="การแจ้งเตือน" title="การแจ้งเตือน" onClick={() => run("notif")}>
              <BellIcon />
              {unreadNotifs > 0 && <span className="badge">{unreadNotifs}</span>}
            </button>
            <button type="button" aria-label="บัญชี" title="บัญชี" onClick={() => open("account")}>
              <UserIcon />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
