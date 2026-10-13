"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/api/services/admin.service"
import { accountService } from "@/api/services/account.service"
import { ApiError } from "@/api/client"
import type { UserProfile } from "@/api/types/user.types"
import type { AdminLogsParams, LogsResponse } from "@/api/types/admin.types"
import { Link, useRouter } from "@/i18n/navigation"
import { Flourish } from "@/components/ParchmentNew"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import LoginHistoryTable from "./components/LoginHistoryTable"
import UsernameHistoryTable from "./components/UsernameHistoryTable"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"

export default function AdminLogsView() {
  const t = useTranslations("adminLogs")
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [logs, setLogs] = useState<LogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [successFilter, setSuccessFilter] = useState<"" | "true" | "false">("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    accountService.me()
      .then(u => {
        setUser(u)
        if (u.role !== "admin" && u.role !== "moderator") {
          router.push(routes.dashboard)
        }
      })
      .catch(() => router.push(routes.login))
  }, [router])

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "moderator")) return
    setLoading(true)
    const params: AdminLogsParams = { page, limit: 25 }
    if (successFilter) params.success = successFilter as "true" | "false"

    adminService.getLogs(params)
      .then(data => setLogs(data))
      .catch(err => setError(err instanceof ApiError ? err.message : t("failedToLoad")))
      .finally(() => setLoading(false))
  }, [user, page, successFilter, t])

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return (
      <div className="parch-bg flex min-h-screen items-center justify-center">
        <p className="parch-label animate-pulse">{t("checkingAccess")}</p>
      </div>
    )
  }

  const isModerator = user.role === "moderator"

  return (
    <main className="parch-bg min-h-screen">
      {/* Header */}
      <header className="relative z-10 border-b border-[#c9ad77]/40 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href={routes.dashboard} className="parch-label transition hover:text-[#3a2c1a]">{t("backToAccount")}</Link>
          <Flourish className="h-3 w-3 text-[#8a6a35]" />
          <h1 className="font-jimthompson text-2xl text-[#3a2c1a]">{t("pageTitle")}</h1>
          <span className={`parch-label px-2 py-0.5 border ${
            user.role === "admin" ? "border-amber-700/40 text-amber-800" : "border-blue-700/40 text-blue-800"
          }`}>{user.role}</span>
        </div>
        <div className="flex items-center gap-4">
          {isModerator && (
            <div className="parch-label text-[#8a7350] border border-[#c9ad77]/50 px-3 py-1.5">
              {t("ipRedactedNote")}
            </div>
          )}
          <LanguageSwitcher />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 text-[#3a2c1a]">

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            id="filter-success"
            value={successFilter}
            onChange={e => { setSuccessFilter(e.target.value as "" | "true" | "false"); setPage(1) }}
            className="parch-input w-auto font-ui text-sm"
          >
            <option value="">{t("filterAll")}</option>
            <option value="true">{t("filterSuccess")}</option>
            <option value="false">{t("filterFailed")}</option>
          </select>
        </div>

        {error && (
          <div className="border border-[#8a2a1f]/40 bg-red-50/60 px-4 py-3 font-ui text-sm text-[#8a2a1f]">⚠️ {error}</div>
        )}

        <LoginHistoryTable rows={logs?.loginHistory} loading={loading} isModerator={isModerator} />

        <UsernameHistoryTable rows={logs?.usernameHistory} />

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button
            id="prev-page"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="parch-btn-outline px-6 py-2 text-sm"
          >
            {t("prevPage")}
          </button>
          <span className="parch-label">{t("pageLabel", { page })}</span>
          <button
            id="next-page"
            onClick={() => setPage(p => p + 1)}
            disabled={(logs?.loginHistory.length ?? 0) < 25}
            className="parch-btn-outline px-6 py-2 text-sm"
          >
            {t("nextPage")}
          </button>
        </div>
      </div>
    </main>
  )
}
