"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { Suspense } from "react"

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

  if (status === "loading") {
    return (
      <div className="text-center space-y-3">
        <div className="text-4xl animate-pulse">🔍</div>
        <p className="text-zinc-400 text-sm">Verifying your email…</p>
      </div>
    )
  }

  if (status === "success") {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">✅</div>
        <h1 className="text-xl font-bold text-green-300">Email verified!</h1>
        <p className="text-zinc-400 text-sm">{message}</p>
        <Link href="/login" className="inline-block mt-4 rounded-lg bg-white text-zinc-900 px-6 py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-colors">
          Sign in
        </Link>
      </div>
    )
  }

  return (
    <div className="text-center space-y-4">
      <div className="text-4xl">❌</div>
      <h1 className="text-xl font-bold text-red-300">Verification failed</h1>
      <p className="text-zinc-400 text-sm">{message}</p>
      <Link href="/signup" className="inline-block mt-4 text-sm text-zinc-400 hover:text-white transition-colors">
        Back to sign up
      </Link>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 p-10">
        <Suspense fallback={<div className="text-zinc-400 text-sm text-center">Loading…</div>}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  )
}
