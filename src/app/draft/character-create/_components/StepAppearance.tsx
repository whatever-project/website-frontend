import Field from "./Field"
import RichTextEditor from "./RichTextEditor"
import { MAX_CUSTOM_TOPICS } from "../_mock/options"
import type { CharacterForm, CustomTopic, FormPatch } from "./form"

interface StepAppearanceProps {
  form: CharacterForm
  onChange: (patch: FormPatch) => void
}

/** Step 4 — ลักษณะภายนอกและอุปนิสัย. */
export default function StepAppearance({ form, onChange }: StepAppearanceProps) {
  const setTopic = (index: number, patch: Partial<CustomTopic>) => {
    const topics = form.topics.map((t, i) => (i === index ? { ...t, ...patch } : t))
    onChange({ topics })
  }

  const removeTopic = (index: number) => {
    onChange({ topics: form.topics.filter((_, i) => i !== index) })
  }

  const addTopic = () => {
    if (form.topics.length >= MAX_CUSTOM_TOPICS) return
    onChange({ topics: [...form.topics, { label: "", value: "" }] })
  }

  return (
    <div className="space-y-8">
      <div className="color-fields">
        <Field id="cc-hair" label="สีผมตามกำเนิด">
          <input
            id="cc-hair"
            className="parch-input w-full font-serithai"
            placeholder="เช่น สีน้ำตาลเข้ม"
            value={form.hairColor}
            onChange={(e) => onChange({ hairColor: e.target.value })}
          />
        </Field>
        <Field id="cc-eyes" label="สีตาตามกำเนิด">
          <input
            id="cc-eyes"
            className="parch-input w-full font-serithai"
            placeholder="เช่น สีเขียวมรกต"
            value={form.eyeColor}
            onChange={(e) => onChange({ eyeColor: e.target.value })}
          />
        </Field>
        <Field id="cc-skin" label="สีผิวตามกำเนิด">
          <input
            id="cc-skin"
            className="parch-input w-full font-serithai"
            placeholder="เช่น ผิวขาวเหลือง"
            value={form.skinColor}
            onChange={(e) => onChange({ skinColor: e.target.value })}
          />
        </Field>
      </div>

      <div className="measure-row">
        <Field id="cc-scent" label="กลิ่นประจำตัว (ไม่บังคับ)">
          <input
            id="cc-scent"
            className="parch-input w-full font-serithai"
            placeholder="เช่น กลิ่นฝนตกบนใบไม้"
            value={form.scent}
            onChange={(e) => onChange({ scent: e.target.value })}
          />
        </Field>
        <Field id="cc-height" label="ส่วนสูง">
          <div className="unit-input">
            <input
              id="cc-height"
              inputMode="numeric"
              className="font-serithai"
              placeholder="168"
              value={form.height}
              onChange={(e) => onChange({ height: e.target.value.replace(/\D/g, "") })}
            />
            <span>cm.</span>
          </div>
        </Field>
        <Field id="cc-weight" label="น้ำหนัก">
          <div className="unit-input">
            <input
              id="cc-weight"
              inputMode="numeric"
              className="font-serithai"
              placeholder="52"
              value={form.weight}
              onChange={(e) => onChange({ weight: e.target.value.replace(/\D/g, "") })}
            />
            <span>kg.</span>
          </div>
        </Field>
      </div>

      {/* custom extra topics */}
      <div className="space-y-3">
        <p className="parch-label">หัวข้อเพิ่มเติม (ไม่บังคับ) : เพิ่มได้ไม่เกิน {MAX_CUSTOM_TOPICS} หัวข้อ เช่น รอยตำหนิ, รอยสัก, MBTI</p>
        {form.topics.map((topic, i) => (
          <div key={i} className="flex items-center gap-3 border border-dashed border-[#c9ad77] px-3 py-2">
            <input
              aria-label={`ชื่อหัวข้อที่ ${i + 1}`}
              placeholder="หัวข้อ"
              value={topic.label}
              onChange={(e) => setTopic(i, { label: e.target.value })}
              className="w-20 shrink-0 border border-[#b89a63] bg-transparent px-2 py-1 text-center font-ui text-[11px] text-[#5d4626] outline-none focus:border-[#8a6a35]"
            />
            <input
              aria-label={`รายละเอียดของหัวข้อ ${topic.label || i + 1}`}
              value={topic.value}
              onChange={(e) => setTopic(i, { value: e.target.value })}
              className="w-full min-w-0 flex-1 bg-transparent font-serithai text-[14px] text-[#3a2c1a] outline-none"
            />
            <button
              type="button"
              aria-label={`ลบหัวข้อ ${topic.label || i + 1}`}
              onClick={() => removeTopic(i)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#b89a63] text-[#a68d5f] transition hover:border-[#8a2a1f] hover:text-[#8a2a1f]"
            >
              ✕
            </button>
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={addTopic}
            disabled={form.topics.length >= MAX_CUSTOM_TOPICS}
            className="parch-btn-outline px-5 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-35"
          >
            ✦ เพิ่มหัวข้อเอง
          </button>
        </div>
      </div>

      <div className="border-t border-dashed border-[#c9ad77]" />

      <Field id="cc-appearance" label="ลักษณะภายนอก">
        <RichTextEditor
          id="cc-appearance"
          label="ลักษณะภายนอก"
          placeholder="บรรยายลักษณะภายนอกโดยละเอียด เช่น รูปร่าง ทรงผม รอยแผลเป็นที่เห็นได้..."
          minHeight={160}
          value={form.appearanceNotes}
          onChange={(appearanceNotes) => onChange({ appearanceNotes })}
        />
      </Field>

      <Field id="cc-personality" label="อุปนิสัย (ไม่บังคับ)">
        <RichTextEditor
          id="cc-personality"
          label="อุปนิสัย"
          placeholder="บรรยายอุปนิสัย นิสัยใจคอ พฤติกรรมที่โดดเด่น..."
          minHeight={160}
          value={form.personality}
          onChange={(personality) => onChange({ personality })}
        />
      </Field>
    </div>
  )
}
