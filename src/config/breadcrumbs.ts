/**
 * Maps pathname patterns to i18n message keys.
 * Used by Breadcrumb components to render localised labels.
 * No hardcoded labels here — all labels come from messages/.
 */
export const breadcrumbMap: Record<string, string> = {
  "/": "breadcrumbs.home",
  "/login": "breadcrumbs.login",
  "/signup": "breadcrumbs.signup",
  "/forgot-password": "breadcrumbs.forgotPassword",
  "/reset-password": "breadcrumbs.resetPassword",
  "/verify-email": "breadcrumbs.verifyEmail",
  "/verify-email-change": "breadcrumbs.verifyEmailChange",
  "/dashboard": "breadcrumbs.dashboard",
  "/account": "breadcrumbs.account",
  "/admin": "breadcrumbs.admin",
  "/admin/logs": "breadcrumbs.adminLogs",
}
