"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LOGIN_STATE_OPTIONS, type LoginState } from "../_mock/login"
import LoginForm from "./LoginForm"
import { QUILL_SRC, useScrollLoginAnimation } from "./useScrollLoginAnimation"
import styles from "./LoginModal.module.css"

export default function LoginModal({ onClose }: { onClose: () => void }) {
  const [state, setState] = useState<LoginState>("idle")
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const identifierRef = useRef<HTMLInputElement>(null)
  const { error: sceneError, formActive, quillVisible, close } = useScrollLoginAnimation(stageRef)

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
          // Box tracks the parchment's on-screen size (--sheet-w / --sheet-h are set by the 3D engine).
          style={{ width: "var(--sheet-w, 74%)", height: "var(--sheet-h, 84%)" }}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          {/* Cast shadow of the quill ON THE PAPER, clipped to the parchment outline (flat sheet + the wider bottom roll,
              soft-faded at the edges) so nothing is cast onto the dark backdrop. It replays the same drift/sway
              animation classes as the feather below, with identical geometry/timing, so it stays in step with it. */}
          <div className={styles.quillShadowClip} aria-hidden="true">
            <div className={styles.quillShadowFade}>
              <div className={`${styles.quill} ${quillVisible ? styles.quillShown : ""}`}>
                <div className={styles.quillDrift}>
                  <div className={styles.quillSway}>
                        {/* cast shadow on the paper: sharp + soft silhouettes of the same PNG, tinted by the SVG filters below */}
                        <div className={styles.quillShadowRig}>
                          {/* .quillShadowProject: static projection (shear about the nib) toward the key light's direction */}
                          <div className={styles.quillShadowProject}>
                            {/* eslint-disable @next/next/no-img-element -- decorative copies of the static quill PNG */}
                            <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={`${styles.quillShadowImage} ${styles.quillShadowSoft}`} />
                            <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={`${styles.quillShadowImage} ${styles.quillShadowSharp}`} />
                            {/* eslint-enable @next/next/no-img-element */}
                          </div>
                        </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            inert={!interactive}
            className={`${styles.formReveal} ${styles.compactForm} ${interactive ? "" : styles.formHidden} overflow-y-auto px-1`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>

          {/* Decorative 2D quill (separate from the 3D scene): enters at ~68% of the unroll, drifts while open,
              leaves as soon as the close starts. Purely visual: aria-hidden and pointer-events none.
              Nested layers, each owning different transform properties so no animation overwrites another:
              .quill (position + entrance/exit) > .quillDrift (organic path) > .quillSway (tilt about the nib)
              > img (tiny shaft flex + faint silhouette shadow). The cast shadow on the paper is the separate, paper-clipped chain above. */}
          {/* Warm-brown silhouette filters for the quill's cast shadow (no pure black): blur the image's alpha,
              then fill it with brown. Static; only the elements' opacity/transform are animated. */}
          <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
            <filter id="quillShadowSharp" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blur" />
              <feFlood floodColor="#3a2210" />
              <feComposite in2="blur" operator="in" />
            </filter>
            <filter id="quillShadowSoft" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
              <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="blur" />
              <feFlood floodColor="#3f2a2c" />
              <feComposite in2="blur" operator="in" />
            </filter>
          </svg>
          <div className={`${styles.quill} ${quillVisible ? styles.quillShown : ""}`} aria-hidden="true">
            <div className={styles.quillDrift}>
              <div className={styles.quillSway}>
                {/* eslint-disable-next-line @next/next/no-img-element -- static decorative PNG; cropped/sized with CSS */}
                <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={styles.quillImage} />
              </div>
            </div>
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
