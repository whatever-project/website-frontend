import type { UsernameError } from "@/utils/validation"

/** Message key (signup namespace) for each username validation error code. */
export const USERNAME_ERROR_KEYS = {
  spaces: "usernameErrSpaces",
  length: "usernameErrLength",
  chars: "usernameErrChars",
} as const satisfies Record<UsernameError, string>
