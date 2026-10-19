"use client"

import { useSkeleton } from "../SkeletonContext"
import Placeholder from "../Placeholder"
import { clickable } from "../clickable"
import { BoardInfo, PatronInfo } from "../infoContent"
import { BOARD, STATIC_NOTES } from "../../_mock/copy"
import { BOARDS, PATRONS } from "../../_mock/home"
import { PLAYER } from "../../_mock/guide"

/** Public notice board: patrons list on the left, pinned notes (5 static + the ones the player writes) on the right. */
export function NoticeBoardCell() {
  const { openPanel, openInfo, userNotes } = useSkeleton()
  return (
    <div className="cell cell-board">
      <div className="c-label">
        <b>{BOARD.label}</b>
        <button type="button" className="nl-btn" onClick={() => openPanel("note")}>
          {BOARD.write}
        </button>
      </div>

      <div className="board-side">
        <div className="mini-label">
          <b>{BOARD.patronsLabel}</b>
        </div>
        <div className="patrons-v">
          {PATRONS.map((p) => (
            <div className="pv-row" key={p.name} {...clickable(() => openInfo(p.name, <PatronInfo />))}>
              <span className="ph">[โลโก้]</span>
              <span>
                <b>{p.name}</b>
                <span>{p.since}</span>
              </span>
              <span className="go">→</span>
            </div>
          ))}
        </div>
        <p className="patrons-caption">{BOARD.patronsCaption}</p>
      </div>

      <div className="board-main">
        <div className="board-bg" id="boardBg">
          {STATIC_NOTES.map((n) => (
            <div
              className={`note ${n.cls}`}
              key={n.cls}
              {...clickable(() => openInfo(BOARDS[n.board].title, <BoardInfo board={BOARDS[n.board]} />))}
            >
              <span className="pin" />
              <b>{n.title}</b>
              {Array.from({ length: n.lines }, (_, i) => (
                <i key={i} />
              ))}
              <div className="nd">{n.foot}</div>
            </div>
          ))}
          {userNotes.map((n, i) => (
            <div
              className="note usernote"
              key={i}
              style={{ left: n.slot.l, top: n.slot.t, transform: `rotate(${n.tilt}deg)`, zIndex: 6 }}
            >
              <span className="pin" />
              <b>{n.text.slice(0, 60)}</b>
              <i />
              <i />
              <div className="nd">โดย {PLAYER.name} · เมื่อสักครู่</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function AdsRow() {
  return (
    <div className="cell-ads">
      {[0, 1, 2].map((i) => (
        <Placeholder key={i} tag={BOARD.adTag} />
      ))}
    </div>
  )
}
