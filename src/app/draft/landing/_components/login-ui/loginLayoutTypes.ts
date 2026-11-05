import type { RefObject } from "react"
import type { LOGIN_COPY, LoginState } from "../../_mock/login"

/**
 * What every login layout receives from LoginForm. The two layouts (classic/ClassicLoginLayout and
 * new-ui/ParchmentLoginLayout) are pure presentation: all form state, validation, submission and copy selection live
 * once, in LoginForm.
 */
export interface LoginLayoutProps {
  copy: typeof LOGIN_COPY
  state: LoginState
  values: { usernameOrEmail: string; password: string }
  onIdentifierChange: (value: string) => void
  onPasswordChange: (value: string) => void
  remember: boolean
  onRememberChange: (value: boolean) => void
  identifierRef: RefObject<HTMLInputElement | null>
}
