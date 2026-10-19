"use client"

import { useSkeleton } from "../../SkeletonContext"
import PanelShell from "./PanelShell"

/** Generic panel: shows whatever `openInfo(title, node)` was called with (patches, posts, quests, crystals…). */
export default function InfoPanel() {
  const { info } = useSkeleton()
  return (
    <PanelShell id="info" title={info?.title ?? "รายละเอียด"}>
      <div id="infoBody">{info?.node}</div>
    </PanelShell>
  )
}
