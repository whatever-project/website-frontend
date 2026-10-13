import { ParchShell } from "@/components/ParchmentNew"
import type { ReactNode } from "react"

interface PublicShellProps {
  children: ReactNode
  title?: string
  sub?: string
  backHref?: string
}

/**
 * Shell for public (unauthenticated) pages.
 * Wraps content with ParchShell; landing page bypasses this by rendering
 * its own full-screen layout independently (PublicShell passes children through).
 */
export default function PublicShell({ children, title, sub, backHref }: PublicShellProps) {
  if (!title) {
    // Landing page path: no shell wrapping, render children directly
    return <>{children}</>
  }
  return (
    <ParchShell title={title} sub={sub ?? ''} backHref={backHref}>
      {children}
    </ParchShell>
  )
}
