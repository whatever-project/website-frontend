"use client"

import { useLayoutEffect, type RefObject } from "react"

/**
 * Puts the nib of the decorative 2D quill on the same line as the "ยังไม่มีบัญชี?" sign-up line.
 *
 * The quill (QuillFeather) and its cast shadow (QuillShadow) are positioned with `bottom: var(--quill-bottom, 50px)` inside the
 * dialog box that tracks the 3D paper. Where the sign-up line sits above the bottom of that box is not a constant: it depends
 * on the paper height (the bottom roll is 9.09% of it), on the form's own height and on where the form is centred, all of which
 * change with the window size and with the spacing in classic/ClassicLoginLayout.module.css. So instead of a fixed number the
 * real line is measured and its vertical centre is published as `--quill-bottom` on the box; the feather and the shadow inherit it.
 *
 * Measured from layout offsets (not getBoundingClientRect) so the form's fade/scale reveal animation does not disturb it.
 * Re-measured whenever the box (paper size) or the form (content) changes size. The fallback 50px in the CSS applies until then.
 */
export function useQuillAnchor(boxRef: RefObject<HTMLElement | null>, enabled: boolean) {
  useLayoutEffect(() => {
    const box = boxRef.current
    if (!box || !enabled) return

    const update = () => {
      const prompt = box.querySelector<HTMLElement>('[data-layout="prompt"]')
      if (!prompt) return
      let top = 0
      let node: HTMLElement | null = prompt
      while (node && node !== box) {
        top += node.offsetTop
        node = node.offsetParent as HTMLElement | null
      }
      if (node !== box) return // the prompt is not laid out inside this box (yet): keep the CSS fallback
      const centre = top + prompt.offsetHeight / 2
      box.style.setProperty("--quill-bottom", `${Math.round(box.clientHeight - centre)}px`)
    }

    update()
    const observer = new ResizeObserver(update)
    observer.observe(box)
    const form = box.querySelector("form")
    if (form) observer.observe(form)
    return () => {
      observer.disconnect()
      box.style.removeProperty("--quill-bottom")
    }
  }, [boxRef, enabled])
}
