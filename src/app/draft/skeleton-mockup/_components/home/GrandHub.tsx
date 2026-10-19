import SectionHead from "../SectionHead"
import EmergencyCell from "./EmergencyCell"
import { PatchNotesCell, PatchOrbitCell } from "./PatchCells"
import { AdsRow, NoticeBoardCell } from "./NoticeBoardCell"
import { HUB } from "../../_mock/copy"

/** SEC.01 — The Grand Hub: emergency / newspaper, patch notes, patch orbit, notice board, ads. */
export default function GrandHub() {
  return (
    <section className="hub wrap" id="sec-hub">
      <SectionHead title={HUB.title} sub={HUB.sub} />
      <div className="hub-grid reveal d1">
        <EmergencyCell />
        <PatchNotesCell />
        <PatchOrbitCell />
        <NoticeBoardCell />
        <AdsRow />
      </div>
    </section>
  )
}
