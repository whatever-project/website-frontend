"use client"

import { useSyncExternalStore } from "react"

// Same limit as `@media (max-width: 979px) { .quill { display: none } }` in Quill.module.css.
const QUERY = "(min-width: 980px)"

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia(QUERY)
  media.addEventListener("change", onChange)
  return () => media.removeEventListener("change", onChange)
}

/**
 * True when the decorative quill can be seen (window at least 980px wide). Below that the CSS only hides it with `display: none`, but
 * the browser still downloads the image of a hidden `<img>`, so LoginModal does not render the quill (nor its shadow copies) at all.
 * The server snapshot is false: the dialog is never rendered on the server.
 */
export function useQuillWanted(): boolean {
  return useSyncExternalStore(subscribe, () => window.matchMedia(QUERY).matches, () => false)
}
