interface StepIndicatorProps {
  current: number
  total: number
}

/** Numbered step circles — filled for done/current, outline for upcoming. */
export default function StepIndicator({ current, total }: StepIndicatorProps) {
  return (
    <ol className="flex items-center justify-center" aria-label={`ขั้นที่ ${current} จาก ${total}`}>
      {Array.from({ length: total }, (_, i) => i + 1).map((n) => {
        const done = n <= current
        return (
          <li key={n} className="flex items-center">
            {n > 1 && <span className={`h-px w-5 sm:w-10 ${n <= current ? "bg-[#43331c]" : "bg-[#b89a63]"}`} />}
            <span
              aria-current={n === current ? "step" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full border font-ui text-[13px] ${
                done
                  ? "border-[#43331c] bg-[#43331c] text-[#e9d9ae] shadow-[0_3px_10px_rgba(50,36,14,0.35)]"
                  : "border-[#b89a63] text-[#a68d5f]"
              }`}
            >
              {n}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
