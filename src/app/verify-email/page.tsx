"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { Suspense } from "react"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners } from "@/components/parchment"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided.")
      return
    }

    authApi.verifyEmail(token)
      .then((result: unknown) => {
        const r = result as { message: string }
        setMessage(r.message)
        setStatus("success")
      })
      .catch((err: unknown) => {
        setMessage(err instanceof ApiError ? err.message : "Verification failed.")
        setStatus("error")
      })
  }, [token])

  return (
    <div className="text-center">
      {status === "loading" && (
        <>
          <p className="parch-label animate-pulse">Verifying your email…</p>
        </>
      )}

      {status === "success" && (
        <>
          <WaxSeal letter="✓" size={56} className="mx-auto" />
          <h2 className="font-jimthompson mt-4 text-2xl text-[#3a2c1a]">Email Verified!</h2>
          <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
          <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">{message}</p>
          <div className="mt-7">
            <Link href="/login" className="parch-btn block">
              Sign In
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <p className="font-jimthompson text-2xl text-[#8a2a1f]">Verification Failed</p>
          <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
          <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">{message}</p>
          <div className="mt-7">
            <Link href="/signup" className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
              Back to Sign Up
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <ParchShell title="Verify Email" sub="— Seal the Pact —" backHref="/">
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10 text-center">
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="✉" size={56} />
          </div>
          <div className="mt-4">
            <Suspense fallback={<p className="parch-label animate-pulse">Loading…</p>}>
              <VerifyEmailContent />
            </Suspense>
          </div>
        </div>
      </div>
    </ParchShell>
  )
}
