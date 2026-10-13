export interface AdminLogsParams {
  page?: number
  limit?: number
  userId?: number
  success?: "true" | "false"
  from?: string
  to?: string
}

export interface LoginHistoryRow {
  id: number
  userId: number | null
  attemptedUsername: string | null
  ip: string | null
  userAgent: string | null
  success: boolean
  createdAt: string
  userUsername: string | null
  userRole: string | null
}

export interface UsernameHistoryRow {
  id: number
  userId: number
  oldUsername: string
  newUsername: string
  changedAt: string
  userRole: string | null
}

export interface LogsResponse {
  loginHistory: LoginHistoryRow[]
  usernameHistory: UsernameHistoryRow[]
  meta: { page: number; limit: number; role: string; ipRedacted: boolean }
}
