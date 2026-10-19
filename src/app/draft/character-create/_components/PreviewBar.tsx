interface PreviewBarProps {
  step: number
  total: number
  submitted: boolean
  onStep: (n: number) => void
  onFillSample: () => void
  onClear: () => void
  onShowSubmitted: () => void
}

/**
 * DRAFT ONLY — lets the designer jump between steps and fill the sample character,
 * because every step is gated by validation. Remove when promoting (listed in CONTEXT.md "Needs dev").
 */
export default function PreviewBar({ step, total, submitted, onStep, onFillSample, onClear, onShowSubmitted }: PreviewBarProps) {
  const btn =
    "border border-[#b89a63] bg-[#f6ecd4] px-2.5 py-1 font-ui text-[11px] text-[#5d4626] transition hover:border-[#8a6a35] hover:text-[#3a2c1a]"
  return (
    <details className="fixed bottom-4 left-16 z-30 max-w-[calc(100vw-5rem)] border border-dashed border-[#8a6a35] bg-[#efe3c6]/95 px-3 py-2 shadow-[0_6px_18px_rgba(80,58,22,0.25)]">
      <summary className="cursor-pointer font-ui text-[11px] tracking-wider text-[#7a5f34] uppercase">
        Preview (draft only)
      </summary>
      <div className="mt-2 space-y-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-ui text-[11px] text-[#a68d5f]">ไปที่ขั้น</span>
          {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onStep(n)}
              aria-current={!submitted && n === step ? "step" : undefined}
              className={`${btn} ${!submitted && n === step ? "!border-[#43331c] !bg-[#43331c] !text-[#e9d9ae]" : ""}`}
            >
              {n}
            </button>
          ))}
          <button type="button" onClick={onShowSubmitted} className={btn}>
            หน้าส่งคำขอแล้ว
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={onFillSample} className={btn}>
            ใส่ข้อมูลตัวอย่าง (Karen Mason)
          </button>
          <button type="button" onClick={onClear} className={btn}>
            ล้างฟอร์ม
          </button>
        </div>
      </div>
    </details>
  )
}
