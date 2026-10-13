import type { ReactNode } from "react"
import { SheetCorners } from "@/components/Parchment"

export default function Section({ children }: { children: ReactNode }) {
  return (
    <div className="parch-sheet relative p-7 sm:p-9">
      <SheetCorners />
      {children}
    </div>
  )
}
