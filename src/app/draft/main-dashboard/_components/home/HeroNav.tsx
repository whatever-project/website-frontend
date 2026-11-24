"use client"

import type { MouseEvent, PointerEvent } from "react"
import { HERO_NAV } from "../../_mock/heroNav"
import { usePageNav } from "../bottomhud/usePageNav"

/**
 * Horizontal Thai-only navigation at the bottom right of the hero banner.
 * The current page is still tracked (aria-current, .active class) but has no visual style: every item looks the same
 * until it is hovered / focused, when a soft golden glow and a few twinkling sparkles appear (pure CSS).
 */
export default function HeroNav() {
  const { currentPage, goPage } = usePageNav()

  /* after a mouse click the effect stays off until the pointer leaves (no gold left behind); keyboard activation keeps focus and its ring */
  const onClick = (e: MouseEvent<HTMLButtonElement>, id: (typeof HERO_NAV)[number]["id"]) => {
    if (e.detail > 0) {
      e.currentTarget.dataset.clicked = "1"
      e.currentTarget.blur()
    }
    goPage(id)
  }
  const onLeave = (e: PointerEvent<HTMLButtonElement>) => {
    delete e.currentTarget.dataset.clicked
  }

  return (
    <nav className="hn" aria-label="หน้าหลักของเว็บไซต์">
      <ul>
        {HERO_NAV.map((it) => {
          const active = currentPage === it.id
          return (
            <li key={it.id}>
              <button
                type="button"
                className={`hn-item${active ? " active" : ""}`}
                aria-current={active ? "page" : undefined}
                onClick={(e) => onClick(e, it.id)}
                onPointerLeave={onLeave}
              >
                <span className="hn-label">{it.th}</span>
                <i className="hn-sp hn-sp1" aria-hidden />
                <i className="hn-sp hn-sp2" aria-hidden />
                <i className="hn-sp hn-sp3" aria-hidden />
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
