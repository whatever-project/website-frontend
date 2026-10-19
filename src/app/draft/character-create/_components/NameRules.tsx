import type { NameCheck } from "./form"

interface NameRulesProps {
  check: NameCheck
  isThai?: boolean
}

/** Live rule ticks under a name field (✓ green / ✕ red). New element. */
export default function NameRules({ check, isThai = false }: NameRulesProps) {
  if (!check.lang && !check.capital && !check.noSpecial) return null
  const rules = isThai
    ? [
        { ok: check.lang, label: "เป็นภาษาไทย และมี space bar ได้" },
        { ok: check.noSpecial, label: "ไม่มีอักขระพิเศษ และตัวเลข" },
      ]
    : [
        { ok: check.lang, label: "เป็นภาษาอังกฤษ และมี space bar ได้" },
        { ok: check.capital, label: "ตัวอักษรตัวแรกของชื่อและนามสกุลเป็นตัวพิมพ์ใหญ่ (Capital Letter)" },
        { ok: check.noSpecial, label: "ไม่มีอักขระพิเศษ และตัวเลข" },
      ]
  return (
    <ul className="mt-2 space-y-1 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-3">
      {rules.map((r) => (
        <li key={r.label} className={`flex items-center gap-2 font-ui text-[12px] ${r.ok ? "text-[#5b7a3d]" : "text-[#8a2a1f]"}`}>
          <span className="w-4 text-center" aria-hidden>
            {r.ok ? "✓" : "✕"}
          </span>
          {r.label}
        </li>
      ))}
    </ul>
  )
}
