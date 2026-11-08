"use client"

import { useLayoutEffect, type RefObject } from "react"
import { computeSheetLayout } from "../scroll/sheetLayout"

/**
 * Gives the flat fallback card exactly the size of the 3D paper.
 *
 * The 3D engine publishes the paper size as `--sheet-w` / `--sheet-h` (px) on the dialog root. When the flat card is shown the engine
 * may not be running at all (WebGL failed), so the same numbers are computed here from the same function the engine uses
 * (scroll/sheetLayout.ts) and published under the same variable names; the card's CSS reads them (classic/ClassicLoginLayout.module.css).
 * `noticeExtraPx` is the height the login message adds to the form (useNoticeExtra), so the card grows with it exactly like the paper.
 *
 * The variables are left on the root when this stops (the 3D box needs them right away when switching back, and they are equal to
 * the engine's values).
 */
export function useFlatSheetSize(rootRef: RefObject<HTMLElement | null>, enabled: boolean, noticeExtraPx: number) {
  useLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !enabled) return

    const apply = () => {
      const { sheetPx, widthPx } = computeSheetLayout(root.clientWidth, root.clientHeight, noticeExtraPx)
      root.style.setProperty("--sheet-w", `${widthPx}px`)
      root.style.setProperty("--sheet-h", `${sheetPx}px`)
    }
    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(root)
    return () => observer.disconnect()
  }, [rootRef, enabled, noticeExtraPx])
}
