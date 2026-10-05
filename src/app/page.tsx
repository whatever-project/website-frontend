"use client"

import { useEffect, useMemo, useState } from 'react'
import { getTimeState } from '@/lib/timeOfDay'
import Link from 'next/link'

/** Stars — generated once per mount client-side */
function Stars({ opacity }: { opacity: number }) {
  const [stars, setStars] = useState<{ id: number; x: number; y: number; s: number; d: number }[]>([])

  useEffect(() => {
    setStars(
      Array.from({ length: 90 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 55,
        s: Math.random() * 2 + 0.6,
        d: Math.random() * 6,
      }))
    )
  }, [])

  if (stars.length === 0) return null

  return (
    <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000" style={{ opacity }}>
      {stars.map(s => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.s,
            height: s.s,
            animation: `star-twinkle ${3 + s.d}s ease-in-out ${s.d}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export default function LandingPage() {
  const nowHour = () => {
    const d = new Date()
    return d.getHours() + d.getMinutes() / 60
  }

  // optional ?t=13.5 override for a fixed starting time
  const [hour, setHour] = useState(nowHour())
  const [live, setLive] = useState(true)

  // live clock sync
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const forced = parseFloat(params.get('t') ?? '')
    if (Number.isFinite(forced)) {
      setHour(((forced % 24) + 24) % 24)
      setLive(false)
      return
    }
  }, [])

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setHour(nowHour()), 30_000)
    setHour(nowHour())
    return () => clearInterval(id)
  }, [live])

  const ts = getTimeState(hour)

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#10131f] select-none">
      {/* village backdrop */}
      <img
        src="/assets/village.jpg"
        alt="Arcane Vale Village"
        className="absolute inset-0 h-full w-full object-cover"
        draggable={false}
      />

      {/* drifting mist layers */}
      <div
        className="pointer-events-none absolute inset-x-[-10%] bottom-0 h-[38vh] opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(60% 100% at 30% 100%, rgba(200,220,255,.35), transparent 70%), radial-gradient(50% 100% at 75% 100%, rgba(210,225,255,.28), transparent 70%)',
          animation: 'mist-drift 26s ease-in-out infinite alternate',
        }}
      />

      {/* time-of-day colour grade */}
      <div className="pointer-events-none absolute inset-0 transition-all duration-1000" style={{ background: ts.grade }} />
      <div className="pointer-events-none absolute inset-0 transition-all duration-1000" style={{ background: ts.wash }} />

      {/* stars */}
      <Stars opacity={ts.stars} />

      {/* warm window glows at night */}
      <div className="pointer-events-none absolute inset-0 transition-opacity duration-1000" style={{ opacity: ts.windowGlow }}>
        {[
          { l: '56%', t: '62%', s: 90 },
          { l: '79%', t: '66%', s: 120 },
          { l: '87%', t: '60%', s: 80 },
          { l: '41%', t: '70%', s: 70 },
        ].map((w, i) => (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: w.l,
              top: w.t,
              width: w.s,
              height: w.s,
              background: 'radial-gradient(circle, rgba(255,178,80,.55) 0%, rgba(255,150,50,.22) 45%, transparent 70%)',
              animation: `candle-flicker ${3 + i * 1.3}s ease-in-out ${i * 0.7}s infinite`,
            }}
          />
        ))}
      </div>

      {/* bottom vignette */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/60 to-transparent" />

      {/* top bar */}
      <header className="absolute inset-x-0 top-0 z-20 flex items-center px-6 py-5 sm:px-10">
        <div className="font-ui text-[11px] tracking-[0.5em] text-amber-100/80 uppercase">Arcane Vale</div>
      </header>

      {/* centre title */}
      <main className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <p
          className="rise-in font-oranienbaum text-2xl tracking-[0.55em] text-[#f1e8d8]/85 uppercase sm:text-3xl"
          style={{ textShadow: '0 2px 20px rgba(0,0,0,.5)' }}
        >
          Welcome
        </p>
        <h1
          className="rise-in-1 font-oranienbaum mt-3 text-[13vw] leading-[1.05] tracking-[0.06em] text-[#f2ead9] uppercase sm:text-[9vw] lg:text-[7.5vw]"
          style={{ textShadow: '0 2px 34px rgba(0,0,0,.6), 0 0 60px rgba(233,196,106,.18)' }}
        >
          Wanderer
        </h1>
        <p className="rise-in-2 font-josefin mt-6 text-xs font-extralight tracking-[0.32em] text-amber-50/80 uppercase">
          A Magical Time Awaits Your Arrival
        </p>

        <div className="rise-in-3 mt-12 flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
          <Link href="/login" className="gallery-btn w-40 px-6 py-3.5 text-sm tracking-[0.35em] uppercase text-center">
            Log In
          </Link>
          <Link href="/signup" className="gallery-btn w-40 px-6 py-3.5 text-sm tracking-[0.35em] uppercase text-center">
            Sign Up
          </Link>
        </div>
      </main>

      {/* time scrubber */}
      <footer className="absolute inset-x-0 bottom-0 z-20 px-6 pb-7 sm:px-10">
        <div className="mx-auto flex max-w-xl flex-col gap-2">
          <div className="flex items-center justify-between font-josefin text-[10px] font-light tracking-[0.25em] text-amber-100/40 uppercase">
            <span>00:00</span>
            <button
              onClick={() => setLive(v => !v)}
              className={`rounded-full px-3 py-1 transition ${
                live ? 'bg-white/10 text-amber-100/90' : 'text-amber-100/45 hover:text-amber-100/80'
              }`}
            >
              {live ? '● Real time' : '○ Real time'}
            </button>
            <span>24:00</span>
          </div>
          <input
            type="range"
            min={0}
            max={24}
            step={0.05}
            value={hour}
            onChange={e => {
              setLive(false)
              setHour(parseFloat(e.target.value))
            }}
            className="sun-slider"
            aria-label="Adjust time of day"
          />
        </div>
      </footer>
    </div>
  )
}