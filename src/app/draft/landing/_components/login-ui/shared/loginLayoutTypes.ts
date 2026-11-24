import type { ReactNode, RefObject } from "react"
import type { LOGIN_COPY, LoginState } from "../../../_mock/login"

/**
 * What the login layout receives from LoginForm. The layout (classic/ClassicLoginLayout) is pure presentation:
 * all form state, validation, submission and copy selection live once, in LoginForm.
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
  /**
   * Optional slot for the login notice INSIDE the form, between the divider and the first field label. LoginModal passes it on the
   * 3D paper and on the flat fallback card alike (the form grows to fit it); it is undefined while there is no message.
   */
  notice?: ReactNode
  /** When set, the "create an account" link calls this instead of navigating (LoginModal `closeOnSignup`, used on the signup page itself). */
  onSignupClick?: () => void
}
