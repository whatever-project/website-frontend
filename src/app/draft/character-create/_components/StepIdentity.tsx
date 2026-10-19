import { useState } from "react"
import Field from "./Field"
import ChipSelect from "./ChipSelect"
import SectionHeading from "./SectionHeading"
import InfoButton from "./InfoButton"
import NameRules from "./NameRules"
import PhotoCircle from "./PhotoCircle"
import PhotoPicker from "./PhotoPicker"
import {
  checkEnglishName,
  checkThaiName,
  getBirthInfo,
  getDisplayName,
  type CharacterForm,
  type FormPatch,
} from "./form"
import { SETTING_MONTHS, monthsForSeason, seasonInfo, seasonsForDay, type SettingSeasonKey } from "./settingCalendar"
import {
  BEAST_RACES,
  BIRTH_MODES,
  BLOODLINE_TYPES,
  DOMINANT_BLOODLINES,
  NAME_FORMATS,
  NYMPH_SPIRITS,
  PHOTO_PRESETS,
} from "../_mock/options"
import type { InfoTopicKey } from "../_mock/guideContent"

interface StepIdentityProps {
  form: CharacterForm
  onChange: (patch: FormPatch) => void
  onOpenInfo: (topic: InfoTopicKey) => void
}

/** Step 3 — ข้อมูลประจำตัว (photo, names, birthdate, bloodline). */
export default function StepIdentity({ form, onChange, onOpenInfo }: StepIdentityProps) {
  const [pickerOpen, setPickerOpen] = useState(false)

  const firstCheck = checkEnglishName(form.firstNameEn)
  const lastCheck = checkEnglishName(form.lastNameEn)
  const thaiCheck = checkThaiName(form.nameTh)
  const displayName = getDisplayName(form)
  const birth = getBirthInfo(form)

  const seasons = form.settingDay > 0 ? seasonsForDay(form.settingDay) : []
  const months = form.settingDay > 0 && form.settingSeason !== "" ? monthsForSeason(form.settingDay, form.settingSeason) : []

  const changeDay = (day: number) => {
    const seasonOk = day > 0 && form.settingSeason !== "" && seasonsForDay(day).includes(form.settingSeason)
    const monthOk = seasonOk && form.settingSeason !== "" && monthsForSeason(day, form.settingSeason).includes(form.settingMonth)
    onChange({
      settingDay: day,
      settingSeason: seasonOk ? form.settingSeason : "",
      settingMonth: monthOk ? form.settingMonth : -1,
    })
  }

  return (
    <div className="space-y-8">
      {/* profile picture + names */}
      <section>
      <div className="grid gap-8 sm:grid-cols-[200px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            aria-label="เลือกรูปภาพโปรไฟล์"
            className="transition hover:opacity-85"
          >
            <PhotoCircle photo={form.photo} />
          </button>
          <button type="button" onClick={() => setPickerOpen(true)} className="parch-btn-outline px-5 py-2 text-sm">
            เลือกรูปภาพโปรไฟล์
          </button>
        </div>

        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="cc-first-name" label="ชื่อ (ภาษาอังกฤษ)">
              <input
                id="cc-first-name"
                className="parch-input w-full font-serithai"
                placeholder="Karen"
                value={form.firstNameEn}
                onChange={(e) => onChange({ firstNameEn: e.target.value })}
              />
              {firstCheck.message && (
                <>
                  <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">{firstCheck.message}</p>
                  <NameRules check={firstCheck} />
                </>
              )}
            </Field>
            <Field id="cc-last-name" label="นามสกุล (ภาษาอังกฤษ)">
              <input
                id="cc-last-name"
                className="parch-input w-full font-serithai"
                placeholder="Mason"
                value={form.lastNameEn}
                onChange={(e) => onChange({ lastNameEn: e.target.value })}
              />
              {lastCheck.message && (
                <>
                  <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">{lastCheck.message}</p>
                  <NameRules check={lastCheck} />
                </>
              )}
            </Field>
          </div>
          <Field id="cc-name-th" label="วิธีอ่านชื่อ–นามสกุล (ภาษาไทย)">
            <input
              id="cc-name-th"
              className="parch-input w-full font-serithai"
              placeholder="แคร์ริน เมสัน"
              value={form.nameTh}
              onChange={(e) => onChange({ nameTh: e.target.value })}
            />
            {thaiCheck.message && (
              <>
                <p className="mt-1.5 font-ui text-[12px] text-[#8a2a1f]">{thaiCheck.message}</p>
                <NameRules check={thaiCheck} isThai />
              </>
            )}
          </Field>
          <p className="font-ui text-[11.5px] leading-relaxed text-[#a68d5f]">
            ชื่อ Display Name ที่แสดงต่อสาธารณะจะใช้เป็นภาษาอังกฤษ — ส่วนภาษาไทยเป็นคำอ่านของชื่อนั้น
          </p>
        </div>
      </div>

      {/* display-name format — same markup as the Kimi reference app */}
      <div className="mt-6 border border-dashed border-[#c9ad77] bg-[#efe3c6]/30 p-4">
        <p className="parch-label mb-3">รูปแบบการแสดงชื่อ (เลือก 1 รูปแบบ)</p>
        <div className="flex flex-wrap items-center gap-4">
          {NAME_FORMATS.map((f) => (
            <label key={f.id} className="flex cursor-pointer items-center gap-2.5">
              <input
                type="checkbox"
                className="parch-check"
                checked={form.nameFormat === f.id}
                onChange={() => onChange({ nameFormat: f.id })}
              />
              <span className="font-ui text-[13px] text-[#5d4626]">{f.label}</span>
            </label>
          ))}
          <span className="ml-auto font-display text-lg text-[#3a2c1a]">
            {displayName || <span className="font-ui text-[12px] text-[#a68d5f]">ตัวอย่างจะปรากฏเมื่อกรอกชื่อ</span>}
          </span>
        </div>
      </div>
      </section>

      <div className="border-t border-dashed border-[#c9ad77]" />

      {/* birthdate */}
      <section className="space-y-5">
        <SectionHeading title="วันเกิด" onDetail={() => onOpenInfo("calendar")} />
        <Field
          id="cc-age"
          label="อายุ (ใส่ได้เฉพาะตัวเลข)"
          hint="ระบบใช้อายุคำนวณ “ปีเกิด” ของเซตติ้งให้โดยอัตโนมัติ"
          className="sm:max-w-xs"
        >
          <input
            id="cc-age"
            inputMode="numeric"
            className="parch-input w-full font-serithai"
            placeholder="เช่น 24"
            value={form.age}
            onChange={(e) => onChange({ age: e.target.value.replace(/\D/g, "") })}
          />
        </Field>

        <div>
          <p className="parch-label mb-2">เลือกรูปแบบวันเกิด</p>
          <ChipSelect
            options={BIRTH_MODES}
            value={form.birthMode}
            onChange={(id) => onChange({ birthMode: id as CharacterForm["birthMode"] })}
            ariaLabel="เลือกรูปแบบวันเกิด"
          />
        </div>

        {form.birthMode === "real" && (
          <Field id="cc-real-date" label="เลือกวันเกิด (สากล)" className="sm:max-w-xs">
            <input
              id="cc-real-date"
              type="date"
              className="parch-input w-full font-ui"
              value={form.realDate}
              onChange={(e) => onChange({ realDate: e.target.value })}
            />
          </Field>
        )}

        {form.birthMode === "setting" && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="cc-birth-day" label="วันเกิด">
              <select
                id="cc-birth-day"
                className="parch-input w-full font-serithai"
                value={form.settingDay}
                onChange={(e) => changeDay(Number(e.target.value))}
              >
                <option value={0}>— เลือกวันที่ —</option>
                {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            {form.settingDay > 0 && (
              <Field id="cc-birth-season" label="ฤดูกำเนิด">
                <select
                  id="cc-birth-season"
                  className="parch-input w-full font-serithai"
                  value={form.settingSeason}
                  onChange={(e) => onChange({ settingSeason: e.target.value as SettingSeasonKey, settingMonth: -1 })}
                >
                  <option value="">— เลือกฤดู —</option>
                  {seasons.map((k) => (
                    <option key={k} value={k}>
                      {seasonInfo(k).en} ({seasonInfo(k).th})
                    </option>
                  ))}
                </select>
              </Field>
            )}
            {form.settingDay > 0 && form.settingSeason !== "" && (
              <Field id="cc-birth-month" label="เดือน">
                <select
                  id="cc-birth-month"
                  className="parch-input w-full font-serithai"
                  value={form.settingMonth}
                  onChange={(e) => onChange({ settingMonth: Number(e.target.value) })}
                >
                  <option value={-1}>— เลือกเดือน —</option>
                  {months.map((i) => (
                    <option key={SETTING_MONTHS[i].key} value={i}>
                      {SETTING_MONTHS[i].en} ({SETTING_MONTHS[i].th})
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </div>
        )}

        {(birth.realLine || birth.settingLine) && (
          <div className="space-y-1.5 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 px-4 py-3">
            {birth.realLine && (
              <p className="font-ui text-[12.5px] text-[#5d4626]">
                <span className="text-[#a68d5f]">วันเกิด (สากล)</span> {birth.realLine}
              </p>
            )}
            {birth.settingLine && (
              <p className="font-ui text-[12.5px] text-[#5d4626]">
                <span className="text-[#a68d5f]">วันเกิด (เทียบเท่าเซตติ้ง)</span> {birth.settingLine}
              </p>
            )}
          </div>
        )}
      </section>

      <div className="border-t border-dashed border-[#c9ad77]" />

      {/* bloodline */}
      <section className="space-y-5">
        <SectionHeading title="ประเภทสายเลือด" onDetail={() => onOpenInfo("bloodline")} />
        <ChipSelect
          options={BLOODLINE_TYPES}
          value={form.bloodlineType}
          onChange={(id) => onChange({ bloodlineType: id })}
          ariaLabel="ประเภทสายเลือด"
        />

        {form.bloodlineType !== "" && (
          <div className="space-y-5 border-l-2 border-[#b89a63] pl-5">
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <p className="parch-label">สายเลือดเด่น (Dominant Bloodline)</p>
                <InfoButton label="ข้อมูลสายเลือดเด่น" onClick={() => onOpenInfo("bloodline")} />
              </div>
              <ChipSelect
                options={DOMINANT_BLOODLINES}
                value={form.dominant}
                onChange={(id) =>
                  onChange({
                    dominant: id,
                    beastRace: id === "halfbeast" ? form.beastRace : "",
                    nymphSpirit: id === "nymph" ? form.nymphSpirit : "",
                  })
                }
                ariaLabel="สายเลือดเด่น"
              />
            </div>

            {form.dominant === "halfbeast" && (
              <div className="space-y-3 border-l-2 border-[#c9ad77] pl-5">
                <p className="parch-label">เลือกสายพันธุ์ (ฮาล์ฟบีสต์)</p>
                <ChipSelect
                  options={BEAST_RACES}
                  value={form.beastRace}
                  onChange={(id) => onChange({ beastRace: id })}
                  ariaLabel="สายพันธุ์ของฮาล์ฟบีสต์"
                />
              </div>
            )}

            {form.dominant === "nymph" && (
              <div className="space-y-3 border-l-2 border-[#c9ad77] pl-5">
                <p className="parch-label">เลือกจิตวิญญาณ (นิมฟ์)</p>
                <ChipSelect
                  options={NYMPH_SPIRITS}
                  value={form.nymphSpirit}
                  onChange={(id) => onChange({ nymphSpirit: id })}
                  ariaLabel="จิตวิญญาณของนิมฟ์"
                />
              </div>
            )}
          </div>
        )}
      </section>

      {pickerOpen && (
        <PhotoPicker
          initial={PHOTO_PRESETS.some((p) => p.id === form.photo) ? form.photo : ""}
          onCancel={() => setPickerOpen(false)}
          onConfirm={(id) => {
            onChange({ photo: id })
            setPickerOpen(false)
          }}
        />
      )}
    </div>
  )
}
