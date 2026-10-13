import { request } from "@/api/client"
import { ACCOUNT_ROUTES } from "@/api/routes"
import type { UserProfile } from "@/api/types/user.types"

export const accountService = {
  me: () => request<UserProfile>(ACCOUNT_ROUTES.me),

  changeUsername: (data: { newUsername: string; currentPassword: string }) =>
    request(ACCOUNT_ROUTES.username, { method: "PATCH", body: JSON.stringify(data) }),

  changeEmail: (data: { newEmail: string; currentPassword: string }) =>
    request(ACCOUNT_ROUTES.email, { method: "PATCH", body: JSON.stringify(data) }),

  verifyEmailChange: (token: string) =>
    request(`${ACCOUNT_ROUTES.verifyEmailChange}?token=${encodeURIComponent(token)}`),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    request(ACCOUNT_ROUTES.password, { method: "PATCH", body: JSON.stringify(data) }),

  deleteAccount: (data: {
    reasonType: string
    reasonDetail?: string
    currentPassword: string
  }) => request(ACCOUNT_ROUTES.account, { method: "DELETE", body: JSON.stringify(data) }),
}
