"use client"

import { useCallback, useEffect, useId, useState, type ReactNode } from "react"

const STORAGE_KEY = "draft-preview-collapsed"

/**
 * Collapsed / expanded state of the draft-only "Preview state" panels. Starts expanded (same on the server and the first client render);
 * the choice is remembered in localStorage so it survives reloads and moving between the draft pages that use it.
 */
export function usePreviewCollapsed(): [boolean, () => void] {
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    try {
      if (localStorage.getItem(STORAGE_KEY) === "1") setCollapsed(true)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setCollapsed((current) => {
      const next = !current
      try {
        localStorage.setItem(STORAGE_KEY, next ? "1" : "0")
      } catch {}
      return next
    })
  }, [])

  return [collapsed, toggle]
}

/**
 * The panel's title row with a collapse button, and the body that is hidden while collapsed.
 * Usage: <PreviewCollapsible title="Preview state (draft only)">...rows...</PreviewCollapsible> inside the panel's own box
 * (the box keeps its `fixed` position and look; collapsed, it shrinks to the title row).
 */
export function PreviewCollapsible({ title, children }: { title: string; children: ReactNode }) {
  const [collapsed, toggle] = usePreviewCollapsed()
  const bodyId = useId()
  return (
    <>
      {/* The button comes first (left): on phones the floating "Back to dev tools" pill sits over the bottom-right corner. Collapsed, the title is
          shortened so the whole pill stays clear of it. */}
      <div className={`flex items-center gap-3 ${collapsed ? "" : "mb-1.5"}`}>
        <button
          type="button"
          onClick={toggle}
          aria-expanded={!collapsed}
          aria-controls={bodyId}
          aria-label={collapsed ? "ขยาย Preview state" : "ย่อ Preview state"}
          title={collapsed ? "ขยาย" : "ย่อ"}
          className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center border border-[#b89a63] text-[#6b5533] hover:border-[#8a6a35] hover:text-[#3a2c1a]"
        >
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <p className="parch-label">{collapsed ? title.split(" ")[0] : title}</p>
      </div>
      <div id={bodyId} hidden={collapsed}>
        {children}
      </div>
    </>
  )
}
