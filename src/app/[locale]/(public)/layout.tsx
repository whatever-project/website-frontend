import type { ReactNode } from "react"

interface PublicLayoutProps {
  children: ReactNode
}

/**
 * (public) route group layout.
 * Intentionally thin — individual pages call ParchShell directly
 * so they can pass their own title/sub/backHref props.
 * The landing page renders its own full-screen layout without any shell.
 */
export default function PublicLayout({ children }: PublicLayoutProps) {
  return <>{children}</>
}
