import type { UsernameError } from "@/utils/validation"

/**
 * Draft username rule: letters (A-Z, a-z) and digits only, no spaces, at least 3 characters (the 25 maximum is the input's maxLength).
 * Same signature as the shared validateUsername in @/utils/validation, which ALSO allows `_ . -` (the live signup page uses that one).
 * A dev aligns the shared util and the backend with this rule when promoting the draft.
 */
export function validateUsername(v: string): UsernameError | null {
  if (v.length === 0) return null
  if (/\s/.test(v)) return "spaces"
  if (v.length < 3) return "length"
  if (!/^[A-Za-z0-9]+$/.test(v)) return "chars"
  return null
}
