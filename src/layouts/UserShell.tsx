import { ParchShell } from "@/components/Parchment"
import type { ReactNode } from "react"

interface UserShellProps {
  children: ReactNode
  title?: string
  sub?: string
  backHref?: string
}

/**
 * Shell for authenticated user pages (/dashboard, /account).
 * Defaults to linking back to the landing page.
 */
export default function UserShell({ children, title, sub, backHref = "/" }: UserShellProps) {
  if (!title) {
    return <>{children}</>
  }
  return (
    <ParchShell title={title} sub={sub ?? ''} backHref={backHref}>
      {children}
    </ParchShell>
  )
}
