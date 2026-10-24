"use client"

import Link from "next/link"
import { useState, FormEvent } from "react"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners } from "@/components/Parchment"
import { routes } from "@/config/routes"
import { COPY, STATE_OPTIONS, type ForgotState } from "./_mock/copy"

export default function ForgotPasswordDraft() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<ForgotState>("idle")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setState("success")
  }

  const loading = state === "loading"
  const error = state === "error" ? COPY.sampleError : null

  return (
    <>
      <ParchShell title={COPY.pageTitle} sub={COPY.pageSub} backHref={routes.login}>
        <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
          <div className="parch-sheet relative p-10 text-center">
            <SheetCorners />

            {state === "success" ? (
              <>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <WaxSeal letter="✉" size={56} />
                </div>
                <h2 className="font-jimthompson mt-4 text-3xl text-[#3a2c1a]">{COPY.successHeading}</h2>
                <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                <p className="font-serif2 mt-2 text-[15px] leading-relaxed text-[#4a3820]">{COPY.successBody}</p>
                <div className="mt-7">
                  <Link href={routes.login} className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
                    {COPY.backToSignIn}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <div className="absolute -top-7 left-1/2 -translate-x-1/2">
                  <WaxSeal letter="?" size={56} />
                </div>
                <h2 className="font-jimthompson mt-4 text-3xl text-[#3a2c1a]">{COPY.heading}</h2>
                <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                <p className="font-serif2 mb-6 text-[15px] leading-relaxed text-[#4a3820]">{COPY.body}</p>

                {error && (
                  <div className="mb-4 border border-[#8a2a1f]/40 bg-red-50/60 p-3 text-left font-ui text-[13px] text-[#8a2a1f]">
                    ⚠️ {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label htmlFor="forgot-email" className="parch-label mb-1 block">{COPY.emailLabel}</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={COPY.emailPlaceholder}
                      required
                      className="parch-input w-full font-serithai"
                    />
                  </div>
                  <button id="forgot-submit" type="submit" disabled={loading} className="parch-btn">
                    {loading ? COPY.submitting : COPY.submit}
                  </button>
                </form>

                <div className="mt-6">
                  <Link
                    href={routes.login}
                    className="font-ui text-[13px] text-[#a68d5f] underline decoration-dotted underline-offset-4 hover:text-[#6b4f22]"
                  >
                    {COPY.backToSignIn}
                  </Link>
                </div>
              </>
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
