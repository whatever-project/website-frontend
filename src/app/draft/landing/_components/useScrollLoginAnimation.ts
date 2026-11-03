"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import type { ScrollLoginAnimation } from "./scrollLoginAnimation"

// Emitted by the bundler as an asset; never copied to public/.
const GLB_URL = new URL("../_assets/scroll/scroll_login_animation_v01.glb", import.meta.url).href

export interface ScrollLoginAnimationHandle {
  ready: boolean
  error: boolean
  /** True once the sheet is fully open and has settled; the form becomes interactive. */
  formActive: boolean
  /** Rolls the sheet back up; resolves when it is fully rolled (or immediately if nothing is open). */
  close: () => Promise<void>
}

/** Mounts the Three.js scroll in `containerRef`, unrolls it, and disposes it on unmount. */
export function useScrollLoginAnimation(containerRef: RefObject<HTMLDivElement | null>): ScrollLoginAnimationHandle {
  const engineRef = useRef<ScrollLoginAnimation | null>(null)
  const closedResolvers = useRef<Array<() => void>>([])
  const [ready, setReady] = useState(false)
  const [error, setError] = useState(false)
  const [formActive, setFormActive] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let active = true
    let engine: ScrollLoginAnimation | null = null
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    import("./scrollLoginAnimation")
      .then(({ ScrollLoginAnimation: Engine }) => {
        if (!active) return
        engine = new Engine(container, {
          glbUrl: GLB_URL,
          onReady: () => {
            if (!active || !engine) return
            engineRef.current = engine
            setReady(true)
            if (reducedMotion) engine.setProgress(1)
            else engine.playOpen()
          },
          onError: () => active && setError(true),
          onFormState: (value) => active && setFormActive(value),
          onStateChange: (state) => {
            if (state !== "closed") return
            closedResolvers.current.splice(0).forEach((resolve) => resolve())
          },
        })
        return engine.init()
      })
      .catch(() => active && setError(true))

    return () => {
      active = false
      engineRef.current = null
      engine?.dispose()
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

  return { ready, error, formActive, close }
}
