"use client"

import Link from "next/link"
import { useState, FormEvent } from "react"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/Parchment"
import { routes } from "@/config/routes"
import { COPY, STATE_OPTIONS, type ResetState } from "./_mock/copy"

export default function ResetPasswordDraft() {
  const [newPassword, setNewPassword] = useState("")
  const [state, setState] = useState<ResetState>("form")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setState("success")
  }

  return (
    <>
      <ParchShell title={COPY.pageTitle} sub={COPY.pageSub} backHref={routes.login}>
        <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
          <div className="parch-sheet relative p-10">
            <SheetCorners />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <WaxSeal letter="⚿" size={56} />
            </div>

            {state === "noToken" && (
              <div className="text-center">
                <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">{COPY.invalidToken}</p>
                <div className="mt-6">
                  <Link href={routes.forgotPassword} className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
                    {COPY.requestNewLink}
                  </Link>
                </div>
              </div>
            )}

            {state === "success" && (
              <div className="space-y-4 text-center">
                <WaxSeal letter="✓" size={56} className="mx-auto" />
                <h2 className="font-jimthompson text-2xl text-[#3a2c1a]">{COPY.successHeading}</h2>
                <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">{COPY.successBody}</p>
              </div>
            )}

            {(state === "form" || state === "loading" || state === "error") && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">{COPY.heading}</h2>
                <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                <p className="text-center font-ui text-[13px] text-[#8a7350]">{COPY.hint}</p>

                {state === "error" && (
                  <div className="border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-[13px] text-[#8a2a1f]">
                    ⚠️ {COPY.sampleError}
                  </div>
                )}

                <div>
                  <label htmlFor="reset-password" className="parch-label mb-1 block">{COPY.passwordLabel}</label>
                  <PasswordInput
                    id="reset-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={COPY.passwordPlaceholder}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    className="parch-input w-full font-serithai"
                  />
                </div>

                <button id="reset-submit" type="submit" disabled={state === "loading"} className="parch-btn">
                  {state === "loading" ? COPY.submitting : COPY.submit}
                </button>
              </form>
            )}
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
