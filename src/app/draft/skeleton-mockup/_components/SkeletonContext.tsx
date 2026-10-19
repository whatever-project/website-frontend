"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { CRYSTALS, type Crystal } from "../_mock/crystals"
import { EMERGENCY, QUEST, type NavKey } from "../_mock/copy"
import type { ForumKey } from "../_mock/forums"
import { CHAT_SEED, PLAYER, type ChatMessage } from "../_mock/guide"
import { LETTERS, NOTIFICATIONS, type Letter, type Notification } from "../_mock/hud"
import { NOTE_SLOTS } from "../_mock/home"
import { AchieveInfo, EmergencyInfo, PatchLogInfo, PurseInfo, QuestInfo } from "./infoContent"

/** Overlay panels (the wireframe's .pnl elements). "info" shows whatever `openInfo` was given. */
export type PanelId = "info" | "profile" | "note" | "crys" | "pm" | "notif" | "map" | "chat" | "inv" | "fairy" | "cal" | "lore"

/** Keys the buttons pass to `open()` (the wireframe's data-open values). */
export type OpenKey = "account" | "purse" | "patchlog" | "quest" | "achieve" | "emergency" | Exclude<PanelId, "info" | "note" | "crys" | "cal">

export type View = { name: "home" } | { name: "forums" } | { name: "forum"; key: ForumKey }

export interface UserNote {
  text: string
  slot: { l: number; t: number }
  /** degrees */
  tilt: number
}

interface ToastItem {
  id: number
  text: string
}

interface SkeletonContextValue {
  view: View
  goHome: () => void
  openForums: () => void
  openForum: (key: ForumKey) => void

  nav: NavKey
  mapOpen: boolean
  navClick: (key: NavKey) => void

  panel: PanelId | null
  info: { title: string; node: ReactNode } | null
  accountOpen: boolean
  openPanel: (id: PanelId) => void
  openInfo: (title: string, node: ReactNode) => void
  open: (key: OpenKey) => void
  closeAll: () => void

  mini: boolean
  toggleMini: () => void

  kell: number
  userNotes: UserNote[]
  publishNote: (text: string) => void

  crystals: Crystal[]
  crystalFresh: boolean
  addCrystal: (text: string, img: string | null) => Crystal

  letters: Letter[]
  readLetter: (index: number) => void
  notifications: Notification[]
  readNotification: (index: number) => void

  chat: ChatMessage[]
  sendChat: (text: string) => void

  toasts: ToastItem[]
}

const Ctx = createContext<SkeletonContextValue | null>(null)

export function useSkeleton(): SkeletonContextValue {
  const v = useContext(Ctx)
  if (!v) throw new Error("useSkeleton must be used inside <SkeletonProvider>")
  return v
}

const pad = (n: number) => String(n).padStart(2, "0")

export function SkeletonProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<View>({ name: "home" })
  const [nav, setNav] = useState<NavKey>("home")
  const [mapOpen, setMapOpen] = useState(false)
  const [panel, setPanel] = useState<PanelId | null>(null)
  const [info, setInfo] = useState<{ title: string; node: ReactNode } | null>(null)
  const [accountOpen, setAccountOpen] = useState(false)
  const [mini, setMini] = useState(false)
  const [kell, setKell] = useState<number>(PLAYER.kell)
  const [userNotes, setUserNotes] = useState<UserNote[]>([])
  const [crystals, setCrystals] = useState<Crystal[]>(CRYSTALS)
  const [crystalFresh, setCrystalFresh] = useState(false)
  const [letters, setLetters] = useState<Letter[]>(LETTERS)
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS)
  const [chat, setChat] = useState<ChatMessage[]>(CHAT_SEED)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const toastId = useRef(0)

  const scrollTop = (behavior: ScrollBehavior) => window.scrollTo({ top: 0, behavior })

  /* ---------- views ---------- */
  const goHome = useCallback(() => {
    setView({ name: "home" })
    setMapOpen(false)
    setNav("home")
    scrollTop("smooth")
  }, [])
  const openForums = useCallback(() => {
    setView({ name: "forums" })
    scrollTop("instant")
  }, [])
  const openForum = useCallback((key: ForumKey) => {
    setView({ name: "forum", key })
    scrollTop("instant")
  }, [])

  /* ---------- overlay panels ---------- */
  const openPanel = useCallback((id: PanelId) => {
    setPanel(id)
    setAccountOpen(false)
  }, [])
  const openInfo = useCallback(
    (title: string, node: ReactNode) => {
      setInfo({ title, node })
      openPanel("info")
    },
    [openPanel],
  )
  const closeAll = useCallback(() => {
    setPanel(null)
    setAccountOpen(false)
  }, [])

  const open = useCallback(
    (key: OpenKey) => {
      switch (key) {
        case "account":
          setAccountOpen((v) => !v)
          return
        case "purse":
          openInfo(`กระเป๋าเงิน — ${PLAYER.kell.toLocaleString("en-US")} อาร์เจนต์`, <PurseInfo />)
          return
        case "patchlog":
          openInfo("แพตช์ล็อก — ทุกรุ่น", <PatchLogInfo />)
          return
        case "quest":
          openInfo(QUEST.infoTitle, <QuestInfo />)
          return
        case "achieve":
          openInfo(QUEST.honorBtn, <AchieveInfo />)
          return
        case "emergency":
          openInfo(
            EMERGENCY.infoTitle,
            <EmergencyInfo meta={EMERGENCY.infoMeta} quote={EMERGENCY.quote} cta={EMERGENCY.infoCta} />,
          )
          return
        default:
          openPanel(key)
      }
    },
    [openInfo, openPanel],
  )

  /* Esc closes the overlay */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAll()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [closeAll])

  /* ---------- hero nav ---------- */
  const navClick = useCallback(
    (key: NavKey) => {
      setNav(key)
      if (key === "home") goHome()
      if (key === "map") setMapOpen((v) => !v)
      if (key === "calendar") {
        setMapOpen(false)
        openPanel("cal")
      }
      if (key === "forums") openForums()
    },
    [goHome, openForums, openPanel],
  )

  /* ---------- toasts ---------- */
  const toast = useCallback((text: string) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, text }])
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3300)
  }, [])

  /* ---------- mock economy / content ---------- */
  const publishNote = useCallback(
    (text: string) => {
      const next = kell - PLAYER.noteCost
      setKell(next)
      setUserNotes((notes) => {
        const n = notes.length + 1
        return [...notes, { text, slot: NOTE_SLOTS[(n - 1) % NOTE_SLOTS.length], tilt: n % 2 ? -2 : 2 }]
      })
      closeAll()
      toast(`จ่าย ${PLAYER.noteCost} เคล — เหลือ ${next.toLocaleString("en-US")} เคล · ประกาศถูกปักบนกระดานแล้ว`)
    },
    [kell, closeAll, toast],
  )

  const addCrystal = useCallback((text: string, img: string | null): Crystal => {
    const c: Crystal = {
      name: PLAYER.name,
      time: "เมื่อสักครู่",
      text: text || "(แบ่งปันรูปภาพ)",
      img,
      likes: 0,
      comments: 0,
    }
    setCrystals((list) => [c, ...list])
    setCrystalFresh(true)
    return c
  }, [])

  const readLetter = useCallback((i: number) => setLetters((l) => l.map((m, j) => (j === i ? { ...m, unread: false } : m))), [])
  const readNotification = useCallback(
    (i: number) => setNotifications((l) => l.map((n, j) => (j === i ? { ...n, unread: false } : n))),
    [],
  )

  const sendChat = useCallback((text: string) => {
    const d = new Date()
    setChat((c) => [...c, { name: PLAYER.name, time: `${pad(d.getHours())}:${pad(d.getMinutes())}`, text }])
  }, [])

  const value = useMemo<SkeletonContextValue>(
    () => ({
      view,
      goHome,
      openForums,
      openForum,
      nav,
      mapOpen,
      navClick,
      panel,
      info,
      accountOpen,
      openPanel,
      openInfo,
      open,
      closeAll,
      mini,
      toggleMini: () => setMini((v) => !v),
      kell,
      userNotes,
      publishNote,
      crystals,
      crystalFresh,
      addCrystal,
      letters,
      readLetter,
      notifications,
      readNotification,
      chat,
      sendChat,
      toasts,
    }),
    [
      view, goHome, openForums, openForum, nav, mapOpen, navClick, panel, info, accountOpen, openPanel, openInfo, open, closeAll,
      mini, kell, userNotes, publishNote, crystals, crystalFresh, addCrystal, letters, readLetter, notifications, readNotification,
      chat, sendChat, toasts,
    ],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
