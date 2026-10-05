"use client"

import { useEffect, useState, FormEvent } from "react"
import { accountApi, authApi, ApiError, UserProfile } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ParchShell, InkDivider, Flourish, WaxSeal, SheetCorners, PasswordInput, InkModal } from "@/components/parchment"

const DELETION_REASONS = [
  { value: "no_longer_needed", label: "No longer needed" },
  { value: "privacy_concerns", label: "Privacy concerns" },
  { value: "found_alternative", label: "Found an alternative" },
  { value: "too_expensive", label: "Too expensive" },
  { value: "other", label: "Other" },
] as const

function passOk(v: string) {
  return v.length >= 8 && /[0-9]/.test(v) && /[A-Z]/.test(v) && /[a-z]/.test(v)
}

function PassRules({ value }: { value: string }) {
  const rules = [
    { ok: value.length >= 8, label: "At least 8 characters" },
    { ok: /[0-9]/.test(value), label: "At least one number" },
    { ok: /[A-Z]/.test(value) && /[a-z]/.test(value), label: "Both uppercase and lowercase" },
  ]
  return (
    <div className="mt-2 space-y-1 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-3">
      <p className="parch-label mb-1">Password Requirements</p>
      {rules.map((r, i) => (
        <p key={i} className={`flex items-center gap-2 font-ui text-[12px] ${r.ok ? "text-[#5b7a3d]" : "text-[#8a2a1f]"}`}>
          <span className="w-4 text-center">{r.ok ? "✓" : "✕"}</span>
          {r.label}
        </p>
      ))}
    </div>
  )
}

/* ── Section wrapper ─────────────────────────────────────── */

function Section({ children }: { children: React.ReactNode }) {
  return (
    <div className="parch-sheet relative p-7 sm:p-9">
      <SheetCorners />
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-jimthompson text-2xl text-[#3a2c1a]">{children}</h2>
  )
}

function FeedbackBar({ msg }: { msg: { type: "success" | "error"; text: string } | null }) {
  if (!msg) return null
  return (
    <div
      className={`mb-4 rounded border p-3 font-ui text-[13px] ${
        msg.type === "success"
          ? "border-[#5b7a3d]/40 bg-[#d4e6c3]/50 text-[#3a5c27]"
          : "border-[#8a2a1f]/40 bg-red-50/60 text-[#8a2a1f]"
      }`}
    >
      {msg.type === "success" ? "✦ " : "⚠️ "}
      {msg.text}
    </div>
  )
}

/* ── Main Dashboard ──────────────────────────────────────── */

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const [usernameForm, setUsernameForm] = useState({ newUsername: "", currentPassword: "" })
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" })
  const [deleteForm, setDeleteForm] = useState({ reasonType: "no_longer_needed", reasonDetail: "", currentPassword: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string; for: string } | null>(null)
  const [submitting, setSubmitting] = useState<string | null>(null)

  const setMessage = (type: "success" | "error", text: string, section: string) => {
    setMsg({ type, text, for: section })
    if (type === "success") setTimeout(() => setMsg(null), 4000)
  }

  useEffect(() => {
    accountApi.me()
      .then(setUser)
      .catch(() => router.push("/login"))
      .finally(() => setLoading(false))
  }, [router])

  const refreshUser = async () => {
    const updated = await accountApi.me()
    setUser(updated)
  }

  const handleLogout = async () => {
    await authApi.logout()
    router.push("/login")
  }

  const handleUsernameChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("username")
    try {
      await accountApi.changeUsername(usernameForm)
      await refreshUser()
      setUsernameForm(f => ({ ...f, currentPassword: "" }))
      setMessage("success", "Username updated successfully!", "username")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : "Failed to update username", "username")
    } finally {
      setSubmitting(null)
    }
  }

  const handleEmailChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("email")
    try {
      const result = await accountApi.changeEmail(emailForm) as { message: string }
      await refreshUser()
      setEmailForm(f => ({ ...f, currentPassword: "" }))
      setMessage("success", result.message, "email")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : "Failed to update email", "email")
    } finally {
      setSubmitting(null)
    }
  }

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("password")
    try {
      await accountApi.changePassword(passwordForm)
      setPasswordForm({ currentPassword: "", newPassword: "" })
      setMessage("success", "Password updated. Other sessions have been signed out.", "password")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : "Failed to update password", "password")
    } finally {
      setSubmitting(null)
    }
  }

  const handleDeleteAccount = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting("delete")
    try {
      await accountApi.deleteAccount({
        reasonType: deleteForm.reasonType,
        reasonDetail: deleteForm.reasonDetail || undefined,
        currentPassword: deleteForm.currentPassword,
      })
      router.push("/login")
    } catch (err) {
      setMessage("error", err instanceof ApiError ? err.message : "Failed to delete account", "delete")
    } finally {
      setSubmitting(null)
    }
  }

  const getUsernameCooldownDays = () => {
    if (!user?.usernameChangedAt) return 0
    const msElapsed = Date.now() - new Date(user.usernameChangedAt).getTime()
    const msCooldown = 7 * 24 * 60 * 60 * 1000
    if (msElapsed >= msCooldown) return 0
    return Math.ceil((msCooldown - msElapsed) / (1000 * 60 * 60 * 24))
  }

  const sec = (id: string) => msg?.for === id ? msg : null

  if (loading) {
    return (
      <div className="parch-bg flex min-h-screen items-center justify-center">
        <p className="parch-label animate-pulse">Loading…</p>
      </div>
    )
  }

  if (!user) return null

  const cooldownDays = getUsernameCooldownDays()

  return (
    <ParchShell title="Manage Account" sub="— Account Settings —" backHref="/">
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
            <Link href="/admin/logs" className="parch-label transition hover:text-[#3a2c1a]">
              Admin Logs →
            </Link>
          )}
          <button onClick={handleLogout} className="parch-label text-[#8a2a1f] transition hover:text-[#5c1d17]">
            Sign Out
          </button>
        </div>
      </div>

      <div className="relative z-20 mx-auto max-w-3xl px-6 py-10 space-y-8 sm:px-12">

        {/* Pending email banner */}
        {user.pendingEmail && (
          <div className="border border-[#c9ad77] bg-amber-50/60 p-4 font-ui text-[13px] text-[#5d4626]">
            ⏳ A verification letter was sent to <strong>{user.pendingEmail}</strong>.
            Your current email <strong>{user.email}</strong> remains active until confirmed.
          </div>
        )}

        {/* ── Change Username ── */}
        <Section>
          <SectionTitle>Change Username</SectionTitle>
          <p className="parch-label mt-0.5 mb-4">
            Current: <span className="text-[#3a2c1a] normal-case" style={{ letterSpacing: 0 }}>@{user.username}</span>
          </p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>

          {cooldownDays > 0 ? (
            <p className="font-ui text-[13px] text-[#8a7350]">
              🕐 You can change your username again in <strong className="text-[#3a2c1a]">{cooldownDays} day{cooldownDays !== 1 ? "s" : ""}</strong>.
            </p>
          ) : (
            <form onSubmit={handleUsernameChange} className="space-y-3">
              <FeedbackBar msg={sec("username")} />
              <div>
                <label className="parch-label mb-1 block">New Username</label>
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
                <label className="parch-label mb-1 block">Current Password</label>
                <PasswordInput
                  id="username-password"
                  value={usernameForm.currentPassword}
                  onChange={e => setUsernameForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••"
                  required
                  className="parch-input w-full font-serithai"
                />
              </div>
              <button id="username-submit" type="submit" disabled={submitting === "username"} className="parch-btn-outline px-8 py-2.5 text-sm">
                {submitting === "username" ? "Saving…" : "Save Username"}
              </button>
            </form>
          )}
        </Section>

        {/* ── Change Email ── */}
        <Section>
          <SectionTitle>Change Email</SectionTitle>
          <p className="parch-label mt-0.5 mb-4">
            Current: <span className="text-[#3a2c1a] normal-case" style={{ letterSpacing: 0 }}>{user.email}</span>
          </p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>
          <form onSubmit={handleEmailChange} className="space-y-3">
            <FeedbackBar msg={sec("email")} />
            <div>
              <label className="parch-label mb-1 block">New Email Address</label>
              <input
                id="email-new"
                type="email"
                value={emailForm.newEmail}
                onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
                placeholder="new@example.com"
                required
                className="parch-input w-full font-serithai"
              />
            </div>
            <div>
              <label className="parch-label mb-1 block">Current Password</label>
              <PasswordInput
                id="email-password"
                value={emailForm.currentPassword}
                onChange={e => setEmailForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••"
                required
                className="parch-input w-full font-serithai"
              />
            </div>
            <button id="email-submit" type="submit" disabled={submitting === "email"} className="parch-btn-outline px-8 py-2.5 text-sm">
              {submitting === "email" ? "Sending…" : "Send Verification Email"}
            </button>
          </form>
        </Section>

        {/* ── Change Password ── */}
        <Section>
          <SectionTitle>Change Password</SectionTitle>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            <FeedbackBar msg={sec("password")} />
            <div>
              <label className="parch-label mb-1 block">Current Password</label>
              <PasswordInput
                id="password-current"
                value={passwordForm.currentPassword}
                onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                className="parch-input w-full font-serithai"
              />
            </div>
            <div>
              <label className="parch-label mb-1 block">New Password</label>
              <PasswordInput
                id="password-new"
                value={passwordForm.newPassword}
                onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
                placeholder="••••••••"
                required
                minLength={8}
                autoComplete="new-password"
                className="parch-input w-full font-serithai"
              />
            </div>
            {passwordForm.newPassword.length > 0 && <PassRules value={passwordForm.newPassword} />}
            <button id="password-submit" type="submit" disabled={submitting === "password"} className="parch-btn-outline px-8 py-2.5 text-sm">
              {submitting === "password" ? "Updating…" : "Update Password"}
            </button>
          </form>
        </Section>

        {/* ── Delete Account ── */}
        <Section>
          <SectionTitle>
            <span className="text-[#8a2a1f]">Delete Account</span>
          </SectionTitle>
          <p className="parch-label mt-0.5 mb-4 text-[#8a2a1f]/70">
            This is permanent — your account will be soft-deleted and all sessions revoked.
          </p>
          <InkDivider><Flourish className="h-3 w-3" /></InkDivider>

          {!showDeleteConfirm ? (
            <button
              id="delete-account-open"
              onClick={() => setShowDeleteConfirm(true)}
              className="parch-btn-outline border-[#8a2a1f]/60 px-8 py-2.5 text-sm text-[#8a2a1f] hover:bg-red-50/50 hover:border-[#8a2a1f]"
            >
              Delete My Account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              <FeedbackBar msg={sec("delete")} />
              <div>
                <label className="parch-label mb-1 block">Reason for leaving</label>
                <select
                  id="delete-reason"
                  value={deleteForm.reasonType}
                  onChange={e => setDeleteForm(f => ({ ...f, reasonType: e.target.value }))}
                  required
                  className="parch-input w-full font-serithai"
                >
                  {DELETION_REASONS.map(r => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              {deleteForm.reasonType === "other" && (
                <textarea
                  id="delete-detail"
                  value={deleteForm.reasonDetail}
                  onChange={e => setDeleteForm(f => ({ ...f, reasonDetail: e.target.value }))}
                  placeholder="Please tell us more…"
                  required
                  rows={3}
                  className="parch-input w-full font-serithai resize-none"
                />
              )}
              <div>
                <label className="parch-label mb-1 block">Confirm with Current Password</label>
                <PasswordInput
                  id="delete-password"
                  value={deleteForm.currentPassword}
                  onChange={e => setDeleteForm(f => ({ ...f, currentPassword: e.target.value }))}
                  placeholder="••••••••"
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
                  {submitting === "delete" ? "Deleting…" : "Permanently Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="parch-btn-outline px-8 py-2.5 text-sm"
                >
                  Cancel
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
