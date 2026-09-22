"use client"

import { useEffect, useState, FormEvent } from "react"
import { accountApi, authApi, ApiError, UserProfile } from "@/lib/api"
import { useRouter } from "next/navigation"
import Link from "next/link"

const DELETION_REASONS = [
  { value: "no_longer_needed", label: "No longer needed" },
  { value: "privacy_concerns", label: "Privacy concerns" },
  { value: "found_alternative", label: "Found an alternative" },
  { value: "too_expensive", label: "Too expensive" },
  { value: "other", label: "Other" },
] as const

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Form states
  const [usernameForm, setUsernameForm] = useState({ newUsername: "", currentPassword: "" })
  const [emailForm, setEmailForm] = useState({ newEmail: "", currentPassword: "" })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" })
  const [deleteForm, setDeleteForm] = useState({ reasonType: "no_longer_needed", reasonDetail: "", currentPassword: "" })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Status messages
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

  // Cooldown calculation for username
  const getUsernameCooldownDays = () => {
    if (!user?.usernameChangedAt) return 0
    const msElapsed = Date.now() - new Date(user.usernameChangedAt).getTime()
    const msCooldown = 7 * 24 * 60 * 60 * 1000
    if (msElapsed >= msCooldown) return 0
    return Math.ceil((msCooldown - msElapsed) / (1000 * 60 * 60 * 24))
  }
  const cooldownDays = user ? getUsernameCooldownDays() : 0

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-zinc-500 text-sm animate-pulse">Loading…</div>
      </main>
    )
  }

  if (!user) return null

  const section = (id: string) => msg?.for === id ? msg : null

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center justify-between max-w-3xl mx-auto">
        <div>
          <span className="font-semibold text-zinc-100">@{user.username}</span>
          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
            user.role === "admin" ? "bg-yellow-900 text-yellow-300" :
            user.role === "moderator" ? "bg-blue-900 text-blue-300" :
            "bg-zinc-800 text-zinc-400"
          }`}>{user.role}</span>
        </div>
        <div className="flex items-center gap-4">
          {(user.role === "admin" || user.role === "moderator") && (
            <Link href="/admin/logs" className="text-xs text-zinc-400 hover:text-white transition-colors">
              Admin Logs
            </Link>
          )}
          <button onClick={handleLogout} className="text-xs text-zinc-500 hover:text-red-400 transition-colors">
            Sign out
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>

        {/* Pending email banner */}
        {user.pendingEmail && (
          <div className="rounded-xl border border-amber-800 bg-amber-950/30 px-5 py-4 text-sm text-amber-300">
            ⏳ A verification email has been sent to <strong>{user.pendingEmail}</strong>.
            Your current email <strong>{user.email}</strong> remains active until you confirm the new one.
          </div>
        )}

        {/* ── Change Username ──────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-100">Change Username</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Current: <span className="text-zinc-300">@{user.username}</span></p>
          </div>

          {cooldownDays > 0 ? (
            <div className="rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-3 text-sm text-zinc-400">
              🕐 You can change your username again in <strong className="text-zinc-200">{cooldownDays} day{cooldownDays !== 1 ? "s" : ""}</strong>.
            </div>
          ) : (
            <form onSubmit={handleUsernameChange} className="space-y-3">
              {section("username") && (
                <div className={`rounded-lg px-4 py-3 text-sm border ${section("username")!.type === "success" ? "bg-green-950/40 border-green-800 text-green-300" : "bg-red-950/40 border-red-800 text-red-400"}`}>
                  {section("username")!.text}
                </div>
              )}
              <input
                id="username-new"
                type="text"
                value={usernameForm.newUsername}
                onChange={e => setUsernameForm(f => ({ ...f, newUsername: e.target.value }))}
                placeholder="New username"
                required
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <input
                id="username-password"
                type="password"
                value={usernameForm.currentPassword}
                onChange={e => setUsernameForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Current password"
                required
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />
              <button id="username-submit" type="submit" disabled={submitting === "username"} className="rounded-lg bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors">
                {submitting === "username" ? "Saving…" : "Save username"}
              </button>
            </form>
          )}
        </section>

        {/* ── Change Email ─────────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-zinc-100">Change Email</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Current: <span className="text-zinc-300">{user.email}</span></p>
          </div>
          <form onSubmit={handleEmailChange} className="space-y-3">
            {section("email") && (
              <div className={`rounded-lg px-4 py-3 text-sm border ${section("email")!.type === "success" ? "bg-green-950/40 border-green-800 text-green-300" : "bg-red-950/40 border-red-800 text-red-400"}`}>
                {section("email")!.text}
              </div>
            )}
            <input
              id="email-new"
              type="email"
              value={emailForm.newEmail}
              onChange={e => setEmailForm(f => ({ ...f, newEmail: e.target.value }))}
              placeholder="New email address"
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <input
              id="email-password"
              type="password"
              value={emailForm.currentPassword}
              onChange={e => setEmailForm(f => ({ ...f, currentPassword: e.target.value }))}
              placeholder="Current password"
              required
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button id="email-submit" type="submit" disabled={submitting === "email"} className="rounded-lg bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors">
              {submitting === "email" ? "Sending…" : "Send verification email"}
            </button>
          </form>
        </section>

        {/* ── Change Password ──────────────────────────────────────── */}
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-4">
          <h2 className="font-semibold text-zinc-100">Change Password</h2>
          <form onSubmit={handlePasswordChange} className="space-y-3">
            {section("password") && (
              <div className={`rounded-lg px-4 py-3 text-sm border ${section("password")!.type === "success" ? "bg-green-950/40 border-green-800 text-green-300" : "bg-red-950/40 border-red-800 text-red-400"}`}>
                {section("password")!.text}
              </div>
            )}
            <input
              id="password-current"
              type="password"
              value={passwordForm.currentPassword}
              onChange={e => setPasswordForm(f => ({ ...f, currentPassword: e.target.value }))}
              placeholder="Current password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <input
              id="password-new"
              type="password"
              value={passwordForm.newPassword}
              onChange={e => setPasswordForm(f => ({ ...f, newPassword: e.target.value }))}
              placeholder="New password (min 8 characters)"
              required
              minLength={8}
              autoComplete="new-password"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
            />
            <button id="password-submit" type="submit" disabled={submitting === "password"} className="rounded-lg bg-zinc-100 text-zinc-900 px-5 py-2 text-sm font-medium hover:bg-white disabled:opacity-50 transition-colors">
              {submitting === "password" ? "Updating…" : "Update password"}
            </button>
          </form>
        </section>

        {/* ── Delete Account ───────────────────────────────────────── */}
        <section className="rounded-2xl border border-red-900/60 bg-red-950/10 p-6 space-y-4">
          <div>
            <h2 className="font-semibold text-red-300">Delete Account</h2>
            <p className="text-xs text-zinc-500 mt-0.5">This is permanent. Your account will be soft-deleted and all sessions revoked.</p>
          </div>

          {!showDeleteConfirm ? (
            <button
              id="delete-account-open"
              onClick={() => setShowDeleteConfirm(true)}
              className="rounded-lg border border-red-900 text-red-400 px-5 py-2 text-sm font-medium hover:bg-red-950/40 transition-colors"
            >
              Delete my account
            </button>
          ) : (
            <form onSubmit={handleDeleteAccount} className="space-y-3">
              {section("delete") && (
                <div className="rounded-lg bg-red-950/40 border border-red-800 px-4 py-3 text-sm text-red-400">
                  {section("delete")!.text}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-xs font-medium text-zinc-400">Reason for leaving</label>
                <select
                  id="delete-reason"
                  value={deleteForm.reasonType}
                  onChange={e => setDeleteForm(f => ({ ...f, reasonType: e.target.value }))}
                  required
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
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
                  className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                />
              )}

              <input
                id="delete-password"
                type="password"
                value={deleteForm.currentPassword}
                onChange={e => setDeleteForm(f => ({ ...f, currentPassword: e.target.value }))}
                placeholder="Confirm with current password"
                required
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
              />

              <div className="flex gap-3">
                <button
                  id="delete-confirm"
                  type="submit"
                  disabled={submitting === "delete"}
                  className="rounded-lg bg-red-700 text-white px-5 py-2 text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-colors"
                >
                  {submitting === "delete" ? "Deleting…" : "Permanently delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg border border-zinc-700 text-zinc-400 px-5 py-2 text-sm font-medium hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </section>
      </div>
    </main>
  )
}
