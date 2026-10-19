import { useState } from "react"
import { Flourish, InkDivider, SheetCorners } from "@/components/Parchment"
import {
  GUIDE_BACKSTORY,
  INFO_TOPICS,
  STORY_SECTIONS,
  type GuideSection,
  type InfoTopicKey,
} from "../_mock/guideContent"

interface InfoPanelProps {
  open: boolean
  /** which guide to show (kept while the panel slides out) */
  topic: InfoTopicKey
  onClose: () => void
}

interface PanelTab {
  key: string
  label: string
  sections: GuideSection[]
}

/** Backstory shows two tabs (guide + Story Intro); the other topics show one page. */
function getTabs(topic: InfoTopicKey): PanelTab[] {
  if (topic === "backstory") {
    return [
      { key: "guide", label: "คำแนะนำประวัติตัวละคร", sections: GUIDE_BACKSTORY },
      { key: "story", label: "Story Intro", sections: STORY_SECTIONS },
    ]
  }
  const t = INFO_TOPICS.find((x) => x.key === topic) ?? INFO_TOPICS[0]
  return [{ key: t.key, label: t.label, sections: [...t.sections] }]
}

function PanelBody({ tabs }: { tabs: PanelTab[] }) {
  const [tab, setTab] = useState(tabs[0].key)
  const active = tabs.find((t) => t.key === tab) ?? tabs[0]

  const tabCls = (isActive: boolean) =>
    `border px-3 py-1.5 font-ui text-[12px] transition ${
      isActive ? "border-[#43331c] bg-[#43331c] text-[#e9d9ae]" : "border-[#b89a63] text-[#8a7350] hover:text-[#5d4626]"
    }`

  return (
    <>
      {tabs.length > 1 && (
        <div role="tablist" className="flex gap-2 border-b border-dashed border-[#c9ad77] px-6 py-3">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tabCls(tab === t.key)}
              onClick={() => setTab(t.key)}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {active.sections.map((s, i) => (
          <section key={s.heading} className={i > 0 ? "mt-7" : ""}>
            <h3 className="font-display text-xl text-[#3a2c1a]">✦ {s.heading}</h3>
            <InkDivider>
              <Flourish className="h-3.5 w-3.5" />
            </InkDivider>
            {s.body.map((p) => (
              <p key={p} className="mb-3 font-ui text-[13.5px] leading-relaxed text-[#5d4626] last:mb-0">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}

/**
 * Slide-out information panel on the right ("รายละเอียด" pills). New element.
 * The page shifts its content left while this is open (see page.tsx) so the form stays readable.
 */
export default function InfoPanel({ open, topic, onClose }: InfoPanelProps) {
  const [fullscreen, setFullscreen] = useState(false)
  const title = INFO_TOPICS.find((t) => t.key === topic)?.label ?? ""

  const close = () => {
    setFullscreen(false)
    onClose()
  }

  return (
    <aside
      aria-label={title}
      aria-hidden={!open}
      inert={!open}
      className={`parch-sheet fixed inset-y-0 right-0 z-40 flex flex-col overflow-hidden border-l-2 border-[#b89a63] shadow-[-16px_0_40px_rgba(50,36,14,0.3)] transition-transform duration-300 ${
        fullscreen ? "w-full" : "w-[88%] sm:w-105"
      } ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <SheetCorners />

      <header className="relative flex items-start justify-between gap-3 border-b border-dashed border-[#c9ad77] px-6 pt-6 pb-4">
        <div className="min-w-0">
          <p className="parch-label">Information Panel</p>
          <h2 className="mt-1 font-jimthompson text-2xl leading-tight text-[#3a2c1a]">{title}</h2>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            aria-label={fullscreen ? "ย่อแผง" : "ขยายแผงเต็มจอ"}
            aria-pressed={fullscreen}
            onClick={() => setFullscreen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b89a63] text-[#8a6a35] transition hover:text-[#5d4626]"
          >
            ⛶
          </button>
          <button
            type="button"
            aria-label="ปิดแผงคำแนะนำ"
            onClick={close}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[#b89a63] text-[#8a6a35] transition hover:border-[#8a2a1f] hover:text-[#8a2a1f]"
          >
            ✕
          </button>
        </div>
      </header>

      <PanelBody key={topic} tabs={getTabs(topic)} />

      <footer className="border-t border-dashed border-[#c9ad77] px-6 py-3 text-center">
        <p className="parch-label">✦ Arcane Vale — บันทึกแห่งหุบเขา ✦</p>
      </footer>
    </aside>
  )
}
