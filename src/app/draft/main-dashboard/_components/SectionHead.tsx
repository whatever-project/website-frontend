interface SectionHeadProps {
  title: string
  sub: string
}

/** Big section title + rule + one-line subtitle (both fade in on scroll via `.reveal`). */
export default function SectionHead({ title, sub }: SectionHeadProps) {
  return (
    <>
      <div className="sec-head reveal">
        <h2>{title}</h2>
        <div className="rule" />
      </div>
      <p className="sec-sub reveal">{sub}</p>
    </>
  )
}
