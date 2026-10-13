// ─── API Endpoint Constants ───────────────────────────────────────────────────

export const AUTH_ROUTES = {
  signup: "/api/auth/signup",
  login: "/api/auth/login",
  logout: "/api/auth/logout",
  verifyEmail: "/api/auth/verify-email",
  forgotPassword: "/api/auth/forgot-password",
  resetPassword: "/api/auth/reset-password",
} as const

export const ACCOUNT_ROUTES = {
  me: "/api/account/me",
  username: "/api/account/username",
  email: "/api/account/email",
  verifyEmailChange: "/api/account/verify-email-change",
  password: "/api/account/password",
  account: "/api/account",
} as const

export const ADMIN_ROUTES = {
  logs: "/api/admin/logs",
  users: "/users",
} as const
