"use client"

import { useEffect, useState } from "react"
import { adminApi, accountApi, ApiError, UserProfile } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

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
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">Checking access…</div>
      </main>
    )
  }

  const isModerator = user.role === "moderator"

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-zinc-500 hover:text-zinc-300 transition-colors text-sm">← Dashboard</Link>
          <span className="text-zinc-700">|</span>
          <h1 className="font-semibold text-zinc-100">Admin Logs</h1>
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            user.role === "admin" ? "bg-yellow-900 text-yellow-300" : "bg-blue-900 text-blue-300"
          }`}>{user.role}</span>
        </div>
        {isModerator && (
          <div className="text-xs text-zinc-500 bg-zinc-900 border border-zinc-700 px-3 py-1.5 rounded-lg">
            🔒 IP addresses are redacted for your role
          </div>
        )}
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Filters */}
        <div className="flex items-center gap-4">
          <select
            id="filter-success"
            value={successFilter}
            onChange={e => { setSuccessFilter(e.target.value as "" | "true" | "false"); setPage(1) }}
            className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-sm text-white focus:outline-none"
          >
            <option value="">All logins</option>
            <option value="true">Successful only</option>
            <option value="false">Failed only</option>
          </select>
        </div>

        {error && (
          <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Login History Table */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Login History</h2>

          {loading ? (
            <div className="text-zinc-500 text-sm animate-pulse">Loading…</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-sm">
                <thead className="bg-zinc-800/60">
                  <tr>
                    {["Time", "Username", "Role", "Status", "IP Address", "User Agent"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-400 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {logs?.loginHistory.map(row => (
                    <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 text-zinc-400 whitespace-nowrap text-xs">
                        {new Date(row.createdAt).toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-zinc-200 font-mono text-xs">
                        {row.attemptedUsername ?? "—"}
                        {row.userId === null && <span className="ml-1 text-red-400 text-xs">(no user)</span>}
                      </td>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{row.userRole ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          row.success ? "bg-green-900/60 text-green-300" : "bg-red-900/60 text-red-400"
                        }`}>
                          {row.success ? "✓ Success" : "✗ Failed"}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                        {isModerator ? (
                          <span className="text-zinc-600 italic">— hidden —</span>
                        ) : (
                          row.ip ?? "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-zinc-500 text-xs max-w-xs truncate">
                        {isModerator ? (
                          <span className="text-zinc-600 italic">— hidden —</span>
                        ) : (
                          row.userAgent ?? "—"
                        )}
                      </td>
                    </tr>
                  ))}
                  {logs?.loginHistory.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-6 text-center text-zinc-600 text-sm">No records found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Username History Table */}
        <section>
          <h2 className="text-lg font-semibold text-zinc-100 mb-4">Username History</h2>

          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-sm">
              <thead className="bg-zinc-800/60">
                <tr>
                  {["Time", "User ID", "Role", "Old Username", "New Username"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-zinc-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {logs?.usernameHistory.map(row => (
                  <tr key={row.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">{new Date(row.changedAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{row.userId}</td>
                    <td className="px-4 py-3 text-zinc-400 text-xs">{row.userRole ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-400">{row.oldUsername}</td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-200">{row.newUsername}</td>
                  </tr>
                ))}
                {logs?.usernameHistory.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-zinc-600 text-sm">No records found</td></tr>
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
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs text-zinc-500">Page {page}</span>
          <button
            id="next-page"
            onClick={() => setPage(p => p + 1)}
            disabled={(logs?.loginHistory.length ?? 0) < 25}
            className="rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-400 hover:bg-zinc-800 disabled:opacity-30 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </main>
  )
}
