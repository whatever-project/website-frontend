# website-frontend: project structure

Frontend for **Arcane Vale**, a Thai/English roleplay community site.

|                |                                                                                                        |
| -------------- | ------------------------------------------------------------------------------------------------------ |
| Framework      | Next.js 16 (App Router) + React 19 + TypeScript                                                        |
| i18n           | `next-intl` with locales `th` (default) and `en`                                                       |
| Styling        | Tailwind CSS v4 + the "parchment" design system (`src/components/Parchment`, `src/styles/globals.css`) |
| Env validation | `zod` (`src/config/env.ts`)                                                                            |
| Backend        | Separate service in `../website-backend`, called over HTTP with cookies                                |

Path alias: `@/*` → `./src/*` (see `tsconfig.json`).

### Next.js 16 notes

Most tutorials online target Next 13–15. The changes below affect this repo. Docs matching the installed version are in `node_modules/next/dist/docs/` (paths below are relative to that folder).

| Change in v16                                                                                                                                   | What it means here                                                                                                               | Doc                                                               |
| ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `middleware.ts` is renamed **`proxy.ts`** and always runs on Node.js (no edge runtime). Export a function named `proxy` or use a default export | `src/proxy.ts` exports `proxy` (the next-intl handler), the recommended form. **Don't rename it to `middleware.ts`**: that name is deprecated                                                        | `01-app/01-getting-started/16-proxy.md`                           |
| `params`, `searchParams`, `cookies()`, `headers()` are **async only**                                                                           | Always `await params` (as `app/[locale]/layout.tsx` does). `npx next typegen` generates `PageProps` / `LayoutProps` type helpers | `01-app/02-guides/upgrading/version-16.md` → _Async Request APIs_ |
| **Turbopack is the default** for `next dev` and `next build`                                                                                    | Don't add `--turbopack`. Webpack-only config won't apply                                                                         | same → _Turbopack by default_                                     |
| **`next lint` is removed**, and `next build` no longer lints                                                                                    | Run `npm run lint` (ESLint flat config, `eslint.config.mjs`) separately and in CI                                                | same → _`next lint` Command_                                      |
| `next dev` writes to `.next/dev`, and a **lockfile allows one `next dev` per project**                                                          | A second `npm run dev` exits with "Another next dev server is already running". `next build` can run alongside it                | same → _Concurrent `dev` and `build`_                             |
| Minimum **Node.js 20.9** and **TypeScript 5.1**                                                                                                 | Check `node -v` if dev fails to start                                                                                            | same → _Node.js runtime and browser support_                      |

---

## 1. Top level

```
website-frontend/
├── docs/                 This documentation (+ docs/ai: AI rules, templates; docs/handoffs: backend hand-offs, created on first promotion)
├── scripts/              check-draft-only.mjs (`npm run check:draft`: guard for the design stage)
├── .agents/              Kimi design agent + design-* skills (design stage)
├── .claude/skills/       draft-to-live, api-handoff (dev stage)
├── public/
│   ├── assets/           Images served at /assets/*. Used: village, letter-scene, avatar-1/2.
│   │                     Unused (kept for upcoming designs): envelope, feather, inkpot, postmark, script-lines, seal-red
│   └── fonts/            Self-hosted fonts (Charm, Great Vibes, Josefin Sans, Oranienbaum, Serithai)
├── src/                  All application code (see below)
├── .env.example          Required env vars (NEXT_PUBLIC_API_URL)
├── next.config.mjs       Wraps config with the next-intl plugin → src/i18n/request.ts
├── eslint.config.mjs     ESLint (eslint-config-next)
├── postcss.config.mjs    Tailwind v4 PostCSS plugin
├── tsconfig.json         TS config + "@/*" alias
├── AGENTS.md / CLAUDE.md Notes for AI coding agents
└── package.json          Scripts: dev, build, start, lint, typecheck, check:draft, design
```

---

## 2. `src/` tree

```
src/
├── proxy.ts                         next-intl locale routing; `export const proxy` (Next 16 replacement for middleware.ts)
│
├── app/                             ROUTES ONLY (App Router)
│   ├── layout.tsx                   Root layout: <html lang> (via getLocale), <body>, global CSS, fonts, metadata, DraftBadge
│   ├── favicon.ico
│   │
│   ├── [locale]/                    Every real, translated route. Each page.tsx is a 5-line entry that renders its view from views/
│   │   ├── layout.tsx               Validates locale, provides NextIntlClientProvider
│   │   ├── (public)/                Unauthenticated pages (landing + auth flows)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             "/" landing page
│   │   │   ├── login/  signup/  forgot-password/  reset-password/
│   │   │   └── verify-email/  verify-email-change/
│   │   ├── (user)/                  Signed-in user pages
│   │   │   ├── layout.tsx
│   │   │   ├── dashboard/           Profile, username/email/password, delete account
│   │   │   └── account/             Character/profile picker ("Choose Your Soul")
│   │   └── (admin)/                 Admin-only pages
│   │       ├── layout.tsx
│   │       └── admin/logs/          Audit log viewer
│   │
│   └── draft/                        Designer drafts + dev utilities (NOT localized; reached via the Drafts button)
│       ├── layout.tsx               Hard-codes the Thai messages so next-intl components still work
│       ├── account/                 Draft of /account (+ dashboard settings): mock data, Thai copy
│       ├── character-create/        Draft of a new 6-step character-creation wizard (not live yet)
│       ├── skeleton-mockup/         Grayscale wireframe of a forum main page (home / forums / forum detail + HUD), scoped CSS in `_styles/`
│       └── dev-tools/               Draft hub: list of drafts, quick links
│
├── views/                           Page code, one folder per live page (see §5)
│   ├── public/   landing/ login/ signup/ forgot-password/ reset-password/ verify-email/ verify-email-change/
│   ├── user/     dashboard/ account/
│   └── admin/    logs/
│
├── api/                             Everything that talks to the backend
│   ├── client.ts                    request<T>() fetch wrapper (base URL from env, cookies, ApiError)
│   ├── routes.ts                    Endpoint constants: AUTH_ROUTES, ACCOUNT_ROUTES, ADMIN_ROUTES
│   ├── services/                    auth / account / admin service objects. Pages call these, never fetch()
│   ├── types/                       Request/response types (user.types.ts, admin.types.ts)
│   └── functions/                   (empty, kept) intended for response mappers
│
├── components/                      Shared UI used by 2+ pages
│   ├── Parchment/index.tsx          Design system: ParchShell, InkModal, PasswordInput, WaxSeal,
│   │                                InkDivider, Flourish, SheetCorners, ParchCurvedLabel
│   ├── LanguageSwitcher/index.tsx   🌐 one-click th ⇄ en toggle in page headers (keeps path + query; hidden on /draft)
│   ├── HtmlLang/index.tsx           Keeps <html lang> in sync after client-side locale switches
│   ├── LetterStack/index.tsx        Letter-scene illustration beside the login + signup forms
│   ├── DraftBadge/index.tsx          Floating button on every page: "Go to Drafts" / "Exit Drafts", see §4
│   └── Breadcrumb/                  BaseBreadcrumb + Public/User/Admin wrappers (⚠️ not used yet)
│
├── layouts/                         Page shells per route group (⚠️ not used yet, see §6)
│   ├── PublicShell.tsx  UserShell.tsx  AdminShell.tsx
│
├── config/
│   ├── env.ts                       zod-validated env → `env.API_URL` (throws on bad config)
│   ├── routes.ts                    Every app link target (`routes.login`…) + DRAFT_PREFIX / DRAFT_HUB
│   ├── site.ts                      Site name / description / title template
│   └── breadcrumbs.ts               pathname → message key ("breadcrumbs.login"…), no hard-coded labels
│
├── i18n/
│   ├── routing.ts                   locales ["th","en"], defaultLocale "th", localePrefix "as-needed"
│   ├── request.ts                   getRequestConfig: validates locale, loads messages
│   └── navigation.ts                Locale-aware Link, redirect, useRouter, usePathname
│
├── messages/
│   ├── index.ts                     Merges every JSON per locale → `messages.en` / `messages.th`
│   ├── en/  *.json                  One file per namespace: common, landing, login, signup,
│   └── th/  *.json                  forgot-password, reset-password, verify-email,
│                                    verify-email-change, dashboard, account, admin-logs
│
├── styles/globals.css               Tailwind + parchment CSS (fonts, .parch-* classes, wax-seal…)
├── utils/
│   ├── timeOfDay.ts                 Time-of-day theming for the landing page
│   └── validation.ts                EMAIL_RE, validateUsername (error codes), getPasswordChecks, isStrongPassword
│
├── hooks/  constants/  types/       (empty, kept) intended for global hooks / constants / types
```

> Git does not track empty folders. The empty folders above exist only on this machine and disappear on a fresh clone, until a file (or a `.gitkeep`) is added to them.

---

## 3. Routes

`localePrefix: "as-needed"` means Thai (the default) has **no** prefix and English gets `/en`.

| URL (th)               | URL (en)                  | File                                                 | Group         |
| ---------------------- | ------------------------- | ---------------------------------------------------- | ------------- |
| `/`                    | `/en`                     | `app/[locale]/(public)/page.tsx`                     | public        |
| `/login`               | `/en/login`               | `app/[locale]/(public)/login/page.tsx`               | public        |
| `/signup`              | `/en/signup`              | `app/[locale]/(public)/signup/page.tsx`              | public        |
| `/forgot-password`     | `/en/forgot-password`     | `app/[locale]/(public)/forgot-password/page.tsx`     | public        |
| `/reset-password`      | `/en/reset-password`      | `app/[locale]/(public)/reset-password/page.tsx`      | public        |
| `/verify-email`        | `/en/verify-email`        | `app/[locale]/(public)/verify-email/page.tsx`        | public        |
| `/verify-email-change` | `/en/verify-email-change` | `app/[locale]/(public)/verify-email-change/page.tsx` | public        |
| `/dashboard`           | `/en/dashboard`           | `app/[locale]/(user)/dashboard/page.tsx`             | user          |
| `/account`             | `/en/account`             | `app/[locale]/(user)/account/page.tsx`               | user          |
| `/admin/logs`          | `/en/admin/logs`          | `app/[locale]/(admin)/admin/logs/page.tsx`           | admin         |
| `/draft/account`       | —                         | `app/draft/account/page.tsx`                         | draft         |
| `/draft/character-create` | —                      | `app/draft/character-create/page.tsx`                | draft         |
| `/draft/skeleton-mockup` | —                       | `app/draft/skeleton-mockup/page.tsx`                 | draft         |
| `/draft/dev-tools`     | —                         | `app/draft/dev-tools/page.tsx`                       | draft         |

### Why `[locale]`?

`[locale]` is a dynamic route segment holding the language. `proxy.ts` runs next-intl's middleware on every request. It works out the locale from the URL prefix, cookie or `Accept-Language` and rewrites the request so `params.locale` is always `th` or `en`. `[locale]/layout.tsx` then:

1. calls `notFound()` for any other value, and
2. wraps the tree in `NextIntlClientProvider`, so every page can call `useTranslations("<namespace>")`.

The **route groups** `(public)`, `(user)` and `(admin)` are only for organisation. Parentheses keep them out of the URL. Each group has its own `layout.tsx`, the place to attach that group's shell (header, breadcrumb, auth guard).

### Why `draft/`?

`draft/` sits **outside** `[locale]`, and `proxy.ts` excludes it from its matcher, so its pages get no locale redirect or prefix. It holds:

- **Designer drafts**: full UI mock-ups with mock data and hard-coded Thai copy, kept for reference before they become real, translated pages (e.g. `draft/account`). See §4 "Design → dev workflow".
- **Draft hub + developer tools**: `dev-tools` lists every draft (with its live counterpart), and has quick links. No language switcher: drafts are Thai-only.

`draft/layout.tsx` provides the Thai messages, so shared components that call `useTranslations` don't crash. Every page links to `/draft` through the floating Drafts button (§4).

---

## 4. Request and data flow

```
browser ─▶ proxy.ts (next-intl: resolve/redirect locale; skips /draft, /_next, static files)
        ─▶ app/layout.tsx              <html>, fonts, globals.css
        ─▶ app/[locale]/layout.tsx     validate locale + NextIntlClientProvider(messages)
        ─▶ app/[locale]/(group)/layout.tsx
        ─▶ page.tsx  ──uses──▶ components/Parchment, messages via useTranslations
                    └─calls─▶ api/services/*.service.ts ─▶ api/client.ts request() ─▶ backend (env.API_URL)
```

Messages: `i18n/request.ts` imports `messages/index.ts` and picks `messages[locale]`. Each JSON file is a namespace (e.g. `login.json` → `{ "login": { … } }`), and all of them are spread together per locale.

### Links

All in-app link targets come from `routes` in `src/config/routes.ts` (`href={routes.login}`, `router.push(routes.dashboard)`). Never hard-code a path.

### Drafts button

`components/DraftBadge` (rendered once in `app/layout.tsx`) puts a floating button in the bottom-right corner of **every page**:

| You are on                                               | Button             | Goes to                                                                |
| -------------------------------------------------------- | ------------------ | ---------------------------------------------------------------------- |
| a live page (`/`, `/login`, `/en/dashboard`…)            | **✎ Go to Drafts** | `/draft/dev-tools`, the hub listing every draft                        |
| a draft (`/draft/<route>`)                               | **✕ Exit Drafts**  | the matching live page `/<route>` (e.g. `/draft/account` → `/account`) |
| a draft page with no live twin (e.g. `/draft/dev-tools`) | **✕ Exit Drafts**  | `/` (landing)                                                          |

"Exit Drafts" works because of the naming convention below: it strips `/draft` from the path and checks the result against `routes`.

### Design → dev workflow ("copy on demand")

`[locale]/` holds the **live** pages (owned by dev). `draft/` holds **drafts** (owned by design), and only for pages that are being redesigned right now. Don't mirror every page.

Convention: a draft of `/<route>` lives at `app/draft/<route>/page.tsx` (e.g. `/account` → `app/draft/account/`).

1. **Start a draft (design):** normally via `/design-request`, which first looks for an existing draft folder of the page and only otherwise starts a new one from the interview (Kimi never copies live code). A dev starting a draft by hand may copy the view folder `views/<group>/<route>/` to `app/draft/<route>/_view/` and add `app/draft/<route>/page.tsx` that renders it (the `_` keeps it out of routing), or start from scratch. Add a line to `DRAFTS` in `app/draft/dev-tools/page.tsx` so it shows up on the hub.
2. **Iterate (design):** mock data and hard-coded text are fine. Put draft-only components **inside the draft folder** (e.g. `app/draft/account/_components/`), not in `src/components/`, because editing a shared component changes the live pages too.
3. **Review:** click **Go to Drafts** on any page and pick the draft, or open `/draft/<route>` directly. **Exit Drafts** returns to the live version for comparison.
4. **Ship (dev):** once design approves, port the draft into the live `[locale]` page: move text into `messages/th|en`, swap mock data for `api/services`, and move components that are reused into `src/components/`. **Keep the draft folder and its `DRAFTS` line** as the design team's reference; delete them only when the dev team explicitly decides to (`draft-to-live` step 7). Because the draft is kept, a later change to a live page is made in its existing draft folder (design team: `/design-request` finds it first), and shipping that change applies only what its CONTEXT.md §2b lists (see `docs/ai/DESIGN-RULES.md` §1).

Rule: live code never imports from `app/draft/`.

### Adding a new page

1. Create the view `src/views/<group>/<route>/index.tsx` and the 5-line route entry `src/app/[locale]/(<group>)/<route>/page.tsx` (see §5). Add its path to `routes` in `config/routes.ts`.
2. Add `src/messages/en/<route>.json` and `src/messages/th/<route>.json` with **identical keys**.
3. Import both in `src/messages/index.ts` and spread them into `en` / `th`.
4. Add the breadcrumb key to `src/config/breadcrumbs.ts` and `breadcrumbs.*` in `common.json`.
5. Use `Link` / `useRouter` from `@/i18n/navigation` (not `next/link`) so links keep the locale.
6. Call the backend only through `src/api/services/*`. Add new endpoints to `api/routes.ts` and types to `api/types/`.

---

## 5. Page code: `views/`

Every live page has one folder under `src/views/<group>/<page>/` (group = `public` | `user` | `admin`, mirroring the route groups). The route file only renders it:

```tsx
// app/[locale]/(user)/dashboard/page.tsx
import DashboardView from "@/views/user/dashboard"

export default function Page() {
  return <DashboardView />
}
```

Inside a view folder, create a file or subfolder **only when it has content**:

```
views/<group>/<page>/
├── index.tsx        the view ("use client"), default export <Page>View
├── components/      components used only by this page (one component per file)
├── hooks/           hooks used only by this page
├── functions/       pure helpers used only by this page
├── constants.ts     page-only constants
└── types.ts         page-only types
```

Example: `views/user/dashboard/` has `components/{PassRules,Section,SectionTitle,FeedbackBar}.tsx`, `constants.ts`, `types.ts` and `functions/usernameCooldown.ts`. A small page like `views/public/forgot-password/` is just `index.tsx`.

Rules:
- **Used by 2+ pages:** move it up to `src/components/<Name>/index.tsx` (UI) or `src/utils/*.ts` (pure helpers), e.g. `LetterStack` (login + signup) and `utils/validation.ts` (signup + dashboard).
- **Imports:** inside a view, use relative imports (`./components/Section`); everything else uses `@/…`. No `index.ts` re-export files in view folders.
- **Direction:** views may import from `components/`, `utils/`, `api/`, `config/`, `i18n/`. Never from `app/`, and never from another view. Live code never imports from `app/draft/`.
- **Metadata** (`generateMetadata`) goes in `page.tsx`, not in the view.

---

## 6. Known gaps against the refactor plan

| Item                                                            | Status                                                                                                                                                                                                                              |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pages-modules` thin-page split                                 | ✅ Done as `views/` (§5); `pages-modules/` removed                                                                                                                                                                                                                   |
| Group layouts render `PublicShell` / `UserShell` / `AdminShell` | Layouts are pass-through `<>{children}</>`. Shells and `Breadcrumb/*` are imported nowhere                                                                                                                                          |
| Single Breadcrumb component placed in shells                    | Base + 3 wrappers exist, unused                                                                                                                                                                                                     |
| Use `@/i18n/navigation` instead of `next/link`                  | ✅ Done. Only `DraftBadge` and `draft/dev-tools` keep `next/link` (drafts are outside locale routing)                                                                                  |
| `<html lang={locale}>`                                          | ✅ Done: `getLocale()` in the root layout + `HtmlLang` for client-side switches                                                                                                                                                                                                  |
| `app/not-found.tsx`                                             | Missing                                                                                                                                                                                                                             |
| Thai messages typed against English                             | `messages/index.ts` is untyped                                                                                                                                                                                                      |
| All UI strings in messages                                      | A few remain hard-coded (e.g. `PROFILES` names on `/account`; all of `draft/*` on purpose)                                                                                                                                          |
| `defaultLocale`                                                 | Plan said `en`, code uses `th` (deliberate for a Thai audience?)                                                                                                                                                                    |
| MUI `theme/`                                                    | Not applicable: the project uses Tailwind, not MUI                                                                                                                                                                                  |
| `config/site.ts` used for metadata                              | Imported nowhere. `app/layout.tsx` hard-codes the same name/description                                                                                                                                                             |
| Font files                                                      | `globals.css` references `/fonts/Charmonman-Regular.ttf`, which is **missing**, so the Jim Thompson fallback silently fails. The 4 licensed `.woff2` slots (Parfumerie, TAN Grandeur, Jim Thompson, Anuparp) are optional by design |
| tsc / lint / build gates pass                                   | `tsc` passes, but `npm run lint` fails with **7 errors**: `react-hooks/set-state-in-effect` in landing, verify-email, verify-email-change and admin logs; `react-hooks/purity` in dashboard                                         |
| Env files                                                       | `.env` and `.env.local` both define `NEXT_PUBLIC_API_URL` with different values. `.env.local` wins                                                                                                                                  |

---

## 7. Recommended changes (industry standard)

In priority order. The first three fix real user-facing bugs; the rest bring the project in line with common Next.js + next-intl conventions.

| #   | Change                                                                                                                                                                                                                                                                                                                                   | Why                                                                                                                                                                       | Files                                                                                                                                                                                                                                      |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | ✅ **Done.** Replace `import Link from "next/link"` with `import { Link } from "@/i18n/navigation"`. Also use `useRouter` / `usePathname` / `redirect` from there. `useSearchParams` and `notFound` stay on `next/navigation`                                                                                                                         | `next/link` drops the `/en` prefix, so English users get bounced to Thai on every click                                                                                   | `(public)/page.tsx`, `login`, `signup`, `forgot-password`, `reset-password`, `verify-email`, `verify-email-change`, `(user)/dashboard`, `(admin)/admin/logs`, `components/Parchment/index.tsx`, `components/Breadcrumb/BaseBreadcrumb.tsx` |
| 2   | ✅ **Done another way** (`getLocale()` in root layout + `HtmlLang`); moving `<html>` into `[locale]/layout.tsx` is still an option if you later want separate root layouts. Original idea: move `<html>` / `<body>` (fonts, global CSS) from `app/layout.tsx` into `app/[locale]/layout.tsx` with `<html lang={locale}>`. Call `setRequestLocale(locale)` and add `generateStaticParams` returning `routing.locales`. The root `app/layout.tsx` then just returns `children`                                                        | Screen readers, SEO and the browser's Thai line-breaking all rely on the correct `lang`. This is next-intl's documented App Router setup                                  | `app/layout.tsx`, `app/[locale]/layout.tsx`                                                                                                                                                                                                |
| 3   | Add `app/[locale]/not-found.tsx` and `app/[locale]/error.tsx` (plus `loading.tsx` where data loads)                                                                                                                                                                                                                                      | Unknown URLs and runtime errors currently show the unstyled default Next.js pages                                                                                         | `app/[locale]/`                                                                                                                                                                                                                            |
| 4   | Make each group `layout.tsx` render its shell and breadcrumb (`<PublicShell>`, `<UserShell>`, `<AdminShell>`). Collapse `Breadcrumb/{Base,Public,User,Admin}Breadcrumb.tsx` into one `components/Breadcrumb/index.tsx` with a `className` prop                                                                                           | Shared chrome lives in one place instead of every page calling `ParchShell` itself. Removes 3 near-empty wrapper files                                                    | `app/[locale]/(*)/layout.tsx`, `layouts/*`, `components/Breadcrumb/*`                                                                                                                                                                      |
| 5   | ✅ **Done** (as `views/`, see §5). Make `page.tsx` thin: move each page body into `views/<group>/<page>/index.tsx` (+ `components/`, `hooks/`… only when used). **Pick one convention and stick to it.** `pages-modules` is fine; the more common names are `features/<feature>/`, or colocating `_components/` inside each route folder (Next's "private folders") | Keeps `app/` as a routing map. Page-specific code is findable and deletable as a unit                                                                                     | `app/[locale]/**/page.tsx`, `pages-modules/**`                                                                                                                                                                                             |
| 6   | Split `components/Parchment/index.tsx` (8 components in one file) into one file per component under `components/ui/` (`ParchShell.tsx`, `InkModal.tsx`, `PasswordInput.tsx`, …) with a single `index.ts` re-export. Keep one folder-name casing everywhere (all component folders are PascalCase; `Parchment` was renamed from lowercase because Linux is case-sensitive)   | Smaller files, clearer diffs, consistent imports                                                                                                                          | `components/`                                                                                                                                                                                                                              |
| 7   | Type-check messages. Add `src/types/next-intl.d.ts`: `declare module "next-intl" { interface AppConfig { Messages: typeof messages.en; Locale: (typeof routing.locales)[number] } }`. Type the `th` object as `typeof en` in `messages/index.ts`                                                                                         | A missing Thai key or a typo in `t("…")` fails `tsc` instead of showing a raw key at runtime                                                                              | `types/`, `messages/index.ts`                                                                                                                                                                                                              |
| 8   | Have `app/layout.tsx` metadata read from `config/site.ts` (or delete `site.ts`)                                                                                                                                                                                                                                                          | One source of truth                                                                                                                                                       | `app/layout.tsx`, `config/site.ts`                                                                                                                                                                                                         |
| 9   | Load fonts with `next/font/google` (Cormorant, EB Garamond, Jost, Prompt) and `next/font/local` (files in `public/fonts`, which can then move to `src/assets/fonts`) instead of the `<link>` tag and hand-written `@font-face`. Add or remove the missing Charmonman file                                                                | Self-hosted, preloaded, no layout shift, no request to Google at runtime                                                                                                  | `app/layout.tsx`, `styles/globals.css`                                                                                                                                                                                                     |
| 10  | Route protection: an optimistic check in `proxy.ts` (redirect `(user)`/`(admin)` routes to `/login` when the session cookie is absent), with the real check still done by the backend API                                                                                                                                                | Stops the flash of protected pages before the client-side redirect. See `node_modules/next/dist/docs/01-app/02-guides/authentication.md` → _Optimistic checks with Proxy_ | `proxy.ts`                                                                                                                                                                                                                                 |
| 11  | Keep `/draft` out of production: in `draft/layout.tsx`, call `notFound()` when `process.env.NODE_ENV === "production"` (or behind an env flag)                                                                                                                                                                                           | Drafts with mock data shouldn't be publicly reachable                                                                                                                     | `app/draft/layout.tsx`                                                                                                                                                                                                                     |
| 12  | Env files: keep `.env.local` (personal values) plus `.env.example` (committed), and remove `.env` unless it's deliberately shared defaults                                                                                                                                                                                               | Avoids the "which value wins?" confusion                                                                                                                                  | root                                                                                                                                                                                                                                       |
| 13  | Replace the create-next-app README body with a real quick start (Node version, `.env.local` setup, backend URL, scripts), then **commit the refactor**. It's all uncommitted right now                                                                                                                                                   | Onboarding, and protection against losing work                                                                                                                            | `README.md`                                                                                                                                                                                                                                |
| 14  | _Optional tooling:_ Prettier (+ `prettier-plugin-tailwindcss`), a test runner (Vitest for units, Playwright for flows), and a CI job running `tsc --noEmit`, `npm run lint`, `next build`                                                                                                                                                | Standard quality gates (`next build` no longer lints in v16)                                                                                                              | root                                                                                                                                                                                                                                       |
