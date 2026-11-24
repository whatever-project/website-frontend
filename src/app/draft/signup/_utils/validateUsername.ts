import type { UsernameError } from "@/utils/validation"

/**
 * Draft-local error codes: the shared UsernameError's "chars" is split in two so each case gets its own message
 *  - "language": a letter/digit of another language or script (Thai, Japanese, accented Latin, ...) -> "Only A-Z and 0-9 are allowed"
 *  - "special":  a symbol such as ! = - . < _ or an emoji                                          -> "Username must not contain special characters"
 */
export type DraftUsernameError = Exclude<UsernameError, "chars"> | "language" | "special"

/**
 * Draft username rule: letters (A-Z, a-z) and digits only, no spaces, at least 3 characters (the 25 maximum is the input's maxLength).
 * Same signature idea as the shared validateUsername in @/utils/validation, which ALSO allows `_ . -` (the live signup page uses that one).
 * A dev aligns the shared util and the backend with this rule when promoting the draft.
 */
export function validateUsername(v: string): DraftUsernameError | null {
  if (v.length === 0) return null
  if (/\s/.test(v)) return "spaces"
  if (v.length < 3) return "length"
  if (/[^A-Za-z0-9]/.test(v)) {
    // Any letter, combining mark (Thai vowels / tone marks) or digit that is not A-Z / 0-9 counts as "another language".
    return /(?![A-Za-z0-9])[\p{L}\p{M}\p{N}]/u.test(v) ? "language" : "special"
  }
  return null
}
