import type { ReactNode } from "react"

interface UserLayoutProps {
  children: ReactNode
}

/**
 * (user) route group layout.
 * Intentionally thin — dashboard and account pages include their own ParchShell calls.
 */
export default function UserLayout({ children }: UserLayoutProps) {
  return <>{children}</>
}
