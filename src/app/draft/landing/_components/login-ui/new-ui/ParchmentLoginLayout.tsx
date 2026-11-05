import Link from "next/link"
import { Flourish, InkDivider, PasswordInput } from "@/components/Parchment"
import { routes } from "@/config/routes"
import type { LoginLayoutProps } from "../loginLayoutTypes"
import p from "./ParchmentLogin.module.css"

/**
 * The NEW login UI ("UI ใหม่"). It is the original UI's layout, unchanged (same markup, classes, spacing, rectangular
 * button, sign-up line inside the sheet; the login notice is shown by LoginModal below the sheet), with exactly two differences, both in ParchmentLogin.module.css:
 *   1. the boxed inputs are underlined inputs (p.input instead of "parch-input");
 *   2. every text except the heading is Anupark (the .anupark scope class, applied by LoginModal to the form wrapper).
 * Keep this file in step with classic/ClassicLoginLayout.tsx; do not add anything else here.
 */
export default function ParchmentLoginLayout({
  copy,
  state,
  values,
  onIdentifierChange,
  onPasswordChange,
  remember,
  onRememberChange,
  identifierRef,
}: LoginLayoutProps) {
  return (
    <>
      <h2 id="landing-login-title" className="font-jimthompson mt-2 text-center text-3xl text-[#3a2c1a]">
        {copy.formHeading}
      </h2>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>

      <label htmlFor="landing-login-identifier" className="parch-label mt-5 mb-1.5 block">
        {copy.identifier}
      </label>
      <input
        ref={identifierRef}
        id="landing-login-identifier"
        className={p.input}
        value={values.usernameOrEmail}
        onChange={(event) => onIdentifierChange(event.target.value)}
        placeholder={copy.identifierPlaceholder}
        autoComplete="username"
        required
      />

      <label htmlFor="landing-login-password" className="parch-label mt-5 mb-1.5 block">
        {copy.password}
      </label>
      <PasswordInput
        id="landing-login-password"
        className={`${p.input} w-full`}
        placeholder={copy.passwordPlaceholder}
        value={values.password}
        onChange={(event) => onPasswordChange(event.target.value)}
        autoComplete="current-password"
        required
      />

      <div className="mt-4 mb-7 flex flex-wrap items-center justify-between gap-2">
        <label data-login-text className="flex cursor-pointer items-center gap-2.5 font-ui text-[13px] text-[#5d4626]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => onRememberChange(event.target.checked)}
            className="parch-check"
          />
          {copy.rememberMe}
        </label>
        <Link
          data-login-text
          href={routes.forgotPassword}
          className="font-ui text-[13px] text-[#a68d5f] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
        >
          {copy.forgotPassword}
        </Link>
      </div>

      <button type="submit" disabled={state === "loading"} className="parch-btn">
        <span>{state === "loading" ? copy.submitting : copy.submit}</span>
      </button>

      <p data-login-text className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
        {copy.noAccount}{" "}
        <Link
          href={routes.signup}
          className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
        >
          {copy.createOne}
        </Link>
      </p>
    </>
  )
}
