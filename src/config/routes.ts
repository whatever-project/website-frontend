/**
 * Single source for app link targets. Use `routes.x` instead of hard-coded paths.
 * Locale prefixes are added by next-intl — never write them here.
 */
export const routes = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  verifyEmailChange: "/verify-email-change",
  dashboard: "/dashboard",
  account: "/account",
  adminLogs: "/admin/logs",
} as const

/** Design drafts live at app/draft/<route>/ — same path as the live page, under /draft. */
export const DRAFT_PREFIX = "/draft"

/** Hub listing all drafts; target of the floating DraftBadge on live pages. */
export const DRAFT_HUB = "/draft/dev-tools"
