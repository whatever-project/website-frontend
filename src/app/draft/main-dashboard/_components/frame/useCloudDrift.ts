"use client"

import { useSyncExternalStore } from "react"

/**
 * Preview-only switch: are the drifting-mist layers of the sky animated? Default: true. Same pattern as useFrameVisible
 * (external store: server render and first client render are "on", a saved choice is applied right after hydration; remembered in localStorage).
 * `prefers-reduced-motion` always wins in CSS, whatever this says.
 */
const STORE_KEY = "md-cloud-drift"
let current: boolean | null = null
const listeners = new Set<() => void>()

function getSnapshot(): boolean {
  if (current === null) {
    try {
      current = window.localStorage.getItem(STORE_KEY) !== "0"
    } catch {
      current = true
    }
  }
  return current
}

function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function setCloudDrift(next: boolean) {
  current = next
  try {
    window.localStorage.setItem(STORE_KEY, next ? "1" : "0")
  } catch {
    /* blocked storage: lasts until reload */
  }
  listeners.forEach((fn) => fn())
}

export function useCloudDrift(): [boolean, (next: boolean) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, () => true), setCloudDrift]
}