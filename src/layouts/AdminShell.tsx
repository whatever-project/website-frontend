import type { ReactNode } from "react"

interface AdminShellProps {
  children: ReactNode
}

/**
 * Shell for admin pages (/admin/logs, etc.).
 * Admin pages use their own bespoke header (not ParchShell),
 * so this shell is intentionally minimal — just passes children through
 * with the parch-bg base class applied at the page level.
 */
export default function AdminShell({ children }: AdminShellProps) {
  return <>{children}</>
}
