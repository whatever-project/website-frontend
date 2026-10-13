import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

// Next 16 file convention: proxy.ts with a `proxy` export (middleware.ts is deprecated)
export const proxy = createMiddleware(routing)

export const config = {
  // Match all pathnames except:
  // - /draft/** (designer drafts, no locale routing)
  // - Next.js internals (_next/static, _next/image, favicon.ico, etc.)
  // - Public asset files (png, jpg, svg, …)
  matcher: [
    "/((?!draft|_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?|ttf|otf)).*)",
  ],
}
