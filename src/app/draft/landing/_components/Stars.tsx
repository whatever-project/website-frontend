"use client"

import { useEffect, useState } from 'react'

/** Stars — generated once per mount client-side */
export default function Stars({ opacity }: { opacity: number }) {
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
