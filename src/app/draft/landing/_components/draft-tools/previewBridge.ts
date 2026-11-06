"use client"

import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"
import type { PreviewSnapshot } from "./previewRoute"

/**
 * Same-window bridge between the device preview HOST and the real page running in its iframe (the "embedded" page).
 *
 * No postMessage and no cross-origin access: the host and the iframe are the same origin, so the host simply dispatches a CustomEvent on
 * `iframe.contentWindow`, and the embedded page dispatches status events on its own window, which the host listens to. Only the embedded
 * page (opened with ?embed=1, development builds only) reacts to these events; in a production build everything here is a no-op.
 */
export const PREVIEW_SET_EVENT = "draft-landing-preview-set"
export const PREVIEW_STATUS_EVENT = "draft-landing-preview-status"

/** What the embedded page reports back to the host. */
export interface PreviewStatus {
  /** The page has hydrated and listens for commands. */
  ready: boolean
  /** The login dialog is mounted (opened by the host OR by clicking the real Login button inside the iframe). */
  modalOpen: boolean
  /** The 3D scene really failed to start (WebGL / model): the flat fallback is then not a preview choice. */
  sceneError: boolean
}

export const INITIAL_STATUS: PreviewStatus = { ready: false, modalOpen: false, sceneError: false }

/** A command from the host: any subset of the snapshot. `loginOpen: true` opens the login, `loginOpen: false` closes it (rolling the sheet up first). */
export type PreviewCommand = Partial<PreviewSnapshot>

declare global {
  interface Window {
    /** Latest status of the embedded page, so a host that attaches late can still read it. */
    __draftLandingPreviewStatus?: PreviewStatus
  }
}

let embedded = false
let current: PreviewSnapshot | null = null

export const setEmbedded = (value: boolean) => {
  if (DEV_PREVIEW_ENABLED) embedded = value
}
export const isEmbedded = () => DEV_PREVIEW_ENABLED && embedded

/** The preview selections the login dialog should start from (null = defaults, i.e. the normal page). */
export const getCurrentSnapshot = (): PreviewSnapshot | null => (DEV_PREVIEW_ENABLED ? current : null)
export const setCurrentSnapshot = (snapshot: PreviewSnapshot | null) => {
  if (DEV_PREVIEW_ENABLED) current = snapshot
}
export const mergeCurrentSnapshot = (partial: PreviewCommand) => {
  if (DEV_PREVIEW_ENABLED && current) current = { ...current, ...partial }
}

/** Embedded page → host. */
export function reportPreviewStatus(partial: Partial<PreviewStatus>) {
  if (!isEmbedded()) return
  const next: PreviewStatus = { ...(window.__draftLandingPreviewStatus ?? INITIAL_STATUS), ...partial }
  window.__draftLandingPreviewStatus = next
  window.dispatchEvent(new CustomEvent<PreviewStatus>(PREVIEW_STATUS_EVENT, { detail: next }))
}

/** Embedded page: run `handler` for every command the host sends. Returns the cleanup. */
export function listenPreviewCommands(handler: (command: PreviewCommand) => void): () => void {
  if (!isEmbedded()) return () => undefined
  const listener = (event: Event) => handler((event as CustomEvent<PreviewCommand>).detail ?? {})
  window.addEventListener(PREVIEW_SET_EVENT, listener)
  return () => window.removeEventListener(PREVIEW_SET_EVENT, listener)
}
