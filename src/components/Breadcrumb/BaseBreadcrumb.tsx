"use client"

import { usePathname } from "@/i18n/navigation"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { breadcrumbMap } from "@/config/breadcrumbs"

interface BaseBreadcrumbProps {
  className?: string
}

/**
 * Reads the current pathname, resolves each segment against breadcrumbMap,
 * and renders localised crumbs via useTranslations("common").
 */
export default function BaseBreadcrumb({ className = "" }: BaseBreadcrumbProps) {
  const pathname = usePathname()
  const t = useTranslations("common")

  // Build crumb list: always start with Home
  const crumbs: { label: string; href: string }[] = []

  const homeKey = breadcrumbMap["/"]
  if (homeKey) {
    crumbs.push({ label: t(homeKey as Parameters<typeof t>[0]), href: "/" })
  }

  // Walk path segments
  const segments = pathname.split("/").filter(Boolean)
  let accumulated = ""
  for (const segment of segments) {
    accumulated += `/${segment}`
    const key = breadcrumbMap[accumulated]
    if (key) {
      crumbs.push({
        label: t(key as Parameters<typeof t>[0]),
        href: accumulated,
      })
    }
  }

  if (crumbs.length <= 1) return null

  return (
    <nav aria-label="Breadcrumb" className={`flex items-center gap-2 font-ui text-[11px] tracking-widest text-[#a68d5f] uppercase ${className}`}>
      {crumbs.map((crumb, i) => (
        <span key={crumb.href} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>✦</span>}
          {i < crumbs.length - 1 ? (
            <Link href={crumb.href} className="transition hover:text-[#6b4f22]">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-[#6b4f22]">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}
