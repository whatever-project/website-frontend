<!--
Written by Kimi at the end of every design round (overwrite in place; append to the Iteration log).
Audience: the frontend dev who will promote this page. Be factual, list paths, don't sell.
Later stages (draft-to-live, api-handoff) update `status` and put a copy of this file in docs/handoffs/<page>/. The draft folder and this file stay in place as the designers' reference.
-->
---
page: <kebab-case-name>
status: designing          # designing | ready-for-dev | in-dev | promoted | backend-todo | backend-in-progress | backend-done
route_group: public | user | admin
target_route: /<path>
draft_url: /draft/<path>
round: 1
updated: YYYY-MM-DD
---

# <Page name>: dev context

## 1. What this page is
(2–3 sentences. Link to `DESIGN-REQUEST.md` for the full request.)

## 2. Files in the draft
| File | Purpose |
|---|---|
| `page.tsx` | Page |
| `_components/<Name>.tsx` | … |
| `_mock/<name>.ts` | Mock data |
| `_assets/<file>` | Attached image |

## 2b. Changes since promotion (revision rounds only; otherwise "n/a")
Written when a draft that dev already picked up (`in-dev` or later) is revised. The dev applies exactly these changes to the live page. Everything not listed is unchanged since the last promotion. Keep earlier rounds' rows. The live page may have been edited by a dev after promotion, so the dev compares before applying.
| Round | File (draft) | What changed | Why / who asked |
|---|---|---|---|
| | | | |

## 2d. Unused files (dev may delete)
Files in the draft that nothing imports any more. Kimi never deletes; the dev team decides.
- none

## 3. Reused (already in the repo)
| What | Path | Used for |
|---|---|---|
| `ParchShell` | `@/components/Parchment` | Page frame |

## 4. New elements (not in the repo before this draft)
| Element | Path | Why existing ones didn't fit | Promote to shared? |
|---|---|---|---|
| | `_components/…` | | yes / no / maybe |

New colours / fonts / spacing / animations / CSS (anything beyond `docs/ai/COMPONENTS.md`):
- none

## 5. Needs dev (couldn't be done inside the draft)
- none

## 6. Page states
| State | Trigger | What the draft shows |
|---|---|---|
| Empty | | |
| Loading | | |
| Error | | |
| Success | | |

## 7. Mock data → API entities
Shape of the mock data in `_mock/`, and the real entity it likely maps to. This feeds `api-handoff`.

| Mock field | Type | Likely API source | Notes |
|---|---|---|---|
| | | | |

User actions that will need an endpoint:
| Action (UI) | Likely call | Notes |
|---|---|---|
| | | |

## 8. Thai strings to move to i18n
(Group by section; the dev will turn these into `messages/th/<page>.json` and `messages/en/<page>.json`.)
- 

## 9. Assumptions and open questions
- **Assumed (designer to confirm):**
- **Open:**

## 10. Iteration log
| Round | Date | What changed | Why / who asked |
|---|---|---|---|
| 1 | YYYY-MM-DD | First version | Initial request |
