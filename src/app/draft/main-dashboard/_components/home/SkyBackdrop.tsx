/**
 * The painted sky of the home page (styles in _styles/sky-mist.css). It belongs to the page, not to the dashboard cards: it fills the whole <main> whether the cards are
 * rendered or not. Each entry is one band of the same painting (placement in % of the page width, flip / mirror / zoom, opacity): alternating orientation and zoom hide the
 * repetition, and the opacity falls from 1 near the hero to ~0.2 far down, so the clouds are recognisable at the top and soft at the bottom.
 */
type Band = { y: number; o: number; sx?: number; sy?: number; w?: number; l?: number }
const BANDS: Band[] = [
  { y: 19.7, o: 1 },
  { y: 64, o: 0.5, sy: -1 },
  { y: 104, o: 0.42, sx: -1, w: 125, l: -15 },
  { y: 158, o: 0.34, sx: -1, sy: -1, w: 120, l: -8 },
  { y: 208, o: 0.28, w: 130, l: -22 },
  { y: 262, o: 0.24, sy: -1 },
  { y: 312, o: 0.2, sx: -1, w: 125, l: -5 },
]

export default function SkyBackdrop() {
  return (
    <div className="sk-backdrop" aria-hidden>
      {BANDS.map((b, i) => (
        <i
          key={i}
          className={`sk-band${i === 0 ? " sk-band-0" : ""}`}
          style={{ "--y": `${b.y}%`, "--o": b.o, "--sx": b.sx ?? 1, "--sy": b.sy ?? 1, "--w": `${b.w ?? 100}%`, "--l": `${b.l ?? 0}%` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}