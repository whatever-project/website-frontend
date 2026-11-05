import Link from "next/link"
import { routes } from "@/config/routes"
import type { LOGIN_COPY, LoginState } from "../../_mock/login"

/**
 * The login notice (wrong password, unverified e-mail, general error): the same messages and the same link as before, but shown
 * BELOW and OUTSIDE the parchment instead of inside it, so the form on the sheet never changes height (no scrolling, no layout
 * shift). It is positioned from the dialog box, whose size the 3D engine keeps equal to the parchment's, so it always sits just
 * under the bottom roll. Shared by both UI versions; the font comes from LoginFonts (the "notice" group, via role="alert").
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
  /** Extra classes (the font scope classes of the active UI). */
  className?: string
  /** "below-sheet" (3D scroll: under the bottom roll) or "inline" (flat fallback card: below the card, in the page flow). */
  placement?: "below-sheet" | "inline"
}

export default function LoginNotice({ state, copy, visible, className = "", placement = "below-sheet" }: LoginNoticeProps) {
  const notice = getLoginNotice(state, copy)
  if (!notice) return null
  const position =
    placement === "below-sheet"
      ? "absolute left-1/2 top-[calc(100%+14px)] w-max max-w-[min(92vw,26rem)] -translate-x-1/2"
      : "mx-auto mt-4 w-full max-w-md"
  return (
    <div
      role="alert"
      inert={!visible}
      onClick={(event) => event.stopPropagation()}
      className={`${position} rounded border bg-[#f6ecd2]/95 px-3 py-2 font-ui text-sm shadow transition-opacity duration-200 ${
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
