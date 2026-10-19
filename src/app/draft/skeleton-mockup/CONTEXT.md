---
page: skeleton-mockup
status: designing
route_group: user
target_route: "[TBD]"
draft_url: /draft/skeleton-mockup
round: 1
updated: 2026-10-16
---

# Skeleton Mockup: dev context

## 1. What this page is
A grayscale wireframe of a forum main page ("วังวนแห่งเวย์มัวร์ / WHATEVER") ported from the single-file prototype `veymour-athenaeum-thai-v2.html` (MONO WIREFRAME V 2.2). One route with three views switched by state, exactly like the HTML: **home**, **main forums list**, **forum detail**. Plus a fixed HUD dome and 12 overlay panels. Everything is mock data and Thai copy. See `DESIGN-REQUEST.md` for the request.

The original HTML is kept as a reference copy in `_assets/source/` (not imported by any code). To compare, open it in a browser next to `/draft/skeleton-mockup`.

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Server component: `SkeletonRoot` + the three views + footer |
| `_styles/skeleton.css` | Scoped copy of the HTML's two `<style>` blocks (see §4 "CSS") |
| `_assets/crys-cisenn.jpg` | Picture of the first crystal |
| `_assets/source/veymour-athenaeum-thai-v2.html` | Original prototype (reference only) |
| `_mock/copy.ts` | Static page copy: hero, nav, map pins, ticker, emergency + newspaper, notice-board notes, quest, events, live, members, forum pages, footer |
| `_mock/home.ts` | Patches, posts, orbit categories + posts, honour roll, new citizens, patrons, board details, roles, note slots |
| `_mock/forums.ts` | The 4 forums with sub-forums and threads |
| `_mock/hud.ts` | Letters, notifications, inventory items, map locations, calendar events |
| `_mock/guide.ts` | Fairy guide, lore library, chat seed, player profile (`PLAYER`, incl. 1,240 เคล and the 20 เคล note cost) |
| `_mock/crystals.ts` | Status crystals |
| `_components/SkeletonRoot.tsx` | `.sk-root` scope, font `<link>`, provider, toasts; wires `useReveal`, `Hud`, `AccountPopover`, `Overlay` |
| `_components/SkeletonContext.tsx` | All shared state: view, hero nav/map, panel + info content, mini HUD, kell balance, pinned notes, crystals, letters/notifications read state, chat, toasts; `open(key)` replaces the HTML's `data-open` delegation |
| `_components/infoContent.tsx` | Bodies for the generic info panel (patch, post, honour, quest, purse, citizen, patron, board, role, crystal …) |
| `_components/home/*` | `HomeView`, `Hero` (banner, map, glass nav), `Ticker`, `GrandHub` → `EmergencyCell`, `PatchCells` (notes + orbit), `NoticeBoardCell` (+ `AdsRow`); `SeventhSeal`, `LiveUpdates`, `MembersBoard` |
| `_components/forums/*` | `ForumsPage` (list + tooltip), `ForumDetailPage` |
| `_components/hud/*` | `Hud` (dome, rim icons, mini mode), `AccountPopover`, `Overlay`, `panels/` (`PanelShell`, `InfoPanel`, `ProfilePanel`, `NotePanel`, `CrystalPanel`, `MailPanels`, `WorldPanels` (map, lore, calendar), `PlayPanels` (chat, inventory, fairy)) |
| `_components/Footer.tsx`, `SectionHead.tsx`, `Placeholder.tsx`, `icons.tsx`, `clickable.ts`, `useReveal.ts` | Small shared pieces |

## 2b. Changes since promotion
n/a (never picked up by dev yet).

## 2d. Unused files (dev may delete)
- none (`_assets/source/…html` is a reference copy, not an unused import)

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| nothing | — | The wireframe has its own grayscale visual language; it shares no component, class, font or palette with the Parchment design system. |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| Whole wireframe design language (`.btn`, `.tag`, `.ph`, `.cell`, `.rowbtn`, HUD …) | `_styles/skeleton.css` | Different look from Parchment (grayscale, Playfair Display / Sarabun / JetBrains Mono) | no — it is a wireframe; real design tokens are TBD |
| Hero + map + glass nav, ticker, hub cells, quest/events, live, members | `_components/home/*` | No equivalent pages exist | maybe, once the real design exists |
| Forum list + forum detail | `_components/forums/*` | No forum pages exist | maybe |
| HUD dome + 12 overlay panels | `_components/hud/*` | No in-game HUD exists | maybe |
| Shared UI atoms (`Placeholder`, `SectionHead`, icons) | `_components/` | — | no |
| Seeded scatter of 26 sparks | `home/Hero.tsx` | The HTML used `Math.random()` (hydration mismatch in Next) | no |

**CSS (`_styles/skeleton.css`)** — generated once from the HTML by a throw-away script (not in the repo):
- every selector is prefixed with `.sk-root` (`body` → `.sk-root`, `body.mini` → `.sk-root.mini`, `:root` → `.sk-root`); `html{}` removed; `@keyframes` renamed `sk-*`.
- Rules for classes the markup never uses were dropped: old footer (`.foot-grid`, `.fg-*`, `.fv-*`, `.ft-*`), live chat bubbles, status map (`.st-*`, `.sb-head/name/time/txt`), `.event-banner`, `.vf-card` strip, `.roles-light`, `.mstat*`, `.sky-dome/.sky-window/.plaque`, `.post-item`, `.feed-group`, and 3 unused keyframes.
- Draft additions at the end of the file: `min-height`, toast animation (replaces the JS timer classes), `[hidden]`, button-as-link styles (`.crumb button`, `.ft2-col button`), pin-note pop-in, `.brandmark` alignment.
- Fonts: React 19 `<link rel="stylesheet" precedence>` inside `SkeletonRoot`; the repo's root layout uses a `<link>` too. On promotion move to `next/font`.

## 5. Needs dev (couldn't be done inside the draft)
- Target route and route group are undecided (`[TBD]`); the hub row uses the plain string `"/skeleton-mockup"` (guess).
- Real design tokens: this is a wireframe (`MONO WIREFRAME · V 2.2`). Decide whether the grayscale look is final; if not, re-skin with Parchment or new tokens and delete `skeleton.css`.
- Replace `_mock/*` with services (see §7). Several actions cost money (เคล): the server must own balances.
- Convert the three views to real routes (`/forums`, `/forums/[forum]`) when promoting; `SkeletonContext.view` is the only thing driving them.
- i18n: all copy is hard-coded Thai in `_mock/*` and the components (§8).
- Remove the demo button "จำลอง: เหตุฉุกเฉิน" (`EmergencyCell`) when promoting.
- `next/image` for real banner/post images; `next/font` for fonts.
- Known quirks inherited from the HTML (kept on purpose, flag to the designer):
  - The first map pin (อาณาจักร, 420,155) sits under the map heading block (`.map-hud`, z-index 3) at wide desktop widths, so it is hard to click.
  - The HUD's "‹" rim arrow sits behind the nameplate (z-index 9), so it can't be clicked; the rim scrolls back only with the wheel over an icon or dragging.
  - Pin rings are stroke-only (`fill:none`), so only the dot, the ring line and the label receive clicks.
  - The HTML references CSS variables that don't exist (`--ink2`, `--disp`); they were ignored and not recreated.
  - The site's floating **Exit Drafts** badge (z-index 50, bottom-right) overlaps the HUD on narrow widths.
- Deliberate improvements over the HTML:
  - Mini HUD: the icons are re-created in the mini row, so they don't keep stale `left/top/opacity` from the rim (the HTML's did).
  - Clickable cards are `<button>` or `role="button"` + keyboard (`clickable.ts`); footer "links" are buttons (no real routes).
  - User-entered text is rendered by React (no manual HTML escaping).

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Emergency on / off | Demo button | Segmented control "เหตุการณ์ฉุกเฉิน / หนังสือพิมพ์" or the newspaper only |
| Newspaper locked | Open "หนังสือพิมพ์" first time | Owl gate asking 20 เคล; after paying (≈2 s animation) the gate disappears for good |
| Empty events | Last 4 event cards | "No Event" dashed cards |
| Mini HUD | Chevron on the HUD | Thin bar; icons in a scrollable row; badge with unread count |
| Panel open | Any HUD / card action | Dimmed backdrop + one of 12 panels (close with ✕, backdrop or Esc) |
| Loading / Error | — | Not designed |

## 7. Mock data → API entities
| Mock | Likely API source | Notes |
|---|---|---|
| `FORUMS` (forums, subs, threads) | `GET /forums`, `GET /forums/:id` (+ paged threads) | `lastPost`, `views`, `replies`, `tag` (pinned / announcement …) |
| `PATCHES`, `POSTS`, `ORBIT_DATA` | `GET /patches`, `GET /posts?sort=latest`, `GET /posts?category=` | orbit categories: UX/UI, Lore & Story, Bloodkin, System, Quest, Events, Balance |
| `HONOR`, `QUEST` | `GET /quests/main`, `GET /honor-roll` | progress %, areas unlocked, personal achievements |
| `EVENTS`, `CAL_EVENTS` | `GET /events?month=` | 10 slots on the strip (LIVE / dated / empty) |
| `CITIZENS`, `ROLES`, member stats | `GET /members/new`, `GET /roles`, `GET /stats` | roles in the mock: Wate Spirits, Avera, Ever, Wanderer, Daevarn |
| `PATRONS`, `BOARDS`, `STATIC_NOTES` | `GET /patrons`, `GET /notice-board` | user-pinned notes: `POST /notice-board` (cost 20 เคล) |
| `CRYSTALS` | `GET /crystals`, `POST /crystals` (text + image upload) | likes / comments counts |
| `LETTERS`, `NOTIFICATIONS` | `GET /me/letters`, `GET /me/notifications`, mark-read | unread counts feed the HUD badges |
| `ITEMS`, `PLAYER.kell`, `LOCATIONS` | `GET /me/inventory`, `GET /me/wallet`, `GET /map/locations` | balance is mock-only; server must own it |
| `CHAT_SEED` | realtime chat channel | draft keeps messages locally |
| `NEWS` | `GET /newspaper/today` | gated by paying 20 เคล (`POST /newspaper/purchase`) |
| `FAIRY_*`, `LORE` | `GET /me/quests`, `GET /me/npcs`, `GET /me/friends`, `GET /lore` | |

User actions that will need an endpoint: publish note, wake crystal (+ image upload), pay for newspaper, read letter / notification, send chat message, like a crystal, open forum / thread, mark events.

## 8. Thai strings to move to i18n
- `_mock/copy.ts` (all page copy, ticker, emergency, newspaper, quest, events, footer), `_mock/guide.ts` (fairy, lore, chat seed, player), the mock arrays in `_mock/home.ts` / `hud.ts` / `forums.ts` / `crystals.ts` (these become server data, not i18n).
- Hard-coded in components: panel titles and labels in `hud/panels/*`, `infoContent.tsx` sentences, toast text in `SkeletonContext.tsx`, button/aria labels (`Hud.tsx`, `Footer.tsx`, `Overlay`).

## 9. Assumptions and open questions
- **Assumed (designer to confirm):**
  - Route group `user` because the HUD shows a logged-in character; target route unknown.
  - Three views in one route (decision made with the dev in this round); no URL per view.
  - Source text typos were kept as-is (e.g. "ทุกค่ำค่ำ" in the footer info line).
  - Dead CSS and unused keyframes of the HTML were dropped (see §4); nothing visible changes.
  - Fonts load from Google (same as the HTML).
- **Open:** see `DESIGN-REQUEST.md` §7 (route, guest view, final look, loading/error, which panels ship first).

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | 2026-10-16 | First version: ported `veymour-athenaeum-thai-v2.html` into a Next.js draft (state-based views, scoped CSS, split into components and mock files) | Designer asked to make the HTML compatible with website-frontend in a new `skeleton-mockup` folder |
