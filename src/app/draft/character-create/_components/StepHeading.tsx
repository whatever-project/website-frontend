import { Flourish, InkDivider } from "@/components/Parchment"

interface StepHeadingProps {
  /** e.g. "STEP III — IDENTITY" */
  label: string
  title: string
}

/** Header inside the parchment sheet for each wizard step. */
export default function StepHeading({ label, title }: StepHeadingProps) {
  return (
    <div className="text-center">
      <p className="parch-label">{label}</p>
      <h2 className="font-jimthompson mt-2 text-3xl text-[#3a2c1a]">{title}</h2>
      <div className="mx-auto mt-3 max-w-[220px]">
        <InkDivider>
          <Flourish className="h-4 w-4" />
        </InkDivider>
      </div>
    </div>
  )
}
