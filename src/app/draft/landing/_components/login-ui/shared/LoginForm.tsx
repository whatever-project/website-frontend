"use client"

import { useRef, useState, type FormEvent, type ReactNode, type RefObject } from "react"
import { LOGIN_COPY, type LoginState, type LoginUiVariant } from "../../../_mock/login"
import ClassicLoginLayout from "../classic/ClassicLoginLayout"
import NewLoginLayout from "../new/NewLoginLayout"

interface LoginFormProps {
  state: LoginState
  onSubmit: () => void
  /** False while the sheet is still rolling: inputs stay disabled so nothing can be typed or focused. */
  interactive?: boolean
  identifierRef?: RefObject<HTMLInputElement | null>
  /** Draft-only UI experiment: "classic" is the original login UI, "new" the redesigned one (underlined inputs). */
  variant?: LoginUiVariant
  /** Copy for the form; defaults to the original Thai copy. */
  copy?: typeof LOGIN_COPY
  /** Flat fallback card only: the notice rendered inside the form, between the divider and the first label. Not passed in 3D mode. */
  notice?: ReactNode
}

/**
 * The one login implementation: form state, preview-state messages, submit handling and the disabled fieldset live here,
 * once. The two UI variants are presentation only (classic/ClassicLoginLayout, new/NewLoginLayout); switching
 * between them re-renders this same component with a different prop, so typed text is kept and nothing is remounted.
 */
export default function LoginForm({
  state,
  onSubmit,
  interactive = true,
  identifierRef,
  variant = "classic",
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
        {variant === "new" ? <NewLoginLayout {...layoutProps} /> : <ClassicLoginLayout {...layoutProps} />}
      </fieldset>
    </form>
  )
}
