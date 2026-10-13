import { getPasswordChecks } from "@/utils/validation"
import type { DashboardT } from "../types"

export default function PassRules({ value, t }: { value: string; t: DashboardT }) {
  const checks = getPasswordChecks(value)
  const rules = [
    { ok: checks.length, label: t("passRule1") },
    { ok: checks.digit, label: t("passRule2") },
    { ok: checks.mixedCase, label: t("passRule3") },
  ]
  return (
    <div className="mt-2 space-y-1 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-3">
      <p className="parch-label mb-1">{t("passwordRequirements")}</p>
      {rules.map((r, i) => (
        <p key={i} className={`flex items-center gap-2 font-ui text-[12px] ${r.ok ? "text-[#5b7a3d]" : "text-[#8a2a1f]"}`}>
          <span className="w-4 text-center">{r.ok ? "✓" : "✕"}</span>
          {r.label}
        </p>
      ))}
    </div>
  )
}
