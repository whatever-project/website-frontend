import { QUILL_SRC } from "../../../_utils/assets"
import styles from "./Quill.module.css"

/**
 * The quill's cast shadow on the BACKDROP (the dimmed village behind the parchment), for the part of the quill that sticks out
 * past the paper. QuillShadow.tsx draws the shadow on the paper; this one is the same light falling further, onto the 3D scene's
 * shadow-catcher plane behind the sheet, so it matches the parchment's own shadow there: same direction (right and down), same
 * near-black colour, lighter and softer than the shadow on the paper.
 *
 * Render it BEFORE the 3D stage: the canvas then paints the paper over it, so the shadow only shows where there is no paper
 * (exactly like the sheet hiding the backdrop). It replays the quill's drift/sway animation classes so it moves with the feather.
 * The box has the parchment's on-screen size and position (same as the dialog box), and inherits --quill-bottom from the modal root.
 */
export default function QuillBackdropShadow({ visible }: { visible: boolean }) {
  return (
    <div
      className={styles.quillBackdropBox}
      style={{ width: "var(--sheet-w, 74%)", height: "var(--sheet-h, 84%)" }}
      aria-hidden="true"
    >
      {/* Near-black silhouette, a little softer than the sharp shadow on the paper (the backdrop is further away). */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="quillBackdropShadow" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3.5" result="blur" />
          <feFlood floodColor="#10130d" />
          <feComposite in2="blur" operator="in" />
        </filter>
      </svg>
      <div className={`${styles.quill} ${visible ? styles.quillShown : ""}`}>
        <div className={styles.quillDrift}>
          <div className={styles.quillSway}>
            <div className={styles.quillBackdropRig}>
              <div className={`${styles.quillShadowRig} ${styles.quillBackdropMask}`}>
                <div className={styles.quillShadowProject}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- decorative copy of the static quill PNG */}
                  <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={`${styles.quillShadowImage} ${styles.quillBackdropImage}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
