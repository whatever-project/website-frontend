"use client"

import { useSkeleton } from "../SkeletonContext"
import Hero from "./Hero"
import SkyBackdrop from "./SkyBackdrop"
import GrandHub from "./GrandHub"
import SeventhSeal from "./SeventhSeal"
import LiveUpdates from "./LiveUpdates"
import MembersBoard from "./MembersBoard"
import { useShowDashboardContent } from "../frame/useShowDashboardContent"

/** View 1 of 3: the main page. Kept mounted (hidden) while other views are shown so its state survives. */
export default function HomeView() {
  const { view } = useSkeleton()
  const [showDashboardContent] = useShowDashboardContent() // temporary preview flag: false = Hero + sky only
  return (
    <main id="view-home" hidden={view.name !== "home"}>
      <SkyBackdrop />
      <Hero />
      {showDashboardContent ? (
        <>
          <GrandHub />
          <SeventhSeal />
          <LiveUpdates />
          <MembersBoard />
        </>
      ) : (
        // keeps enough sky below the hero to inspect the transition and the clouds by scrolling (height comes from sky-mist.css)
        <div className="sk-preview-sky" aria-hidden />
      )}
    </main>
  )
}
