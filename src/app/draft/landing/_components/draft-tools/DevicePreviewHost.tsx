"use client"

import { useCallback, useEffect, useRef, useState, type RefObject } from "react"
import { LOGIN_STATE_OPTIONS, LOGIN_UI_OPTIONS } from "../../_mock/login"
import DeviceButtons from "./DeviceButtons"
import { getModeNote } from "./PreviewPanel"
import { INITIAL_STATUS, PREVIEW_SET_EVENT, PREVIEW_STATUS_EVENT, type PreviewCommand, type PreviewStatus } from "./previewBridge"
import {
  CUSTOM_LIMITS,
  buildEmbedUrl,
  exitDevicePreview,
  replacePreviewSearch,
  switchDevice,
  writeSnapshotParams,
  type DeviceSpec,
  type PreviewSnapshot,
} from "./previewRoute"
import { buttonClass } from "./previewStyles"

interface PreviewFrameProps {
  device: DeviceSpec
  snapshot: PreviewSnapshot
  frameRef: RefObject<HTMLIFrameElement | null>
  onStatus: (status: PreviewStatus) => void
  onSize: (size: [number, number]) => void
}

/** The simulated viewport: an iframe of the REAL landing route with exactly the device's CSS size (so real media queries respond). */
function PreviewFrame({ device, snapshot, frameRef, onStatus, onSize }: PreviewFrameProps) {
  // The URL is fixed for the life of this frame (the host remounts it for every device); later changes travel as events, not reloads.
  const [src] = useState(() => buildEmbedUrl(snapshot))
  const detachRef = useRef<() => void>(() => undefined)

  const attach = useCallback(() => {
    detachRef.current()
    const win = frameRef.current?.contentWindow as (Window & { __draftLandingPreviewStatus?: PreviewStatus }) | null | undefined
    if (!win) return
    const handler = (event: Event) => onStatus((event as CustomEvent<PreviewStatus>).detail)
    win.addEventListener(PREVIEW_STATUS_EVENT, handler)
    detachRef.current = () => {
      try {
        win.removeEventListener(PREVIEW_STATUS_EVENT, handler)
      } catch {
        /* the iframe window is already gone */
      }
    }
    // The page may already have reported before this listener existed: read the latest value too (same-origin property read).
    if (win.__draftLandingPreviewStatus) onStatus(win.__draftLandingPreviewStatus)
    onSize([win.innerWidth, win.innerHeight])
  }, [frameRef, onStatus, onSize])

  // Only the status listener is released here. The iframe itself is emptied by the host's buttons (see `leaveFrame`), never by an effect:
  // React StrictMode runs effect cleanups once right after mount in development, which would blank the live frame.
  useEffect(() => () => detachRef.current(), [])

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={`Landing page preview ${device.width} × ${device.height}`}
      onLoad={attach}
      style={{ width: device.width, height: device.height, border: 0, display: "block", background: "#000" }}
    />
  )
}

const rowClass = "flex flex-wrap items-center gap-1.5"

function HostInner({ device, snapshot }: { device: DeviceSpec; snapshot: PreviewSnapshot }) {
  const [snap, setSnap] = useState(snapshot)
  const snapRef = useRef(snapshot)
  const [status, setStatus] = useState<PreviewStatus>(INITIAL_STATUS)
  const [reported, setReported] = useState<[number, number] | null>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const readySeen = useRef(false)
  /**
   * Called by every control that is about to REMOVE this frame (another device, Desktop): empties the iframe first so the embedded page, its
   * 3D engine, its WebGL context and its timers are torn down right away instead of waiting for garbage collection.
   */
  const leaveFrame = useCallback((then: () => void) => {
    const frame = frameRef.current
    if (frame) frame.src = "about:blank"
    then()
  }, [])
  const [customWidth, setCustomWidth] = useState(String(device.width))
  const [customHeight, setCustomHeight] = useState(String(device.height))

  // Keep the URL in step with the selections: a reload, or "Desktop", then keeps them.
  useEffect(() => {
    replacePreviewSearch((p) => writeSnapshotParams(p, snap))
  }, [snap])

  /** Host -> embedded page (same origin: a CustomEvent dispatched on the iframe's own window, no postMessage). */
  const send = useCallback((command: PreviewCommand) => {
    const win = frameRef.current?.contentWindow as (Window & typeof globalThis) | null | undefined
    if (!win) return
    win.dispatchEvent(new win.CustomEvent(PREVIEW_SET_EVENT, { detail: command }))
  }, [])

  const update = useCallback(
    (command: PreviewCommand) => {
      // "Close" is only reflected once the page confirms it (the sheet rolls up first), so loginOpen=false is never applied optimistically.
      const { loginOpen, ...rest } = command
      snapRef.current = { ...snapRef.current, ...rest, ...(loginOpen === true ? { loginOpen: true } : {}) }
      setSnap(snapRef.current)
      send(command)
    },
    [send],
  )

  const onStatus = useCallback(
    (next: PreviewStatus) => {
      setStatus(next)
      if (snapRef.current.loginOpen !== next.modalOpen) {
        snapRef.current = { ...snapRef.current, loginOpen: next.modalOpen }
        setSnap(snapRef.current)
      }
      if (next.ready && !readySeen.current) {
        // First contact: re-send the selections once, in case a click arrived before the page had hydrated.
        readySeen.current = true
        const { loginOpen: ignored, ...settings } = snapRef.current
        void ignored
        send(settings)
      }
    },
    [send],
  )

  const flat = snap.forceFlat || status.sceneError
  const modeNote = getModeNote(flat, status.sceneError, snap.uiVariant)
  const applyCustom = () => {
    const width = Number(customWidth), height = Number(customHeight)
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return
    const clamp = (v: number) => Math.min(CUSTOM_LIMITS.max, Math.max(CUSTOM_LIMITS.min, Math.round(v)))
    leaveFrame(() => switchDevice({ id: "custom", label: "Custom", width: clamp(width), height: clamp(height) }))
  }
  const numberInput = "w-16 border border-[#b89a63] bg-white/60 px-1.5 py-0.5 text-[#3a2c1a]"

  return (
    <div data-dev-preview className="fixed inset-0 z-50 flex flex-col bg-[#14161f]">
      {/* Controls live OUTSIDE the simulated viewport. */}
      <div className="max-h-[45vh] shrink-0 space-y-2 overflow-y-auto border-b border-[#c9ad77] bg-[#f6ecd2] py-2.5 pr-3 pl-16 font-ui text-[12px] text-[#3a2c1a]">
        <div className={rowClass}>
          <span className="parch-label mr-1">Device</span>
          <DeviceButtons
            value={device.id}
            showSize
            onSelect={(next) => leaveFrame(() => (next === "desktop" ? exitDevicePreview() : switchDevice(next)))}
          />
          <span className="parch-label mr-1 ml-2">Custom</span>
          <input aria-label="Custom width" inputMode="numeric" className={numberInput} value={customWidth} onChange={(e) => setCustomWidth(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCustom()} />
          <span>×</span>
          <input aria-label="Custom height" inputMode="numeric" className={numberInput} value={customHeight} onChange={(e) => setCustomHeight(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyCustom()} />
          <button type="button" onClick={applyCustom} aria-pressed={device.id === "custom"} className={buttonClass(device.id === "custom")}>
            Apply
          </button>
          <span className="ml-2 font-medium" data-testid="viewport-readout">
            Viewport {device.width} × {device.height}px
            {reported && (reported[0] !== device.width || reported[1] !== device.height) ? ` (iframe reports ${reported[0]} × ${reported[1]})` : ""}
          </span>
        </div>

        <div className={rowClass}>
          <span className="parch-label mr-1">Login</span>
          <button type="button" onClick={() => update({ loginOpen: true })} aria-pressed={snap.loginOpen} className={buttonClass(snap.loginOpen)}>
            Open
          </button>
          <button type="button" onClick={() => update({ loginOpen: false })} aria-pressed={!snap.loginOpen} className={buttonClass(!snap.loginOpen)}>
            Close
          </button>
          <span className="parch-label mr-1 ml-2">UI</span>
          {LOGIN_UI_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => update({ uiVariant: option.value })} aria-pressed={snap.uiVariant === option.value} className={buttonClass(snap.uiVariant === option.value)}>
              {option.label}
            </button>
          ))}
          <span className="parch-label mr-1 ml-2">Lang</span>
          {(["th", "en"] as const).map((code) => (
            <button key={code} type="button" onClick={() => update({ uiLang: code })} aria-pressed={(snap.uiLang ?? "th") === code} className={buttonClass((snap.uiLang ?? "th") === code)}>
              {code.toUpperCase()}
            </button>
          ))}
          <span className="parch-label mr-1 ml-2">Mode</span>
          <button
            type="button"
            onClick={() => update({ forceFlat: false })}
            aria-pressed={!flat}
            disabled={status.sceneError}
            title={status.sceneError ? "WebGL ใช้ไม่ได้ จึงสลับกลับ 3D ไม่ได้" : undefined}
            className={`${buttonClass(!flat)} disabled:cursor-not-allowed disabled:opacity-40`}
          >
            3D scroll
          </button>
          <button type="button" onClick={() => update({ forceFlat: true })} aria-pressed={flat} className={buttonClass(flat)}>
            Flat fallback
          </button>
        </div>
        {modeNote && (
          <p role="status" className="text-[11px] leading-snug text-[#8a2a1f]">
            {modeNote}
          </p>
        )}

        <div className={rowClass}>
          <span className="parch-label mr-1">State</span>
          {LOGIN_STATE_OPTIONS.map((option) => (
            <button key={option.value} type="button" onClick={() => update({ loginState: option.value })} aria-pressed={snap.loginState === option.value} className={buttonClass(snap.loginState === option.value)}>
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* The simulated viewport. If it is larger than the available area, this area scrolls: the viewport is never shrunk. */}
      <div className="flex flex-1 overflow-auto p-5">
        <div className="m-auto shrink-0 outline outline-1 outline-[#c9ad77]/60" style={{ width: device.width, height: device.height }}>
          <PreviewFrame device={device} snapshot={snapshot} frameRef={frameRef} onStatus={onStatus} onSize={setReported} />
        </div>
      </div>
    </div>
  )
}

/** Developer-only host: toolbar + an iframe of the real landing page at an exact device size. Remounts per device (fresh iframe, fresh 3D engine). */
export default function DevicePreviewHost({ device, snapshot }: { device: DeviceSpec; snapshot: PreviewSnapshot }) {
  return <HostInner key={`${device.id}-${device.width}x${device.height}`} device={device} snapshot={snapshot} />
}
