"use client"

import { useRef, useState, type FormEvent, type RefObject } from "react"
import { LOGIN_COPY, type LoginState, type LoginUiVariant } from "../../_mock/login"
import ClassicLoginLayout from "./classic/ClassicLoginLayout"
import ParchmentLoginLayout from "./new-ui/ParchmentLoginLayout"

interface LoginFormProps {
  state: LoginState
  onSubmit: () => void
  /** False while the sheet is still rolling: inputs stay disabled so nothing can be typed or focused. */
  interactive?: boolean
  identifierRef?: RefObject<HTMLInputElement | null>
  /** Draft-only UI experiment: "classic" is the original login UI, "parchment" the handwritten-ink redesign. */
  variant?: LoginUiVariant
  /** Copy for the form; defaults to the original Thai copy. */
  copy?: typeof LOGIN_COPY
}

/**
 * The one login implementation: form state, preview-state messages, submit handling and the disabled fieldset live here,
 * once. The two UI variants are presentation only (classic/ClassicLoginLayout, new-ui/ParchmentLoginLayout); switching
 * between them re-renders this same component with a different prop, so typed text is kept and nothing is remounted.
 */
export default function LoginForm({
  state,
  onSubmit,
  interactive = true,
  identifierRef,
  variant = "classic",
  copy = LOGIN_COPY,
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
  }

  return (
    <form id="landing-login-form" onSubmit={handleSubmit} className="w-full">
      <fieldset disabled={!interactive} className="m-0 min-w-0 border-0 p-0">
        {variant === "parchment" ? <ParchmentLoginLayout {...layoutProps} /> : <ClassicLoginLayout {...layoutProps} />}
      </fieldset>
    </form>
  )
}
