import { QUILL_SRC } from "../../_utils/assets"
import styles from "./Quill.module.css"

/**
 * Decorative 2D quill (separate from the 3D scene): enters at ~68% of the unroll, drifts while open, leaves as soon as the
 * close starts. Purely visual: aria-hidden and pointer-events none. Nested layers, each owning different transform
 * properties so no animation overwrites another:
 *   .quill (position + entrance/exit) > .quillDrift (organic path) > .quillSway (tilt about the nib) > img (tiny shaft flex).
 * Its cast shadow on the paper is the separate, paper-clipped chain in QuillShadow.tsx. Render it AFTER the form.
 */
export default function QuillFeather({ visible }: { visible: boolean }) {
  return (
    <div className={`${styles.quill} ${visible ? styles.quillShown : ""}`} aria-hidden="true">
      <div className={styles.quillDrift}>
        <div className={styles.quillSway}>
          {/* eslint-disable-next-line @next/next/no-img-element -- static decorative PNG; cropped/sized with CSS */}
          <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={styles.quillImage} />
        </div>
      </div>
    </div>
  )
}
