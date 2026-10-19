interface WizardNavProps {
  savedAt: string | null
  onPrev: () => void
  onNext: () => void
  prevDisabled?: boolean
  nextDisabled?: boolean
  nextLabel?: string
  error?: string | null
}

/** Bottom bar of every step: autosave note + ← ย้อนกลับ / ถัดไป → */
export default function WizardNav({
  savedAt,
  onPrev,
  onNext,
  prevDisabled = false,
  nextDisabled = false,
  nextLabel = "ถัดไป →",
  error,
}: WizardNavProps) {
  return (
    <div className="mt-8 border-t border-dashed border-[#c9ad77] pt-5">
      {error && <p className="mb-3 font-ui text-[12.5px] text-[#8a2a1f]">✕ {error}</p>}
      <div className="flex flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
        <p className="font-ui text-[12px] text-[#a68d5f]">{savedAt ? `บันทึกอัตโนมัติแล้ว · ${savedAt}` : ""}</p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onPrev}
            disabled={prevDisabled}
            className="parch-btn-outline px-6 py-2.5 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          >
            ← ย้อนกลับ
          </button>
          <button type="button" onClick={onNext} disabled={nextDisabled} className="parch-btn w-auto px-8">
            {nextLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
