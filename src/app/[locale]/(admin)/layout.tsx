import type { ReactNode } from "react"

interface AdminLayoutProps {
  children: ReactNode
}

/**
 * (admin) route group layout.
 * Admin pages manage their own bespoke layout (no ParchShell).
 */
export default function AdminLayout({ children }: AdminLayoutProps) {
  return <>{children}</>
}
