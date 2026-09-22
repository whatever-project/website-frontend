"use client"

import { useState, FormEvent } from "react"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ username: "", email: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const result = await authApi.signup(form) as { message: string }
      setSuccess(result.message)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-2xl border border-green-800 bg-green-950/30 p-8 text-center space-y-4">
          <div className="text-4xl">✉️</div>
          <h1 className="text-xl font-bold text-green-300">Check your email</h1>
          <p className="text-zinc-400 text-sm">{success}</p>
          <Link href="/login" className="inline-block mt-4 text-sm text-zinc-400 hover:text-white transition-colors">
            Back to login →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Create account</h1>
          <p className="text-zinc-500 text-sm mt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-zinc-300 hover:text-white transition-colors">Sign in</Link>
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
            <label className="block text-xs font-medium text-zinc-400">Username</label>
            <input
              id="signup-username"
              type="text"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="your_username"
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-400">Email</label>
            <input
              id="signup-email"
              type="email"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-medium text-zinc-400">Password</label>
            <input
              id="signup-password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-zinc-900 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
    </main>
  )
}
