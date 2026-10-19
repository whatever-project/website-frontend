import { Flourish, InkDivider } from "@/components/Parchment"
import { STORY_SECTIONS } from "../_mock/guideContent"

/** Step 2 — เนื้อเรื่องย่อแห่งจักรวาล (read-only story intro). */
export default function StepStory() {
  return (
    <div>
      <div className="mx-auto max-w-xs">
        <InkDivider>
          <Flourish className="h-4 w-4" />
        </InkDivider>
      </div>
      <div className="mt-6 space-y-7">
        {STORY_SECTIONS.map((s, i) => (
          <div key={s.heading} className={i > 0 ? "border-t border-dashed border-[#c9ad77] pt-6" : ""}>
            <h3 className="font-display text-xl text-[#3a2c1a]">✦ {s.heading}</h3>
            {s.body.map((p) => (
              <p key={p} className="mt-2 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
