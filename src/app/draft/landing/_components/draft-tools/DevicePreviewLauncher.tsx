"use client"

import DeviceButtons from "./DeviceButtons"
import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"
import { enterDevicePreview, type PreviewSnapshot } from "./previewRoute"

/**
 * Developer-only pill at the top of the normal landing page (while the login is closed): pick a device to leave the normal page and
 * inspect the real page at that viewport size. The login dialog has the same buttons in its Preview panel. Never rendered in production.
 */
export default function DevicePreviewLauncher({ snapshot }: { snapshot: PreviewSnapshot }) {
  if (!DEV_PREVIEW_ENABLED) return null
  return (
    <div
      data-dev-preview
      className="fixed top-3 left-1/2 z-30 flex -translate-x-1/2 flex-wrap items-center justify-center gap-1.5 border border-[#c9ad77] bg-[#f6ecd2]/90 px-2.5 py-1.5 font-ui text-[12px] text-[#3a2c1a] shadow"
    >
      <span className="parch-label mr-1">Device</span>
      <DeviceButtons value="desktop" onSelect={(device) => device !== "desktop" && enterDevicePreview(device, snapshot)} />
    </div>
  )
}
