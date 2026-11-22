"use client"

import { LOGIN_STATE_OPTIONS, type LoginState } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import { VERIFY_PREVIEW_OPTIONS } from "../../../signup/_mock/verify"
import styles from "./PreviewPanel.module.css"
import DeviceButtons from "./DeviceButtons"
import { DEV_PREVIEW_ENABLED } from "./devPreviewFlag"
import { enterDevicePreview } from "./previewRoute"
import { buttonClass } from "./previewStyles"
import { PreviewCollapsible } from "./PreviewCollapse"

// The language / mode / device switches are design-review tools: they exist in development only and never in a production build.
const SHOW_PREVIEW_TOOLS = DEV_PREVIEW_ENABLED

/** Note shown next to the Mode switch: only when the real flat fallback is showing because WebGL is unavailable (not forced). */
export function getModeNote(flat: boolean, sceneError: boolean): string | null {
  if (flat && sceneError) return "WebGL ใช้ไม่ได้ — กำลังแสดง Flat fallback จริง (ไม่ได้บังคับ)"
  return null
}

interface PreviewPanelProps {
  state: LoginState
  onStateChange: (state: LoginState) => void
  /** Language of the login dialog (TH/EN). */
  lang: DraftLang
  onLangChange: (lang: DraftLang) => void
  /** True while the flat fallback card is what is shown (a real 3D failure OR the preview switch below). */
  flat: boolean
  /** True when the 3D scene really failed to start (WebGL / model): the flat card is then the only option, so "3D scroll" is disabled. */
  sceneError: boolean
  /** Preview switch: true forces the existing flat fallback card, false returns to the 3D scroll (no reload). */
  onForceFlatChange: (force: boolean) => void
  /** True while the email-verification dialog is open: its own preview states (wrong code, locked, ...) are then listed. */
  verifyOpen?: boolean
  /** Id (VERIFY_PREVIEW_OPTIONS) of the verification state last chosen here: that button is shown selected. */
  verifyActiveId?: string
  onVerifyPreview?: (id: string) => void
}

/**
 * Draft-only controls at the bottom-left: the login preview states (existing) and the language switch. Both only change props;
 * nothing is remounted. The "Mode" row switches between the 3D scroll and the existing flat fallback card (preview only; it reuses the real fallback).
 */
export default function PreviewPanel({
  state,
  onStateChange,
  lang,
  onLangChange,
  flat,
  sceneError,
  onForceFlatChange,
  verifyOpen = false,
  verifyActiveId,
  onVerifyPreview,
}: PreviewPanelProps) {
  const modeNote = getModeNote(flat, sceneError)
  // Device preview: leave the normal page and inspect the real page at a mobile / tablet viewport (the login stays open with these selections).
  const deviceToggle = SHOW_PREVIEW_TOOLS && (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2">
      <span className="parch-label mr-1">Device</span>
      <DeviceButtons
        value="desktop"
        onSelect={(device) =>
          device !== "desktop" &&
          enterDevicePreview(device, { loginOpen: true, uiLang: lang, loginState: state, forceFlat: flat && !sceneError })
        }
      />
    </div>
  )
  const modeToggle = SHOW_PREVIEW_TOOLS && (
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

  const langToggle = SHOW_PREVIEW_TOOLS && (
    <>
      <span className="parch-label mr-1">Lang</span>
      {(["th", "en"] as const).map((code) => (
        <button key={code} type="button" onClick={() => onLangChange(code)} aria-pressed={lang === code} className={buttonClass(lang === code)}>
          {code.toUpperCase()}
        </button>
      ))}
    </>
  )

  return (
    <>
      {/* Narrow screens: the language switch is a separate pill at the top, so the panel stays short and never covers the sign-up
          link under the scroll. */}
      {langToggle && (
        <div
          className={`${styles.panel} fixed top-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1.5 border border-[#c9ad77] bg-[#f6ecd2]/95 px-2.5 py-1.5 font-ui text-[12px] text-[#3a2c1a] shadow sm:hidden`}
          onClick={(event) => event.stopPropagation()}
        >
          {langToggle}
        </div>
      )}

      {/* Preview state (draft only) */}
      <div
        className={`${styles.panel} fixed bottom-3 left-3 z-50 max-w-[calc(100vw-1.5rem)] border border-[#c9ad77] bg-[#f6ecd2]/95 p-3 font-ui text-[12px] text-[#3a2c1a] shadow`}
        onClick={(event) => event.stopPropagation()}
      >
        <PreviewCollapsible title="Preview state (draft only)">
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
        {/* Email-verification dialog states (draft only), listed while the dialog is open. The correct code is 123456. */}
        {verifyOpen && onVerifyPreview && (
          <div className="mt-2 border-t border-[#c9ad77]/60 pt-2">
            <p className="parch-label mb-1">หน้าต่างยืนยันอีเมล (รหัสที่ถูกต้อง: 123456)</p>
            <div className="flex flex-wrap gap-1.5">
              {VERIFY_PREVIEW_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => onVerifyPreview(option.id)}
                  aria-pressed={verifyActiveId === option.id}
                  className={buttonClass(verifyActiveId === option.id)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {/* Preview mode (draft only): 3D scroll <-> the existing flat fallback card. */}
        {modeToggle}
        {/* Preview device (draft only): desktop <-> mobile / tablet viewport. */}
        {deviceToggle}
        {/* Wide screens: the language switch is a row in this panel. */}
        {langToggle && (
          <div className="mt-2 hidden flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2 sm:flex">{langToggle}</div>
        )}
        </PreviewCollapsible>
      </div>
    </>
  )
}
