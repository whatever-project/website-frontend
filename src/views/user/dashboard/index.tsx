"use client"

import { useEffect, useState, FormEvent } from "react"
import { accountService } from "@/api/services/account.service"
import { authService } from "@/api/services/auth.service"
import { ApiError } from "@/api/client"
import type { UserProfile } from "@/api/types/user.types"
import { Link, useRouter } from "@/i18n/navigation"
import { ParchShell, InkDivider, Flourish, WaxSeal, PasswordInput, InkModal } from "@/components/ParchmentNew"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"
import { DELETION_REASON_KEYS } from "./constants"
import type { DeletionReasonKey } from "./types"
import { getUsernameCooldownDays } from "./functions/usernameCooldown"
import PassRules from "./components/PassRules"
import Section from "./components/Section"
import SectionTitle from "./components/SectionTitle"
import FeedbackBar from "./components/FeedbackBar"

export default function DashboardView() {
  const t = useTranslations("dashboard")
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [usernameForm, setUsernameForm] = useState({ newUsername: "", currentPassword: "" })
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" })
  const [deleteForm, setDeleteForm] = useState({ reasonType: "no_longer_needed" as DeletionReasonKey, reasonDetail: "", currentPassword: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string; for: string } | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)

  const setMessage = (type: "success" | "error", text: string, section: string) => {
    setMsg({ type, text, for: section })
    if (type === "success") setTimeout(() => setMsg(null), 4000)
  }

  useEffect(() => {
    accountService.me()
      .then(setUser)
      .catch(() => router.push(routes.login))
      .finally(() => setLoading(false))
  }, [router])

  const refreshUser = async () => {
    const updated = await accountService.me()
    setUser(updated)
  }

  const handleLogout = async () => {
    await authService.logout()
    router.push(routes.login)
  }

  const handleUsernameChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("username")
    try {
      await accountService.changeUsername(usernameForm)
      await refreshUser()
      setUsernameForm(f => ({ ...f, currentPassword: "" }))
      setMessage("success", t("successUsername"), "username")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : t("failUsername"), "username")
    } finally {
      setSubmitting(null)
    }
  }

  const handleEmailChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("email")
    try {
      const result = await accountService.changeEmail(emailForm) as { message: string }
      await refreshUser()
      setEmailForm(f => ({ ...f, currentPassword: "" }))
      setMessage("success", result.message, "email")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : t("failEmail"), "email")
    } finally {
      setSubmitting(null)
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("password")
    try {
      await accountService.changePassword(passwordForm)
      setPasswordForm({ currentPassword: "", newPassword: "" })
      setMessage("success", t("successPassword"), "password")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : t("failPassword"), "password")
    } finally {
      setSubmitting(null)
    }
  }

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("delete")
    try {
      await accountService.deleteAccount({
        reasonType: deleteForm.reasonType,
        reasonDetail: deleteForm.reasonDetail || undefined,
        currentPassword: deleteForm.currentPassword,
      })
      router.push(routes.login)
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : t("failDelete"), "delete")
    } finally {
      setSubmitting(null)
    }
  }

  const sec = (id: string) => msg?.for === id ? msg : null

  if (loading) {
    return (
      <div className="parch-bg flex min-h-screen items-center justify-center">
        <p className="parch-label animate-pulse">{t("loading")}</p>
      </div>
    )
  }

  if (!user) return null

  const cooldownDays = getUsernameCooldownDays(user.usernameChangedAt)

  return (
    <ParchShell title={t("pageTitle")} sub={t("pageSub")} backHref={routes.home}>
      {/* user banner */}
      <div className="relative z-20 flex flex-col items-center gap-1 px-6 sm:px-12">
        <div className="flex items-center gap-3">
          <WaxSeal letter={user.username.charAt(0).toUpperCase()} size={48} />
          <div>
            <p className="font-jimthompson text-2xl text-[#3a2c1a]">@{user.username}</p>
            <span className={`parch-label ${
              user.role === "admin" ? "text-amber-700" :
              user.role === "moderator" ? "text-blue-700" : ""
            }`}>
              {user.role}
            </span>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-6">
          {(user.role === "admin" || user.role === "moderator") && (
            <Link href={routes.adminLogs} className="parch-label transition hover:text-[#3a2c1a]">
              {t("adminLogs")}
            </Link>
          )}
          <button onClick={handleLogout} className="parch-label text-[#8a2a1f] transition hover:text-[#5c1d17]">
            {t("signOut")}
          </button>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-3xl px-6 py-10 space-y-8 sm:px-12">

        {/* Pending email banner */}
        {user.pendingEmail && (
          <div className="border border-[#c9ad77] bg-amber-50/60 p-4 font-ui text-[13px] text-[#5d4626]">
            ⏳ {t("pendingEmail", { email: user.pendingEmail, currentEmail: user.email })}
          </div>
        )}

        {/* ── Change Username ── */}
        <Section>
          <SectionTitle>{t("usernameSection")}</SectionTitle>
          <p className="parch-label mt-0.5 mb-4">
            {t("currentUsername")} <span className="text-[#3a2c1a] normal-case" style={{ letterSpacing: 0 }}>@{user.username}</span>
          </p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>

          {cooldownDays > 0 ? (
            <p className="font-ui text-[13px] text-[#8a7350]">
              🕐 {t("cooldown", { days: cooldownDays, plural: cooldownDays !== 1 ? "s" : "" })}
            </p>
          ) : (
            <form onSubmit={handleUsernameChange} className="space-y-3">
              <FeedbackBar msg={sec("username")} />
              <div>
                <label className="parch-label mb-1 block">{t("newUsernameLabel")}</label>
                <input
                  id="username-new"
                  type="text"
                  value={usernameForm.newUsername}
                  onChange={e => setUsernameForm(f => ({ ...f, newUsername: e.target.value }))}
                  placeholder="new_username"
                  required
                  className="parch-input w-full font-serithai"
                />
              </div>
              <div>
                <label className="parch-label mb-1 block">{t("currentPasswordLabel")}</label>
                <PasswordInput
                  id="username-password"
                  value={usernameForm.currentPassword}
                  onChange={e => setUsernameForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="parch-input w-full font-serithai"
                />
              </div>
              <button id="username-submit" type="submit" disabled={submitting === "username"} className="parch-btn-outline px-8 py-2.5 text-sm">
                {submitting === "username" ? t("savingUsername") : t("saveUsername")}
              </button>
            </form>
          )}
        </Section>

        {/* ── Change Email ── */}
        <Section>
          <SectionTitle>{t("emailSection")}</SectionTitle>
          <p className="parch-label mt-0.5 mb-4">
            {t("currentEmail")} <span className="text-[#3a2c1a] normal-case" style={{ letterSpacing: 0 }}>{user.email}</span>
          </p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>
          <form onSubmit={handleEmailChange} className="space-y-3">
            <FeedbackBar msg={sec("email")} />
            <div>
              <label className="parch-label mb-1 block">{t("newEmailLabel")}</label>
              <input
                id="email-new"
                type="email"
                value={emailForm.newEmail}
                onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
                placeholder={t("newEmailPlaceholder")}
                required
                className="parch-input w-full font-serithai"
              />
            </div>
            <div>
              <label className="parch-label mb-1 block">{t("currentPasswordLabel")}</label>
              <PasswordInput
                id="email-password"
                value={emailForm.currentPassword}
                onChange={e => setEmailForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder={t("passwordPlaceholder")}
                required
                className="parch-input w-full font-serithai"
              />
            </div>
            <button id="email-submit" type="submit" disabled={submitting === "email"} className="parch-btn-outline px-8 py-2.5 text-sm">
              {submitting === "email" ? t("sendingVerification") : t("sendVerification")}
            </button>
          </form>
        </Section>

        {/* ── Change Password ── */}
        <Section>
          <SectionTitle>{t("passwordSection")}</SectionTitle>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <FeedbackBar msg={sec("password")} />
            <div>
              <label className="parch-label mb-1 block">{t("currentPasswordLabel")}</label>
              <PasswordInput
                id="password-current"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder={t("passwordPlaceholder")}
                required
                autoComplete="current-password"
                className="parch-input w-full font-serithai"
              />
            </div>
            <div>
              <label className="parch-label mb-1 block">{t("newPasswordLabel")}</label>
              <PasswordInput
                id="password-new"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder={t("passwordPlaceholder")}
                required
                minLength={8}
                autoComplete="new-password"
                className="parch-input w-full font-serithai"
              />
            </div>
            {passwordForm.newPassword.length > 0 && <PassRules value={passwordForm.newPassword} t={t} />}
            <button id="password-submit" type="submit" disabled={submitting === "password"} className="parch-btn-outline px-8 py-2.5 text-sm">
              {submitting === "password" ? t("updatingPassword") : t("updatePassword")}
            </button>
          </form>
        </Section>

        {/* ── Delete Account ── */}
        <Section>
          <SectionTitle>
            <span className="text-[#8a2a1f]">{t("deleteSection")}</span>
          </SectionTitle>
          <p className="parch-label mt-0.5 mb-4 text-[#8a2a1f]/70">{t("deleteWarning")}</p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>

          {!showDeleteConfirm ? (
            <button
              id="delete-account-open"
              onClick={() => setShowDeleteConfirm(true)}
              className="parch-btn-outline border-[#8a2a1f]/60 px-8 py-2.5 text-sm text-[#8a2a1f] hover:bg-red-50/50 hover:border-[#8a2a1f]"
            >
              {t("deleteMyAccount")}
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <FeedbackBar msg={sec("delete")} />
              <div>
                <label className="parch-label mb-1 block">{t("deleteReasonLabel")}</label>
                <select
                  id="delete-reason"
                  value={deleteForm.reasonType}
                  onChange={e => setDeleteForm(f => ({ ...f, reasonType: e.target.value as DeletionReasonKey }))}
                  required
                  className="parch-input w-full font-serithai"
                >
                  {DELETION_REASON_KEYS.map(key => (
                    <option key={key} value={key}>{t(`deletionReasons.${key}` as Parameters<typeof t>[0])}</option>
                  ))}
                </select>
              </div>
              {deleteForm.reasonType === "other" && (
                <textarea
                  id="delete-detail"
                  value={deleteForm.reasonDetail}
                  onChange={e => setDeleteForm(f => ({ ...f, reasonDetail: e.target.value }))}
                  placeholder={t("deleteDetailPlaceholder")}
                  required
                  rows={3}
                  className="parch-input w-full font-serithai resize-none"
                />
              )}
              <div>
                <label className="parch-label mb-1 block">{t("confirmPasswordLabel")}</label>
                <PasswordInput
                  id="delete-password"
                  value={deleteForm.currentPassword}
                  onChange={e => setDeleteForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder={t("passwordPlaceholder")}
                  required
                  className="parch-input w-full font-serithai"
                />
              </div>
              <div className="flex gap-3">
                <button
                  id="delete-confirm"
                  type="submit"
                  disabled={submitting === "delete"}
                  className="parch-btn-outline border-[#8a2a1f]/60 px-8 py-2.5 text-sm text-[#8a2a1f] hover:bg-red-50/50 hover:border-[#8a2a1f]"
                >
                  {submitting === "delete" ? t("deleting") : t("permanentlyDelete")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="parch-btn-outline px-8 py-2.5 text-sm"
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          )}
        </Section>

        <div className="flex justify-center pt-4 pb-2">
          <WaxSeal letter={user.username.charAt(0).toUpperCase()} size={50} />
        </div>
      </div>
    </ParchShell>
  )
}
