"use client"

import { useState, FormEvent } from "react"
import { authService } from "@/api/services/auth.service"
import { ApiError } from "@/api/client"
import { Link } from "@/i18n/navigation"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput } from "@/components/ParchmentNew"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"
import LetterStack from "@/components/LetterStack"
import { EMAIL_RE, getPasswordChecks, validateUsername } from "@/utils/validation"
import { USERNAME_ERROR_KEYS } from "./constants"

export default function SignupView() {
  const t = useTranslations("signup")

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [agree, setAgree] = useState(false)
  const [form, setForm] = useState({ username: "", email: "", password: "" })

  const [userFocus, setUserFocus] = useState(false)
  const [passFocus, setPassFocus] = useState(false)
  const [touched, setTouched] = useState<{ user?: boolean; email?: boolean; pass?: boolean }>({})

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const userErrCode = validateUsername(form.username)
  const userErr = userErrCode ? t(USERNAME_ERROR_KEYS[userErrCode]) : null
  const emailBadFormat = form.email.length > 0 && !EMAIL_RE.test(form.email)
  const emailErr = emailBadFormat ? t("emailErrFormat") : null

  const checks = getPasswordChecks(form.password)
  const passRules = [
    { ok: checks.length, label: t("passRule1") },
    { ok: checks.digit, label: t("passRule2") },
    { ok: checks.mixedCase, label: t("passRule3") },
  ]
  const passOk = passRules.every(r => r.ok)
  const formOk = !userErr && form.username.length > 0 && !emailErr && form.email.length > 0 && passOk

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setTouched({ user: true, email: true, pass: true })
    if (!formOk) return
    setError(null)
    setLoading(true)
    try {
      const result = await authService.signup({ username: form.username, email: form.email, password: form.password }) as { message: string }
      setSuccessMsg(result.message)
      setStep(3)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Read terms from message file (keys "0"…"6")
  const TERMS = Array.from({ length: 7 }, (_, i) => t(`terms.${i}` as Parameters<typeof t>[0]))

  const sub =
    step === 1 ? t("pageSubStep1")
    : step === 2 ? t("pageSubStep2")
    : t("pageSubStep3")

  return (
    <ParchShell title={t("pageTitle")} sub={sub} backHref={routes.home}>
      {/* step indicator */}
      {step !== 3 && (
        <div className="relative z-20 mt-6 flex items-center justify-center gap-4">
          {[1, 2].map(s => (
            <div key={s} className="flex items-center gap-4">
              <div className="flex items-center gap-2.5">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border font-display text-base transition-all ${
                    step === s ? "wax-seal border-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] bg-[#efe3c6] text-[#a68d5f]"
                  }`}
                >
                  {s}
                </div>
                <span className={`parch-label ${step === s ? "text-[#3a2c1a]" : ""}`}>
                  {s === 1 ? t("stepTerms") : t("stepAccountInfo")}
                </span>
              </div>
              {s === 1 && <span className="text-[#b89a63]">——✦——</span>}
            </div>
          ))}
        </div>
      )}

      {/* ── Step 1: Terms ── */}
      {step === 1 && (
        <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[1fr_1fr] lg:gap-32">
          <div className="parch-sheet relative p-8 sm:p-10 lg:ml-16">
            <SheetCorners />
            <h2 className="font-display text-center text-3xl text-[#3a2c1a]">{t("termsHeading")}</h2>
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>

            <ol className="my-5 max-h-72 space-y-3.5 overflow-y-auto border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-5">
              {TERMS.map((term, i) => (
                <li key={i} className="flex gap-3 font-serif2 text-[15px] leading-relaxed text-[#4a3820]">
                  <span className="font-display text-lg text-[#8a6a35]">
                    {["I", "II", "III", "IV", "V", "VI", "VII"][i]}.
                  </span>
                  {term}
                </li>
              ))}
            </ol>

            <label className="mb-6 flex cursor-pointer items-start gap-3 font-ui text-sm text-[#3a2c1a]">
              <input
                type="checkbox"
                checked={agree}
                onChange={e => setAgree(e.target.checked)}
                className="parch-check mt-0.5"
              />
              <span>
                {t("iAgree")}{" "}
                <span className="text-[#a68d5f]">{t("iAgreeRequired")}</span>
              </span>
            </label>

            <button className="parch-btn" disabled={!agree} onClick={() => setStep(2)}>
              {t("next")}
            </button>
          </div>

          <div className="relative hidden h-[460px] lg:block">
            <LetterStack />
          </div>
        </div>
      )}

      {/* ── Step 2: Account form ── */}
      {step === 2 && (
        <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center gap-20 px-6 py-12 sm:px-12 lg:grid-cols-[1fr_1fr] lg:gap-32">
          <form
            onSubmit={handleSubmit}
            className="parch-sheet relative mx-auto w-full max-w-md p-8 sm:p-10 lg:mx-0 lg:ml-16"
          >
            <SheetCorners />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <WaxSeal letter="✦" size={56} />
            </div>

            <h2 className="font-display mt-4 text-center text-3xl text-[#3a2c1a]">{t("formHeading")}</h2>
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>

            {error && (
              <div className="mb-4 border border-[#8a2a1f]/40 bg-red-50/60 p-3 font-ui text-sm text-[#8a2a1f]">
                ⚠️ {error}
              </div>
            )}

            <div className="mt-4">
              <label className="parch-label block">{t("username")}</label>
            </div>
            <input
              id="signup-username"
              className="parch-input w-full font-serithai"
              style={touched.user && userErr ? { borderColor: "#8a2a1f" } : undefined}
              value={form.username}
              maxLength={25}
              onChange={e => {
                setForm(f => ({ ...f, username: e.target.value }))
                setTouched(t => ({ ...t, user: true }))
              }}
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
              required
            />
            {userFocus && (
              <div className="mt-2 border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-3 font-ui text-[12px]">
                <p className="parch-label mb-1">{t("usernameRequirements")}</p>
                <ul className="space-y-1 text-[#4a3820]">
                  <li>- {t("usernameRule1")}</li>
                  <li>- {t("usernameRule2")}</li>
                  <li>- {t("usernameRule3")}</li>
                </ul>
              </div>
            )}
            {touched.user && userErr && <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">✕ {userErr}</p>}

            <label className="parch-label mb-1.5 mt-5 block">{t("email")}</label>
            <input
              id="signup-email"
              type="email"
              className="parch-input w-full font-serithai"
              style={touched.email && emailErr ? { borderColor: "#8a2a1f" } : undefined}
              placeholder={t("emailPlaceholder")}
              value={form.email}
              onChange={e => {
                setForm(f => ({ ...f, email: e.target.value }))
                setTouched(t => ({ ...t, email: true }))
              }}
              onBlur={() => setTouched(t => ({ ...t, email: true }))}
              required
            />
            {touched.email && emailErr && <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">✕ {emailErr}</p>}

            <label className="parch-label mb-1.5 mt-5 block">{t("password")}</label>
            <div onFocus={() => setPassFocus(true)} onBlur={() => setPassFocus(false)}>
              <PasswordInput
                id="signup-password"
                className="parch-input w-full font-serithai"
                placeholder={t("passwordPlaceholder")}
                value={form.password}
                onChange={e => {
                  setForm(f => ({ ...f, password: e.target.value }))
                  setTouched(t => ({ ...t, pass: true }))
                }}
                minLength={8}
                required
              />
            </div>
            {(passFocus || (touched.pass && !passOk)) && (
              <ul className="mt-2 space-y-1 border border-[#c9ad77] bg-[rgba(255,250,235,0.45)] p-3 font-ui text-[12px]">
                <li className="parch-label mb-1">{t("passwordRequirements")}</li>
                {passRules.map(r => (
                  <li key={r.label} className={`flex items-center gap-2 ${r.ok ? "text-[#5b7a3d]" : "text-[#8a2a1f]"}`}>
                    <span className="w-4 text-center font-bold">{r.ok ? "✓" : "✕"}</span>
                    {r.label}
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-8">
              <button id="signup-submit" type="submit" disabled={loading} className="parch-btn">
                {loading ? t("submitting") : t("submit")}
              </button>
            </div>

            <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
              {t("alreadyHaveAccount")}{" "}
              <Link href={routes.login} className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]">
                {t("signIn")}
              </Link>
            </p>
          </form>

          <div className="relative hidden h-[460px] lg:block">
            <LetterStack />
          </div>
        </div>
      )}

      {/* ── Step 3: Email verification ── */}
      {step === 3 && (
        <div className="relative z-20 mx-auto max-w-xl px-6 py-14">
          <div className="parch-sheet relative p-10 text-center">
            <SheetCorners />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2">
              <WaxSeal letter="✦" size={56} />
            </div>

            <svg viewBox="0 0 24 24" fill="none" stroke="#8a6a35" strokeWidth="1.4" className="mx-auto mt-4 h-16 w-16">
              <rect x="2.5" y="5" width="19" height="14" rx="1.5" />
              <path d="m3.5 6.5 8.5 7 8.5-7" />
            </svg>

            <h2 className="font-display mt-5 text-3xl text-[#3a2c1a]">{t("verifyHeading")}</h2>
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>

            <p className="font-serif2 mt-2 text-[15px] leading-relaxed text-[#4a3820]">
              {successMsg ?? t("verifyBody")}
            </p>
            <p className="font-ui mt-3 text-[13px] text-[#8a7350]">
              {t("verifyLetterSent")}{" "}
              <span className="font-medium text-[#3a2c1a]">{form.email}</span>
            </p>

            <div className="mt-7">
              <p className="font-ui text-center text-[13px] text-[#8a7350]">
                {t("alreadyVerified")}{" "}
                <Link href={routes.login} className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]">
                  {t("signIn")}
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}
    </ParchShell>
  )
}
