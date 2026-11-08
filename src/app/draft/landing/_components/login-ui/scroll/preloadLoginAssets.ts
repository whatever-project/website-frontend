import { preload } from "react-dom"
import { PARCHMENT_GLB_URL, QUILL_SRC } from "../../../_utils/assets"

/**
 * Network hints for the two heavy login assets, so the browser starts downloading them as early as possible.
 *
 * Call it while the landing page renders (it also runs during server rendering): React then writes `<link rel="preload">` into the
 * HTML head, so the downloads begin at HTML-parse time, BEFORE hydration and before the engine chunk has loaded. `preloadScrollLogin()`
 * (useScrollLoginAnimation.ts) only starts after hydration and a dynamic import, which in a slow or dev environment can be seconds
 * later, so without this the 53 MB model started downloading only when the visitor clicked Login.
 *
 * Both are low priority so they do not compete with the backdrop image, the fonts or the page's own scripts.
 * The quill is only shown from 980px wide (Quill.module.css hides it below), so it is not preloaded on narrower windows.
 */
export function preloadLoginAssets() {
  // `crossOrigin: "anonymous"` = same-origin credentials mode, which is what GLTFLoader's fetch uses, so the preloaded response is reused.
  // `fetchPriority: "low"` matters: measured under a throttled network and CPU, the same preload at normal priority competed with
  // hydration and the page's scripts: the model finished at 60 s instead of 22 s and the main thread was blocked for 12 s.
  preload(PARCHMENT_GLB_URL, { as: "fetch", crossOrigin: "anonymous", fetchPriority: "low" })
  preload(QUILL_SRC, { as: "image", fetchPriority: "low", media: "(min-width: 980px)" })
}
