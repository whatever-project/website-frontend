import Link from "next/link"
import { Flourish, InkDivider, PasswordInput } from "@/components/Parchment"
import { routes } from "@/config/routes"
import type { LoginLayoutProps } from "../shared/loginLayoutTypes"
import p from "./NewLogin.module.css"

/**
 * The NEW login UI ("UI ใหม่"). It is the original UI's layout, unchanged (same markup, classes, spacing, rectangular
 * button, sign-up line inside the sheet; the login notice is shown by LoginModal below the sheet), with exactly two differences, both in NewLogin.module.css:
 *   1. the boxed inputs are underlined inputs (p.input instead of "parch-input");
 *   2. the ".new" scope class (NewLogin.module.css) is applied by LoginModal to the form wrapper and gives the login button its softer shadow.
 * TYPOGRAPHY is not set in this file: every text element carries a data-typo role (heading, label, input, remember, forgot, button, prompt,
 * signup; the notice is in LoginNotice) and all fonts / sizes / weights / spacing are in NewLoginTypography.module.css. Only colors stay here. Size / spacing / gaps are not set here either: each element also carries a data-layout role and all of it is in NewLoginLayout.module.css.
 * Keep this file in step with classic/ClassicLoginLayout.tsx; do not add anything else here.
 */
export default function NewLoginLayout({
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
      <h2 id="landing-login-title" data-typo="heading" data-layout="heading" className="text-center text-[#3a2c1a]">
        {copy.formHeading}
      </h2>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>

      <label htmlFor="landing-login-identifier" data-typo="label" data-layout="label" className="parch-label block">
        {copy.identifier}
      </label>
      <input
        ref={identifierRef}
        id="landing-login-identifier"
        data-typo="input"
        data-layout="input"
        className={p.input}
        value={values.usernameOrEmail}
        onChange={(event) => onIdentifierChange(event.target.value)}
        placeholder={copy.identifierPlaceholder}
        autoComplete="username"
        required
      />

      <label htmlFor="landing-login-password" data-typo="label" data-layout="label" className="parch-label block">
        {copy.password}
      </label>
      <PasswordInput
        id="landing-login-password"
        data-typo="input"
        data-layout="password-input"
        className={p.input}
        placeholder={copy.passwordPlaceholder}
        value={values.password}
        onChange={(event) => onPasswordChange(event.target.value)}
        autoComplete="current-password"
        required
      />

      <div data-layout="options" className="flex flex-wrap items-center justify-between">
        <label data-typo="remember" data-layout="remember" className="flex cursor-pointer items-center text-[#5d4626]">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => onRememberChange(event.target.checked)}
            data-layout="checkbox"
            className="parch-check"
          />
          {copy.rememberMe}
        </label>
        <Link
          data-typo="forgot"
          href={routes.forgotPassword}
          className="text-[#a68d5f] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
        >
          {copy.forgotPassword}
        </Link>
      </div>

      <button type="submit" data-typo="button" data-layout="button" disabled={state === "loading"} className="parch-btn">
        <span>{state === "loading" ? copy.submitting : copy.submit}</span>
      </button>

      <p data-typo="prompt" data-layout="prompt" className="text-center text-[#8a7350]">
        {copy.noAccount}{" "}
        <Link
          data-typo="signup"
          href={routes.signup}
          className="text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
        >
          {copy.createOne}
        </Link>
      </p>
    </>
  )
}
