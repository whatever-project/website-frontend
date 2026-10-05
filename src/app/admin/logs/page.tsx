"use client"

import { useEffect, useState } from "react"
import { adminApi, accountApi, ApiError, UserProfile } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Flourish } from "@/components/parchment"

interface LoginHistoryRow {
  id: number
  userId: number | null
  attemptedUsername: string | null
  ip: string | null
  userAgent: string | null
  success: boolean
  createdAt: string
  userUsername: string | null
  userRole: string | null
}

interface UsernameHistoryRow {
  id: number
  userId: number
  oldUsername: string
  newUsername: string
  changedAt: string
  userRole: string | null
}

interface LogsResponse {
  loginHistory: LoginHistoryRow[]
  usernameHistory: UsernameHistoryRow[]
  meta: { page: number; limit: number; role: string; ipRedacted: boolean }
}

export default function AdminLogsPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [logs, setLogs] = useState<LogsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filters
  const [successFilter, setSuccessFilter] = useState<"" | "true" | "false">("")
  const [page, setPage] = useState(1)

  useEffect(() => {
    accountApi.me()
      .then(u => {
        setUser(u)
        if (u.role !== "admin" && u.role !== "moderator") {
          router.push("/dashboard")
        }
      })
      .catch(() => router.push("/login"))
  }, [router])

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "moderator")) return
    setLoading(true)
    const params: Record<string, unknown> = { page, limit: 25 }
    if (successFilter) params.success = successFilter

    adminApi.getLogs(params as Parameters<typeof adminApi.getLogs>[0])
      .then(data => setLogs(data as LogsResponse))
      .catch(err => setError(err instanceof ApiError ? err.message : "Failed to load logs"))
      .finally(() => setLoading(false))
  }, [user, page, successFilter])

  if (!user || (user.role !== "admin" && user.role !== "moderator")) {
    return (
      <div className="parch-bg flex min-h-screen items-center justify-center">
        <p className="parch-label animate-pulse">Checking access…</p>
      </div>
    )
  }

  const isModerator = user.role === "moderator"

  return (
    <main className="parch-bg min-h-screen">
      {/* Header */}
      <header className="relative z-10 border-b border-[#c9ad77]/40 px-6 py-5 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="parch-label transition hover:text-[#3a2c1a]">← Account</Link>
          <Flourish className="h-3 w-3 text-[#8a6a35]" />
          <h1 className="font-jimthompson text-2xl text-[#3a2c1a]">Admin Logs</h1>
          <span className={`parch-label px-2 py-0.5 border ${
            user.role === "admin" ? "border-amber-700/40 text-amber-800" : "border-blue-700/40 text-blue-800"
          }`}>{user.role}</span>
        </div>
        {isModerator && (
          <div className="parch-label text-[#8a7350] border border-[#c9ad77]/50 px-3 py-1.5">
            🔒 IP addresses are redacted for your role
          </div>
        )}
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
            <option value="">All logins</option>
            <option value="true">Successful only</option>
            <option value="false">Failed only</option>
          </select>
        </div>

        {error && (
          <div className="border border-[#8a2a1f]/40 bg-red-50/60 px-4 py-3 font-ui text-sm text-[#8a2a1f]">⚠️ {error}</div>
        )}

        {/* Login History Table */}
        <section className="parch-sheet p-6">
          <h2 className="font-jimthompson text-2xl text-[#3a2c1a] mb-4">Login History</h2>

          {loading ? (
            <div className="text-zinc-500 text-sm animate-pulse">Loading…</div>
          ) : (
            <div className="overflow-x-auto border border-[#c9ad77]">
              <table className="w-full text-sm">
                <thead className="bg-[#e9d9ae]/40">
                  <tr>
                    {["Time", "Username", "Role", "Status", "IP Address", "User Agent"].map(h => (
                      <th key={h} className="px-4 py-3 text-left parch-label whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c9ad77]/40">
                  {logs?.loginHistory.map(row => (
                    <tr key={row.id} className="hover:bg-[#e9d9ae]/30 transition-colors">
                      <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34] whitespace-nowrap">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#3a2c1a]">
                        {row.attemptedUsername ?? "—"}
                        {row.userId === null && <span className="ml-1 font-ui text-[#8a2a1f] text-[11px]">(no user)</span>}
                      </td>
                      <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userRole ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 font-ui text-[11px] font-medium tracking-wider uppercase border ${
                          row.success ? "border-[#5b7a3d]/40 text-[#3a5c27] bg-[#d4e6c3]/50" : "border-[#8a2a1f]/40 text-[#8a2a1f] bg-red-50/50"
                        }`}>
                          {row.success ? "✓ Success" : "✗ Failed"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-[#7a5f34]">
                        {isModerator ? (
                          <span className="font-ui text-[11px] text-[#a68d5f] italic">— hidden —</span>
                        ) : (
                          row.ip ?? "—"
                        )}
                      </td>
                      <td className="px-4 py-3 font-ui text-[11px] text-[#a68d5f] max-w-xs truncate">
                        {isModerator ? (
                          <span className="italic">— hidden —</span>
                        ) : (
                          row.userAgent ?? "—"
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs?.loginHistory.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-6 text-center parch-label">No records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Username History Table */}
        <section className="parch-sheet p-6">
          <h2 className="font-jimthompson text-2xl text-[#3a2c1a] mb-4">Username History</h2>

          <div className="overflow-x-auto border border-[#c9ad77]">
            <table className="w-full text-sm">
              <thead className="bg-[#e9d9ae]/40">
                <tr>
                  {["Time", "User ID", "Role", "Old Username", "New Username"].map(h => (
                    <th key={h} className="px-4 py-3 text-left parch-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c9ad77]/40">
                {logs?.usernameHistory.map(row => (
                  <tr key={row.id} className="hover:bg-[#e9d9ae]/30 transition-colors">
                    <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34] whitespace-nowrap">{new Date(row.changedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userId}</td>
                    <td className="px-4 py-3 font-ui text-[11px] text-[#7a5f34]">{row.userRole ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#a68d5f] line-through">{row.oldUsername}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[#3a2c1a] font-semibold">{row.newUsername}</td>
                  </tr>
                ))}
                {logs?.usernameHistory.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center parch-label">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pagination */}
        <div className="flex items-center gap-3">
          <button
            id="prev-page"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="parch-btn-outline px-6 py-2 text-sm"
          >
            ← Previous
          </button>
          <span className="parch-label">Page {page}</span>
          <button
            id="next-page"
            onClick={() => setPage(p => p + 1)}
            disabled={(logs?.loginHistory.length ?? 0) < 25}
            className="parch-btn-outline px-6 py-2 text-sm"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}
