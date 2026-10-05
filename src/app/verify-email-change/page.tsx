"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { accountApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners } from "@/components/parchment"

function VerifyEmailChangeContent() {
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

    accountApi.verifyEmailChange(token)
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
        <p className="parch-label animate-pulse">Confirming your new email…</p>
      )}

      {status === "success" && (
        <>
          <WaxSeal letter="✓" size={56} className="mx-auto" />
          <h2 className="font-jimthompson mt-4 text-2xl text-[#3a2c1a]">Email Updated!</h2>
          <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
          <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">{message}</p>
          <div className="mt-7">
            <Link href="/dashboard" className="parch-btn block">
              Go to Account Settings
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
            <Link href="/dashboard" className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
              Back to Account Settings
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailChangePage() {
  return (
    <ParchShell title="Verify Email Change" sub="— Update Your Seal —" backHref="/dashboard">
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10 text-center">
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="✉" size={56} />
          </div>
          <div className="mt-4">
            <Suspense fallback={<p className="parch-label animate-pulse">Loading…</p>}>
              <VerifyEmailChangeContent />
            </Suspense>
          </div>
        </div>
      </div>
    </ParchShell>
  )
}
