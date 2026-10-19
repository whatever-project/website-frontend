"use client"

import type { ReactNode } from "react"
import { useSkeleton, type PanelId } from "../../SkeletonContext"
import { CloseIcon } from "../../icons"

interface PanelShellProps {
  id: PanelId
  title: string
  /** optional tag next to the title (e.g. unread count) */
  tag?: ReactNode
  children: ReactNode
}

/** Frame shared by every overlay panel: title, optional tag, close button. Only the active panel is shown (`.on`). */
export default function PanelShell({ id, title, tag, children }: PanelShellProps) {
  const { panel, closeAll } = useSkeleton()
  return (
    <div className={`pnl${panel === id ? " on" : ""}`} id={`p-${id}`} role="dialog" aria-label={title}>
      <div className="in">
        <div className="phead">
          <h3>{title}</h3>
          {tag}
          <button type="button" className="xbtn" aria-label="ปิด" onClick={closeAll}>
            <CloseIcon />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
