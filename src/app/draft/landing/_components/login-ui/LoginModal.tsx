"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { LOGIN_COPY_BY_LANG, type LoginState } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import { useScrollLoginAnimation } from "./scroll/useScrollLoginAnimation"
import PreviewPanel from "../draft-tools/PreviewPanel"
import { getCurrentSnapshot, isEmbedded, listenPreviewCommands, reportPreviewStatus } from "../draft-tools/previewBridge"
import QuillFeather from "./quill/QuillFeather"
import QuillShadow from "./quill/QuillShadow"
import { useQuillAnchor } from "./quill/useQuillAnchor"
import { useQuillWanted } from "./quill/useQuillWanted"
import { useNoticeExtra } from "./shared/useNoticeExtra"
import { useFlatSheetSize } from "./shared/useFlatSheetSize"
import LoginForm from "./shared/LoginForm"
import LoginNotice from "./shared/LoginNotice"
import styles from "./LoginModal.module.css"
import "./shared/LoginFontFaces.module.css"
import classicStyles from "./classic/ClassicLogin.module.css"
import classicLayout from "./classic/ClassicLoginLayout.module.css"
import classicTypography from "./classic/ClassicLoginTypography.module.css"

/**
 * The login dialog: the dimmed backdrop, the transparent 3D parchment canvas, the form on the sheet, the decorative quill,
 * and the draft preview controls. Form logic is in LoginForm; the UI is in login-ui/classic (shared login pieces: login-ui/shared).
 * Typography is owned by classic/ClassicLoginTypography.module.css: this file only puts its `.typography` class on the form box
 * and on the notice. Layout (size / spacing / gaps) works the same way: classic/ClassicLoginLayout.module.css;
 * this file keeps only the shared modal behaviour.
 */
export default function LoginModal({ onClose, lang = "th" }: { onClose: () => void; lang?: DraftLang }) {
  // Language of the login dialog (starts from the landing page language). Thai is the original copy.
  // The developer device preview (draft-tools/previewRoute.ts) can start the dialog from earlier preview selections; null on the normal page.
  const [uiLang, setUiLang] = useState<DraftLang>(() => getCurrentSnapshot()?.uiLang ?? lang)
  const [state, setState] = useState<LoginState>(() => getCurrentSnapshot()?.loginState ?? "idle")
  // Draft-only PREVIEW switch (PreviewPanel, "Mode" row): shows the existing flat fallback card although WebGL works, so it can be
  // inspected without disabling WebGL. It never changes how a real failure is detected (`sceneError` below is untouched).
  const [forceFlat, setForceFlat] = useState(() => getCurrentSnapshot()?.forceFlat ?? false)
  const [closing, setClosing] = useState(false)
  const closingRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const identifierRef = useRef<HTMLInputElement>(null)
  const { error: sceneError, formActive, quillVisible, close, setContentExtra } = useScrollLoginAnimation(stageRef)
  // The flat fallback card is shown when the 3D scene failed (production behaviour) OR when the preview switch forces it.
  const flat = sceneError || forceFlat
  // The dialog box that tracks the 3D paper. The quill's nib is kept on the sign-up line by measuring that line (useQuillAnchor).
  const sheetBoxRef = useRef<HTMLDivElement>(null)
  useQuillAnchor(sheetBoxRef, !flat)
  // The quill (and its two shadow copies) is only rendered on windows where it can be seen: no image download on tablets and phones.
  const showQuill = useQuillWanted()
  // The login message makes the form taller; the 3D paper (and the flat card, which has the paper's exact size) grows by the same
  // amount, so the gaps around the form stay what they are without a message. See useNoticeExtra / sheetLayout.ts.
  const rootRef = useRef<HTMLDivElement>(null)
  const noticeExtra = useNoticeExtra(rootRef, `${state}|${uiLang}|${flat}`)
  useEffect(() => {
    setContentExtra(noticeExtra)
  }, [noticeExtra, setContentExtra])
  useFlatSheetSize(rootRef, flat, noticeExtra)

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

  const copy = LOGIN_COPY_BY_LANG[uiLang]
  // The UI's classes: typography, its non-typography styles (e.g. the button shadow) and layout (size / spacing / gaps):
  // `.layout` carries the layout variables, `.sheetBox` is the form box on the sheet.
  const typographyClass = classicTypography.typography
  const variantClass = classicStyles.classic
  const layoutClass = classicLayout.layout
  const sheetBoxClass = classicLayout.sheetBox

  // The login notice is rendered INSIDE the form (above the first label) through LoginForm's `notice` slot, on the 3D sheet and on the
  // flat fallback card alike; the form grows to fit it. It carries the same typography / layout classes as the box that wraps it.
  const notice = (
    <LoginNotice
      state={state}
      copy={copy}
      visible={interactive}
      className={`${classicTypography.typography} ${classicLayout.layout}`}
    />
  )

  const form = (
    <LoginForm
      state={state}
      onSubmit={() => setState("error")}
      interactive={interactive}
      identifierRef={identifierRef}
      copy={copy}
      notice={notice}
    />
  )

  return (
    // `lang` on the root: every `:lang(th)` / `:lang(en)` rule in the classic CSS (and the notice) follows the dialog language from here.
    <div
      ref={rootRef}
      lang={uiLang}
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
            className={`${styles.sheet} ${classicTypography.typography} ${classicStyles.classic} ${classicLayout.layout} ${classicLayout.flatCard} parch-sheet`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>
        </div>
      ) : (
        <div
          ref={sheetBoxRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="landing-login-title"
          // Box tracks the parchment's on-screen size (--sheet-w / --sheet-h are set by the 3D engine).
          style={{ width: "var(--sheet-w, 74%)", height: "var(--sheet-h, 84%)" }}
          className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        >
          {/* The quill's cast shadow on the paper: before the form, so the form paints above it. */}
          {showQuill && <QuillShadow visible={quillVisible} />}

          <div
            inert={!interactive}
            className={`${styles.formReveal} ${layoutClass} ${sheetBoxClass} ${typographyClass} ${variantClass} ${interactive ? "" : styles.formHidden} overflow-y-auto`}
            onClick={(event) => event.stopPropagation()}
          >
            {form}
          </div>

          {showQuill && <QuillFeather visible={quillVisible} />}
        </div>
      )}

      {/* In the device preview the controls are in the host, OUTSIDE the simulated viewport, so the panel is not drawn inside it. */}
      {!isEmbedded() && (
      <PreviewPanel
        state={state}
        onStateChange={setState}
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
