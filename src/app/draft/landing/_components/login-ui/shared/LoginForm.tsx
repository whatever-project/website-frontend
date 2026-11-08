"use client"

import { useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react"
import { LOGIN_COPY, type LoginState } from "../../../_mock/login"
import ClassicLoginLayout from "../classic/ClassicLoginLayout"

interface LoginFormProps {
  state: LoginState
  onSubmit: () => void
  /** False while the sheet is still rolling: inputs stay disabled so nothing can be typed or focused. */
  interactive?: boolean
  identifierRef?: RefObject<HTMLInputElement | null>
  /** Copy for the form; defaults to the original Thai copy. */
  copy?: typeof LOGIN_COPY
  /** The notice rendered inside the form, between the divider and the first label (3D paper and flat card). Undefined when there is none. */
  notice?: ReactNode
}

/**
 * The one login implementation: form state, preview-state messages, submit handling and the disabled fieldset live here,
 * once. The markup is presentation only (classic/ClassicLoginLayout).
 */
export default function LoginForm({
  state,
  onSubmit,
  interactive = true,
  identifierRef,
  copy = LOGIN_COPY,
  notice,
}: LoginFormProps) {
  const [values, setValues] = useState({ usernameOrEmail: "", password: "" })
  const [remember, setRemember] = useState(false)
  const fallbackRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const layoutProps = {
    copy,
    state,
    values,
    onIdentifierChange: (value: string) => setValues((current) => ({ ...current, usernameOrEmail: value })),
    onPasswordChange: (value: string) => setValues((current) => ({ ...current, password: value })),
    remember,
    onRememberChange: setRemember,
    identifierRef: identifierRef ?? fallbackRef,
    notice,
  }

  return (
    <form id="landing-login-form" onSubmit={handleSubmit} className="w-full">
      <fieldset disabled={!interactive} className="m-0 min-w-0 border-0 p-0">
        <ClassicLoginLayout {...layoutProps} />
      </fieldset>
    </form>
  )
}
