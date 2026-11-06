"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LOGIN_COPY_BY_LANG, type LoginState, type LoginUiVariant } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import { useScrollLoginAnimation } from "./scroll/useScrollLoginAnimation"
import PreviewPanel from "../draft-tools/PreviewPanel"
import { getCurrentSnapshot, isEmbedded, listenPreviewCommands, reportPreviewStatus } from "../draft-tools/previewBridge"
import QuillFeather from "./quill/QuillFeather"
import QuillShadow from "./quill/QuillShadow"
import LoginForm from "./shared/LoginForm"
import LoginNotice from "./shared/LoginNotice"
import styles from "./LoginModal.module.css"
import "./shared/LoginFontFaces.module.css"
import classicStyles from "./classic/ClassicLogin.module.css"
import classicLayout from "./classic/ClassicLoginLayout.module.css"
import classicTypography from "./classic/ClassicLoginTypography.module.css"
import newStyles from "./new/NewLogin.module.css"
import newLayout from "./new/NewLoginLayout.module.css"
import newTypography from "./new/NewLoginTypography.module.css"

/**
 * The login dialog: the dimmed backdrop, the transparent 3D parchment canvas, the form on the sheet, the decorative quill,
 * and the draft preview controls. Form logic is in LoginForm; the two UI variants are in login-ui/classic and login-ui/new (shared login pieces: login-ui/shared).
 * Typography is owned by one file per UI (classic/ClassicLoginTypography.module.css, new/NewLoginTypography.module.css): this file only
 * puts the active UI's `.typography` class on the form box and on the notice. Layout (size / spacing / gaps) works the same way:
 * classic/ClassicLoginLayout.module.css and new/NewLoginLayout.module.css, one file per UI; this file keeps only the shared modal behaviour.
 */
export default function LoginModal({ onClose, lang = "th" }: { onClose: () => void; lang?: DraftLang }) {
  // Language of the login dialog (starts from the landing page language). Both UI versions follow it; Thai is the original copy.
  // The developer device preview (draft-tools/previewRoute.ts) can start the dialog from earlier preview selections; null on the normal page.
  const [uiLang, setUiLang] = useState<DraftLang>(() => getCurrentSnapshot()?.uiLang ?? lang)
  const [state, setState] = useState<LoginState>(() => getCurrentSnapshot()?.loginState ?? "idle")
  // Draft-only UI experiment. Switching only changes props/classes: the form (and its typed text), the WebGL engine and
  // the feather are never remounted.
  const [uiVariant, setUiVariant] = useState<LoginUiVariant>(() => getCurrentSnapshot()?.uiVariant ?? "classic")
  // Draft-only PREVIEW switch (PreviewPanel, "Mode" row): shows the existing flat fallback card although WebGL works, so it can be
  // inspected without disabling WebGL. It never changes how a real failure is detected (`sceneError` below is untouched).
  const [forceFlat, setForceFlat] = useState(() => getCurrentSnapshot()?.forceFlat ?? false)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const identifierRef = useRef<HTMLInputElement>(null)
  const { error: sceneError, formActive, quillVisible, close } = useScrollLoginAnimation(stageRef)
  // The flat fallback card is shown when the 3D scene failed (production behaviour) OR when the preview switch forces it.
  const flat = sceneError || forceFlat

  // The sheet rolls back up first, then the dialog is dismissed.
  const requestClose = useCallback(async () => {
    if (closingRef.current) return
    closingRef.current = true
    setClosing(true)
    if (!sceneError) await close()
    onClose()
  }, [close, onClose, sceneError])

  // Developer device preview only (inert unless this page is the embedded page inside the preview host's iframe): the host drives the
  // preview selections through same-window events and is told whether the dialog is open / the 3D scene really failed. A close request
  // goes through requestClose, so the sheet rolls up exactly as it does for Esc.
  const requestCloseRef = useRef(requestClose)
  useEffect(() => {
    requestCloseRef.current = requestClose
  }, [requestClose])
  useEffect(
    () =>
      listenPreviewCommands((command) => {
        if (command.uiLang) setUiLang(command.uiLang)
        if (command.loginState) setState(command.loginState)
        if (command.uiVariant) setUiVariant(command.uiVariant)
        if (command.forceFlat !== undefined) setForceFlat(command.forceFlat)
        if (command.loginOpen === false) void requestCloseRef.current()
      }),
    [],
  )
  useEffect(() => {
    reportPreviewStatus({ modalOpen: true })
    return () => reportPreviewStatus({ modalOpen: false })
  }, [])
  useEffect(() => {
    reportPreviewStatus({ sceneError })
  }, [sceneError])

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
  const interactive = flat ? !closing : formActive && !closing
  useEffect(() => {
    if (interactive) identifierRef.current?.focus()
  }, [interactive])

  // The flat fallback card (WebGL unavailable, or forced by the preview switch) always uses the original UI.
  const isNew = uiVariant === "new" && !flat
  const copy = LOGIN_COPY_BY_LANG[uiLang]
  // The active UI's classes: typography (one file per UI) and its non-typography styles (e.g. the button shadow).
  const typographyClass = isNew ? newTypography.typography : classicTypography.typography
  const variantClass = isNew ? newStyles.new : classicStyles.classic
  // Layout (size / spacing / gaps) is owned by one file per UI, like typography: `.layout` carries its variables, `.sheetBox` is the form box on the sheet.
  const layoutClass = isNew ? newLayout.layout : classicLayout.layout
  const sheetBoxClass = isNew ? newLayout.sheetBox : classicLayout.sheetBox

  // Flat fallback card only: the notice is rendered INSIDE the form (above the first label) through LoginForm's `notice` slot.
  // On the 3D sheet the notice stays where it was (a separate element under the bottom roll, further below).
  const flatNotice = (
    <LoginNotice
      state={state}
      copy={copy}
      lang={uiLang}
      visible={interactive}
      placement="in-card"
      className={`${classicTypography.typography} ${classicTypography.flatCard} ${classicLayout.layout}`}
    />
  )

  const form = (
    <LoginForm
      state={state}
      onSubmit={() => setState("error")}
      interactive={interactive}
      identifierRef={identifierRef}
      variant={isNew ? "new" : "classic"}
      copy={copy}
      notice={flat ? flatNotice : undefined}
    />
  )

  return (
    <div
      className={`${styles.backdrop} fixed inset-0 z-50 overflow-hidden bg-[#10131f]/65 backdrop-blur-[2px]`}
      onClick={() => void requestClose()}
    >
      {/* Three.js canvas: transparent, so the dimmed village stays visible around the sheet */}
      {/* Preview only: while the flat card is forced the (still running) 3D canvas is hidden, not unmounted, so switching back needs no reload. */}
      <div
        ref={stageRef}
        className={`${styles.stage} pointer-events-none absolute inset-0`}
        style={forceFlat && !sceneError ? { visibility: "hidden" } : undefined}
      />

      {flat ? (
        <div className={classicLayout.flatPage}>
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-login-title"
            data-lang={uiLang}
            className={`${styles.sheet} ${classicTypography.typography} ${classicTypography.flatCard} ${classicStyles.classic} ${classicLayout.layout} ${classicLayout.flatCard} parch-sheet`}
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
          {/* The quill's cast shadow on the paper: before the form, so the form paints above it. */}
          <QuillShadow visible={quillVisible} />

          <div
            inert={!interactive}
            data-lang={uiLang}
            className={`${styles.formReveal} ${layoutClass} ${sheetBoxClass} ${typographyClass} ${variantClass} ${interactive ? "" : styles.formHidden} overflow-y-auto`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>

          {/* The login notice sits under the bottom roll, outside the sheet (same for both UI versions). */}
          <LoginNotice
            state={state}
            copy={copy}
            lang={uiLang}
            visible={interactive}
            className={`${typographyClass} ${layoutClass}`}
          />

          <QuillFeather visible={quillVisible} />
        </div>
      )}

      {/* In the device preview the controls are in the host, OUTSIDE the simulated viewport, so the panel is not drawn inside it. */}
      {!isEmbedded() && (
      <PreviewPanel
        state={state}
        onStateChange={setState}
        uiVariant={uiVariant}
        onUiVariantChange={setUiVariant}
        flat={flat}
        sceneError={sceneError}
        onForceFlatChange={setForceFlat}
        lang={uiLang}
        onLangChange={setUiLang}
      />
      )}
    </div>
  )
}
