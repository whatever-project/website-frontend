/** Form validation helpers shared by signup and dashboard. Pure functions — no UI, no translations. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type UsernameError = "spaces" | "length" | "chars"

/** Returns an error code for a non-empty username, or null when valid (empty input is not an error). */
export function validateUsername(v: string): UsernameError | null {
  if (v.length === 0) return null
  if (/\s/.test(v)) return "spaces"
  if (v.length < 3) return "length"
  if (!/^[A-Za-z0-9_.-]+$/.test(v)) return "chars"
  return null
}

/** The three password rules shown in the UI: 8+ chars, a digit, upper + lower case. */
export function getPasswordChecks(v: string) {
  return {
    length: v.length >= 8,
    digit: /[0-9]/.test(v),
    mixedCase: /[A-Z]/.test(v) && /[a-z]/.test(v),
  }
}

export function isStrongPassword(v: string): boolean {
  const c = getPasswordChecks(v)
  return c.length && c.digit && c.mixedCase
}
