"use client"

import { useState, FormEvent } from "react"
import { authApi, ApiError } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/parchment"

function LetterStack() {
  return (
    <div className="absolute inset-0 flex items-center justify-end">
      <img
        src="/assets/letter-scene.png"
        alt=""
        className="-mr-6 w-[560px] max-w-none [filter:drop-shadow(0_16px_22px_rgba(60,40,15,.42))]"
      />
    </div>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUnverified, setIsUnverified] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsUnverified(false)
    setLoading(true)
    try {
      await authApi.login(form)
      router.push("/dashboard")
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403 || err.message.toLowerCase().includes("verify")) {
          setIsUnverified(true)
          setError("Your email is still unverified. Please check your inbox before signing in.")
        } else {
          setError(err.message)
        }
      } else {
        setError("Something went wrong. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ParchShell title="Sign In" sub="— The Gates of the Vale —" backHref="/">
      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[1fr_1fr] lg:gap-32">
        {/* parchment login form */}
        <form
          onSubmit={handleSubmit}
          className="parch-sheet relative mx-auto w-full max-w-md p-8 sm:p-10 lg:mx-0 lg:ml-16"
        >
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="✦" size={56} />
          </div>

          <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">
            จดหมายเชิญกลับหมู่บ้าน
          </h2>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>

          {/* Error banner */}
          {error && (
            <div
              className={`mb-4 rounded border p-3 font-ui text-sm ${
                isUnverified
                  ? "border-amber-700/60 bg-amber-100/60 text-amber-900"
                  : "border-[#8a2a1f]/40 bg-red-50/60 text-[#8a2a1f]"
              }`}
            >
              <span className="mr-2">{isUnverified ? "✉️" : "⚠️"}</span>
              {error}
              {isUnverified && (
                <div className="mt-1">
                  <Link href="/signup" className="underline underline-offset-2 hover:text-amber-700">
                    Back to sign up →
                  </Link>
                </div>
              )}
            </div>
          )}

          <label className="parch-label mb-1.5 mt-4 block">Username or Email</label>
          <input
            id="login-identifier"
            className="parch-input font-serithai"
            value={form.usernameOrEmail}
            onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
            placeholder="wanderer or you@example.com"
            autoComplete="username"
            required
          />

          <label className="parch-label mb-1.5 mt-5 block">Password</label>
          <PasswordInput
            id="login-password"
            className="parch-input w-full font-serithai"
            placeholder="••••••••••"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            autoComplete="current-password"
            required
          />

          <div className="mt-4 mb-7 flex items-center justify-between">
            <label className="flex cursor-pointer items-center gap-2.5 font-ui text-[13px] text-[#5d4626]">
              <input
                type="checkbox"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
                className="parch-check"
              />
              Remember me
            </label>
            <Link
              href="/forgot-password"
              className="font-ui text-[13px] text-[#b3a07c] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
            >
              Forgot password?
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="parch-btn"
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>

          <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
            No account yet?{" "}
            <Link
              href="/signup"
              className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
            >
              Create one
            </Link>
          </p>

          <p className="mt-3 text-center">
            <Link href="/account" className="font-ui text-[12px] tracking-wider text-[#a68d5f] underline decoration-dashed underline-offset-4 hover:text-[#6b4f22]">
              ✦ ดูตัวอย่างหน้า Manage Account โดยไม่เข้าสู่ระบบ
            </Link>
          </p>
          <p className="mt-2 text-center">
            <Link href="/account-alt" className="font-ui text-[12px] tracking-wider text-[#a68d5f] underline decoration-dashed underline-offset-4 hover:text-[#6b4f22]">
              ✦ ดูตัวอย่างหน้า Manage Account แบบที่ 2 (Profile Picker)
            </Link>
          </p>
        </form>

        {/* right side — decorative letter scene */}
        <div className="relative hidden h-[460px] lg:block">
          <LetterStack />
        </div>
      </div>
    </ParchShell>
  )
}
