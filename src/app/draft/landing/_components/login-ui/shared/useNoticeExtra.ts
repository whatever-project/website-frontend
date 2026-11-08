"use client"

import { useLayoutEffect, useState, type RefObject } from "react"

/**
 * How much height the login message adds to the form, in px (0 while there is no message).
 *
 * The message sits in the form's normal flow above the first label, so the form is taller by the message height plus its top margin.
 * The 3D paper (scroll/scrollLoginAnimation.ts) grows by that amount (and the flat card follows the same size, see
 * useFlatSheetSize.ts) so the gaps around the form stay what they are without a message.
 *
 * The value is measured from the live element, not hard-coded, so the number of lines (1 to 3, Thai / English, window width) is
 * handled. `rootRef` is the dialog root that contains the form; `resetKey` changes whenever the message or the layout may have
 * changed (state, language, mode), so the observers are attached to the new elements.
 */
export function useNoticeExtra(rootRef: RefObject<HTMLElement | null>, resetKey: string): number {
  const [extra, setExtra] = useState(0)

  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return

    const measure = () => {
      const notice = root.querySelector<HTMLElement>('[data-layout="notice"]')
      const next = notice ? Math.round(notice.offsetHeight + (parseFloat(getComputedStyle(notice).marginTop) || 0)) : 0
      setExtra((current) => (current === next ? current : next))
    }

    // ResizeObserver reports once right after observing, which does the first measurement; the form is observed too because the
    // message wraps differently when the form width changes.
    const observer = new ResizeObserver(measure)
    const notice = root.querySelector('[data-layout="notice"]')
    if (notice) observer.observe(notice)
    const form = root.querySelector("form")
    if (form) observer.observe(form)
    return () => observer.disconnect()
  }, [rootRef, resetKey])

  return extra
}
