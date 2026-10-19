import InfoButton from "./InfoButton"

interface SectionHeadingProps {
  title: string
  /** When set, shows the "รายละเอียด" pill that opens the info panel. */
  onDetail?: () => void
}

/** "✦ …" section title inside a step, with an optional detail pill on the right. */
export default function SectionHeading({ title, onDetail }: SectionHeadingProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <h3 className="font-jimthompson text-xl text-[#3a2c1a]">
        <span className="mr-1.5 text-[#8a6a35]">✦</span>
        {title}
      </h3>
      {onDetail && <InfoButton label={title} onClick={onDetail} />}
    </div>
  )
}
