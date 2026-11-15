// Size of the login "paper", in one place. Used by the 3D engine (scrollLoginAnimation.ts) and by the flat fallback card (via
// shared/useFlatSheetSize.ts), so the flat card always has exactly the same width and height as the scroll.
//
// This file must not import three.js: the engine is loaded on demand to keep three.js out of the landing bundle, this file is not.

// Sheet footprint in model units (from the GLB's POSITION accessor bounds; x: -2.14..2.14, y: -2.73..2.56).
export const SHEET_WIDTH = 4.28
export const SHEET_HEIGHT = 5.29

// On-screen height of the flat sheet: a fraction of the container height (0.49 -> ~455 px on a 928 px viewport),
// but never so small that the login form no longer fits, and never taller than the container.
export const SHEET_VIEWPORT_FRACTION = 0.49
const MIN_SHEET_PX = 445
const MAX_SHEET_FRACTION = 0.92

// The sheet is made taller by this factor on every screen (+10%): both the viewport fraction and the minimum height above are
// multiplied by it. The sheet WIDTH in pixels is kept as it was before this boost (see widthScale below), so the paper
// gets slimmer instead of just bigger.
const SHEET_TALLER = 1.1

// Tablet windows (portrait iPads etc.): the paper is a fraction of the window height but the form inside has a fixed height, so on a tall
// window the empty band above the title and below the sign-up line grows (about 58px at 768x1024, 96px at 820x1180, against 34px on a
// 1280x928 desktop). On windows between these widths the viewport-driven part of the height is multiplied by SHEET_TABLET_HEIGHT_SCALE
// (-8%, about 20px less above and below at every tablet size), never going below the minimum sheet. The width in px is NOT changed.
// 640px and 979px are the repo's own breakpoints (the flat card padding step, and where the quill is hidden); phones (< 640px) and
// desktop / landscape tablets (>= 980px) keep the original sizes.
const TABLET_MIN_WIDTH = 640
const TABLET_MAX_WIDTH = 979
const SHEET_TABLET_HEIGHT_SCALE = 0.92

// Share of the sheet height that is flat paper; the bottom roll is the rest (9.09%). The login form is centred in the flat part.
const FLAT_PAPER_RATIO = 0.9091

// Extra sheet height (px) on every screen, for the extra margins inside the login form (classic/ClassicLoginLayout.module.css):
// the 2rem top margin of the title (`--heading-margin-top`, 16px more than the previous 1rem) and the 0.5rem bottom margin of the
// "ยังไม่มีบัญชี?" line (`--prompt-margin-bottom`, 8px). The form is centred in the flat-paper area, so 24px more content needs
// 24 / 0.9091 = 26.4px more sheet: the gaps above and below the form (and to the bottom roll) stay exactly as they were.
// Keep the number in sync with those two variables.
const SHEET_EXTRA_PX = 26.4

// Before the boost the sheet was stretched horizontally by this factor (+20%). Only X is scaled: the roll cylinders just get longer
// (their round cross-section is in the YZ plane) and the paper texture stretches by the same amount; the animation is untouched.
// That stretch is reduced (down to 1) so the sheet never gets wider than this fraction of the container: phones keep the same width.
const SHEET_WIDTH_SCALE = 1.2
const SHEET_MAX_WIDTH_FRACTION = 0.96

export interface SheetLayoutResult {
  /** On-screen height of the whole sheet (flat paper + bottom roll), in CSS px. */
  sheetPx: number
  /** On-screen width of the sheet, in CSS px. Does not depend on `noticeExtraPx`. */
  widthPx: number
  /** Horizontal scale to apply to the (taller) 3D model so that it is `widthPx` wide. */
  widthScale: number
}

/**
 * @param containerWidth  width of the area the paper is shown in (the dialog backdrop), CSS px
 * @param containerHeight height of that area, CSS px
 * @param noticeExtraPx   extra height (px) the login message currently adds to the form (0 when there is none). The paper grows by
 *                        that amount / 0.9091 so the gaps around the form stay what they are without a message.
 */
export function computeSheetLayout(containerWidth: number, containerHeight: number, noticeExtraPx = 0): SheetLayoutResult {
  const width = Math.max(1, containerWidth)
  const height = Math.max(1, containerHeight)
  // Sheet height before the extra room for the margins and the message; the width below is derived from this height.
  const heightBeforeExtra = Math.min(
    Math.max(height * SHEET_VIEWPORT_FRACTION * SHEET_TALLER, MIN_SHEET_PX * SHEET_TALLER),
    height * MAX_SHEET_FRACTION,
  )
  // Tablet windows: a bit shorter (see SHEET_TABLET_HEIGHT_SCALE). Only the height is trimmed; the width below keeps using
  // `heightBeforeExtra`, so it does not change.
  const isTablet = width >= TABLET_MIN_WIDTH && width <= TABLET_MAX_WIDTH
  const trimmedBeforeExtra = isTablet
    ? Math.min(heightBeforeExtra, Math.max(heightBeforeExtra * SHEET_TABLET_HEIGHT_SCALE, MIN_SHEET_PX * SHEET_TALLER))
    : heightBeforeExtra
  const sheetPx = Math.min(trimmedBeforeExtra + SHEET_EXTRA_PX + Math.max(0, noticeExtraPx) / FLAT_PAPER_RATIO, height * MAX_SHEET_FRACTION)
  // Keep the width the sheet had before it was made SHEET_TALLER times taller (and before the extra height): take the height it
  // had then, stretch that sheet as wide as SHEET_WIDTH_SCALE allows while it still fits inside the container, and express that
  // width as a scale of the (now taller, so wider) unscaled model. About +4% of the model width on a 1280x928 window, about
  // -14% on a 375 px phone.
  const basisUnscaledWidthPx = (SHEET_WIDTH * (heightBeforeExtra / SHEET_TALLER)) / SHEET_HEIGHT
  const basisStretch = Math.min(SHEET_WIDTH_SCALE, Math.max(1, (width * SHEET_MAX_WIDTH_FRACTION) / basisUnscaledWidthPx))
  const widthPx = basisUnscaledWidthPx * basisStretch
  const widthScale = widthPx / ((SHEET_WIDTH * sheetPx) / SHEET_HEIGHT)
  return { sheetPx, widthPx, widthScale }
}
