import type { CSSProperties, ReactNode } from "react"

interface IcoProps {
  children: ReactNode
  /** px, default 20 (the .ico class) */
  size?: number
  strokeWidth?: number
  style?: CSSProperties
}

/** Shared 24×24 line-icon wrapper (the wireframe's inline SVG icons). */
function Ico({ children, size, strokeWidth = 1.6, style }: IcoProps) {
  return (
    <svg
      className="ico"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      style={size ? { width: size, height: size, ...style } : style}
    >
      {children}
    </svg>
  )
}

export const MailIcon = () => (
  <Ico>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Ico>
)

export const BellIcon = () => (
  <Ico>
    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
    <path d="M10 21a2 2 0 0 0 4 0" />
  </Ico>
)

export const UserIcon = () => (
  <Ico>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
  </Ico>
)

export const MapIcon = () => (
  <Ico>
    <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" />
    <path d="M9 4v14M15 6v14" />
  </Ico>
)

export const GemIcon = () => (
  <Ico>
    <path d="M12 3 5 9l7 12 7-12-7-6z" />
    <path d="M5 9h14" />
  </Ico>
)

export const BookIcon = () => (
  <Ico>
    <path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z" />
    <path d="M4 19a2 2 0 0 0 2 2h13" />
  </Ico>
)

export const KeyIcon = () => (
  <Ico>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12 20 3M16 5l3 3M13 8l2 2" />
  </Ico>
)

export const PurseIcon = () => (
  <Ico>
    <ellipse cx="12" cy="6" rx="7" ry="3" />
    <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
    <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
  </Ico>
)

export const FairyIcon = () => (
  <Ico>
    <path d="M12 4v10M12 4c-3 0-5 2-5 5 0 2 2 3 5 3M12 4c3 0 5 2 5 5 0 2-2 3-5 3" />
    <path d="M8 21c1-2 3-3 4-3s3 1 4 3" />
  </Ico>
)

export const QuestIcon = () => (
  <Ico>
    <rect x="5" y="3" width="14" height="18" rx="2" />
    <path d="M9 8h6M9 12h6M9 16h4" />
  </Ico>
)

export const CompassIcon = () => (
  <Ico>
    <circle cx="12" cy="12" r="9" />
    <path d="m15 9-2 5-4 1 2-5 4-1z" />
  </Ico>
)

export const SnowIcon = () => (
  <svg className="snk" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
    <path d="M12 2v20M4 6l16 12M20 6 4 18" />
  </svg>
)

export const ChevronIcon = ({ up = false }: { up?: boolean }) => (
  <Ico size={16} strokeWidth={2}>
    <path d={up ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
  </Ico>
)

export const CloseIcon = () => (
  <Ico size={14} strokeWidth={2}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Ico>
)

export const XMarkIcon = () => (
  <Ico strokeWidth={1.8}>
    <path d="M5 5l14 14M19 5 5 19" />
  </Ico>
)

/** The 5 footer social icons: Email, Discord, Facebook, Instagram, X. */
export function SocialIcon({ kind }: { kind: string }) {
  switch (kind) {
    case "Email":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      )
    case "Discord":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 5h14v10h-6l-2 3-2-3H5z" />
          <path d="M9 10h.01M15 10h.01" />
        </svg>
      )
    case "Facebook":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M14 4h3v4h-3v3h4l-1 4h-3v9h-4v-9H7v-4h3V8a4 4 0 0 1 4-4z" />
        </svg>
      )
    case "Instagram":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="4" />
          <circle cx="12" cy="12" r="4" />
          <path d="M17 7h.01" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      )
  }
}

/** Owl that carries the newspaper (coins drop when paying). */
export function OwlSvg({ label }: { label: string }) {
  return (
    <svg className="owl-svg" viewBox="0 0 220 250" aria-label={label} role="img">
      <ellipse cx="110" cy="128" rx="58" ry="68" fill="none" stroke="#141414" strokeWidth="2" />
      <path d="M62 66 L74 34 L92 58 Z" fill="none" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
      <path d="M158 66 L146 34 L128 58 Z" fill="none" stroke="#141414" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="88" cy="96" r="20" fill="none" stroke="#141414" strokeWidth="2" />
      <circle cx="132" cy="96" r="20" fill="none" stroke="#141414" strokeWidth="2" />
      <circle cx="88" cy="96" r="6" fill="#141414" />
      <circle cx="132" cy="96" r="6" fill="#141414" />
      <path d="M110 108 L101 122 L119 122 Z" fill="#141414" />
      <path d="M52 118 Q40 150 58 172" fill="none" stroke="#141414" strokeWidth="2" />
      <path d="M168 118 Q180 150 162 172" fill="none" stroke="#141414" strokeWidth="2" />
      <path d="M84 194 L84 208 M94 194 L94 208 M126 194 L126 208 M136 194 L136 208" stroke="#141414" strokeWidth="2" />
      <rect x="68" y="208" width="84" height="6" fill="#141414" />
      <path d="M150 200 Q152 214 160 218" fill="none" stroke="#141414" strokeWidth="1.5" />
      <path d="M160 218 L176 218 L180 240 L156 240 Z" fill="none" stroke="#141414" strokeWidth="1.5" />
      <path d="M160 224 L176 224" stroke="#141414" strokeWidth="1" />
      <circle className="coin c1" cx="108" cy="26" r="4" fill="none" stroke="#141414" strokeWidth="1.5" />
      <circle className="coin c2" cx="118" cy="12" r="4" fill="none" stroke="#141414" strokeWidth="1.5" />
      <circle className="coin c3" cx="112" cy="40" r="4" fill="none" stroke="#141414" strokeWidth="1.5" />
    </svg>
  )
}
