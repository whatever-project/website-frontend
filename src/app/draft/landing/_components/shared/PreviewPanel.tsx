"use client"

import { LOGIN_STATE_OPTIONS, LOGIN_UI_OPTIONS, type LoginState, type LoginUiVariant } from "../../_mock/login"
import type { DraftLang } from "../../_mock/copy"
import styles from "./PreviewPanel.module.css"

// The variant switch is a design-review tool: it exists in development only and never in a production build.
const SHOW_UI_VARIANT_TOGGLE = process.env.NODE_ENV !== "production"

interface PreviewPanelProps {
  state: LoginState
  onStateChange: (state: LoginState) => void
  uiVariant: LoginUiVariant
  onUiVariantChange: (variant: LoginUiVariant) => void
  /** Language of the login dialog (TH/EN), switchable for both UI versions. */
  lang: DraftLang
  onLangChange: (lang: DraftLang) => void
}

const buttonClass = (active: boolean) =>
  `border px-2.5 py-1 ${active ? "border-[#5c1d17] bg-[#5c1d17] text-[#f3ddc0]" : "border-[#b89a63] text-[#6b5533]"}`

/**
 * Draft-only controls at the bottom-left: the login preview states (existing) and the UI variant switch
 * ("UI เดิม" = original, "UI ใหม่" = same layout with underlined inputs and Anupark). Both only change props; nothing is remounted.
 */
export default function PreviewPanel({ state, onStateChange, uiVariant, onUiVariantChange, lang, onLangChange }: PreviewPanelProps) {
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
        {/* Wide screens: the UI switch is a row in this panel. */}
        {uiToggle && (
          <div className="mt-2 hidden flex-wrap items-center gap-1.5 border-t border-[#c9ad77]/60 pt-2 sm:flex">{uiToggle}</div>
        )}
      </div>
    </>
  )
}
