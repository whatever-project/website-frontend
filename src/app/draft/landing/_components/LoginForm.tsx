"use client"

import Link from "next/link"
import { useRef, useState, type FormEvent, type RefObject } from "react"
import { Flourish, InkDivider, PasswordInput } from "@/components/Parchment"
import { routes } from "@/config/routes"
import { LOGIN_COPY, type LoginState } from "../_mock/login"

interface LoginFormProps {
  state: LoginState
  onSubmit: () => void
  /** False while the sheet is still rolling: inputs stay disabled so nothing can be typed or focused. */
  interactive?: boolean
  identifierRef?: RefObject<HTMLInputElement | null>
}

export default function LoginForm({ state, onSubmit, interactive = true, identifierRef }: LoginFormProps) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })
  const [remember, setRemember] = useState(false)
  const fallbackRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onSubmit()
  }

  const isUnverified = state === "unverified"
  const error =
    state === "error" ? LOGIN_COPY.sampleApiError
    : state === "unverified" ? LOGIN_COPY.errorUnverified
    : state === "generic" ? LOGIN_COPY.errorGeneric
    : null

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <fieldset disabled={!interactive} className="m-0 min-w-0 border-0 p-0">
        <h2 id="landing-login-title" className="font-jimthompson mt-2 text-center text-3xl text-[#3a2c1a]">
          {LOGIN_COPY.formHeading}
        </h2>
        <InkDivider>
          <Flourish className="h-4 w-4" />
        </InkDivider>

        {error && (
          <div
            className={`mb-4 rounded border p-3 font-ui text-sm ${
              isUnverified
                ? "border-amber-700/60 bg-amber-100/60 text-amber-900"
                : "border-[#8a2a1f]/40 bg-red-50/60 text-[#8a2a1f]"
            }`}
          >
            <span className="mr-2">{isUnverified ? "✉️" : "⚠️"}</span>
            {error}
            {isUnverified && (
              <div className="mt-1">
                <Link href={routes.signup} className="underline underline-offset-2 hover:text-amber-700">
                  {LOGIN_COPY.backToSignup}
                </Link>
              </div>
            )}
          </div>
        )}

        <label htmlFor="landing-login-identifier" className="parch-label mt-5 mb-1.5 block">
          {LOGIN_COPY.identifier}
        </label>
        <input
          ref={identifierRef ?? fallbackRef}
          id="landing-login-identifier"
          className="parch-input font-serithai"
          value={form.usernameOrEmail}
          onChange={(event) => setForm((current) => ({ ...current, usernameOrEmail: event.target.value }))}
          placeholder={LOGIN_COPY.identifierPlaceholder}
          autoComplete="username"
          required
        />

        <label htmlFor="landing-login-password" className="parch-label mt-5 mb-1.5 block">
          {LOGIN_COPY.password}
        </label>
        <PasswordInput
          id="landing-login-password"
          className="parch-input w-full font-serithai"
          placeholder={LOGIN_COPY.passwordPlaceholder}
          value={form.password}
          onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
          autoComplete="current-password"
          required
        />

        <div className="mt-4 mb-7 flex flex-wrap items-center justify-between gap-2">
          <label className="flex cursor-pointer items-center gap-2.5 font-ui text-[13px] text-[#5d4626]">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              className="parch-check"
            />
            {LOGIN_COPY.rememberMe}
          </label>
          <Link
            href={routes.forgotPassword}
            className="font-ui text-[13px] text-[#a68d5f] underline decoration-dotted underline-offset-4 transition hover:text-[#8a6a35]"
          >
            {LOGIN_COPY.forgotPassword}
          </Link>
        </div>

        <button type="submit" disabled={state === "loading"} className="parch-btn">
          {state === "loading" ? LOGIN_COPY.submitting : LOGIN_COPY.submit}
        </button>

        <p className="mt-6 text-center font-ui text-[13px] text-[#8a7350]">
          {LOGIN_COPY.noAccount}{" "}
          <Link
            href={routes.signup}
            className="font-medium text-[#3a2c1a] underline underline-offset-4 hover:text-[#6b4f22]"
          >
            {LOGIN_COPY.createOne}
          </Link>
        </p>
      </fieldset>
    </form>
  )
}
