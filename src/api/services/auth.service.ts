import { request } from "@/api/client"
import { AUTH_ROUTES } from "@/api/routes"

export const authService = {
  signup: (data: { username: string; email: string; password: string }) =>
    request(AUTH_ROUTES.signup, { method: "POST", body: JSON.stringify(data) }),

  login: (data: { usernameOrEmail: string; password: string }) =>
    request(AUTH_ROUTES.login, { method: "POST", body: JSON.stringify(data) }),

  logout: () =>
    request(AUTH_ROUTES.logout, { method: "POST" }),

  verifyEmail: (token: string) =>
    request(`${AUTH_ROUTES.verifyEmail}?token=${encodeURIComponent(token)}`),

  forgotPassword: (data: { email: string }) =>
    request(AUTH_ROUTES.forgotPassword, { method: "POST", body: JSON.stringify(data) }),

  resetPassword: (data: { token: string; newPassword: string }) =>
    request(AUTH_ROUTES.resetPassword, { method: "POST", body: JSON.stringify(data) }),
}
