"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LOGIN_STATE_OPTIONS, type LoginState } from "../_mock/login"
import LoginForm from "./LoginForm"
import { useScrollLoginAnimation } from "./useScrollLoginAnimation"
import styles from "./LoginModal.module.css"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<LoginState>("idle")
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const identifierRef = useRef<HTMLInputElement>(null)
  const { ready, error: sceneError, formActive, close } = useScrollLoginAnimation(stageRef)

  // The sheet rolls back up first, then the dialog is dismissed.
  const requestClose = useCallback(async () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    if (!sceneError) await close()
    onClose()
  }, [close, onClose, sceneError])

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previousOverflow
      previouslyFocused?.focus()
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") void requestClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [requestClose])

  // Flat fallback is interactive straight away; the 3D sheet waits until it has unrolled and settled.
  const interactive = sceneError ? !closing : formActive && !closing
  useEffect(() => {
    if (interactive) identifierRef.current?.focus()
  }, [interactive])

  const form = (
    <LoginForm state={state} onSubmit={() => setState("error")} interactive={interactive} identifierRef={identifierRef} />
  )

  return (
    <div
      className={`${styles.backdrop} fixed inset-0 z-50 overflow-hidden bg-[#10131f]/65 backdrop-blur-[2px]`}
      onClick={() => void requestClose()}
    >
      {/* Three.js canvas: transparent, so the dimmed village stays visible around the sheet */}
      <div ref={stageRef} className={`${styles.stage} pointer-events-none absolute inset-0`} />

      {!sceneError && !ready && (
        <div role="status" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className={styles.loadingRoll} aria-hidden="true" />
          <span className="sr-only">กำลังโหลด</span>
        </div>
      )}

      {sceneError ? (
        <div className="absolute inset-0 flex items-center justify-center overflow-y-auto px-4 py-8 sm:px-6 sm:py-12">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-login-title"
            className={`${styles.sheet} parch-sheet relative m-auto w-full max-w-md p-7 sm:p-10`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>
        </div>
      ) : (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="landing-login-title"
          className="absolute top-1/2 left-1/2 flex h-[84%] aspect-[0.88] -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          <div
            inert={!interactive}
            className={`${styles.formReveal} ${interactive ? "" : styles.formHidden} max-h-[80%] w-[min(86%,24rem,calc(100vw-3.5rem))] overflow-y-auto px-1`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>
        </div>
      )}

      {/* Preview state (draft only) */}
      <div
        className={`${styles.preview} fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow`}
        onClick={(event) => event.stopPropagation()}
      >
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
  )
}
