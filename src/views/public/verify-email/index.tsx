"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ParchShell, WaxSeal, SheetCorners } from "@/components/ParchmentNew"
import { routes } from "@/config/routes"
import VerifyEmailStatus from "./components/VerifyEmailStatus"

export default function VerifyEmailView() {
  const t = useTranslations("verifyEmail")
  const tCommon = useTranslations("common")
  return (
    <ParchShell title={t("pageTitle")} sub={t("pageSub")} backHref={routes.home}>
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10 text-center">
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="✉" size={56} />
          </div>
          <div className="mt-4">
            <Suspense fallback={<p className="parch-label animate-pulse">{tCommon("loading")}</p>}>
              <VerifyEmailStatus />
            </Suspense>
          </div>
        </div>
      </div>
    </ParchShell>
  )
}
