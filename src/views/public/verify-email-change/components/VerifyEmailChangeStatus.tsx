"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { accountService } from "@/api/services/account.service"
import { ApiError } from "@/api/client"
import { Link } from "@/i18n/navigation"
import { InkDivider, Flourish, WaxSeal } from "@/components/Parchment"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"

export default function VerifyEmailChangeStatus() {
  const t = useTranslations("verifyEmailChange")
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage(t("noToken"))
      return
    }

    accountService.verifyEmailChange(token)
      .then((result: unknown) => {
        const r = result as { message: string }
        setMessage(r.message)
        setStatus("success")
      })
      .catch((err: unknown) => {
        setMessage(err instanceof ApiError ? err.message : "Verification failed.")
        setStatus("error")
      })
  }, [token, t])

  return (
    <div className="text-center">
      {status === "loading" && (
        <p className="parch-label animate-pulse">{t("loading")}</p>
      )}

      {status === "success" && (
        <>
          <WaxSeal letter="✓" size={56} className="mx-auto" />
          <h2 className="font-jimthompson mt-4 text-2xl text-[#3a2c1a]">{t("successHeading")}</h2>
          <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
          <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">{message}</p>
          <div className="mt-7">
            <Link href={routes.dashboard} className="parch-btn block">
              {t("backToAccount")}
            </Link>
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <p className="font-jimthompson text-2xl text-[#8a2a1f]">{t("errorHeading")}</p>
          <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
          <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">{message}</p>
          <div className="mt-7">
            <Link href={routes.dashboard} className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
              {t("backToAccount")}
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
