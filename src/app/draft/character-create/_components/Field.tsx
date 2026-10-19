import type { ReactNode } from "react"

interface FieldProps {
  id: string
  label: string
  hint?: string
  className?: string
  children: ReactNode
}

/** parch-label + control + optional hint line, wired with htmlFor/id. */
export default function Field({ id, label, hint, className = "", children }: FieldProps) {
  return (
    <div className={className}>
      <label htmlFor={id} className="parch-label mb-1.5 block">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 font-ui text-[11.5px] text-[#a68d5f]">{hint}</p>}
    </div>
  )
}
