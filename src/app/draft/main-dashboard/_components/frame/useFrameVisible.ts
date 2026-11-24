"use client"

import { useSyncExternalStore } from "react"

/**
 * `frameVisible`: whether the decorative page frame (summer-main-frame + corner decorations + frame clipping) is shown. Default: true.
 *
 * Preview-only store. It is an external store (not React context state) so that
 *  - the server render and the first client render are both "frame on" (no hydration mismatch); a saved "off" is applied right after hydration,
 *  - every component that reads it (shell class, PageFrame, toggle) stays in sync without prop drilling,
 *  - the value is remembered per browser in localStorage (key below), and in other tabs through the `storage` event.
 *
 * To make it a real player preference later: keep the hook's signature, and replace `readStored` / `writeStored` with the account-settings
 * read / write (e.g. a user-settings query + mutation). Nothing else needs to change.
 */
const STORE_KEY = "md-frame-visible"

let current: boolean | null = null
const listeners = new Set<() => void>()

function readStored(): boolean {
  try {
    return window.localStorage.getItem(STORE_KEY) !== "0"
  } catch {
    return true
  }
}

function writeStored(v: boolean) {
  try {
    window.localStorage.setItem(STORE_KEY, v ? "1" : "0")
  } catch {
    /* private mode / blocked storage: the choice just lasts until reload */
  }
}

function getSnapshot(): boolean {
  if (current === null) current = readStored()
  return current
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORE_KEY) return
    current = e.newValue !== "0"
    fn()
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(fn)
    window.removeEventListener("storage", onStorage)
  }
}

/** The page scrolls inside `#mf-scroll` while the frame is on (it is `position: fixed`), and in the window while it is off. */
function scrollEl(): HTMLElement | null {
  const el = document.getElementById("mf-scroll")
  return el && getComputedStyle(el).position === "fixed" ? el : null
}

export function setFrameVisible(next: boolean) {
  if (next === getSnapshot()) return
  /* keep the reading position: remember it in the layout we are leaving, restore it in the one we enter (after the new layout has been painted) */
  const top = scrollEl()?.scrollTop ?? window.scrollY
  current = next
  writeStored(next)
  listeners.forEach((fn) => fn())
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      const el = scrollEl()
      if (el) el.scrollTop = top
      else window.scrollTo(0, top)
    }),
  )
}

export function useFrameVisible(): [boolean, (next: boolean) => void] {
  const frameVisible = useSyncExternalStore(subscribe, getSnapshot, () => true)
  return [frameVisible, setFrameVisible]
}
