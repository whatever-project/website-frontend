/** Decorative drifting-cloud layers of the sky (styles + keyframes in _styles/sky-mist.css). Purely visual: no pointer events, hidden from assistive tech. */
export default function SkyDrift() {
  return (
    <>
      <div className="sd sd-far" aria-hidden>
        <div className="sd-l" />
      </div>
      <div className="sd sd-mid" aria-hidden>
        <div className="sd-l" />
      </div>
      <div className="sd sd-near" aria-hidden>
        <div className="sd-l" />
      </div>
    </>
  )
}