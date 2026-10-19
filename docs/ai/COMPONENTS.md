# Component & style catalog

**Read this before creating anything new.** Reuse order: a component below → an existing `parch-*` class → a composition of existing pieces → (last resort) a new file.

Keep this file current. When a dev promotes a component to `src/components/` or adds a shared util/class, add it here in the same change (the `draft-to-live` skill does this).

---

## 1. Shared components (`src/components/`)

Import with the `@/` alias, e.g. `import { ParchShell, InkModal } from "@/components/Parchment"`.

### `@/components/Parchment` (design system, named exports)

| Export | Props | Use for |
|---|---|---|
| `ParchShell` | `title: string`, `sub: string`, `backHref?: string`, `onBack?: () => void`, `children` | The standard page frame: parchment background, back link, language switcher, title, divider, footer, floating sparkles. **Start most pages with this.** |
| `InkModal` | `onClose: () => void`, `children`, `wide?: boolean`, `corners?: boolean` | Any modal / confirmation dialog. |
| `PasswordInput` | all `<input>` props | Password field with show/hide toggle. |
| `WaxSeal` | `letter?: string`, `size?: number`, `className?: string` | Round red wax seal with a letter (avatar / badge / stamp). |
| `InkDivider` | `children?` (ornament) | Horizontal ornamental divider between sections. |
| `Flourish` | `className?` (default `h-6 w-6`) | Small SVG ornament. |
| `SheetCorners` | none | Four corner ornaments for a `parch-sheet` card (parent must be `relative`). |
| `ParchCurvedLabel` | `text: string`, `size?: number` (default 170) | Curved SVG text label. |

### Other shared components (default exports, one folder each)

| Import | Props | Use for |
|---|---|---|
| `@/components/LanguageSwitcher` | `tone?: "parch" \| "night"` | th ⇄ en toggle. Already inside `ParchShell`. Hides itself on `/draft`. |
| `@/components/LetterStack` | none | Letter-scene illustration beside login/signup forms. |
| `@/components/Breadcrumb/*` | — | `BaseBreadcrumb` + Public/User/Admin wrappers. **Not used by any page yet.** Don't add to drafts. |
| `@/components/HtmlLang` | `lang` | Internal. Keeps `<html lang>` in sync. Do not use in pages. |
| `@/components/DraftBadge` | none | Internal. Floating "Go to Drafts" button from the root layout. Do not use in pages. |

### Page-local components (NOT shared: copy the idea, don't import across views)

Views must not import from other views. If a design needs one of these, a draft may copy it into its own `_components/` and flag it in CONTEXT.md as "candidate to promote to shared".

| Location | Component | Looks like |
|---|---|---|
| `views/user/dashboard/components/` | `Section` | `parch-sheet` card with corners and a title |
| | `SectionTitle` | Section heading |
| | `PassRules` | Password-rule checklist (uses `getPasswordChecks`) |
| | `FeedbackBar` | Success / error banner |
| `views/user/account/components/` | `Emblem` | Character emblem |
| `views/public/landing/components/` | `Stars` | Twinkling stars |
| `views/public/reset-password/components/` | `ResetPasswordForm` | Reset form (`PasswordInput`, `InkDivider`, `WaxSeal`; calls `authService`) |
| `views/public/verify-email/components/` | `VerifyEmailStatus` | Status page body (loading / ok / error) |
| `views/public/verify-email-change/components/` | `VerifyEmailChangeStatus` | Same, for email change |
| `views/admin/logs/components/` | `LoginHistoryTable`, `UsernameHistoryTable` | Admin data tables |

> Layout shells `src/layouts/{Public,User,Admin}Shell.tsx` exist but are imported nowhere. Ignore them.

---

## 2. Style classes (`src/styles/globals.css`)

Do **not** edit `globals.css` from a draft. If a draft needs a new style, define it locally (Tailwind arbitrary values or a `<style>` inside the draft's `_components/`) and flag it as a **new element**.

| Class | Use for |
|---|---|
| `parch-bg` | Full-page parchment background (+ `parch-vignette` for dark edges) |
| `parch-sheet` | Paper card / panel |
| `parch-label` | Small uppercase caption above fields or headings |
| `parch-input` | Text input / textarea / select |
| `parch-btn` | Primary dark button (full width) |
| `parch-btn-outline` | Secondary outline button |
| `parch-check` | Custom checkbox |
| `wax-seal` | Wax-seal background (used by `WaxSeal`) |
| `ink-divider` | Ornamental divider line (used by `InkDivider`) |
| `seal-stamp` | Stamp-in animation |
| `rise-in`, `rise-in-1`, `rise-in-2`, `rise-in-3` | Staggered fade/rise entrance |
| `gold-glow` | Pulsing gold glow |
| `gallery-btn`, `liquid-glass` | Special buttons used on the landing / gallery pages |
| `wire-*` | Old wireframe styles. **Don't use for new work.** |

### Fonts (utility classes)
`font-display` (Cormorant Garamond), `font-serif2` (EB Garamond), `font-ui` (Jost), `font-jimthompson` (headings), `font-serithai` (Thai buttons / labels), `font-oranienbaum`, `font-josefin`, `font-anuparp`, `font-parfumerie`, `font-tan-grandeur`. All fall back to **Prompt** for Thai.

Typical combos from live pages:
- Page title: `font-jimthompson text-3xl text-[#3a2c1a]`
- Input: `parch-input font-serithai`
- Caption: `parch-label`
- Body text: `font-ui text-[13px] text-[#5d4626]`

### Palette (hard-coded hex, there is no theme token file)
`#3a2c1a` (ink, headings) · `#5d4626` (body) · `#7a5f34` (labels) · `#8a6a35` (accent / borders) · `#a68d5f` (muted / placeholder) · `#b89a63` (card border) · `#e9d9ae` (text on dark button) · `#43331c` / `#2f2413` (dark button).

---

## 3. Utilities & config

| Import | What |
|---|---|
| `@/config/routes` → `routes` | Link targets: `home, login, signup, forgotPassword, resetPassword, verifyEmail, verifyEmailChange, dashboard, account, adminLogs`. Never hard-code paths. |
| `@/utils/validation` | `EMAIL_RE`, `validateUsername(v)`, `getPasswordChecks(v)`, `isStrongPassword(v)` |
| `@/utils/timeOfDay` | `getTimeState`, `formatHour` (landing-page sky theming) |
| `@/i18n/navigation` | Locale-aware `Link`, `useRouter`, `usePathname`, `redirect`. **Live pages only.** Drafts use `next/link` (they are outside locale routing). |
| `react-icons` | Available, but live pages mostly use inline SVG / glyphs (✦ ⚠️). |

No component library (no shadcn / Radix / MUI), no `clsx`, no `tailwind-merge`. Don't add dependencies from a draft.

---

## 4. Existing pages (closest-match reference)

| Page | Route | View folder | Good reference for |
|---|---|---|---|
| Landing | `/` | `views/public/landing` | Full-bleed hero, time-of-day theme |
| Login / Signup | `/login`, `/signup` | `views/public/login`, `signup` | Forms with `ParchShell`, `parch-input`, `parch-btn`, `LetterStack` |
| Forgot / Reset password | `/forgot-password`, `/reset-password` | `views/public/*` | Short forms, success state |
| Verify email (+ change) | `/verify-email`, `/verify-email-change` | `views/public/*` | Status pages (loading / ok / error) |
| Dashboard | `/dashboard` | `views/user/dashboard` | Several `Section` cards, inline edit, feedback bars, modals |
| Account | `/account` | `views/user/account` | Card picker, `WaxSeal`, `InkModal` |
| Admin logs | `/admin/logs` | `views/admin/logs` | Data tables |

Existing draft: `src/app/draft/account/page.tsx` (+ hub at `draft/dev-tools`).
