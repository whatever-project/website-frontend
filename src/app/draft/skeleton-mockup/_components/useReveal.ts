import { useEffect, useRef } from "react"

/**
 * Fade/slide-in on scroll: adds the `in` class to every `.reveal` descendant once it enters the viewport.
 * (Class is added to the DOM directly; the `reveal` elements must keep a static className so React never resets it.)
 * Pass a `key` (e.g. the current view) so it re-runs when the content changes.
 */
export function useReveal<T extends HTMLElement>(key?: string) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const els = root.querySelectorAll<HTMLElement>(".reveal:not(.in)")
    if (typeof IntersectionObserver === "undefined") {
      els.forEach((el) => el.classList.add("in"))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in")
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [key])

  return ref
}
