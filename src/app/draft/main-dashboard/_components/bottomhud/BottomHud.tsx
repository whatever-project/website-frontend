"use client"

import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { useSkeleton } from "../SkeletonContext"
import { BellIcon, MailIcon, UserIcon } from "../icons"
import { HUD_PLAYER, HUD_RESOURCES, HUD_WALLET, HUD_WORLD, KEL_PER_DRANKLE, type HudResource } from "../../_mock/hudStatus"
import { IC, MENUS, type HudMenuId, type HudMenuItem } from "./menus"
import { usePageNav } from "./usePageNav"
import HudToggle from "./HudToggle"

const pad = (n: number) => String(n).padStart(2, "0")
const fmtClock = (m: number) => `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`
const fmtCountdown = (s: number) => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`

/** Round coin icon (gold = Drankle, bronze = Kel). Swap for an SVG/PNG asset later. */
function Coin({ kind }: { kind: "D" | "K" }) {
  const id = `coin-${kind}`
  const [a, b] = kind === "D" ? ["#F3DDA6", "#B98F48"] : ["#D9A978", "#8A5A33"]
  return (
    <svg className="bh-coin" viewBox="0 0 20 20" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="1" stopColor={b} />
        </linearGradient>
      </defs>
      <circle cx="10" cy="10" r="9" fill={`url(#${id})`} />
      <circle cx="10" cy="10" r="6.2" fill="none" stroke="rgba(26,24,48,.45)" strokeWidth="1" />
    </svg>
  )
}

interface ResState extends HudResource {
  left: number
}

function ResourceBar({ r, compact = false }: { r: ResState; compact?: boolean }) {
  const pct = Math.max(0, Math.min(100, (r.cur / r.max) * 100))
  const full = r.cur >= r.max
  return (
    <div className={`bh-res bh-res-${r.key}${compact ? " compact" : ""}`}>
      <span className="bh-res-label">{r.label}</span>
      <div className="bh-bar-track" role="progressbar" aria-label={r.label} aria-valuemin={0} aria-valuemax={r.max} aria-valuenow={r.cur}>
        <div className="bh-bar-fill" style={{ width: `${pct}%` }} />
        <span className="bh-bar-val">
          {r.cur} / {r.max}
        </span>
      </div>
      {!compact && <span className="bh-res-regen">{full ? "เต็มแล้ว" : `+1 ใน ${fmtCountdown(r.left)}`}</span>}
    </div>
  )
}

function Wallet({ short = false }: { short?: boolean }) {
  const list = HUD_WALLET.filter((w) => !w.hidden)
  return (
    <div className="bh-wallet" title={`${KEL_PER_DRANKLE} Kel = 1 Drankle`}>
      {list.map((w, i) => (
        <span className="bh-wallet-item" key={w.code}>
          {i > 0 && <i className="bh-wallet-sep" aria-hidden />}
          <Coin kind={w.code} />
          <b>{w.amount.toLocaleString("en-US")}</b>
          <abbr title={w.name}>
            {w.code}
            {!short && <span className="bh-unit-full">{w.name.slice(1)}</span>}
          </abbr>
        </span>
      ))}
    </div>
  )
}

/** Large character portrait; rises above the bar. Shows `avatarUrl` (cover, focused on the face) or the initials when there is no picture / it fails to load. */
function PlayerPortrait({ onOpen }: { onOpen: () => void }) {
  const url = HUD_PLAYER.avatarUrl
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImg = !!url && failedUrl !== url
  return (
    <button type="button" className="bh-portrait" aria-label="โปรไฟล์ตัวละคร" title="โปรไฟล์ตัวละคร" onClick={onOpen}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element -- portrait URL comes from character data
        <img
          src={url}
          alt=""
          draggable={false}
          ref={(el) => {
            /* a missing file can fail before React attaches onError (server-rendered <img>): check once on mount */
            if (el && el.complete && el.naturalWidth === 0) queueMicrotask(() => setFailedUrl(url))
          }}
          onError={() => setFailedUrl(url)}
          style={{ objectPosition: HUD_PLAYER.avatarFocus, transformOrigin: HUD_PLAYER.avatarFocus, transform: `scale(${HUD_PLAYER.avatarZoom})` }}
        />
      ) : (
        <span className="bh-portrait-ph">{HUD_PLAYER.initials}</span>
      )}
    </button>
  )
}

/** Mail / notifications / account: three round buttons floating on an arc to the left of the portrait (no panel behind them). */
function ShortcutFloat({ letters, notifs, onOpen }: { letters: number; notifs: number; onOpen: (key: "pm" | "notif" | "account") => void }) {
  return (
    <div className="bh-shortcuts">
      <button type="button" className="bh-short bh-short-1" aria-label="จดหมายส่วนตัว" title="จดหมายส่วนตัว" onClick={() => onOpen("pm")}>
        <MailIcon />
        {letters > 0 && <span className="badge">{letters}</span>}
      </button>
      <button type="button" className="bh-short bh-short-2" aria-label="การแจ้งเตือน" title="การแจ้งเตือน" onClick={() => onOpen("notif")}>
        <BellIcon />
        {notifs > 0 && <span className="badge">{notifs}</span>}
      </button>
      <button type="button" className="bh-short bh-short-3" aria-label="บัญชี" title="บัญชี" onClick={() => onOpen("account")}>
        <UserIcon />
      </button>
    </div>
  )
}

/** Name, role and the one-line wallet, to the right of the portrait. */
function PlayerInfo() {
  return (
    <div className="bh-info">
      <div className="bh-name">{HUD_PLAYER.name}</div>
      <div className="bh-role">{HUD_PLAYER.role}</div>
      <Wallet />
    </div>
  )
}

/**
 * Bottom game HUD (replaces the left sidebar). Glass bar with four zones:
 * player · resources · world info · navigation. Two floating menus (World Navigation / Personal & Gameplay)
 * open above it, one at a time. The bar can be minimised (state lives in SkeletonContext as `mini`).
 */
export default function BottomHud() {
  const { mini, toggleMini, open, letters, notifications } = useSkeleton()
  const [menu, setMenu] = useState<HudMenuId | null>(null)
  const [res, setRes] = useState<ResState[]>(() => HUD_RESOURCES.map((r) => ({ ...r, left: r.regenLeft })))
  const [clock, setClock] = useState(HUD_WORLD.startMinutes)

  const rootRef = useRef<HTMLDivElement>(null)
  const barRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRefs = useRef<Record<HudMenuId, HTMLButtonElement | null>>({ world: null, personal: null })
  const mobileInit = useRef(false)

  /* demo ticks: resources regenerate by their countdown, the world clock runs 1 minute every 2 seconds */
  useEffect(() => {
    const id = window.setInterval(() => {
      setRes((list) =>
        list.map((r) => {
          if (r.cur >= r.max) return { ...r, left: r.regenEvery }
          if (r.left > 1) return { ...r, left: r.left - 1 }
          return { ...r, cur: r.cur + 1, left: r.regenEvery }
        }),
      )
    }, 1000)
    const cid = window.setInterval(() => setClock((m) => m + 1), 2000)
    return () => {
      window.clearInterval(id)
      window.clearInterval(cid)
    }
  }, [])

  /* the page reserves room for the HUD through --hud on .sk-root (also used by the toast / overlay / popover offsets) */
  useEffect(() => {
    const bar = barRef.current
    const root = bar?.closest<HTMLElement>(".sk-root")
    if (!bar || !root) return
    const apply = () => root.style.setProperty("--hud", `${Math.ceil(bar.getBoundingClientRect().height) + 22}px`)
    apply()
    const ro = new ResizeObserver(apply)
    ro.observe(bar)
    return () => {
      ro.disconnect()
      root.style.removeProperty("--hud")
    }
  }, [])

  /* phones start with the compact bar (once) */
  useEffect(() => {
    if (mobileInit.current) return
    mobileInit.current = true
    if (window.matchMedia("(max-width: 700px)").matches && !mini) toggleMini()
  }, [mini, toggleMini])

  /* close the floating menu: Escape (focus goes back to its button) and clicks outside the HUD */
  useEffect(() => {
    if (!menu) return
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRefs.current[menu]?.focus()
        setMenu(null)
      }
    }
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setMenu(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [menu])

  /* put keyboard focus on the current (or first) item when a menu opens */
  useEffect(() => {
    if (!menu) return
    const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]')
    const target = panelRef.current?.querySelector<HTMLElement>('[role="menuitem"].active') ?? items?.[0]
    target?.focus()
  }, [menu])

  const unreadLetters = letters.filter((l) => l.unread).length
  const unreadNotifs = notifications.filter((n) => n.unread).length

  const { currentPage, goPage } = usePageNav()

  const runItem = (item: HudMenuItem) => {
    const a = item.action
    if (a.type === "soon") return
    setMenu(null)
    if (a.type === "page") goPage(a.key)
    else open(a.key)
  }

  const toggleMenu = useCallback((id: HudMenuId) => setMenu((m) => (m === id ? null : id)), [])

  const onMenuKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'))
    const i = items.indexOf(document.activeElement as HTMLElement)
    let next = -1
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % items.length
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + items.length) % items.length
    else if (e.key === "Home") next = 0
    else if (e.key === "End") next = items.length - 1
    if (next >= 0) {
      e.preventDefault()
      items[next]?.focus()
    }
  }

  const minimise = () => {
    setMenu(null)
    toggleMini()
  }

  const isActive = (item: HudMenuItem) => menu === "world" && item.action.type === "page" && item.action.key === currentPage

  const menuButton = (id: HudMenuId, icon: ReactNode, label: string) => (
    <button
      type="button"
      ref={(el) => {
        triggerRefs.current[id] = el
      }}
      className={`bh-nav-btn${menu === id ? " on" : ""}`}
      aria-label={MENUS[id].sub}
      title={MENUS[id].sub}
      aria-haspopup="menu"
      aria-expanded={menu === id}
      aria-controls={`bh-menu-${id}`}
      onClick={() => toggleMenu(id)}
    >
      <span className="bh-nav-ico">{icon}</span>
      <span className="bh-nav-label">{label}</span>
    </button>
  )

  /* small round avatar used only by the minimised bar */
  const avatar = (
    <button type="button" className="bh-avatar" aria-label="โปรไฟล์ตัวละคร" title="โปรไฟล์ตัวละคร" onClick={() => open("profile")}>
      {HUD_PLAYER.initials}
    </button>
  )

  const panel = menu ? MENUS[menu] : null

  return (
    <div className="bh-root" ref={rootRef}>
      <div className="bh-wrap">
        {panel && menu && (
          <div className="bh-menu" id={`bh-menu-${menu}`} role="menu" aria-label={panel.sub} ref={panelRef} onKeyDown={onMenuKey}>
            <div className="bh-menu-head">
              <div>
                <b>{panel.title}</b>
                <small>{panel.sub}</small>
              </div>
              <button
                type="button"
                className="bh-menu-close"
                aria-label="ปิดเมนู"
                onClick={() => {
                  triggerRefs.current[menu]?.focus()
                  setMenu(null)
                }}
              >
                {IC.close}
              </button>
            </div>
            <div className="bh-grid">
              {panel.items.map((it) => {
                const soon = it.action.type === "soon"
                return (
                  <button
                    key={it.id}
                    type="button"
                    role="menuitem"
                    className={`bh-item${isActive(it) ? " active" : ""}${soon ? " soon" : ""}`}
                    aria-disabled={soon || undefined}
                    aria-current={isActive(it) ? "page" : undefined}
                    onClick={() => runItem(it)}
                  >
                    <span className="bh-item-ico">{it.icon}</span>
                    <span className="bh-item-label">{it.label}</span>
                    <small>{soon ? "Coming Soon" : it.hint}</small>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* a div, not a <section>: the wireframe CSS gives every <section> a big top padding */}
        <div className={`bh-bar${mini ? " is-mini" : ""}`} ref={barRef} role="region" aria-label="แถบสถานะตัวละครและเมนูหลัก">
          {mini ? (
            <>
              {avatar}
              <div className="bh-mini-res">
                {res.map((r) => (
                  <ResourceBar key={r.key} r={r} compact />
                ))}
              </div>
              <Wallet short />
              <div className="bh-mini-time" title={`${HUD_WORLD.date} · ${HUD_WORLD.season}`}>
                {fmtClock(clock)}
              </div>
              <div className="bh-mini-nav">
                {menuButton("world", IC.globe, "World")}
                {menuButton("personal", IC.shield, "Personal")}
              </div>
              <HudToggle mini onToggle={minimise} />
            </>
          ) : (
            <>
              {/* A · player */}
              <div className="bh-sec bh-a">
                <ShortcutFloat letters={unreadLetters} notifs={unreadNotifs} onOpen={open} />
                <PlayerPortrait onOpen={() => open("profile")} />
                <PlayerInfo />
              </div>

              {/* B · character resources */}
              <div className="bh-sec bh-b">
                <div className="bh-resources">
                  {res.map((r) => (
                    <ResourceBar key={r.key} r={r} />
                  ))}
                </div>
              </div>

              {/* C · world information */}
              <div className="bh-sec bh-c">
                <div className="bh-time" aria-label="เวลาในโลก">
                  {fmtClock(clock)}
                </div>
                <div className="bh-world">
                  <div className="bh-date">{HUD_WORLD.date}</div>
                  <div className="bh-chips">
                    <span title="ฤดู">
                      {IC.leaf}
                      {HUD_WORLD.season}
                    </span>
                    <span title="สภาพอากาศ">
                      {IC.sun}
                      {HUD_WORLD.weather} · {HUD_WORLD.temperature}°C
                    </span>
                    <span title="ข้างขึ้นข้างแรม">
                      {IC.moon}
                      {HUD_WORLD.moon}
                    </span>
                  </div>
                </div>
              </div>

              {/* D · navigation controls */}
              <div className="bh-sec bh-d">
                {menuButton("world", IC.globe, "World Navigation")}
                {menuButton("personal", IC.shield, "Personal & Gameplay")}
                <HudToggle mini={false} onToggle={minimise} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
