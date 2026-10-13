import { request } from "@/api/client"
import { ADMIN_ROUTES } from "@/api/routes"
import type { AdminLogsParams, LogsResponse } from "@/api/types/admin.types"

export const adminService = {
  getLogs: (params: AdminLogsParams = {}) => {
    const qs = new URLSearchParams()
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined) qs.set(k, String(v))
    })
    const query = qs.toString()
    return request<LogsResponse>(`${ADMIN_ROUTES.logs}${query ? `?${query}` : ""}`)
  },

  /** Get all users (id, username, email, role, status) */
  getAllUsers: () => request(ADMIN_ROUTES.users),

  /** Hard-delete a user by id */
  deleteUser: (id: number) =>
    request(`${ADMIN_ROUTES.users}/${id}`, { method: "DELETE" }),
}
