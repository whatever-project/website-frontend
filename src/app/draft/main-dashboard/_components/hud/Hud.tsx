"use client"

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react"
import { useSkeleton, type OpenKey } from "../SkeletonContext"
import {
  BellIcon,
  BookIcon,
  ChevronIcon,
  CompassIcon,
  FairyIcon,
  GemIcon,
  KeyIcon,
  MailIcon,
  MapIcon,
  PurseIcon,
  QuestIcon,
  SnowIcon,
  UserIcon,
} from "../icons"
import { PLAYER } from "../../_mock/guide"

interface RimIcon {
  key: string
  tip: string
  open: OpenKey
  icon: ReactNode
  badge?: string
}

/** The 8 round icons that sit on the curved rim of the HUD dome (scrollable). */
const RIM_ICONS: RimIcon[] = [
  { key: "map", tip: "แผนที่โลก", open: "map", icon: <MapIcon /> },
  { key: "chat", tip: "คริสตัลแชท", open: "chat", icon: <GemIcon /> },
  { key: "lore", tip: "หนังสือคาถา", open: "lore", icon: <BookIcon /> },
  { key: "inv", tip: "กระเป๋าไอเทม", open: "inv", icon: <KeyIcon />, badge: "2" },
  { key: "purse", tip: `กระเป๋าเงิน — ${PLAYER.kell.toLocaleString("en-US")} อาร์เจนต์`, open: "purse", icon: <PurseIcon /> },
  { key: "fairy", tip: "ภูตนำทาง", open: "fairy", icon: <FairyIcon /> },
  { key: "quest", tip: "บันทึกเควส", open: "quest", icon: <QuestIcon /> },
  { key: "compass", tip: "เข็มทิศ", open: "map", icon: <CompassIcon /> },
]

const RIM_STEP = 24
const RIM_SPAN = 48

const fmtClock = (m: number) => `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`

/**
 * Fixed bottom HUD: a half-circle "dome" with the character, quick icons (mail / notifications / account)
 * and a scrollable rim of round shortcuts. The toggle shrinks it to a thin bar ("mini").
 */
export default function Hud() {
  const { mini, toggleMini, open, letters, notifications } = useSkeleton()
  const [worldTime, setWorldTime] = useState(21 * 60 + 47)

  const hudRef = useRef<HTMLDivElement>(null)
  const avatarRef = useRef<HTMLButtonElement>(null)
  const plateRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const rimRef = useRef<HTMLDivElement>(null)
  const prevRef = useRef<HTMLButtonElement>(null)
  const nextRef = useRef<HTMLButtonElement>(null)
  const iconRefs = useRef<(HTMLButtonElement | null)[]>([])
  const rimOffset = useRef(0)

  /* in-world clock: +1 minute every 2 s */
  useEffect(() => {
    const id = window.setInterval(() => setWorldTime((t) => t + 1), 2000)
    return () => window.clearInterval(id)
  }, [])

  /* Place avatar, stack icons, nameplate and rim icons on the dome's ellipse (needs measured size → done on the DOM). */
  const layout = useCallback(() => {
    const hud = hudRef.current
    const avatar = avatarRef.current
    const plate = plateRef.current
    const stack = stackRef.current
    if (!hud || !avatar || !plate || !stack || mini) return
    const W = hud.offsetWidth
    const H = hud.offsetHeight
    const cx = W / 2
    const cy = H - 2
    const rx = W / 2 - 4
    const ry = H - 6
    const pt = (deg: number): [number, number] => {
      const r = (deg * Math.PI) / 180
      return [cx + rx * Math.cos(r), cy - ry * Math.sin(r)]
    }
    const [x, y] = pt(143)
    avatar.style.left = `${x}px`
    avatar.style.top = `${y}px`
    stack.style.left = "0px"
    stack.style.top = "0px"
    stack.querySelectorAll<HTMLElement>(".hicon").forEach((h, i) => {
      const a = ((150 + i * 30) * Math.PI) / 180
      h.style.left = `${x + Math.cos(a) * 84}px`
      h.style.top = `${y + Math.sin(a) * 84}px`
    })
    plate.style.left = `${x}px`
    plate.style.top = `${y + 66}px`
    iconRefs.current.forEach((ic, i) => {
      if (!ic) return
      const a = 122 - i * RIM_STEP + rimOffset.current
      const [px, py] = pt(a)
      ic.style.left = `${px}px`
      ic.style.top = `${py}px`
      const hide = a > 134 || a < 10
      ic.style.opacity = hide ? "0" : "1"
      ic.style.pointerEvents = hide ? "none" : "auto"
    })
    if (prevRef.current) prevRef.current.style.opacity = rimOffset.current <= 0 ? ".3" : "1"
    if (nextRef.current) nextRef.current.style.opacity = rimOffset.current >= RIM_SPAN ? ".3" : "1"
  }, [mini])

  const rimScroll = useCallback(
    (d: number) => {
      rimOffset.current = Math.max(0, Math.min(RIM_SPAN, rimOffset.current + d))
      layout()
    },
    [layout],
  )

  /* layout on mount / resize / mini toggle; the dome width animates, so re-run when its transition ends */
  useEffect(() => {
    layout()
    const hud = hudRef.current
    window.addEventListener("resize", layout)
    hud?.addEventListener("transitionend", layout)
    return () => {
      window.removeEventListener("resize", layout)
      hud?.removeEventListener("transitionend", layout)
    }
  }, [layout])

  /* wheel / drag on the rim scrolls the icons (native listeners: React's onWheel is passive and can't preventDefault) */
  useEffect(() => {
    const rim = rimRef.current
    if (!rim || mini) return
    let dragX: number | null = null
    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      rimScroll(e.deltaY > 0 ? 10 : -10)
    }
    const onDown = (e: PointerEvent) => {
      dragX = e.clientX
    }
    const onMove = (e: PointerEvent) => {
      if (dragX === null) return
      const dx = e.clientX - dragX
      if (Math.abs(dx) > 26) {
        rimScroll(dx < 0 ? RIM_STEP : -RIM_STEP)
        dragX = e.clientX
      }
    }
    const onUp = () => {
      dragX = null
    }
    rim.addEventListener("wheel", onWheel, { passive: false })
    rim.addEventListener("pointerdown", onDown)
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    return () => {
      rim.removeEventListener("wheel", onWheel)
      rim.removeEventListener("pointerdown", onDown)
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
    }
  }, [mini, rimScroll])

  const unreadLetters = letters.filter((l) => l.unread).length
  const unreadNotifs = notifications.filter((n) => n.unread).length
  const unreadTotal = unreadLetters + unreadNotifs

  const shortcuts = RIM_ICONS.map((ic, i) => (
    <button
      type="button"
      key={ic.key}
      ref={(el) => {
        iconRefs.current[i] = el
      }}
      className="sc"
      data-tip={ic.tip}
      aria-label={ic.tip}
      onClick={() => open(ic.open)}
    >
      {ic.badge && <span className="badge">{ic.badge}</span>}
      {ic.icon}
    </button>
  ))

  return (
    <div className="hud" id="hud" ref={hudRef}>
      <div className="hud-sky">
        <div className="ph">[ภาพท้องฟ้า]</div>
        <div className="moon3" title="กลางคืน — จำลอง" />
        <div className="sky-hill sh1" />
        <div className="sky-hill sh2" />
      </div>
      <span className="hud-spark sp1">✦</span>
      <span className="hud-spark sp2">✦</span>
      <span className="hud-spark sp3">✦</span>

      <div className="hz hzL" id="hzL">
        <div className="idol-stack" id="idolStack" ref={stackRef}>
          <button type="button" className="hicon" aria-label="จดหมายส่วนตัว" onClick={() => open("pm")}>
            <MailIcon />
            <span className="badge" style={{ display: unreadLetters ? "flex" : "none" }}>
              {unreadLetters}
            </span>
          </button>
          <button type="button" className="hicon" aria-label="การแจ้งเตือน" onClick={() => open("notif")}>
            <BellIcon />
            <span className="badge" style={{ display: unreadNotifs ? "flex" : "none" }}>
              {unreadNotifs}
            </span>
          </button>
          <button type="button" className="hicon" aria-label="บัญชี" onClick={() => open("account")}>
            <UserIcon />
          </button>
        </div>
        <button type="button" className="pav2" id="pav3" ref={avatarRef} aria-label="โปรไฟล์ตัวละคร" onClick={() => open("profile")}>
          [รูป]
        </button>
        <div className="nameplate" id="namePlate" ref={plateRef}>
          <b>{PLAYER.name}</b>
          <span>
            เลเวล {PLAYER.level} · {PLAYER.title}
          </span>
        </div>
      </div>

      <div className="hz hzC">
        <div className="mini-status">
          <SnowIcon />
          <b className="mclock">{fmtClock(worldTime)}</b>
          <span>·</span>
          <span>หิมะเบา -2°C</span>
        </div>
      </div>

      <button type="button" className="rim-arrow" id="rimPrev" ref={prevRef} aria-label="เลื่อนไอคอนกลับ" onClick={() => rimScroll(-RIM_STEP)}>
        ‹
      </button>
      <button type="button" className="rim-arrow" id="rimNext" ref={nextRef} aria-label="เลื่อนไอคอนถัดไป" onClick={() => rimScroll(RIM_STEP)}>
        ›
      </button>
      <div className="rim-wrap" id="rimWrap" ref={rimRef}>
        {!mini && shortcuts}
      </div>

      <button
        type="button"
        className="cbtn"
        id="hudToggle"
        data-tip={mini ? "ขยาย HUD" : "ย่อ HUD"}
        aria-label={mini ? "ขยาย HUD" : "ย่อ HUD ทั้งแทบ"}
        onClick={toggleMini}
      >
        <ChevronIcon up={mini} />
        <span className="badge fabBadge" id="fabBadge" style={{ display: unreadTotal ? "flex" : "none" }}>
          {unreadTotal}
        </span>
      </button>
      <div className="mini-row" id="miniRow">
        {mini && shortcuts}
      </div>
    </div>
  )
}
