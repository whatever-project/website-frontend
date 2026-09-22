"use client"

import { useState, FormEvent } from "react"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authApi.login(form)
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Sign in</h1>
          <p className="text-zinc-500 text-sm mt-2">
            No account?{" "}
            <Link href="/signup" className="text-zinc-300 hover:text-white transition-colors">Create one</Link>
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
            <label className="block text-xs font-medium text-zinc-400">Username or Email</label>
            <input
              id="login-identifier"
              type="text"
              value={form.usernameOrEmail}
              onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
              placeholder="username or you@example.com"
              required
              autoComplete="username"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-zinc-400">Password</label>
              <Link href="/forgot-password" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              id="login-password"
              type="password"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white text-zinc-900 py-2.5 text-sm font-semibold hover:bg-zinc-100 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  )
}
