"use client"

import { useMemo, useSyncExternalStore } from "react"
import { LOGIN_STATE_OPTIONS, LOGIN_UI_OPTIONS, type LoginState, type LoginUiVariant } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"

/**
 * Developer preview ROUTE state. Everything lives in the URL of the one landing route (/draft/landing), so a reload keeps the preview and
 * nothing is stored anywhere else:
 *
 *   ?device=mobile-s|mobile-m|mobile-l|tablet|custom[&w=&h=]   show the device preview HOST (toolbar + iframe of the real page)
 *   ?embed=1                                                    this page IS the real page inside the host's iframe (no preview chrome)
 *   ?open=1 &variant=classic|new &lang=th|en &state=<login state> &flat=1     the login preview selections (the "snapshot")
 *
 * In a production build every function here returns the neutral route, so the tools can never be reached.
 */

export type DeviceId = "desktop" | "mobile-s" | "mobile-m" | "mobile-l" | "tablet" | "custom"

export interface DeviceSpec {
  id: Exclude<DeviceId, "desktop">
  label: string
  width: number
  height: number
}

/** The device presets (CSS pixels). The iframe gets EXACTLY this size, so real CSS media queries respond to it. */
export const DEVICE_PRESETS: DeviceSpec[] = [
  { id: "mobile-s", label: "Mobile Small", width: 375, height: 667 },
  { id: "mobile-m", label: "Mobile Standard", width: 390, height: 844 },
  { id: "mobile-l", label: "Mobile Large", width: 430, height: 932 },
  { id: "tablet", label: "Tablet", width: 768, height: 1024 },
]

export const CUSTOM_LIMITS = { min: 240, max: 1600 }

/** The login preview selections that survive switching between desktop and a device (and reloads). */
export interface PreviewSnapshot {
  loginOpen: boolean
  uiVariant: LoginUiVariant
  /** null = start from the landing page language. */
  uiLang: DraftLang | null
  loginState: LoginState
  /** The flat fallback card is forced (the "Mode" switch). */
  forceFlat: boolean
}

export const DEFAULT_SNAPSHOT: PreviewSnapshot = { loginOpen: false, uiVariant: "classic", uiLang: null, loginState: "idle", forceFlat: false }

export interface PreviewRoute {
  embed: boolean
  device: DeviceSpec | null
  snapshot: PreviewSnapshot
  /** True when the URL carried any snapshot parameter. */
  hasSnapshot: boolean
}

const NEUTRAL_ROUTE: PreviewRoute = { embed: false, device: null, snapshot: DEFAULT_SNAPSHOT, hasSnapshot: false }
const SNAPSHOT_KEYS = ["open", "variant", "lang", "state", "flat"]
const DEVICE_KEYS = ["device", "w", "h"]

const clampSize = (value: number) => Math.min(CUSTOM_LIMITS.max, Math.max(CUSTOM_LIMITS.min, Math.round(value)))

export function parsePreviewRoute(search: string): PreviewRoute {
  if (!DEV_PREVIEW_ENABLED) return NEUTRAL_ROUTE
  const p = new URLSearchParams(search)
  const embed = p.get("embed") === "1"
  const deviceParam = p.get("device")
  let device: DeviceSpec | null = DEVICE_PRESETS.find((d) => d.id === deviceParam) ?? null
  if (!device && deviceParam === "custom") {
    const width = Number(p.get("w")), height = Number(p.get("h"))
    if (Number.isFinite(width) && Number.isFinite(height) && width > 0 && height > 0) device = { id: "custom", label: "Custom", width: clampSize(width), height: clampSize(height) }
  }
  const variant = LOGIN_UI_OPTIONS.find((o) => o.value === p.get("variant"))?.value ?? DEFAULT_SNAPSHOT.uiVariant
  const lang = p.get("lang")
  const state = LOGIN_STATE_OPTIONS.find((o) => o.value === p.get("state"))?.value ?? DEFAULT_SNAPSHOT.loginState
  const snapshot: PreviewSnapshot = {
    loginOpen: p.get("open") === "1",
    uiVariant: variant,
    uiLang: lang === "th" || lang === "en" ? lang : null,
    loginState: state,
    forceFlat: p.get("flat") === "1",
  }
  return { embed, device, snapshot, hasSnapshot: SNAPSHOT_KEYS.some((key) => p.has(key)) }
}

export function writeSnapshotParams(p: URLSearchParams, s: PreviewSnapshot) {
  for (const key of SNAPSHOT_KEYS) p.delete(key)
  if (s.loginOpen) p.set("open", "1")
  p.set("variant", s.uiVariant)
  if (s.uiLang) p.set("lang", s.uiLang)
  p.set("state", s.loginState)
  if (s.forceFlat) p.set("flat", "1")
}

export function clearSnapshotParams(p: URLSearchParams) {
  for (const key of SNAPSHOT_KEYS) p.delete(key)
}

export function writeDeviceParams(p: URLSearchParams, device: DeviceSpec | null) {
  for (const key of DEVICE_KEYS) p.delete(key)
  if (!device) return
  p.set("device", device.id)
  if (device.id === "custom") {
    p.set("w", String(device.width))
    p.set("h", String(device.height))
  }
}

/** The URL the host loads in its iframe: the real landing route, flagged as embedded, with the current snapshot (no device parameters). */
export function buildEmbedUrl(snapshot: PreviewSnapshot): string {
  const p = new URLSearchParams(window.location.search)
  for (const key of [...DEVICE_KEYS, "embed"]) p.delete(key)
  writeSnapshotParams(p, snapshot)
  p.set("embed", "1")
  return `${window.location.pathname}?${p.toString()}`
}

// ── URL store (so React re-renders when the preview parameters change without a navigation) ──────────────────────────
const listeners = new Set<() => void>()
const subscribe = (callback: () => void) => {
  listeners.add(callback)
  window.addEventListener("popstate", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("popstate", callback)
  }
}
const getSearch = () => window.location.search
const getServerSearch = () => ""

/** Rewrites the query string in place (history.replaceState: no navigation, no reload) and notifies every subscriber. */
export function replacePreviewSearch(mutate: (p: URLSearchParams) => void) {
  if (!DEV_PREVIEW_ENABLED) return
  const p = new URLSearchParams(window.location.search)
  mutate(p)
  const query = p.toString()
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`)
  listeners.forEach((listener) => listener())
}

/** The current preview route. Server render and first client render are the neutral route (no hydration mismatch), then it follows the URL. */
export function usePreviewRoute(): PreviewRoute {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)
  return useMemo(() => parsePreviewRoute(search), [search])
}

// ── Actions ──────────────────────────────────────────────────────────────────────────────────────────────────────────
/** Leaves the normal page and shows the device preview host, carrying the current login preview selections over. */
export function enterDevicePreview(device: DeviceSpec, snapshot: PreviewSnapshot) {
  replacePreviewSearch((p) => {
    writeDeviceParams(p, device)
    writeSnapshotParams(p, snapshot)
  })
}

export function switchDevice(device: DeviceSpec) {
  replacePreviewSearch((p) => writeDeviceParams(p, device))
}

/** Back to the normal desktop page. The snapshot parameters stay in the URL until the page has applied them. */
export function exitDevicePreview() {
  replacePreviewSearch((p) => writeDeviceParams(p, null))
}
