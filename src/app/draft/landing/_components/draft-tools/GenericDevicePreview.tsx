"use client"

import { useState, type ReactNode } from "react"
import { usePathname } from "next/navigation"
import DeviceButtons from "./DeviceButtons"
import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"
import { buttonClass } from "./previewStyles"
import {
  CUSTOM_LIMITS,
  exitDevicePreview,
  replacePreviewSearch,
  switchDevice,
  usePreviewRoute,
  writeDeviceParams,
  type DeviceSpec,
} from "./previewRoute"

/**
 * Developer device preview for the draft pages that have no host of their own (forgot-password, reset-password, verify-email, account,
 * character-create, skeleton-mockup). Mounted once in app/draft/layout.tsx. Same URL scheme as the landing / signup drafts:
 *
 *   ?device=<preset>|custom[&w=&h=]   this route shows the host: toolbar + an iframe of the SAME route at exactly the device's CSS size
 *   ?embed=1                          this route IS the page inside that iframe (dev badge and page scrollbar hidden)
 *
 * Landing and signup have their own hosts (page-specific preview state), login is deliberately left out, dev-tools is the hub.
 * Development builds only (DEV_PREVIEW_ENABLED): in production this component renders its children and nothing else.
 */
const OWN_PREVIEW_PATHS = ["/draft/landing", "/draft/signup", "/draft/login", "/draft/dev-tools"]

const rowClass = "flex flex-wrap items-center gap-1.5"
const numberInput = "w-16 border border-[#b89a63] bg-white/60 px-1.5 py-0.5 text-[#3a2c1a]"

/** The URL the host loads in its iframe: this same route, flagged as embedded, without the device parameters. */
function buildEmbedSrc(pathname: string): string {
  const p = new URLSearchParams(window.location.search)
  for (const key of ["device", "w", "h"]) p.delete(key)
  p.set("embed", "1")
  return `${pathname}?${p.toString()}`
}

function Host({ device, pathname }: { device: DeviceSpec; pathname: string }) {
  const [src] = useState(() => buildEmbedSrc(pathname))
  const [customWidth, setCustomWidth] = useState(String(device.width))
  const [customHeight, setCustomHeight] = useState(String(device.height))
  const [reported, setReported] = useState<[number, number] | null>(null)

  const applyCustom = () => {
    const width = Number(customWidth), height = Number(customHeight)
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return
    const clamp = (v: number) => Math.min(CUSTOM_LIMITS.max, Math.max(CUSTOM_LIMITS.min, Math.round(v)))
    switchDevice({ id: "custom", label: "Custom", width: clamp(width), height: clamp(height) })
  }

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
      </div>

      {/* The simulated viewport. If it is larger than the available area, this area scrolls: the viewport is never shrunk. */}
      <div className="flex flex-1 overflow-auto p-5">
        <div className="m-auto shrink-0 outline outline-[#c9ad77]/60" style={{ width: device.width, height: device.height }}>
          <iframe
            src={src}
            title={`${pathname} preview ${device.width} × ${device.height}`}
            onLoad={(e) => {
              const win = e.currentTarget.contentWindow
              if (win) setReported([win.innerWidth, win.innerHeight])
            }}
            style={{ width: device.width, height: device.height, border: 0, display: "block", background: "#e0cfa5" }}
          />
        </div>
      </div>
    </div>
  )
}

export default function GenericDevicePreview({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const preview = usePreviewRoute()

  if (!DEV_PREVIEW_ENABLED || OWN_PREVIEW_PATHS.includes(pathname)) return <>{children}</>

  // Host: the real page in a device-sized iframe. The page itself is not mounted here (it lives in the iframe). Remounts per device.
  if (preview.device && !preview.embed) {
    return <Host key={`${preview.device.id}-${preview.device.width}x${preview.device.height}`} device={preview.device} pathname={pathname} />
  }

  return (
    <>
      {preview.embed && (
        <style>{`a[href="/draft/dev-tools"] { display: none !important; }
/* inside the device frame the document scrolls like a phone: no visible page scrollbar, full-width content (still scrollable) */
html { scrollbar-width: none; }
html::-webkit-scrollbar { display: none; width: 0; height: 0; }`}</style>
      )}
      {children}
      {!preview.embed && (
        <div
          data-dev-preview
          className="fixed top-3 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 border border-[#c9ad77] bg-[#f6ecd2]/90 px-2.5 py-1.5 font-ui text-[12px] text-[#3a2c1a] shadow"
        >
          <span className="parch-label mr-1">Device</span>
          <DeviceButtons
            value="desktop"
            onSelect={(device) => device !== "desktop" && replacePreviewSearch((p) => writeDeviceParams(p, device))}
          />
        </div>
      )}
    </>
  )
}
