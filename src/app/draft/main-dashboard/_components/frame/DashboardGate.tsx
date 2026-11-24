"use client"

import type { ReactNode } from "react"
import { useShowDashboardContent } from "./useShowDashboardContent"

/** Renders its children only while the temporary preview flag `showDashboardContent` is true (see useShowDashboardContent.ts). Used for the footer in page.tsx. */
export default function DashboardGate({ children }: { children: ReactNode }) {
  const [show] = useShowDashboardContent()
  return show ? <>{children}</> : null
}