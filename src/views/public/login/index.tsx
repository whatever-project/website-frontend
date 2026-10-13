"use client"

import { useState, FormEvent } from "react"
import { authService } from "@/api/services/auth.service"
import { ApiError } from "@/api/client"
import { Link, useRouter } from "@/i18n/navigation"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/ParchmentNew"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"
import LetterStack from "@/components/LetterStack"

export default function LoginView() {
  const t = useTranslations("login")
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
      await authService.login(form)
      router.push(routes.dashboard)
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 403 || err.message.toLowerCase().includes("verify")) {
          setIsUnverified(true)
          setError(t("errorUnverified"))
        } else {
          setError(err.message)
        }
      } else {
        setError(t("errorGeneric"))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <ParchShell title={t("pageTitle")} sub={t("pageSub")} backHref={routes.home}>
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
            {t("formHeading")}
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
                  <Link href={routes.signup} className="underline underline-offset-2 hover:text-amber-700">
                    {t("backToSignup")}
                  </Link>
                </div>
              )}
            </div>
          )}

          <label className="parch-label mb-1.5 mt-4 block">{t("identifier")}</label>
          <input
            id="login-identifier"
            className="parch-input font-serithai"
            value={form.usernameOrEmail}
            onChange={e => setForm(f => ({ ...f, usernameOrEmail: e.target.value }))}
            placeholder={t("identifierPlaceholder")}
            autoComplete="username"
            required
          />

          <label className="parch-label mb-1.5 mt-5 block">{t("password")}</label>
          <PasswordInput
            id="login-password"
            className="parch-input w-full font-serithai"
            placeholder={t("passwordPlaceholder")}
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
              {t("rememberMe")}
            </label>
            <Link
              href={routes.forgotPassword}
              className="font-ui text-[13px] text-[#b3a07c] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <button
            id="login-submit"
            type="submit"
            disabled={loading}
            className="parch-btn"
          >
            {loading ? t("submitting") : t("submit")}
          </button>

          <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
            {t("noAccount")}{" "}
            <Link
              href={routes.signup}
              className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
            >
              {t("createOne")}
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
