"use client"

import { useTranslations } from "next-intl"
import type { LoginHistoryRow } from "@/api/types/admin.types"

export default function LoginHistoryTable({ rows, loading, isModerator }: { rows: LoginHistoryRow[] | undefined; loading: boolean; isModerator: boolean }) {
  const t = useTranslations("adminLogs")
  return (
    <section className="parch-sheet p-6">
      <h2 className="font-jimthompson text-2xl text-[#3a2c1a] mb-4">{t("loginHistoryTitle")}</h2>

      {loading ? (
        <div className="text-zinc-500 text-sm animate-pulse">{t("loadingLogs")}</div>
      ) : (
        <div className="overflow-x-auto border border-[#c9ad77]">
          <table className="w-full text-sm">
            <thead className="bg-[#e9d9ae]/40">
              <tr>
                {[t("colTime"), t("colUsername"), t("colRole"), t("colStatus"), t("colIp"), t("colUserAgent")].map(h => (
                  <th key={h} className="px-4 py-3 text-left parch-label whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#c9ad77]/40">
              {rows?.map(row => (
                <tr key={row.id} className="hover:bg-[#e9d9ae]/30 transition-colors">
                  <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34] whitespace-nowrap">
                    {new Date(row.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#3a2c1a]">
                    {row.attemptedUsername ?? "—"}
                    {row.userId === null && <span className="ml-1 font-ui text-[#8a2a1f] text-[11px]">({t("noUser")})</span>}
                  </td>
                  <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userRole ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 font-ui text-[11px] font-medium tracking-wider uppercase border ${
                      row.success ? "border-[#5b7a3d]/40 text-[#3a5c27] bg-[#d4e6c3]/50" : "border-[#8a2a1f]/40 text-[#8a2a1f] bg-red-50/50"
                    }`}>
                      {row.success ? t("statusSuccess") : t("statusFailed")}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#7a5f34]">
                    {isModerator ? (
                      <span className="font-ui text-[11px] text-[#a68d5f] italic">{t("ipHidden")}</span>
                    ) : (
                      row.ip ?? "—"
                    )}
                  </td>
                  <td className="px-4 py-3 font-ui text-[11px] text-[#a68d5f] max-w-xs truncate">
                    {isModerator ? (
                      <span className="italic">{t("ipHidden")}</span>
                    ) : (
                      row.userAgent ?? "—"
                    )}
                  </td>
                </tr>
              ))}
              {rows?.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-6 text-center parch-label">{t("noRecords")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
