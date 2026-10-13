import { USERNAME_COOLDOWN_DAYS } from "../constants"

const DAY_MS = 24 * 60 * 60 * 1000

/** Days left before the username can be changed again (0 = allowed now). */
export function getUsernameCooldownDays(usernameChangedAt: string | null, now: number = Date.now()): number {
  if (!usernameChangedAt) return 0
  const msElapsed = now - new Date(usernameChangedAt).getTime()
  const msCooldown = USERNAME_COOLDOWN_DAYS * DAY_MS
  if (msElapsed >= msCooldown) return 0
  return Math.ceil((msCooldown - msElapsed) / DAY_MS)
}
