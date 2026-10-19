import PhotoCircle from "./PhotoCircle"
import { getBirthInfo, getDisplayName, type CharacterForm } from "./form"
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

function ReviewBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="parch-label mb-1.5">{label}</p>
      <div className="max-h-44 overflow-y-auto border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 px-4 py-3">
        <p className="whitespace-pre-wrap font-ui text-[13px] leading-relaxed text-[#5d4626]">{value.trim() || "—"}</p>
      </div>
    </div>
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

      <div className="space-y-5">
        <ReviewBlock label="ประวัติตัวละคร" value={form.backstory} />
        <ReviewBlock label="ลักษณะภายนอก" value={form.appearanceNotes} />
        <ReviewBlock label="อุปนิสัย" value={form.personality} />
        <ReviewBlock label="ข้อมูลเพิ่มเติม (TMI)" value={form.tmi} />
      </div>
    </div>
  )
}
