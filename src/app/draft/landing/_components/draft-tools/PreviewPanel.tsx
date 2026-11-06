"use client"

import { LOGIN_STATE_OPTIONS, LOGIN_UI_OPTIONS, type LoginState, type LoginUiVariant } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import styles from "./PreviewPanel.module.css"
import DeviceButtons from "./DeviceButtons"
import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"
import { enterDevicePreview } from "./previewRoute"
import { buttonClass } from "./previewStyles"

// The variant / mode / device switches are design-review tools: they exist in development only and never in a production build.
const SHOW_UI_VARIANT_TOGGLE = DEV_PREVIEW_ENABLED

/** Note shown next to the Mode switch. The flat fallback card exists for the original UI only (the new UI has no fallback design). */
export function getModeNote(flat: boolean, sceneError: boolean, uiVariant: LoginUiVariant): string | null {
  if (flat && sceneError) return "WebGL ใช้ไม่ได้ — กำลังแสดง Flat fallback จริง (ไม่ได้บังคับ)"
  if (flat && uiVariant === "new") return "Flat fallback รองรับเฉพาะ UI เดิม — กำลังแสดง UI เดิม (UI ใหม่ยังไม่มีการ์ดสำรอง)"
  return null
}

interface PreviewPanelProps {
  state: LoginState
  onStateChange: (state: LoginState) => void
  uiVariant: LoginUiVariant
  onUiVariantChange: (variant: LoginUiVariant) => void
  /** Language of the login dialog (TH/EN), switchable for both UI versions. */
  lang: DraftLang
  onLangChange: (lang: DraftLang) => void
  /** True while the flat fallback card is what is shown (a real 3D failure OR the preview switch below). */
  flat: boolean
  /** True when the 3D scene really failed to start (WebGL / model): the flat card is then the only option, so "3D scroll" is disabled. */
  sceneError: boolean
  /** Preview switch: true forces the existing flat fallback card, false returns to the 3D scroll (no reload). */
  onForceFlatChange: (force: boolean) => void
}

/**
 * Draft-only controls at the bottom-left: the login preview states (existing) and the UI variant switch
 * ("UI เดิม" = classic, "UI ใหม่" = new: same layout with underlined inputs). Both only change props; nothing is remounted.
 * The "Mode" row switches between the 3D scroll and the existing flat fallback card (preview only; it reuses the real fallback).
 */
export default function PreviewPanel({
  state,
  onStateChange,
  uiVariant,
  onUiVariantChange,
  lang,
  onLangChange,
  flat,
  sceneError,
  onForceFlatChange,
}: PreviewPanelProps) {
  // The flat fallback card exists for the original UI only. Say so when the new UI is selected (the selection is kept for 3D mode).
  const modeNote = getModeNote(flat, sceneError, uiVariant)
  // Device preview: leave the normal page and inspect the real page at a mobile / tablet viewport (the login stays open with these selections).
  const deviceToggle = SHOW_UI_VARIANT_TOGGLE && (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2">
      <span className="parch-label mr-1">Device</span>
      <DeviceButtons
        value="desktop"
        onSelect={(device) =>
          device !== "desktop" &&
          enterDevicePreview(device, { loginOpen: true, uiVariant, uiLang: lang, loginState: state, forceFlat: flat && !sceneError })
        }
      />
    </div>
  )
  const modeToggle = SHOW_UI_VARIANT_TOGGLE && (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2">
      <span className="parch-label mr-1">Mode</span>
      <button
        type="button"
        onClick={() => onForceFlatChange(false)}
        aria-pressed={!flat}
        disabled={sceneError}
        title={sceneError ? "WebGL ใช้ไม่ได้ จึงสลับกลับ 3D ไม่ได้" : undefined}
        className={`${buttonClass(!flat)} disabled:cursor-not-allowed disabled:opacity-40`}
      >
        3D scroll
      </button>
      <button type="button" onClick={() => onForceFlatChange(true)} aria-pressed={flat} className={buttonClass(flat)}>
        Flat fallback
      </button>
      {modeNote && (
        <p role="status" className="basis-full text-[11px] leading-snug text-[#8a2a1f]">
          {modeNote}
        </p>
      )}
    </div>
  )

  const uiToggle = SHOW_UI_VARIANT_TOGGLE && (
    <>
      <span className="parch-label mr-1">UI</span>
      {LOGIN_UI_OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onUiVariantChange(option.value)}
          aria-pressed={uiVariant === option.value}
          className={buttonClass(uiVariant === option.value)}
        >
          {option.label}
        </button>
      ))}
      <span className="parch-label mx-1">Lang</span>
      {(["th", "en"] as const).map((code) => (
        <button key={code} type="button" onClick={() => onLangChange(code)} aria-pressed={lang === code} className={buttonClass(lang === code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </>
  )

  return (
    <>
      {/* Narrow screens: the UI switch is a separate pill at the top, so the panel stays short and never covers the sign-up
          link under the scroll. */}
      {uiToggle && (
        <div
          className={`${styles.panel} fixed top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 border border-[#c9ad77] bg-[#f6ecd2]/95 px-2.5 py-1.5 font-ui text-[12px] text-[#3a2c1a] shadow sm:hidden`}
          onClick={(event) => event.stopPropagation()}
        >
          {uiToggle}
        </div>
      )}

      {/* Preview state (draft only) */}
      <div
        className={`${styles.panel} fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow`}
        onClick={(event) => event.stopPropagation()}
      >
        <p className="parch-label mb-1.5">Preview state (draft only)</p>
        <div className="flex flex-wrap gap-1.5">
          {LOGIN_STATE_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => onStateChange(option.value)}
              aria-pressed={state === option.value}
              className={buttonClass(state === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        {/* Preview mode (draft only): 3D scroll <-> the existing flat fallback card. */}
        {modeToggle}
        {/* Preview device (draft only): desktop <-> mobile / tablet viewport. */}
        {deviceToggle}
        {/* Wide screens: the UI switch is a row in this panel. */}
        {uiToggle && (
          <div className="mt-2 hidden flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2 sm:flex">{uiToggle}</div>
        )}
      </div>
    </>
  )
}
