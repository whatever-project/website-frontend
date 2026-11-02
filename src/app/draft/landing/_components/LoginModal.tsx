"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Flourish, InkDivider, PasswordInput } from "@/components/Parchment"
import { routes } from "@/config/routes"
import parchmentRoll from "../_assets/parchment-roll.svg"
import { LOGIN_COPY, LOGIN_STATE_OPTIONS, type LoginState } from "../_mock/login"
import styles from "./LoginModal.module.css"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ usernameOrEmail: "", password: "" })
  const [remember, setRemember] = useState(false)
  const [state, setState] = useState<LoginState>("idle")
  const identifierRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const focusDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1800
    const focusTimer = window.setTimeout(() => identifierRef.current?.focus(), focusDelay)

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus()
    }
  }, [onClose])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setState("error")
  }

  const isUnverified = state === "unverified"
  const error =
    state === "error" ? LOGIN_COPY.sampleApiError
    : state === "unverified" ? LOGIN_COPY.errorUnverified
    : state === "generic" ? LOGIN_COPY.errorGeneric
    : null

  return (
    <div
      className={`${styles.backdrop} fixed inset-0 z-50 overflow-y-auto bg-[#2a1f10]/60 backdrop-blur-[2px]`}
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center px-4 py-8 sm:px-6 sm:py-12">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="landing-login-title"
          className="w-full max-w-md"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="relative">
            <form onSubmit={handleSubmit} className={`${styles.sheet} parch-sheet relative w-full p-7 sm:p-10`}>

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
                ref={identifierRef}
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
            </form>
            <div className={styles.rollTop} aria-hidden="true">
              <img src={parchmentRoll.src} alt="" draggable={false} />
            </div>
            <div className={styles.rollBottom} aria-hidden="true">
              <img src={parchmentRoll.src} alt="" draggable={false} />
            </div>
          </div>

          <div className={`${styles.preview} mt-5 border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow`}>
            <p className="parch-label mb-1.5">Preview state (draft only)</p>
            <div className="flex flex-wrap gap-1.5">
              {LOGIN_STATE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setState(option.value)}
                  aria-pressed={state === option.value}
                  className={`border px-2.5 py-1 ${
                    state === option.value
                      ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]"
                      : "border-[#b89a63] text-[#6b5533]"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
