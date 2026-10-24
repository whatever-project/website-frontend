"use client"

import Link from "next/link"
import { useState } from "react"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners } from "@/components/Parchment"
import { routes } from "@/config/routes"
import {
  COPY,
  KIND_OPTIONS,
  STATE_OPTIONS,
  SERVER_ERROR_MESSAGE,
  SERVER_SUCCESS_MESSAGE,
  type VerifyKind,
  type VerifyState,
} from "./_mock/copy"

export default function VerifyEmailDraft() {
  const [kind, setKind] = useState<VerifyKind>("signup")
  const [state, setState] = useState<VerifyState>("success")

  const t = COPY[kind]
  // Live: /verify-email goes back to home; /verify-email-change goes to the dashboard.
  const backHref = kind === "signup" ? routes.home : routes.dashboard
  const successHref = kind === "signup" ? routes.login : routes.dashboard
  const errorHref = kind === "signup" ? routes.signup : routes.dashboard

  return (
    <>
      <ParchShell title={t.pageTitle} sub={t.pageSub} backHref={backHref}>
        <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
          <div className="parch-sheet relative p-10 text-center">
            <SheetCorners />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <WaxSeal letter="✉" size={56} />
            </div>

            <div className="mt-4">
              <div className="text-center">
                {state === "loading" && <p className="parch-label animate-pulse">{t.loading}</p>}

                {state === "success" && (
                  <>
                    <WaxSeal letter="✓" size={56} className="mx-auto" />
                    <h2 className="font-jimthompson mt-4 text-2xl text-[#3a2c1a]">{t.successHeading}</h2>
                    <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                    <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">{SERVER_SUCCESS_MESSAGE}</p>
                    <div className="mt-7">
                      <Link href={successHref} className="parch-btn block">
                        {t.successCta}
                      </Link>
                    </div>
                  </>
                )}

                {(state === "errorNoToken" || state === "errorServer") && (
                  <>
                    <p className="font-jimthompson text-2xl text-[#8a2a1f]">{t.errorHeading}</p>
                    <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
                    <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">
                      {state === "errorNoToken" ? t.noToken : SERVER_ERROR_MESSAGE}
                    </p>
                    <div className="mt-7">
                      <Link href={errorHref} className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
                        {t.errorCta}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </ParchShell>

      {/* Preview state (draft only) */}
      <div className="fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow">
        <p className="parch-label mb-1.5">Preview state (draft only)</p>
        <div className="flex flex-wrap gap-1.5">
          {KIND_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => setKind(o.value)}
              aria-pressed={kind === o.value}
              className={`border px-2.5 py-1 ${kind === o.value ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] text-[#6b5533]"}`}
            >
              {o.label}
            </button>
          ))}
        </div>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
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
