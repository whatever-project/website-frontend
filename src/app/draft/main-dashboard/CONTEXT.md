---
page: main-dashboard
status: designing
route_group: user
target_route: "[TBD]"
draft_url: /draft/main-dashboard
round: 2
updated: 2026-11-15
---

# Main Dashboard: dev context (started as a copy of skeleton-mockup; see round 2 in §10)

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
| 2 | 2026-11-15 | Copied to `main-dashboard`. Fantasy re-skin (approved palette) via new `_styles/fantasy.css` loaded after `skeleton.css`; new `_components/Sidebar.tsx` (sidebar-bg/top/foot art); compact hero with `hero-banner.png` and "The Grand Hub" title (`Hero.tsx`, `HERO` in `_mock/copy.ts`); floating Task Bar (`<Hud />`) hidden via `SHOW_TASKBAR = false` in `SkeletonRoot.tsx` (source untouched); fonts Cinzel / Cinzel Decorative added; hero map recoloured; `.hero-issue` + `.brandmark` + scroll cue removed from the hero | Designer asked for the Main Dashboard homepage implementation. `skeleton-mockup` is untouched and is the recoverable original |

### Round 2 notes
- **Assets in use:** `public/assets/main-dashboard/hero-banner.png` and `sidebar-bg.png`, set through a CSS variable in `Sidebar.tsx` / an inline style in `Hero.tsx` (the designer placed them there; Kimi never writes to `public/`). `sidebar-top.png` and `sidebar-foot.png` are no longer rendered (files kept, round 2b). On promotion move the used files into `_assets/` or the live asset folder.
- **Round 3 — bottom game HUD replaces the sidebar:** the left sidebar is gone (no grid column, no mini/floating sidebar, no toggle). `_components/bottomhud/BottomHud.tsx` is a fixed glass bar (`position: fixed`, `env(safe-area-inset-bottom)`) with 4 zones: **A** player (avatar, name, role, wallet D + K on one line, mail / notifications / account with unread badges), **B** HP + Mana bars with `+1 ใน mm:ss` countdowns (demo ticks), **C** world time / date / season / weather / moon, **D** two menu buttons (World Navigation, Personal & Gameplay) + minimise. The menus are floating panels above the bar, one at a time (toggle, Escape, click outside, arrow keys; they live outside the bar so nothing clips them). Menu data is in `bottomhud/menus.tsx`, mock status data in `_mock/hudStatus.ts`. Minimise reuses `mini` / `toggleMini` from `SkeletonContext` (closes any open menu). The bar height is measured with a `ResizeObserver` and written to `--hud` on `.sk-root`, so page padding, toasts, overlays and the account popover keep clear of it. Phones start minimised. Breakpoints: ≥1360 four zones, 700–1359 2×2, <700 stacked / compact.
- **Round 4 — hero navigation:** the capsule nav (หน้าหลัก / แผนที่ / ปฏิทิน / ฟอรั่มหลัก, `glass-nav`) is removed from `Hero.tsx` and its CSS deleted. New `home/HeroNav.tsx` is a frosted-glass panel (`backdrop-filter: blur(14px)`, warm translucent brown, hairline cream border, 3px radius) inside `.hero-copy`, above the kicker and the title, with 5 items "Thai • English" (data in `_mock/heroNav.ts`). Page switching is shared with the HUD through `bottomhud/usePageNav.tsx` (`goPage`, `currentPage`). Active = gold edge line + faint gold wash; hover = soft wash + brighter text (0.25s). Desktop/tablet: panel above the title (hero min-height 560px); phones: the hero grows with its content, panel full width above the title.
- **Routes still missing (Needs dev):** none of the five items has a real route. `route` is `null` in `_mock/heroNav.ts` for all of them, so no fake link is rendered: Community Dashboard = this page, World Forums = draft view `forums`, Patch Updates = patch-log panel, Members = scroll to the Members section, Guide = `[TBD]` placeholder panel. Hero **map** and **calendar** shortcuts left with the capsule nav: the map is still reachable from the HUD (World Navigation → Locations, Personal → World Map); the calendar panel (`cal`) currently has no entry point.
- **Round 5 — horizontal hero nav + gold frame:** `HeroNav.tsx` is now a Thai-only horizontal strip at the bottom right of the banner (thin dark-violet translucent bar, vertical hairline separators, cream text, active = pale gold + thin underline; below 900px it moves under the title, wrapping to 2 rows on phones). `summer-top-decor.png` (`public/assets/main-dashboard/`, 2172×724, only the top ~66% is artwork) is an `<img class="hero-decor">` at the top of `.hero-banner`: full width, `height:auto`, `pointer-events:none`, above the picture. The banner picture + shade are clipped with a `clip-path` polygon measured from the PNG's own top outline (units `cqw`, hero is a size container), so no landscape shows above the gold line; the hero itself is not `overflow:hidden`, so flowers are never cut. If the PNG is replaced, re-measure that polygon in `fantasy.css`.
- **Round 6 — player profile:** the bar outline is drawn by `.bh-bar::before` with a two-circle CSS mask (cut-outs under the portrait and the top shortcut), so the circle sits on the frame instead of the line running through it. Shortcuts: gap to the portrait 13→27px, arc spacing ~37→47px, positions from `--r/--cs/--sn`. Portrait picture = `HUD_PLAYER.avatarUrl` (`/assets/avatars/karen-mason.jpg`, **file not added yet**: the initials are shown until it exists), `avatarFocus` / `avatarZoom` keep the face centred; replace the picture by changing those values only.
- **Round 7 — hero nav polish:** nav is text only (no background / border / blur / shadow box), 5 equal CSS-grid columns (`--col` 140px, 122px ≤1180px; 6-column grid on phones), label "สำรวจดินแดน". The current page has no visual style (`aria-current` + `.active` class kept in the markup for logic / assistive tech). Hover / `:focus-visible` = text fades to pale gold, soft golden glow, thin gold line with a light sliding along it, 3 twinkling four-point stars (`.hn-sp`, `clip-path`, absolute, pure CSS); after a mouse click the effect stays off until the pointer leaves (`data-clicked`), keyboard activation keeps focus. `prefers-reduced-motion`: stars hidden, no animation. **Seam fix:** the banner picture's last rows are bright and its edge + the shade's edge are anti-aliased separately on fractional hero heights (e.g. 809.77px at 1853px wide) so a 1px line of picture leaked; `.banner-img` now has a `mask-image` that fades it to transparent before the bottom edge (the shade gradient is unchanged). The old `clip-path` tied to the previous decoration art was removed because `summer-top-decor.png` is now a horizontal ornament band, not a frame (re-measure a clip polygon if a frame returns). Avatar: `HUD_PLAYER.avatarUrl = "/assets/avatar-1.jpg"`, `avatarFocus "47% 10%"`, `avatarZoom 1.4`.
- **Round 8:** hero shows only the banner + the nav, centred at the bottom (`summer-top-decor` no longer rendered, file kept; the kicker / "The Grand Hub" / description block removed from `Hero.tsx`; phones: hero height 260px). Task bar glass = smoky warm translucent (`--bh-glass` rgba(28,23,20,.62), blur 16px, hairline cream border, no purple). Portrait drops 14px (`--pdrop`) so it extends below the bar and the outline mask is centred on the dropped circle; shortcuts keep their old positions.
- **Round 9 — viewport-fixed page frame:** `summer-top-decor` and everything built around it (clip-path on the banner, fog, glints, hero-ratio hack) were removed; the hero is back to the banner's own ratio (1897x829). New `_components/frame/PageFrame.tsx` + `_styles/frame.css`: `.mf-frame` is a `position: fixed` layer drawing `public/assets/main-dashboard/summer-main-frame.png` (1672x941) as a nine-slice `border-image` (slices 290/150/150/150, one scale `--u` = min(100vw/1672, 100vh/700) so ornaments are never stretched horizontally; extra height only stretches the plain side rails). The website scrolls inside `.mf-scroll` (fixed, inset by `--f-top/--f-bot/--f-x`, clipped around the hanging wisteria / bottom flowers), so nothing runs under the border; the window itself never scrolls. HUD, overlays and the account popover are re-anchored inside the frame (`--f-hud-r/--f-hud-b` keep the HUD above the bottom corner flowers). ≤900px: no frame, normal page scroll. `SkeletonContext.scrollTop` scrolls `#mf-scroll` when it is the scroller. Limitations: the scrollbar is cut by the corner clips; the draft layout's fixed "Back to dev tools" pill sits under the frame (dev only).
- **Round 10 — frame fit:** the old safe area was a plain rectangle (100u/62u/44u) INSIDE the deepest point of the wavy border, leaving purple gutters on all four sides. Now the frame's opening is flood-filled from the PNG's transparent centre and its real contour (x 44..1628, y 70..882 source px; 796 points sampled every 4px, 2px inside the gold edge) is the `clip-path` of `.mf-scroll` (`frame.css` is generated from it; regenerate if the PNG changes). The artwork's own bounding box (1642x916) is placed `--fm` = 8px from the browser edges, `--u` = min((100vw-16)/1642, (100vh-16)/916); the frame box is offset by the PNG's transparent margin. Result: gaps between the scroller and the opening's edge are 1-3.5px on every side, content padding stays in `.wrap`. HUD / overlay / popover anchor to `--s-l/--s-r/--s-t/--s-b` and `--f-hud-r/-b`.
- **Round 11 — frame simplified (supersedes round 10's inner mask):** three layers only: A purple page background (only visible outside the frame), B `.mf-scroll` = the website, clipped to the frame's OUTER silhouette (flood-fill of the PNG's transparent pixels connected to the border; 822-point `clip-path` in `frame.css`, hidden by the gold's own outer edge), C `.mf-frame` on top. The inner-contour polygon (which caused the dark jagged shapes near the wisteria) and all inset-driven content boxes are gone; the website now shows through every transparent part of the PNG. Frame size / position unchanged. `--i-*` vars (the opening's bounding box) are used only to keep the HUD, overlays and popovers inside the opening. Regenerate the clip if the PNG changes. Known trade-off: content scrolling under the ornaments can be seen through their transparent gaps.
- **Round 12 — frame mask = the opening:** round 11's outer-silhouette clip let the website show through the lacework of the gold band (ragged cards / dark shapes in the screenshot) and, together with a width-driven `--u` clamped by height, left the frame off-centre. Now `.mf-scroll` is clipped to the OPENING (flood-fill of the transparent centre, grown 6 source px so the edge sits under opaque gold; 802-point `clip-path` in `frame.css`, 99.99% of the opening covered). One origin `--f-x0 = (100vw - 1672u)/2` positions the frame and the mask box, so they are always centred together; `scrollbar-gutter: stable both-edges` keeps the content centred whatever the scrollbar width; `--u` is limited by height only for very wide windows (740 source px). Verified symmetric content gaps (e.g. 77.5 / 77.5 px at 1864x940).
- **Function mapping (old sidebar → HUD):** home / forums / locations (hero map) / patch log / members (scroll) / guide (placeholder) → World Navigation; the old Task Bar shortcuts → Personal & Gameplay (inventory, wallet, quests, spellbook, world map, profile open the existing panels; **Bank & Vault** and **Exploration** are "Coming Soon" and do nothing). There are no real routes in this draft (views are state), so "page change" = the existing `SkeletonContext` view / nav actions.
- **Unused now (kept on disk, dev may delete):** `_components/Sidebar.tsx`, `_components/hud/Hud.tsx` (old dome), `_components/home/Ticker.tsx`. The old `.md-*` sidebar CSS was removed from `fantasy.css`.
- **Needs dev:** replace `_mock/hudStatus.ts` with the character / wallet (Drankle + Kel, 100 Kel = 1 Drankle, never auto-converted) / HP-Mana regen / game-clock services; wire the "Coming Soon" items when those systems exist.
- **Layout (round 2b, superseded):** hero height `clamp(300px, 24vw, 400px)` → now uses the banner's own aspect ratio, full width.
- **Fonts (round 2d/2e):** Jim Thompson Roman (`/fonts/JimThompsonRoman.ttf`, 87/91 Thai glyphs) is declared twice in `fantasy.css`: `"MD English"` (Latin only → body/labels, Thai falls to Google Sans from `src/styles/globals.css`) and `"MD Head"` (Latin + Thai → headings via `--head`, `--display`, `--serif`). Small letter-spaced Thai lines (kicker, emergency subtitle) stay in Google Sans. The old Cinzel / Playfair / Sarabun / JetBrains `<link>` was removed. `font-synthesis: none` because Jim Thompson has a single weight (Thai keeps real Google Sans weights). The Jim Thompson file is a licensed brand font (see the note in `globals.css`).
- **Round 2c:** `sidebar-bg.png` is no longer used either (only `hero-banner.png` is). Page + sidebar background is the flat `--bg: #161326`. The Task Bar's shortcuts (world map, crystal chat, spell book, inventory, purse, fairy, quests, compass, mail, notifications, account, profile) now live in the sidebar ("TOOLS" group + player card); the floating `<Hud />` stays hidden (`SHOW_TASKBAR = false`).
- **Sidebar frame:** `border-image` on `sidebar-bg.png` (slice 380/70/520/70, rails `round`) so corners are never stretched. The CSS fill colours were sampled from the image to hide seams.
- **Needs dev:** sidebar items "Patch Update" and "คู่มือการเล่น" reuse the existing patch-log panel / a `[TBD]` placeholder; "รายชื่อสมาชิก" scrolls to the members section; real routes are TBD.
- **Needs dev:** notes `.n4`/`.n5` on the notice board are hidden below 1700 / 2100px because their fixed `left` offsets no longer fit next to the sidebar; give the notes percentage positions when the board is built for real.
