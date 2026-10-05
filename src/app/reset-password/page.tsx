"use client"

import { useState, FormEvent, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/parchment"

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
      <div className="text-center">
        <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">
          Invalid or missing reset token.
        </p>
        <div className="mt-6">
          <Link href="/forgot-password" className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
            Request a new link →
          </Link>
        </div>
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
        <WaxSeal letter="✓" size={56} className="mx-auto" />
        <h2 className="font-jimthompson text-2xl text-[#3a2c1a]">Password Reset!</h2>
        <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
        <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">
          All sessions have been signed out. Redirecting to sign in…
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">Set New Password</h2>
      <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
      <p className="font-ui text-center text-[13px] text-[#8a7350]">
        Choose a strong password (at least 8 characters)
      </p>

      {error && (
        <div className="border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-[13px] text-[#8a2a1f]">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="parch-label mb-1 block">New Password</label>
        <PasswordInput
          id="reset-password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
          className="parch-input w-full font-serithai"
        />
      </div>

      <button
        id="reset-submit"
        type="submit"
        disabled={loading}
        className="parch-btn"
      >
        {loading ? "Resetting…" : "Reset Password"}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <ParchShell title="Reset Password" sub="— Reclaim Your Seal —" backHref="/login">
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10">
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="⚿" size={56} />
          </div>
          <Suspense fallback={<p className="parch-label text-center animate-pulse">Loading…</p>}>
            <ResetPasswordContent />
          </Suspense>
        </div>
      </div>
    </ParchShell>
  )
}
