"use client"

import { useSkeleton } from "../SkeletonContext"
import Hero from "./Hero"
import Ticker from "./Ticker"
import GrandHub from "./GrandHub"
import SeventhSeal from "./SeventhSeal"
import LiveUpdates from "./LiveUpdates"
import MembersBoard from "./MembersBoard"

/** View 1 of 3: the main page. Kept mounted (hidden) while other views are shown so its state survives. */
export default function HomeView() {
  const { view } = useSkeleton()
  return (
    <main id="view-home" hidden={view.name !== "home"}>
      <Hero />
      <Ticker />
      <GrandHub />
      <SeventhSeal />
      <LiveUpdates />
      <MembersBoard />
    </main>
  )
}
