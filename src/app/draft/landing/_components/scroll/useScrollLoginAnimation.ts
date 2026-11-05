"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { ScrollLoginAnimation } from "./scrollLoginAnimation"
import { PARCHMENT_GLB_URL as GLB_URL, QUILL_SRC } from "../../_utils/assets"


let quillPreloaded = false
/**
 * Builds the renderer, parses the GLB and uploads it to the GPU ahead of time, so opening the popup does no
 * loading or setup work. Call it while the landing page is idle; it is safe to call more than once.
 */
export function preloadScrollLogin() {
  // The decorative quill image: decode it now so it is ready by the time the sheet is open.
  if (!quillPreloaded) {
    quillPreloaded = true
    const quill = new Image()
    quill.decoding = "async"
    quill.src = QUILL_SRC
  }
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
}

/** Mounts the (pre-warmed) Three.js scroll in `containerRef`, unrolls it, and detaches it on unmount. */
export function useScrollLoginAnimation(containerRef: RefObject<HTMLDivElement | null>): ScrollLoginAnimationHandle {
  const engineRef = useRef<ScrollLoginAnimation | null>(null)
  const closedResolvers = useRef<Array<() => void>>([])
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

  return { ready, error, formActive, quillVisible, close }
}
