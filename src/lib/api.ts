const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"

// ─── Base Fetch Wrapper ───────────────────────────────────────────────────────

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: "include", // Always send cookies for session auth
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
    ...options,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string }
    throw new ApiError(err.error ?? `Request failed: ${res.status}`, res.status)
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
    this.name = "ApiError"
  }
}

// ─── Auth API ─────────────────────────────────────────────────────────────────

export const authApi = {
  signup: (data: { username: string; email: string; password: string }) =>
    request("/api/auth/signup", { method: "POST", body: JSON.stringify(data) }),

  login: (data: { usernameOrEmail: string; password: string }) =>
    request("/api/auth/login", { method: "POST", body: JSON.stringify(data) }),

  logout: () =>
    request("/api/auth/logout", { method: "POST" }),

  verifyEmail: (token: string) =>
    request(`/api/auth/verify-email?token=${encodeURIComponent(token)}`),

  forgotPassword: (data: { email: string }) =>
    request("/api/auth/forgot-password", { method: "POST", body: JSON.stringify(data) }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    request("/api/auth/reset-password", { method: "POST", body: JSON.stringify(data) }),
}

// ─── Account API ──────────────────────────────────────────────────────────────

export interface UserProfile {
  id: number
  username: string
  email: string
  role: "guest" | "member" | "moderator" | "admin"
  status: "active" | "suspended" | "banned" | "deleted"
  isEmailVerified: boolean
  emailVerifiedAt: string | null
  pendingEmail: string | null
  pendingEmailChangedAt: string | null
  passwordChangedAt: string | null
  usernameChangedAt: string | null
  registrationIp: string | null
  lastLoginIp: string | null
  createdAt: string
  lastLoginAt: string | null
  deletedAt: string | null
}

export const accountApi = {
  me: () => request<UserProfile>("/api/account/me"),

  changeUsername: (data: { newUsername: string; currentPassword: string }) =>
    request("/api/account/username", { method: "PATCH", body: JSON.stringify(data) }),

  changeEmail: (data: { newEmail: string; currentPassword: string }) =>
    request("/api/account/email", { method: "PATCH", body: JSON.stringify(data) }),

  verifyEmailChange: (token: string) =>
    request(`/api/account/verify-email-change?token=${encodeURIComponent(token)}`),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request("/api/account/password", { method: "PATCH", body: JSON.stringify(data) }),

  deleteAccount: (data: {
    reasonType: string
    reasonDetail?: string
    currentPassword: string
  }) => request("/api/account", { method: "DELETE", body: JSON.stringify(data) }),
}

// ─── Admin API ────────────────────────────────────────────────────────────────

export interface AdminLogsParams {
  page?: number
  limit?: number
  userId?: number
  success?: "true" | "false"
  from?: string
  to?: string
}

export const adminApi = {
  getLogs: (params: AdminLogsParams = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) qs.set(k, String(v))
    })
    const query = qs.toString()
    return request(`/api/admin/logs${query ? `?${query}` : ""}`)
  },
}
