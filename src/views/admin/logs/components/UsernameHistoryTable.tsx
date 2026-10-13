"use client"

import { useTranslations } from "next-intl"
import type { UsernameHistoryRow } from "@/api/types/admin.types"

export default function UsernameHistoryTable({ rows }: { rows: UsernameHistoryRow[] | undefined }) {
  const t = useTranslations("adminLogs")
  return (
    <section className="parch-sheet p-6">
      <h2 className="font-jimthompson text-2xl text-[#3a2c1a] mb-4">{t("usernameHistoryTitle")}</h2>

      <div className="overflow-x-auto border border-[#c9ad77]">
        <table className="w-full text-sm">
          <thead className="bg-[#e9d9ae]/40">
            <tr>
              {[t("colTime"), t("colUserId"), t("colRole"), t("colOldUsername"), t("colNewUsername")].map(h => (
                <th key={h} className="px-4 py-3 text-left parch-label">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c9ad77]/40">
            {rows?.map(row => (
              <tr key={row.id} className="hover:bg-[#e9d9ae]/30 transition-colors">
                <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34] whitespace-nowrap">{new Date(row.changedAt).toLocaleString()}</td>
                <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userId}</td>
                <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userRole ?? "—"}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#a68d5f] line-through">{row.oldUsername}</td>
                <td className="px-4 py-3 font-mono text-xs text-[#3a2c1a] font-semibold">{row.newUsername}</td>
              </tr>
            ))}
            {rows?.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-6 text-center parch-label">{t("noRecords")}</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
