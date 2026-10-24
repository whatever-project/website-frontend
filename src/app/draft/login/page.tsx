"use client"

import Link from "next/link"
import { useState, FormEvent } from "react"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/Parchment"
import LetterStack from "@/components/LetterStack"
import { routes } from "@/config/routes"
import { COPY, STATE_OPTIONS, type LoginState } from "./_mock/copy"

export default function LoginDraft() {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })
  const [remember, setRemember] = useState(false)
  const [state, setState] = useState<LoginState>("idle")

  const handleSubmit = (e: FormEvent) => {
    // Draft: no real login. Pretend the credentials were wrong.
    e.preventDefault()
    setState("error")
  }

  const isUnverified = state === "unverified"
  const error =
    state === "error" ? COPY.sampleApiError
    : state === "unverified" ? COPY.errorUnverified
    : state === "generic" ? COPY.errorGeneric
    : null

  return (
    <>
      <ParchShell title={COPY.pageTitle} sub={COPY.pageSub} backHref={routes.home}>
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

            <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">{COPY.formHeading}</h2>
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>

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
                    <Link href={routes.signup} className="underline underline-offset-2 hover:text-amber-700">
                      {COPY.backToSignup}
                    </Link>
                  </div>
                )}
              </div>
            )}

            <label htmlFor="login-identifier" className="parch-label mb-1.5 mt-4 block">{COPY.identifier}</label>
            <input
              id="login-identifier"
              className="parch-input font-serithai"
              value={form.usernameOrEmail}
              onChange={(e) => setForm((f) => ({ ...f, usernameOrEmail: e.target.value }))}
              placeholder={COPY.identifierPlaceholder}
              autoComplete="username"
              required
            />

            <label htmlFor="login-password" className="parch-label mb-1.5 mt-5 block">{COPY.password}</label>
            <PasswordInput
              id="login-password"
              className="parch-input w-full font-serithai"
              placeholder={COPY.passwordPlaceholder}
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              autoComplete="current-password"
              required
            />

            <div className="mt-4 mb-7 flex flex-wrap items-center justify-between gap-2">
              <label className="flex cursor-pointer items-center gap-2.5 font-ui text-[13px] text-[#5d4626]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="parch-check"
                />
                {COPY.rememberMe}
              </label>
              <Link
                href={routes.forgotPassword}
                className="font-ui text-[13px] text-[#b3a07c] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
              >
                {COPY.forgotPassword}
              </Link>
            </div>

            <button id="login-submit" type="submit" disabled={state === "loading"} className="parch-btn">
              {state === "loading" ? COPY.submitting : COPY.submit}
            </button>

            <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
              {COPY.noAccount}{" "}
              <Link
                href={routes.signup}
                className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
              >
                {COPY.createOne}
              </Link>
            </p>
          </form>

          {/* right side — decorative letter scene */}
          <div className="relative hidden h-[460px] lg:block">
            <LetterStack />
          </div>
        </div>
      </ParchShell>

      {/* Preview state (draft only) */}
      <div className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow">
        <p className="parch-label mb-1.5">Preview state (draft only)</p>
        <div className="flex flex-wrap gap-1.5">
          {STATE_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setState(o.value)}
              aria-pressed={state === o.value}
              className={`border px-2.5 py-1 ${state === o.value ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] text-[#6b5533]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
