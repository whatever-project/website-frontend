import type { KeyboardEvent } from "react"

/**
 * Props that make a non-button element (a card, note or row with block content inside) keyboard-accessible.
 * Use a real <button> when the content is phrasing-only; spread this on a <div> otherwise.
 */
export function clickable(onActivate: () => void) {
  return {
    role: "button" as const,
    tabIndex: 0,
    onClick: onActivate,
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault()
        onActivate()
      }
    },
  }
}
