"use client"

import { useState, FormEvent } from "react"
import { useSearchParams } from "next/navigation"
import { authService } from "@/api/services/auth.service"
import { ApiError } from "@/api/client"
import { Link, useRouter } from "@/i18n/navigation"
import { InkDivider, Flourish, WaxSeal, PasswordInput } from "@/components/Parchment"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"

export default function ResetPasswordForm() {
  const t = useTranslations("resetPassword")
  const searchParams = useSearchParams()
  const token = searchParams.get("token") ?? ""
  const router = useRouter()
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!token) {
    return (
      <div className="text-center">
        <p className="font-serif2 text-[15px] leading-relaxed text-[#8a2a1f]">
          {t("invalidToken")}
        </p>
        <div className="mt-6">
          <Link href={routes.forgotPassword} className="parch-btn-outline inline-block px-8 py-2.5 text-sm">
            {t("requestNewLink")}
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await authService.resetPassword({ token, newPassword })
      setSuccess(true)
      setTimeout(() => router.push(routes.login), 2500)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Reset failed")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <WaxSeal letter="✓" size={56} className="mx-auto" />
        <h2 className="font-jimthompson text-2xl text-[#3a2c1a]">{t("successHeading")}</h2>
        <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
        <p className="font-serif2 text-[15px] leading-relaxed text-[#4a3820]">
          {t("successBody")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-jimthompson mt-4 text-center text-3xl text-[#3a2c1a]">{t("heading")}</h2>
      <InkDivider><Flourish className="h-4 w-4" /></InkDivider>
      <p className="font-ui text-center text-[13px] text-[#8a7350]">{t("hint")}</p>

      {error && (
        <div className="border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-[13px] text-[#8a2a1f]">
          ⚠️ {error}
        </div>
      )}

      <div>
        <label className="parch-label mb-1 block">{t("passwordLabel")}</label>
        <PasswordInput
          id="reset-password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          placeholder={t("passwordPlaceholder")}
          required
          minLength={8}
          autoComplete="new-password"
          className="parch-input w-full font-serithai"
        />
      </div>

      <button
        id="reset-submit"
        type="submit"
        disabled={loading}
        className="parch-btn"
      >
        {loading ? t("submitting") : t("submit")}
      </button>
    </form>
  )
}
