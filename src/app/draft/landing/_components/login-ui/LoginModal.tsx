"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LOGIN_COPY, LOGIN_COPY_BY_LANG, type LoginState, type LoginUiVariant } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import { useScrollLoginAnimation } from "../scroll/useScrollLoginAnimation"
import PreviewPanel from "../shared/PreviewPanel"
import QuillFeather from "../quill/QuillFeather"
import QuillShadow from "../quill/QuillShadow"
import LoginForm from "./LoginForm"
import LoginNotice from "./LoginNotice"
import styles from "./LoginModal.module.css"
import fonts from "./LoginFonts.module.css"
import p from "./new-ui/ParchmentLogin.module.css"

/**
 * The login dialog: the dimmed backdrop, the transparent 3D parchment canvas, the form on the sheet, the decorative quill,
 * and the draft preview controls. Form logic is in LoginForm; the two UI variants are in login/classic and login/new-ui.
 */
export default function LoginModal({ onClose, lang = "th" }: { onClose: () => void; lang?: DraftLang }) {
  // Language of the login dialog (starts from the landing page language). Both UI versions follow it; Thai is the original copy.
  const [uiLang, setUiLang] = useState<DraftLang>(lang)
  const [state, setState] = useState<LoginState>("idle")
  // Draft-only UI experiment. Switching only changes props/classes: the form (and its typed text), the WebGL engine and
  // the feather are never remounted.
  const [uiVariant, setUiVariant] = useState<LoginUiVariant>("classic")
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

  // The flat fallback card (WebGL unavailable) always uses the original UI.
  const parchment = uiVariant === "parchment" && !sceneError
  const copy = LOGIN_COPY_BY_LANG[uiLang]

  const form = (
    <LoginForm
      state={state}
      onSubmit={() => setState("error")}
      interactive={interactive}
      identifierRef={identifierRef}
      variant={parchment ? "parchment" : "classic"}
      copy={copy}
    />
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
            data-lang={uiLang}
            className={`${styles.sheet} ${fonts.fonts} ${fonts.classic} parch-sheet relative m-auto w-full max-w-md p-7 sm:p-10`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>
          <LoginNotice state={state} copy={copy} visible={interactive} placement="inline" className={`${fonts.fonts} ${fonts.classic}`} />
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
          {/* The quill's cast shadow on the paper: before the form, so the form paints above it. */}
          <QuillShadow visible={quillVisible} />

          <div
            inert={!interactive}
            data-lang={uiLang}
            className={`${styles.formReveal} ${styles.compactForm} ${fonts.fonts} ${parchment ? `${fonts.parchment} ${p.anupark}` : fonts.classic} ${interactive ? "" : styles.formHidden} overflow-y-auto px-1`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>

          {/* The login notice sits under the bottom roll, outside the sheet (same for both UI versions). */}
          <LoginNotice
            state={state}
            copy={copy}
            visible={interactive}
            className={`${fonts.fonts} ${parchment ? `${fonts.parchment} ${p.anupark}` : fonts.classic}`}
          />

          <QuillFeather visible={quillVisible} />
        </div>
      )}

      <PreviewPanel
        state={state}
        onStateChange={setState}
        uiVariant={uiVariant}
        onUiVariantChange={setUiVariant}
        lang={uiLang}
        onLangChange={setUiLang}
      />
    </div>
  )
}
