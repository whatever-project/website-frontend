"use client"

import { useSyncExternalStore } from "react"

/**
 * TEMPORARY preview flag: `showDashboardContent`. false (default for now) = only the Hero, its navigation and the sky are shown; the dashboard sections
 * (GrandHub, SeventhSeal, LiveUpdates, MembersBoard, and the footer through DashboardGate) are NOT rendered, but nothing is deleted: set it back to true (dock switch "แสดงการ์ดแดชบอร์ด", or
 * change DEFAULT below) and they come back exactly as before. External store like useFrameVisible / useCloudDrift: server render and first client render use
 * DEFAULT, a saved choice (localStorage) is applied right after hydration. Not a player setting.
 */
const DEFAULT = false
const STORE_KEY = "md-show-dashboard"
let current: boolean | null = null
const listeners = new Set<() => void>()

function getSnapshot(): boolean {
  if (current === null) {
    try {
      const v = window.localStorage.getItem(STORE_KEY)
      current = v === null ? DEFAULT : v === "1"
    } catch {
      current = DEFAULT
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

export function setShowDashboardContent(next: boolean) {
  current = next
  try {
    window.localStorage.setItem(STORE_KEY, next ? "1" : "0")
  } catch {
    /* blocked storage: lasts until reload */
  }
  listeners.forEach((fn) => fn())
}

export function useShowDashboardContent(): [boolean, (next: boolean) => void] {
  return [useSyncExternalStore(subscribe, getSnapshot, () => DEFAULT), setShowDashboardContent]
}