import { Flourish, InkDivider } from "@/components/Parchment"
import { TERMS_SECTIONS } from "../_mock/guideContent"

interface StepTermsProps {
  accepted: boolean
  onAcceptedChange: (v: boolean) => void
}

/** Step 1 — ข้อตกลงและกฎแห่งหุบเขา. The checkbox unlocks ถัดไป. */
export default function StepTerms({ accepted, onAcceptedChange }: StepTermsProps) {
  return (
    <div>
      <p className="mx-auto max-w-xl text-center font-ui text-[13.5px] leading-relaxed text-[#6b5533]">
        ก่อนจารึกวิญญาณใหม่ลงในสมุดทะเบียน ผู้เล่นต้องอ่านและรับทราบข้อตกลงต่อไปนี้ทั้งหมด
      </p>
      <div className="mx-auto mt-4 max-w-xs">
        <InkDivider>
          <Flourish className="h-4 w-4" />
        </InkDivider>
      </div>

      <div className="mt-6 max-h-[46vh] space-y-6 overflow-y-auto pr-2" tabIndex={0} aria-label="ข้อตกลงและกฎแห่งหุบเขา">
        {TERMS_SECTIONS.map((s) => (
          <div key={s.heading}>
            <h3 className="font-display text-xl text-[#3a2c1a]">✦ {s.heading}</h3>
            {s.body.map((p) => (
              <p key={p} className="mt-2 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
                {p}
              </p>
            ))}
          </div>
        ))}
      </div>

      <label
        className={`mt-7 flex cursor-pointer items-start gap-3 border p-4 transition ${
          accepted ? "border-[#8a6a35] bg-[#efe3c6]/70" : "border-dashed border-[#c9ad77] bg-[#efe3c6]/30 hover:border-[#a3854e]"
        }`}
      >
        <input
          type="checkbox"
          className="parch-check mt-0.5"
          checked={accepted}
          onChange={(e) => onAcceptedChange(e.target.checked)}
        />
        <span className="font-ui text-[13.5px] leading-relaxed text-[#3a2c1a]">
          ข้าพเจ้าได้อ่านและเข้าใจข้อตกลง กฎ รายละเอียด และแนวทางการสร้างตัวละครทั้งหมดข้างต้น และ
          <strong>ยินยอมผูกวิญญาณของตัวละครกับกฎแห่งหุบเขา Arcane Vale</strong>
        </span>
      </label>
    </div>
  )
}
