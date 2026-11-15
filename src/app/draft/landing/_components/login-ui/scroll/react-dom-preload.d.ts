// This project does not depend on @types/react-dom, and the only thing the landing draft needs from `react-dom` is `preload`
// (React 19; used by preloadLoginAssets.ts). Minimal ambient declaration of just that function. If @types/react-dom is added later
// this declaration merges with it and can be deleted. (Not a module file on purpose: no top-level import / export.)
declare module "react-dom" {
  export function preload(
    href: string,
    options: {
      as: "fetch" | "image" | "font" | "script" | "style"
      crossOrigin?: "anonymous" | "use-credentials" | ""
      fetchPriority?: "high" | "low" | "auto"
      media?: string
      type?: string
    },
  ): void
}
