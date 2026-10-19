import type { ChipOption } from "../_mock/options"

interface ChipSelectProps {
  options: ChipOption[]
  value: string
  onChange: (id: string) => void
  ariaLabel: string
}

/** Single-select chip group (สายเลือด / สายพันธุ์ / รูปแบบวันเกิด). New element — no existing equivalent. */
export default function ChipSelect({ options, value, onChange, ariaLabel }: ChipSelectProps) {
  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-wrap gap-2.5">
      {options.map((o) => {
        const active = o.id === value
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className={`border px-4 py-2 font-serithai text-[13px] transition ${
              active
                ? "border-[#43331c] bg-[#43331c] text-[#e9d9ae] shadow-[0_4px_12px_rgba(50,36,14,0.35)]"
                : "border-[#b89a63] text-[#5d4626] hover:border-[#8a6a35] hover:text-[#3a2c1a]"
            }`}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
