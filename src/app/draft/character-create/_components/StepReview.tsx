import { useId, useMemo, useState } from "react"
import PhotoCircle from "./PhotoCircle"
import { cleanRichText, getBirthInfo, getDisplayName, type CharacterForm } from "./form"
import { BEAST_RACES, BLOODLINE_TYPES, DOMINANT_BLOODLINES, NYMPH_SPIRITS, optionLabel } from "../_mock/options"

interface StepReviewProps {
  form: CharacterForm
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border-b border-dashed border-[#c9ad77] py-2.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <span className="parch-label shrink-0">{label}</span>
      <span className="font-ui text-[13.5px] leading-relaxed text-[#3a2c1a] sm:text-right">{value || "—"}</span>
    </div>
  )
}

function BookIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 7v14M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg className="review-chevron" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/** Expandable reading sheet: collapsed by default, unfolds to show the formatted text. */
function ReviewBlock({ label, value }: { label: string; value: string }) {
  const [open, setOpen] = useState(false)
  const id = useId()
  // Sanitise once per value, not on every toggle (DOMParser on each render caused the lag).
  const html = useMemo(() => cleanRichText(value) || "—", [value])

  return (
    <section className={`review-block ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="review-trigger"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="review-book" aria-hidden="true"><BookIcon /></span>
        <span className="review-label"><small>✦ บันทึกตัวละคร</small>{label}</span>
        <span className="review-action">{open ? "ย่อเก็บ" : "กดเพื่ออ่าน"}</span>
        <ChevronIcon />
      </button>
      <div id={id} className="review-panel" aria-hidden={!open} inert={!open}>
        <div className="review-panel-inner">
          <div className="review-content font-ui">
            <div className="rich-rendered" dangerouslySetInnerHTML={{ __html: html }} />
          </div>
        </div>
      </div>
    </section>
  )
}

/** Step 6 — ตรวจสอบข้อมูลตัวละคร: reflects what was typed in steps 3–5. */
export default function StepReview({ form }: StepReviewProps) {
  const birth = getBirthInfo(form)
  const displayName = getDisplayName(form)
  const dominantLine =
    [
      optionLabel(DOMINANT_BLOODLINES, form.dominant),
      form.beastRace ? optionLabel(BEAST_RACES, form.beastRace) : "",
      form.nymphSpirit ? optionLabel(NYMPH_SPIRITS, form.nymphSpirit) : "",
    ]
      .filter((s) => s && s !== "—")
      .join(" · ") || "—"
  const colors = [form.hairColor, form.eyeColor, form.skinColor].map((s) => s.trim()).filter(Boolean).join(" · ") || "—"
  const size =
    [form.height.trim() && `${form.height.trim()} cm.`, form.weight.trim() && `${form.weight.trim()} kg.`]
      .filter(Boolean)
      .join(" · ") || "—"
  const formatDesc =
    form.nameFormat === "first-last"
      ? "เอาชื่อต้นขึ้นก่อน (Firstname Lastname)"
      : "เอานามสกุลขึ้นก่อน (Lastname Firstname)"

  return (
    <div className="space-y-6">
      {/* summary card */}
      <div className="flex items-center gap-5 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-5">
        <PhotoCircle photo={form.photo} className="h-20 w-20" />
        <div className="min-w-0">
          <p className="parch-label">Display Name</p>
          <p className="font-display truncate text-2xl text-[#3a2c1a]">{displayName || "—"}</p>
          <p className="mt-1 font-ui text-[12px] text-[#8a7350]">
            อ่านว่า “{form.nameTh.trim() || "—"}” · รูปแบบการแสดง: {formatDesc}
          </p>
        </div>
      </div>

      <div>
        <ReviewRow label="วันเกิด (สากล)" value={birth.realLine ?? "—"} />
        <ReviewRow label="วันเกิด (เทียบเท่าเซตติ้ง)" value={birth.settingLine ?? "—"} />
        <ReviewRow label="อายุ" value={form.age.trim() ? `${form.age.trim()} ปี` : "—"} />
        <ReviewRow label="ประเภทสายเลือด" value={optionLabel(BLOODLINE_TYPES, form.bloodlineType)} />
        <ReviewRow label="สายเลือดเด่น" value={dominantLine} />
        <ReviewRow label="สีผม / สีตา / สีผิว" value={colors} />
        <ReviewRow label="กลิ่นประจำตัว" value={form.scent.trim() || "—"} />
        <ReviewRow label="ส่วนสูง / น้ำหนัก" value={size} />
        {form.topics.map((t, i) => (
          <ReviewRow key={i} label={t.label.trim() || `หัวข้อที่ ${i + 1}`} value={t.value.trim() || "—"} />
        ))}
      </div>

      <div className="review-blocks">
        <ReviewBlock label="ลักษณะภายนอก" value={form.appearanceNotes} />
        <ReviewBlock label="อุปนิสัย" value={form.personality} />
        <ReviewBlock label="ประวัติตัวละคร" value={form.backstory} />
        <ReviewBlock label="ข้อมูลเพิ่มเติม (TMI)" value={form.tmi} />
      </div>
    </div>
  )
}
