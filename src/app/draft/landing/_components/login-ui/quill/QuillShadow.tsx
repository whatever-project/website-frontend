import { QUILL_SRC } from "../../../_utils/assets"
import styles from "./Quill.module.css"

/**
 * The quill's cast shadow ON THE PAPER, clipped to the parchment outline (the flat sheet plus the wider bottom roll) so
 * nothing is cast onto the dark backdrop. It replays the same drift/sway animation classes as QuillFeather, with identical
 * geometry and timing, so it stays in step with it. Render it BEFORE the form (so the form paints above it) and inside the
 * dialog box, whose size the 3D engine keeps equal to the parchment's.
 */
export default function QuillShadow({ visible }: { visible: boolean }) {
  return (
    <>
      {/* Warm-brown silhouette filters (no pure black): blur the image's alpha, then fill it with brown. Static; only the
          elements' opacity/transform are animated. */}
      <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
        <filter id="quillShadowSharp" x="-5%" y="-5%" width="110%" height="110%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.4" result="blur" />
          <feFlood floodColor="#3a2210" />
          <feComposite in2="blur" operator="in" />
        </filter>
        <filter id="quillShadowSoft" x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="5.5" result="blur" />
          <feFlood floodColor="#3f2a2c" />
          <feComposite in2="blur" operator="in" />
        </filter>
      </svg>
      <div className={styles.quillShadowClip} aria-hidden="true">
        <div className={styles.quillShadowFade}>
          <div className={`${styles.quill} ${visible ? styles.quillShown : ""}`}>
            <div className={styles.quillDrift}>
              <div className={styles.quillSway}>
                <div className={styles.quillShadowRig}>
                  {/* .quillShadowProject: static projection (shear about the nib) toward the key light's direction */}
                  <div className={styles.quillShadowProject}>
                    {/* eslint-disable @next/next/no-img-element -- decorative copies of the static quill PNG */}
                    <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={`${styles.quillShadowImage} ${styles.quillShadowSoft}`} />
                    <img src={QUILL_SRC} alt="" draggable={false} decoding="async" className={`${styles.quillShadowImage} ${styles.quillShadowSharp}`} />
                    {/* eslint-enable @next/next/no-img-element */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
