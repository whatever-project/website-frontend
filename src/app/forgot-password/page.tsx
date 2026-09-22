"use client"

import { useState, FormEvent } from "react"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.forgotPassword({ email })
      setSubmitted(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-10 text-center space-y-4">
          <div className="text-4xl">📬</div>
          <h1 className="text-xl font-bold text-white">Check your inbox</h1>
          <p className="text-zinc-400 text-sm">
            If an account with that email exists, a password reset link has been sent. The link expires in 30 minutes.
          </p>
          <Link href="/login" className="inline-block text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
            ← Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Forgot password</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Enter your email and we'll send a reset link if an account exists.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-5"
        >
          {error && (
            <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-400">Email address</label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            id="forgot-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-zinc-900 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>

          <div className="text-center">
            <Link href="/login" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              ← Back to sign in
            </Link>
          </div>
        </form>
      </div>
    </main>
  )
}
