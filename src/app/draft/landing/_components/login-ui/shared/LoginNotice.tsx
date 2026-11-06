import Link from "next/link"
import { routes } from "@/config/routes"
import type { LOGIN_COPY, LoginState } from "../../../_mock/login"

/**
 * The login notice (wrong password, unverified e-mail, general error): the same messages and the same link as before, but shown
 * BELOW and OUTSIDE the parchment instead of inside it, so the form on the sheet never changes height (no scrolling, no layout
 * shift). It is positioned from the dialog box, whose size the 3D engine keeps equal to the parchment's, so it always sits just
 * under the bottom roll. Its offset / max-width / margin / padding are NOT set here: they come from the active UI's layout file
 * (`--notice-*` in classic/ClassicLoginLayout.module.css or new/NewLoginLayout.module.css, whose `.layout` class is passed in `className`).
 * On the flat fallback card (placement "in-card") it is instead placed inside the card, above the first field
 * label, in normal flow (the card grows to fit it). Shared by both UI versions; its typography (the "notice" role: data-typo="notice") is set in the active UI's
 * typography file (classic/ClassicLoginTypography.module.css or new/NewLoginTypography.module.css), whose `.typography` class
 * is passed in `className`. `lang` is exposed as data-lang so the typography files can give Thai and English different values.
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
  /** Language of the login dialog ("th" | "en"); becomes data-lang. */
  lang?: string
  /** Extra classes: the active UI's `.typography` class (and `.flatCard` on the flat fallback card). */
  className?: string
  /**
   * "below-sheet" (3D scroll: under the bottom roll, absolutely positioned from the dialog box) or
   * "in-card" (flat fallback card: rendered inside the form in normal flow, above the first label, so the card grows to fit it).
   */
  placement?: "below-sheet" | "in-card"
}

export default function LoginNotice({ state, copy, visible, lang, className = "", placement = "below-sheet" }: LoginNoticeProps) {
  const notice = getLoginNotice(state, copy)
  if (!notice) return null
  const position =
    placement === "below-sheet"
      ? "absolute left-1/2 w-max -translate-x-1/2"
      : "w-full"
  return (
    <div
      role="alert"
      data-typo="notice"
      data-layout="notice"
      data-placement={placement}
      data-lang={lang}
      inert={!visible}
      onClick={(event) => event.stopPropagation()}
      className={`${position} rounded border bg-[#f6ecd2]/95 shadow transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      } ${
        notice.unverified
          ? "border-amber-700/60 text-amber-900"
          : "border-[#8a2a1f]/50 text-[#8a2a1f]"
      } ${className}`}
    >
      <span className="mr-2">{notice.unverified ? "✉️" : "⚠️"}</span>
      {notice.message}
      {notice.unverified && (
        <>
          {" "}
          <Link href={routes.signup} className="underline underline-offset-2 hover:text-amber-700">
            {copy.backToSignup}
          </Link>
        </>
      )}
    </div>
  )
}
