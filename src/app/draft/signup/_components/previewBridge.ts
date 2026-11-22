import { DEV_PREVIEW_ENABLED } from "../../landing/_components/draft-tools/devPreviewFlag"
import { VERIFY_PREVIEW_OPTIONS } from "../_mock/verify"

/**
 * Signup's part of the developer device preview. The device preview itself (route params ?device= &w= &h= &embed=, usePreviewRoute,
 * switchDevice, DeviceButtons, ...) is the landing draft's and is reused as-is. Only the signup "Preview state" lives here:
 *
 *   &step=1|2|3 &err=1 &loading=1 &verify=<id>
 *
 * `verify` is the state of the step 3 email-verification modal (an id from VERIFY_PREVIEW_OPTIONS, default "code"); only written on step 3.
 *
 * Host -> embedded page travels as a CustomEvent on the iframe's window (same origin), the embedded page reports its step back.
 */

export type SignupStep = 1 | 2 | 3

export interface SignupPreviewState {
  step: SignupStep
  showApiError: boolean
  showLoading: boolean
  /** Step 3 modal state: an id of VERIFY_PREVIEW_OPTIONS. */
  verify: string
}

export const SIGNUP_PREVIEW_SET_EVENT = "draft-signup-preview-set"
export const SIGNUP_PREVIEW_STATUS_EVENT = "draft-signup-preview-status"

const STATE_KEYS = ["step", "err", "loading", "verify"]

export function readSignupState(search: string): SignupPreviewState {
  const p = new URLSearchParams(search)
  const stepNum = Number(p.get("step"))
  return {
    step: stepNum === 2 || stepNum === 3 ? stepNum : 1,
    showApiError: p.get("err") === "1",
    showLoading: p.get("loading") === "1",
    verify: VERIFY_PREVIEW_OPTIONS.find((o) => o.id === p.get("verify"))?.id ?? "code",
  }
}

export function writeSignupStateParams(p: URLSearchParams, s: SignupPreviewState) {
  for (const key of STATE_KEYS) p.delete(key)
  if (s.step !== 1) p.set("step", String(s.step))
  if (s.showApiError) p.set("err", "1")
  if (s.showLoading) p.set("loading", "1")
  if (s.step === 3 && s.verify !== "code") p.set("verify", s.verify)
}

/** The URL the host loads in its iframe: the real signup route, flagged as embedded, with the current state (no device parameters). */
export function buildSignupEmbedUrl(s: SignupPreviewState): string {
  const p = new URLSearchParams()
  p.set("embed", "1")
  writeSignupStateParams(p, s)
  return `/draft/signup?${p.toString()}`
}

export { DEV_PREVIEW_ENABLED }
