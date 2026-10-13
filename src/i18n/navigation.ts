import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// Re-export localised navigation helpers.
// Use these instead of next/link and next/navigation in app code.
export const { Link, redirect, useRouter, usePathname } =
  createNavigation(routing)
