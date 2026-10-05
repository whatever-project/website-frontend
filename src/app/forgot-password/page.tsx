"use client"

import { useState, FormEvent } from "react"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners } from "@/components/parchment"

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

  return (
    <ParchShell title="Forgot Password" sub="— Reset Your Seal —" backHref="/login">
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10 text-center">
          <SheetCorners />

          {submitted ? (
            <>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <WaxSeal letter="✉" size={56} />
              </div>
              <h2 className="font-jimthompson mt-4 text-3xl text-[#3a2c1a]">Check Your Inbox</h2>
              <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
              <p className="font-serif2 mt-2 text-[15px] leading-relaxed text-[#4a3820]">
                If an account with that email exists, a password reset link has been sent.
                The link expires in 30 minutes.
              </p>
              <div className="mt-7">
                <Link href="/login" className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
                  ← Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                <WaxSeal letter="?" size={56} />
              </div>
              <h2 className="font-jimthompson mt-4 text-3xl text-[#3a2c1a]">Reset Your Password</h2>
              <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
              <p className="font-serif2 mb-6 text-[15px] leading-relaxed text-[#4a3820]">
                Enter your email and we'll send a reset link if an account exists.
              </p>

              {error && (
                <div className="mb-4 border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-[13px] text-[#8a2a1f] text-left">
                  ⚠️ {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                <div>
                  <label className="parch-label mb-1 block">Email Address</label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="parch-input w-full font-serithai"
                  />
                </div>
                <button
                  id="forgot-submit"
                  type="submit"
                  disabled={loading}
                  className="parch-btn"
                >
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <div className="mt-6">
                <Link href="/login" className="font-ui text-[13px] text-[#a68d5f] underline decoration-dotted underline-offset-4 hover:text-[#6b4f22]">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </ParchShell>
  )
}
