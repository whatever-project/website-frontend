"use client"

import { Suspense } from "react"
import { useTranslations } from "next-intl"
import { ParchShell, WaxSeal, SheetCorners } from "@/components/ParchmentNew"
import { routes } from "@/config/routes"
import ResetPasswordForm from "./components/ResetPasswordForm"

export default function ResetPasswordView() {
  const t = useTranslations("resetPassword")
  const tCommon = useTranslations("common")
  return (
    <ParchShell title={t("pageTitle")} sub={t("pageSub")} backHref={routes.login}>
      <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
        <div className="parch-sheet relative p-10">
          <SheetCorners />
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WaxSeal letter="⚿" size={56} />
          </div>
          <Suspense fallback={<p className="parch-label text-center animate-pulse">{tCommon("loading")}</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </ParchShell>
  )
}
