"use client"

import { useState, type InputHTMLAttributes, type ReactNode } from 'react'
import Link from 'next/link'

/* ── Password Input ─────────────────────────────────────────── */

export function PasswordInput({ className = '', ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} className={`${className} pr-11`} {...props} />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow(v => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a3854e] transition hover:text-[#6b4f22]"
      >
        {show ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
            <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
            <line x1="1" y1="1" x2="23" y2="23" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        )}
      </button>
    </div>
  )
}

/* ── Flourish Ornament ─────────────────────────────────────── */

export function Flourish({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2c-1.8 2.4-2.4 4.6-1.4 6.6C9.6 7.6 7.6 7.4 6 8.6c1.4.6 2.4 1.6 2.8 3H9l1 2.4h1.4L11 18c-.8 1-2 1.6-3.4 1.6.6 1 1.8 1.6 3.2 1.4-.4 1-.6 2-.8 3h4c-.2-1-.4-2-.8-3 1.4.2 2.6-.4 3.2-1.4-1.4 0-2.6-.6-3.4-1.6l-.4-4H14l1-2.4h-.2c.4-1.4 1.4-2.4 2.8-3-1.6-1.2-3.6-1-4.6 0 1-2 .4-4.2-1.4-6.6z" />
    </svg>
  )
}

/* ── Ink Divider ──────────────────────────────────────────── */

export function InkDivider({ children }: { children?: ReactNode }) {
  return (
    <div className="ink-divider my-4">
      {children ?? <span className="text-sm">✦</span>}
    </div>
  )
}

/* ── Wax Seal ─────────────────────────────────────────────── */

export function WaxSeal({
  letter = 'A',
  size = 54,
  className = '',
}: {
  letter?: string
  size?: number
  className?: string
}) {
  return (
    <div
      className={`wax-seal flex items-center justify-center rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <span
        className="font-display text-2xl font-semibold text-[#f3ddc0]"
        style={{ textShadow: '0 1px 2px rgba(40,8,4,.6)' }}
      >
        {letter}
      </span>
    </div>
  )
}

/* ── Sheet Corners ────────────────────────────────────────── */

export function SheetCorners() {
  const c = 'absolute h-8 w-8 text-[#a3854e] pointer-events-none'
  const path = 'M2 22 Q2 2 22 2 M6 22 Q6 6 22 6'
  return (
    <>
      <svg viewBox="0 0 24 24" className={`${c} top-2 left-2`} fill="none" stroke="currentColor" strokeWidth="1.4"><path d={path} /></svg>
      <svg viewBox="0 0 24 24" className={`${c} top-2 right-2 -scale-x-100`} fill="none" stroke="currentColor" strokeWidth="1.4"><path d={path} /></svg>
      <svg viewBox="0 0 24 24" className={`${c} bottom-2 left-2 -scale-y-100`} fill="none" stroke="currentColor" strokeWidth="1.4"><path d={path} /></svg>
      <svg viewBox="0 0 24 24" className={`${c} bottom-2 right-2 -scale-x-100 -scale-y-100`} fill="none" stroke="currentColor" strokeWidth="1.4"><path d={path} /></svg>
    </>
  )
}

/* ── Curved SVG Label ─────────────────────────────────────── */

export function ParchCurvedLabel({ text, size = 170 }: { text: string; size?: number }) {
  const r = size / 2 - 12
  const id = `parc-${text.replace(/\s/g, '')}`
  return (
    <svg width={size} height={size * 0.5} viewBox={`0 0 ${size} ${size * 0.5}`}>
      <defs>
        <path id={id} d={`M ${size / 2 - r} ${size * 0.1} A ${r} ${r} 0 0 0 ${size / 2 + r} ${size * 0.1}`} />
      </defs>
      <text fill="#5d4626" style={{ fontFamily: "'Josefin Sans','Prompt',sans-serif", fontSize: 12.5, letterSpacing: '0.26em', textTransform: 'uppercase' }}>
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          {text}
        </textPath>
      </text>
    </svg>
  )
}

/* ── Floating Sparkles ────────────────────────────────────── */

function Sparkles() {
  const pts = [
    { l: '12%', t: '22%', d: 0 }, { l: '86%', t: '18%', d: 1.4 }, { l: '70%', t: '78%', d: 2.6 },
    { l: '20%', t: '72%', d: 3.4 }, { l: '45%', t: '12%', d: 1.9 }, { l: '92%', t: '52%', d: 0.8 },
    { l: '6%', t: '48%', d: 2.2 }, { l: '58%', t: '88%', d: 4 },
  ]
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {pts.map((p, i) => (
        <span
          key={i}
          className="absolute text-[#8a6a35]"
          style={{ left: p.l, top: p.t, animation: `float-sparkle ${5 + i * 0.7}s ease-in-out ${p.d}s infinite`, fontSize: i % 3 === 0 ? 15 : 10 }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}

/* ── Parchment Page Shell ─────────────────────────────────── */

export function ParchShell({
  title,
  sub,
  backHref,
  onBack,
  children,
}: {
  title: string
  sub: string
  backHref?: string
  onBack?: () => void
  children: ReactNode
}) {
  const backEl = backHref ? (
    <Link
      href={backHref}
      className="parch-label group flex items-center gap-2 transition hover:text-[#3a2c1a]"
    >
      <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
      Back to Village
    </Link>
  ) : (
    <button
      onClick={onBack}
      className="parch-label group flex items-center gap-2 transition hover:text-[#3a2c1a]"
    >
      <span className="inline-block transition-transform group-hover:-translate-x-1">←</span>
      Back to Village
    </button>
  )

  return (
    <div className="parch-bg relative min-h-screen w-full overflow-x-hidden">
      <div className="parch-vignette pointer-events-none absolute inset-0 z-10" />
      <Sparkles />

      <header className="relative z-20 flex items-center justify-between px-6 pt-7 sm:px-12">
        {backEl}
        <span className="parch-label flex items-center gap-2">
          <Flourish className="h-4 w-4 text-[#8a6a35]" />
          Arcane Vale
        </span>
      </header>

      <div className="relative z-20 px-6 pt-10 text-center sm:px-12">
        <p className="parch-label mb-3">{sub}</p>
        <h1
          className="font-jimthompson text-5xl tracking-tight text-[#3a2c1a] sm:text-6xl"
          style={{ textShadow: '0 1px 0 rgba(255,250,235,.6)' }}
        >
          {title}
        </h1>
        <div className="mx-auto mt-5 max-w-xs">
          <InkDivider>
            <Flourish className="h-5 w-5" />
          </InkDivider>
        </div>
      </div>

      <div className="relative z-20">{children}</div>

     <footer className="relative z-20 px-6 pt-14 pb-10 text-center sm:px-12">
        <p className="parch-label">✦ Arcane Vale — คอมมูนิตี้โรลเพลย์แห่งหุบเขาเวทมนตร์ ✦</p>
      </footer>
    </div>
  )
}

/* ── Ink Modal ────────────────────────────────────────────── */

export function InkModal({
  onClose,
  children,
  wide = false,
  corners = true,
}: {
  onClose: () => void
  children: ReactNode
  wide?: boolean
  corners?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1f10]/45 px-4 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        className={`parch-sheet relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-8 sm:p-10`}
        onClick={e => e.stopPropagation()}
      >
        {corners && <SheetCorners />}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <WaxSeal letter="✦" size={48} />
        </div>
        {children}
      </div>
    </div>
  )
}
