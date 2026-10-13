import type { ReactNode } from "react"

export default function SectionTitle({ children }: { children: ReactNode }) {
  return <h2 className="font-jimthompson text-2xl text-[#3a2c1a]">{children}</h2>
}
