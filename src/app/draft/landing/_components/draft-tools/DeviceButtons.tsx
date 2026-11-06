"use client"

import { DEVICE_PRESETS, type DeviceId, type DeviceSpec } from "./previewRoute"
import { buttonClass } from "./previewStyles"

const SHORT_LABEL: Record<DeviceSpec["id"], string> = { "mobile-s": "Mobile S", "mobile-m": "Mobile M", "mobile-l": "Mobile L", tablet: "Tablet", custom: "Custom" }

interface DeviceButtonsProps {
  /** The device that is currently shown ("desktop" = the normal page). */
  value: DeviceId
  /** Called with "desktop" or a preset. */
  onSelect: (device: "desktop" | DeviceSpec) => void
  /** Also print the size (e.g. 390×844) inside each button. */
  showSize?: boolean
}

/** Device preset buttons shared by the launcher on the landing page, the in-dialog PreviewPanel and the device preview host. */
export default function DeviceButtons({ value, onSelect, showSize = false }: DeviceButtonsProps) {
  return (
    <>
      <button type="button" onClick={() => onSelect("desktop")} aria-pressed={value === "desktop"} className={buttonClass(value === "desktop")} title="Desktop: the normal browser viewport">
        Desktop
      </button>
      {DEVICE_PRESETS.map((device) => (
        <button
          key={device.id}
          type="button"
          onClick={() => onSelect(device)}
          aria-pressed={value === device.id}
          className={buttonClass(value === device.id)}
          title={`${device.label} ${device.width} × ${device.height}`}
        >
          {SHORT_LABEL[device.id]}
          {showSize && <span className="ml-1 opacity-70">{device.width}×{device.height}</span>}
        </button>
      ))}
    </>
  )
}
