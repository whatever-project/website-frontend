// Time-of-day engine: maps hour (0-24) to sky tint and ambience levels.

export interface TimeState {
  grade: string
  wash: string
  darkness: number
  stars: number
  windowGlow: number
  phase: string
  phaseEn: string
}

interface Key {
  h: number
  top: [number, number, number, number]
  bottom: [number, number, number, number]
  darkness: number
  stars: number
  glow: number
  phase: string
  phaseEn: string
}

const KEYS: Key[] = [
  { h: 0,    top: [6,9,26,0.82],      bottom: [16,18,44,0.7],     darkness: 1,    stars: 1,    glow: 1,    phase: 'Night',    phaseEn: 'Midnight' },
  { h: 4,    top: [10,12,34,0.78],    bottom: [28,26,58,0.62],    darkness: 0.95, stars: 0.9,  glow: 1,    phase: 'Night',    phaseEn: 'Deep Night' },
  { h: 5.5,  top: [24,22,52,0.62],    bottom: [96,62,74,0.4],     darkness: 0.7,  stars: 0.45, glow: 0.9,  phase: 'Dawn',     phaseEn: 'First Light' },
  { h: 7,    top: [255,166,110,0.22], bottom: [120,90,130,0.22],  darkness: 0.35, stars: 0.08, glow: 0.55, phase: 'Dawn',     phaseEn: 'Dawn' },
  { h: 9,    top: [255,220,170,0.1],  bottom: [140,170,200,0.06], darkness: 0.12, stars: 0,    glow: 0.15, phase: 'Morning',  phaseEn: 'Morning' },
  { h: 12,   top: [255,244,214,0.03], bottom: [180,210,235,0.0],  darkness: 0,    stars: 0,    glow: 0,    phase: 'Noon',     phaseEn: 'Noon' },
  { h: 15,   top: [255,232,180,0.07], bottom: [200,190,170,0.05], darkness: 0.05, stars: 0,    glow: 0.05, phase: 'Afternoon',phaseEn: 'Afternoon' },
  { h: 17.5, top: [255,158,64,0.2],   bottom: [160,90,90,0.16],   darkness: 0.22, stars: 0,    glow: 0.35, phase: 'Golden',   phaseEn: 'Golden Hour' },
  { h: 19,   top: [150,70,110,0.34],  bottom: [46,34,84,0.42],    darkness: 0.5,  stars: 0.15, glow: 0.75, phase: 'Dusk',     phaseEn: 'Dusk' },
  { h: 20.5, top: [30,26,66,0.6],     bottom: [20,18,48,0.58],    darkness: 0.8,  stars: 0.6,  glow: 1,    phase: 'Evening',  phaseEn: 'Evening' },
  { h: 24,   top: [6,9,26,0.82],      bottom: [16,18,44,0.7],     darkness: 1,    stars: 1,    glow: 1,    phase: 'Night',    phaseEn: 'Midnight' },
]

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function rgba(c: [number, number, number, number]) {
  return `rgba(${Math.round(c[0])}, ${Math.round(c[1])}, ${Math.round(c[2])}, ${c[3].toFixed(3)})`
}

export function getTimeState(hour: number): TimeState {
  const h = ((hour % 24) + 24) % 24
  let i = 0
  while (i < KEYS.length - 2 && KEYS[i + 1].h <= h) i++
  const a = KEYS[i]
  const b = KEYS[i + 1]
  const t = (h - a.h) / (b.h - a.h || 1)

  const top: [number, number, number, number] = [0, 0, 0, 0].map((_, k) =>
    lerp(a.top[k], b.top[k], t),
  ) as [number, number, number, number]
  const bottom: [number, number, number, number] = [0, 0, 0, 0].map((_, k) =>
    lerp(a.bottom[k], b.bottom[k], t),
  ) as [number, number, number, number]

  const darkness = lerp(a.darkness, b.darkness, t)

  return {
    grade: `linear-gradient(180deg, ${rgba(top)} 0%, ${rgba(bottom)} 100%)`,
    wash:
      darkness > 0.5
        ? `radial-gradient(120% 90% at 50% 110%, rgba(8,10,30,${(darkness * 0.45).toFixed(3)}) 0%, transparent 60%)`
        : `radial-gradient(120% 90% at 50% -10%, rgba(255,236,190,${((1 - darkness) * 0.25).toFixed(3)}) 0%, transparent 55%)`,
    darkness,
    stars: lerp(a.stars, b.stars, t),
    windowGlow: lerp(a.glow, b.glow, t),
    phase: t < 0.5 ? a.phase : b.phase,
    phaseEn: t < 0.5 ? a.phaseEn : b.phaseEn,
  }
}

export function formatHour(h: number) {
  const hh = Math.floor(h) % 24
  const mm = Math.floor((h % 1) * 60)
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`
}
