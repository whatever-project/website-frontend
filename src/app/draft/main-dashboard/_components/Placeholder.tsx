import type { CSSProperties, ReactNode } from "react"

interface PlaceholderProps {
  /** text inside the tag, e.g. "[ภาพกิจกรรม]" */
  tag?: ReactNode
  className?: string
  style?: CSSProperties
  children?: ReactNode
}

/** The wireframe's diagonal-hatched image placeholder (.ph) with an optional centred label (.ph-tag). */
export default function Placeholder({ tag, className = "", style, children }: PlaceholderProps) {
  return (
    <div className={`ph ${className}`.trim()} style={style}>
      {tag !== undefined && <span className="ph-tag">{tag}</span>}
      {children}
    </div>
  )
}
