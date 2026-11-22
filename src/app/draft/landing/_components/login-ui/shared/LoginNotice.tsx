import type { LOGIN_COPY, LoginState } from "../../../_mock/login"

/**
 * The login notice (wrong password, unverified e-mail, general error). It is rendered INSIDE the form, in normal flow, directly
 * above the first field label (LoginModal passes it to LoginForm through the `notice` slot), on the 3D paper and on the flat
 * fallback card alike: the form simply grows to fit it. It has no icon or emoji.
 *
 * Its look is in classic/ClassicLogin.module.css (parchment theme: square, inputs' fill and border, a coloured left rule chosen by
 * `data-tone`: "error" = ink red, "warning" = amber ink for the unverified e-mail), its padding / margin in
 * classic/ClassicLoginLayout.module.css (`--notice-*`) and its typography (the "notice" role: data-typo="notice") in
 * classic/ClassicLoginTypography.module.css. Those files target the element itself, so the active UI's `.typography` and
 * `.layout` classes are passed in `className`. The language comes from the `lang` attribute of the dialog root (LoginModal).
 */
export function getLoginNotice(state: LoginState, copy: typeof LOGIN_COPY) {
  if (state === "error") return { message: copy.sampleApiError, unverified: false }
  if (state === "unverified") return { message: copy.errorUnverified, unverified: true }
  if (state === "generic") return { message: copy.errorGeneric, unverified: false }
  return null
}

interface LoginNoticeProps {
  state: LoginState
  copy: typeof LOGIN_COPY
  /** False while the sheet is still rolling or closing: the notice fades out with the form. */
  visible: boolean
  /** Extra classes: the active UI's `.typography` and `.layout` classes. */
  className?: string
  /** Unverified e-mail only: reopens the 6-digit code dialog (shown as a link-style button next to "back to sign up"). */
  onEnterCode?: () => void
}

export default function LoginNotice({ state, copy, visible, className = "", onEnterCode }: LoginNoticeProps) {
  const notice = getLoginNotice(state, copy)
  if (!notice) return null
  return (
    <div
      role="alert"
      data-typo="notice"
      data-layout="notice"
      data-tone={notice.unverified ? "warning" : "error"}
      inert={!visible}
      onClick={(event) => event.stopPropagation()}
      className={`w-full transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"} ${className}`}
    >
      {notice.message}
      {notice.unverified && onEnterCode && (
        <>
          {" "}
          <button type="button" onClick={onEnterCode}>
            {copy.enterCode}
          </button>
        </>
      )}
    </div>
  )
}
