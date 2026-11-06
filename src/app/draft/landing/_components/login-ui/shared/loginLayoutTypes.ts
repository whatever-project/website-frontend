import type { ReactNode, RefObject } from "react"
import type { LOGIN_COPY, LoginState } from "../../../_mock/login"

/**
 * What every login layout receives from LoginForm. The two layouts (classic/ClassicLoginLayout and
 * new/NewLoginLayout) are pure presentation: all form state, validation, submission and copy selection live
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
  /**
   * Optional slot for the login notice INSIDE the form, between the divider and the first field label. Only the flat fallback card
   * passes it (the 3D scroll shows the notice outside the sheet); the layouts used on the 3D sheet never receive it.
   */
  notice?: ReactNode
}
