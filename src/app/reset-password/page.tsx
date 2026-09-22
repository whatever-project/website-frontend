"use client"

import { useState, FormEvent, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <p className="text-zinc-400 text-sm">Invalid or missing reset token.</p>
        <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-white transition-colors">
          Request a new link →
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.resetPassword({ token, newPassword })
      setSuccess(true)
      setTimeout(() => router.push("/login"), 2500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-bold text-green-300">Password reset!</h1>
        <p className="text-zinc-400 text-sm">All sessions have been signed out. Redirecting to sign in…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white">Set new password</h1>
        <p className="text-zinc-500 text-sm">Choose a strong password (at least 8 characters)</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      <div className="space-y-1">
        <label className="block text-xs font-medium text-zinc-400">New password</label>
        <input
          id="reset-password"
          type="password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
        />
      </div>

      <button
        id="reset-submit"
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-white text-zinc-900 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors"
      >
        {loading ? "Resetting…" : "Reset password"}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-8">
        <Suspense fallback={<div className="text-zinc-400 text-sm text-center">Loading…</div>}>
          <ResetPasswordContent />
        </Suspense>
      </div>
    </main>
  )
}
