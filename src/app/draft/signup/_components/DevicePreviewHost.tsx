"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import DeviceButtons from "../../landing/_components/draft-tools/DeviceButtons"
import { buttonClass } from "../../landing/_components/draft-tools/previewStyles"
import {
  CUSTOM_LIMITS,
  exitDevicePreview,
  replacePreviewSearch,
  switchDevice,
  type DeviceSpec,
} from "../../landing/_components/draft-tools/previewRoute"
import {
  SIGNUP_PREVIEW_SET_EVENT,
  SIGNUP_PREVIEW_STATUS_EVENT,
  buildSignupEmbedUrl,
  writeSignupStateParams,
  type SignupPreviewState,
  type SignupStep,
} from "./previewBridge"

const rowClass = "flex flex-wrap items-center gap-1.5"

/**
 * Developer-only host (same look and URL scheme as the landing draft's): toolbar + an iframe of the REAL /draft/signup route at exactly
 * the device's CSS size, so media queries respond to it. Preview state goes to the page as events (the form is never reloaded) and the
 * page reports its step back. Resizing never remounts the iframe, so what was typed stays.
 */
export default function DevicePreviewHost({ device, initial }: { device: DeviceSpec; initial: SignupPreviewState }) {
  const [state, setState] = useState<SignupPreviewState>(initial)
  const stateRef = useRef(initial)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [src] = useState(() => buildSignupEmbedUrl(initial))
  const [customWidth, setCustomWidth] = useState(String(device.width))
  const [customHeight, setCustomHeight] = useState(String(device.height))
  const [reported, setReported] = useState<[number, number] | null>(null)

  useEffect(() => {
    setCustomWidth(String(device.width))
    setCustomHeight(String(device.height))
  }, [device.width, device.height])

  const send = useCallback((detail: Partial<SignupPreviewState>) => {
    const win = frameRef.current?.contentWindow as (Window & typeof globalThis) | null | undefined
    if (!win) return
    win.dispatchEvent(new win.CustomEvent(SIGNUP_PREVIEW_SET_EVENT, { detail }))
  }, [])

  const apply = useCallback((next: SignupPreviewState) => {
    stateRef.current = next
    setState(next)
    replacePreviewSearch((p) => writeSignupStateParams(p, next))
  }, [])

  const update = useCallback(
    (patch: Partial<SignupPreviewState>) => {
      apply({ ...stateRef.current, ...patch })
      send(patch)
    },
    [apply, send],
  )

  // Page -> host: keep the Step buttons in step with what the user does inside the frame (Next, submit).
  useEffect(() => {
    const onStatus = (event: Event) => {
      const { step } = (event as CustomEvent<{ step: SignupStep }>).detail
      if (step !== stateRef.current.step) apply({ ...stateRef.current, step })
    }
    window.addEventListener(SIGNUP_PREVIEW_STATUS_EVENT, onStatus)
    return () => window.removeEventListener(SIGNUP_PREVIEW_STATUS_EVENT, onStatus)
  }, [apply])

  const applyCustom = () => {
    const width = Number(customWidth), height = Number(customHeight)
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return
    const clamp = (v: number) => Math.min(CUSTOM_LIMITS.max, Math.max(CUSTOM_LIMITS.min, Math.round(v)))
    switchDevice({ id: "custom", label: "Custom", width: clamp(width), height: clamp(height) })
  }
  const numberInput = "w-16 border border-[#b89a63] bg-white/60 px-1.5 py-0.5 text-[#3a2c1a]"

  return (
    <div data-dev-preview className="fixed inset-0 z-50 flex flex-col bg-[#14161f]">
      {/* Controls live OUTSIDE the simulated viewport. */}
      <div className="max-h-[45vh] shrink-0 space-y-2 overflow-y-auto border-b border-[#c9ad77] bg-[#f6ecd2] py-2.5 pr-3 pl-16 font-ui text-[12px] text-[#3a2c1a]">
        <div className={rowClass}>
          <span className="parch-label mr-1">Device</span>
          <DeviceButtons value={device.id} showSize onSelect={(next) => (next === "desktop" ? exitDevicePreview() : switchDevice(next))} />
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
          <span className="parch-label mr-1">Step</span>
          {([1, 2, 3] as const).map((s) => (
            <button key={s} type="button" onClick={() => update({ step: s })} aria-pressed={state.step === s} className={buttonClass(state.step === s)}>
              ขั้นตอน {s}
            </button>
          ))}
          {state.step === 2 && (
            <>
              <label className="ml-2 flex items-center gap-1.5">
                <input type="checkbox" className="parch-check" checked={state.showApiError} onChange={(e) => update({ showApiError: e.target.checked })} />
                แสดงข้อผิดพลาดจากเซิร์ฟเวอร์
              </label>
              <label className="flex items-center gap-1.5">
                <input type="checkbox" className="parch-check" checked={state.showLoading} onChange={(e) => update({ showLoading: e.target.checked })} />
                แสดงสถานะกำลังสร้างบัญชี
              </label>
            </>
          )}
        </div>
      </div>

      {/* The simulated viewport. If it is larger than the available area, this area scrolls: the viewport is never shrunk. */}
      <div className="flex flex-1 overflow-auto p-5">
        <div className="m-auto shrink-0 outline outline-1 outline-[#c9ad77]/60" style={{ width: device.width, height: device.height }}>
          <iframe
            ref={frameRef}
            src={src}
            title={`Signup preview ${device.width} × ${device.height}`}
            onLoad={() => {
              const win = frameRef.current?.contentWindow
              if (win) setReported([win.innerWidth, win.innerHeight])
            }}
            style={{ width: device.width, height: device.height, border: 0, display: "block", background: "#e0cfa5" }}
          />
        </div>
      </div>
    </div>
  )
}
