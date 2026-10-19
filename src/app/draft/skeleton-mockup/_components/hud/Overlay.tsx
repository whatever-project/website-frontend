"use client"

import { useSkeleton } from "../SkeletonContext"
import InfoPanel from "./panels/InfoPanel"
import ProfilePanel from "./panels/ProfilePanel"
import NotePanel from "./panels/NotePanel"
import CrystalPanel from "./panels/CrystalPanel"
import { LettersPanel, NotificationsPanel } from "./panels/MailPanels"
import { CalendarPanel, LorePanel, MapPanel } from "./panels/WorldPanels"
import { ChatPanel, FairyPanel, InventoryPanel } from "./panels/PlayPanels"

/** Dimmed backdrop that hosts the 12 overlay panels (only the active one is visible). Click outside or press Esc to close. */
export default function Overlay() {
  const { panel, closeAll } = useSkeleton()
  return (
    <div
      className={`ovl${panel ? " on" : ""}`}
      id="ovl"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAll()
      }}
    >
      <InfoPanel />
      <ProfilePanel />
      <NotePanel />
      <CrystalPanel />
      <LettersPanel />
      <NotificationsPanel />
      <MapPanel />
      <ChatPanel />
      <InventoryPanel />
      <FairyPanel />
      <CalendarPanel />
      <LorePanel />
    </div>
  )
}
