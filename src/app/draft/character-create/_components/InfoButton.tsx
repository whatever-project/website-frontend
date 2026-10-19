interface InfoButtonProps {
  /** what the panel is about, for the accessible name */
  label: string
  onClick: () => void
}

/** Small "ⓘ รายละเอียด" pill that opens the information panel. */
export default function InfoButton({ label, onClick }: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`อ่านรายละเอียด: ${label}`}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-[#b89a63] px-3 py-1 font-ui text-[11px] text-[#8a6a35] transition hover:border-[#8a6a35] hover:text-[#5d4626]"
    >
      <span aria-hidden>ⓘ</span> รายละเอียด
    </button>
  )
}
