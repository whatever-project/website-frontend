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
