import SectionHeading from "./SectionHeading"
import type { CharacterForm, FormPatch } from "./form"
import type { InfoTopicKey } from "../_mock/guideContent"

interface StepBackstoryProps {
  form: CharacterForm
  onChange: (patch: FormPatch) => void
  onOpenInfo: (topic: InfoTopicKey) => void
}

const GUIDE_BULLETS = [
  "ผู้เล่นสามารถกำหนดประวัติและที่มาของตัวละครได้อย่างอิสระ แต่ต้องระบุสายเลือด และที่มาของการเดินทางข้ามมิติให้ชัดเจน",
  "ระบุสายเลือดของบิดาและมารดา",
  "ระบุว่าเป็น สายเลือดบริสุทธิ์ หรือ สายเลือดผสม",
  "หากเป็นสายเลือดผสม ต้องระบุ สายเลือดเด่น ที่ใช้กำหนดลักษณะและความสามารถ",
  "ถูกดูดมาที่มิตินี้อย่างไร — ตัวละครถูก “เดอะริฟท์” (รอยแยกมิติ) ดูดมาจากมิติอื่น",
]

/** Step 5 — ประวัติตัวละคร + ข้อมูลเพิ่มเติม (TMI). */
export default function StepBackstory({ form, onChange, onOpenInfo }: StepBackstoryProps) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <SectionHeading title="เรื่องราวของตัวละคร" onDetail={() => onOpenInfo("backstory")} />
        <textarea
          id="cc-backstory"
          rows={7}
          aria-label="เรื่องราวของตัวละคร"
          className="parch-input w-full resize-none font-serithai"
          placeholder="เล่าเรื่องราวของตัวละคร..."
          value={form.backstory}
          onChange={(e) => onChange({ backstory: e.target.value })}
        />

        <div className="border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-4">
          <p className="parch-label mb-2">คำแนะนำการเขียนประวัติ</p>
          <ul className="list-disc space-y-1.5 pl-5 font-ui text-[12.5px] leading-relaxed text-[#5d4626]">
            {GUIDE_BULLETS.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="space-y-4">
        <SectionHeading title="ข้อมูลเพิ่มเติม (ไม่บังคับ · TMI ต่าง ๆ ของตัวละคร)" />
        <textarea
          id="cc-tmi"
          rows={3}
          aria-label="ข้อมูลเพิ่มเติม (TMI)"
          className="parch-input w-full resize-none font-serithai"
          placeholder="เรื่องเล็ก ๆ น้อย ๆ ที่อยากบอกต่อ เช่น ของชิ้นหัวใจโปรด นิสัยแปลก ๆ ความชอบส่วนตัว..."
          value={form.tmi}
          onChange={(e) => onChange({ tmi: e.target.value })}
        />
      </section>
    </div>
  )
}
