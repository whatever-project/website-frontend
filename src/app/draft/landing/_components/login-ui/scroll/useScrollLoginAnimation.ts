"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { ScrollLoginAnimation } from "./scrollLoginAnimation"
import { PARCHMENT_GLB_URL as GLB_URL, QUILL_SRC } from "../../../_utils/assets"


// The decorative quill is only shown from 980px wide (Quill.module.css hides it below, and LoginModal does not render it there).
const QUILL_MIN_WIDTH_QUERY = "(min-width: 980px)"

// Kept at module level so the decoded bitmap is not thrown away before the dialog's <img> elements ask for the same file.
let quillImage: HTMLImageElement | undefined
let fontsPreloaded = false

/**
 * The faces the login form uses that the landing page itself may not have requested yet (a weight or a script subset). Without this
 * they are only requested when the form appears, and with `font-display: swap` the text re-flows while it fades in. Failures are ignored.
 */
function preloadLoginFonts() {
  if (fontsPreloaded || typeof document === "undefined" || !document.fonts?.load) return
  fontsPreloaded = true
  const thai = "ก"
  const latin = "Ag"
  const faces: Array<[string, string]> = [
    ['400 15px "IBM Plex Sans Thai"', thai],
    ['400 15px "IBM Plex Sans Thai"', latin],
    ['500 13px "IBM Plex Sans Thai"', thai],
    ['500 13px "IBM Plex Sans Thai"', latin],
    ['400 13px "Jost"', latin],
    ['500 13px "Jost"', latin],
    ['400 13px "Prompt"', thai],
    ['500 16px "Montserrat"', latin],
    ['400 16px "Jim Thompson Roman"', latin],
    ['400 16px "Google Sans"', thai],
    ['400 16px "Google Sans"', latin],
  ]
  for (const [font, sample] of faces) void document.fonts.load(font, sample).catch(() => undefined)
}

/**
 * Builds the renderer, parses the GLB and uploads it to the GPU ahead of time, so opening the popup does no
 * loading or setup work; also fetches AND decodes the quill image and the login fonts. Call it while the landing page is idle; it is
 * safe to call more than once. (The raw downloads of the model and the quill are started even earlier, by the `<link rel="preload">`
 * hints from preloadLoginAssets.ts, which do not wait for hydration.)
 */
export function preloadScrollLogin() {
  // The decorative quill image: fetch and decode it now so it is ready by the time the sheet is open (not on windows where it is hidden).
  if (!quillImage && window.matchMedia(QUILL_MIN_WIDTH_QUERY).matches) {
    quillImage = new Image()
    quillImage.decoding = "async"
    quillImage.src = QUILL_SRC
    void quillImage.decode().catch(() => undefined)
  }
  preloadLoginFonts()
  void import("./scrollLoginAnimation")
    .then(({ prepareScrollEngine }) => prepareScrollEngine(GLB_URL))
    .catch(() => undefined)
}

/** Releases the warm engine (WebGL context and GPU memory). Call when leaving the landing page. */
export function releaseScrollLogin() {
  void import("./scrollLoginAnimation").then(({ disposeScrollEngine }) => disposeScrollEngine())
}

export interface ScrollLoginAnimationHandle {
  ready: boolean
  error: boolean
  /** True once the sheet is fully open and has settled; the form becomes interactive. */
  formActive: boolean
  /** True while the decorative quill should be shown (from ~68% of the unroll until the close starts). */
  quillVisible: boolean
  /** Rolls the sheet back up; resolves when it is fully rolled (or immediately if nothing is open). */
  close: () => Promise<void>
  /** Extra height (px) the login message adds to the form (0 when there is none): the paper grows / shrinks to match, eased. */
  setContentExtra: (px: number) => void
}

/** Mounts the (pre-warmed) Three.js scroll in `containerRef`, unrolls it, and detaches it on unmount. */
export function useScrollLoginAnimation(containerRef: RefObject<HTMLDivElement | null>): ScrollLoginAnimationHandle {
  const engineRef = useRef<ScrollLoginAnimation | null>(null)
  const closedResolvers = useRef<Array<() => void>>([])
  // The latest extra form height requested before / while the engine is mounted (applied as soon as it mounts).
  const contentExtraRef = useRef(0)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [formActive, setFormActive] = useState(false)
  const [quillVisible, setQuillVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let active = true
    let engine: ScrollLoginAnimation | null = null
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Normally already warm (see preloadScrollLogin), so this resolves within a microtask of the click.
    import("./scrollLoginAnimation")
      .then(({ prepareScrollEngine }) => prepareScrollEngine(GLB_URL))
      .then((ready) => {
        if (!active) return
        engine = ready
        engine.mount(container, {
          onFormState: (value) => active && setFormActive(value),
          onQuillState: (value) => active && setQuillVisible(value),
          // Exposes the sheet's on-screen size to CSS (--sheet-w / --sheet-h on the modal root) so the form box
          // tracks the parchment without a React re-render on every resize.
          onLayout: ({ width, height }) => {
            const root = container.parentElement
            root?.style.setProperty("--sheet-w", `${width}px`)
            root?.style.setProperty("--sheet-h", `${height}px`)
          },
          onStateChange: (state) => {
            if (state !== "closed") return
            closedResolvers.current.splice(0).forEach((resolve) => resolve())
          },
        })
        engineRef.current = engine
        // A login message that is already visible when the dialog opens: lay the paper out for it right away (no ease).
        engine.setContentExtra(contentExtraRef.current, true)
        setReady(true)
        if (reducedMotion) engine.setProgress(1)
        else engine.playOpen()
      })
      .catch(() => active && setError(true))

    return () => {
      active = false
      engineRef.current = null
      engine?.unmount() // the engine stays warm for the next open
      closedResolvers.current.splice(0).forEach((resolve) => resolve())
    }
  }, [containerRef])

  const close = useCallback(() => {
    const engine = engineRef.current
    if (!engine || engine.state === "closed") return Promise.resolve()
    return new Promise<void>((resolve) => {
      closedResolvers.current.push(resolve)
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) engine.setProgress(0)
      else engine.playClose()
    })
  }, [])

  const setContentExtra = useCallback((px: number) => {
    contentExtraRef.current = px
    engineRef.current?.setContentExtra(px)
  }, [])

  return { ready, error, formActive, quillVisible, close, setContentExtra }
}
