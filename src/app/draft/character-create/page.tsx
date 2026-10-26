"use client"

import { useEffect, useState } from "react"
import { SheetCorners } from "@/components/Parchment"
import DraftFrame from "./_components/DraftFrame"
import StepIndicator from "./_components/StepIndicator"
import StepHeading from "./_components/StepHeading"
import WizardNav from "./_components/WizardNav"
import StepTerms from "./_components/StepTerms"
import StepStory from "./_components/StepStory"
import StepIdentity from "./_components/StepIdentity"
import StepAppearance from "./_components/StepAppearance"
import StepBackstory from "./_components/StepBackstory"
import StepReview from "./_components/StepReview"
import InfoPanel from "./_components/InfoPanel"
import SubmittedScreen from "./_components/SubmittedScreen"
import PreviewBar from "./_components/PreviewBar"
import {
  SAMPLE_FORM,
  defaultForm,
  getDisplayName,
  sanitizeForm,
  validateAppearance,
  validateBackstory,
  validateIdentity,
  type CharacterForm,
  type FormPatch,
  type StepCheck,
} from "./_components/form"
import type { InfoTopicKey } from "./_mock/guideContent"

const TOTAL_STEPS = 6
const ROMAN = ["I", "II", "III", "IV", "V", "VI"]
/** English step names (small caps line above the title). */
const STEP_EN = ["THE ACCORD", "THE CROSSING", "IDENTITY", "APPEARANCE", "BACKSTORY", "THE SEAL"]
/** Page title in the frame header. */
const STEP_TITLE = [
  "ข้อตกลงแห่งหุบเขา",
  "เนื้อเรื่องย่อ",
  "ข้อมูลประจำตัว",
  "ลักษณะภายนอกและอุปนิสัย",
  "ประวัติตัวละคร",
  "ตรวจสอบข้อมูลตัวละคร",
]
/** Title inside the parchment sheet (steps 1–2 are longer than the header title). */
const SHEET_TITLE = [
  "ข้อตกลงและกฎแห่งหุบเขา",
  "เนื้อเรื่องย่อแห่งจักรวาล",
  STEP_TITLE[2],
  STEP_TITLE[3],
  STEP_TITLE[4],
  STEP_TITLE[5],
]

/** Draft-only storage key (kept different from any future live page). */
const STORAGE_KEY = "draft:character-create"
const FALLBACK_NAME = "ผู้พเนจรใหม่"

const NO_CHECK: StepCheck = { valid: true, hint: null }

export default function CharacterCreateDraftPage() {
  const [step, setStep] = useState(1)
  const [accepted, setAccepted] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState<CharacterForm>(defaultForm)
  const [hydrated, setHydrated] = useState(false)
  const [savedAt, setSavedAt] = useState<string | null>(null)
  const [info, setInfo] = useState<{ topic: InfoTopicKey; open: boolean }>({ topic: "backstory", open: false })

  const patch = (p: FormPatch) => setForm((f) => ({ ...f, ...p }))

  /* load the saved draft after mount (not during render → no hydration mismatch) */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- draft-only: restore autosave after mount
      if (raw) setForm(sanitizeForm(JSON.parse(raw)))
    } catch {
      /* corrupted draft — start fresh */
    }
    setHydrated(true)
  }, [])

  /* autosave on every change (mock of the future server-side draft) */
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form))
      // eslint-disable-next-line react-hooks/set-state-in-effect -- draft-only autosave clock
      setSavedAt(new Date().toLocaleTimeString("th-TH", { hour12: false }))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [form, hydrated])

  const goToStep = (n: number) => {
    setSubmitted(false)
    setStep(n)
    window.scrollTo({ top: 0 })
  }

  const openInfo = (topic: InfoTopicKey) => setInfo({ topic, open: true })
  const closeInfo = () => setInfo((i) => ({ ...i, open: false }))

  const submit = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
    setSubmitted(true)
    window.scrollTo({ top: 0 })
  }

  const check: StepCheck =
    step === 1
      ? { valid: accepted, hint: null }
      : step === 3
        ? validateIdentity(form)
        : step === 4
          ? validateAppearance(form)
          : step === 5
            ? validateBackstory(form)
            : NO_CHECK

  const preview = (
    <PreviewBar
      step={step}
      total={TOTAL_STEPS}
      submitted={submitted}
      onStep={goToStep}
      onFillSample={() => setForm(SAMPLE_FORM)}
      onClear={() => {
        setForm(defaultForm())
        setAccepted(false)
        goToStep(1)
      }}
      onShowSubmitted={() => {
        setSubmitted(true)
        window.scrollTo({ top: 0 })
      }}
    />
  )

  if (submitted) {
    return (
      <>
        <SubmittedScreen displayName={getDisplayName(form) || FALLBACK_NAME} />
        {preview}
      </>
    )
  }

  const index = step - 1
  const sub = `— ${STEP_EN[index]} · STEP ${ROMAN[index]} OF VI —`

  return (
    <>
      <DraftFrame sub={sub} title={STEP_TITLE[index]}>
        {/* content shifts left while the info panel is open (left/relative, not transform: a transform would
            re-anchor the fixed photo-picker modal to this wrapper instead of the viewport) */}
        <div className={`relative transition-[left] duration-300 ${info.open ? "left-[-88%] sm:-left-105" : "left-0"}`}>
          <div className="px-6 pt-8 sm:px-12">
            <StepIndicator current={step} total={TOTAL_STEPS} />
          </div>

          <div className="mx-auto max-w-3xl px-4 pt-8 sm:px-6">
            <div className="parch-sheet relative p-6 sm:p-10">

              <div className="mb-8">
                <StepHeading label={`STEP ${ROMAN[index]} — ${STEP_EN[index]}`} title={SHEET_TITLE[index]} />
              </div>

              {step === 1 && <StepTerms accepted={accepted} onAcceptedChange={setAccepted} />}
              {step === 2 && <StepStory />}
              {step === 3 && <StepIdentity form={form} onChange={patch} onOpenInfo={openInfo} />}
              {step === 4 && <StepAppearance form={form} onChange={patch} />}
              {step === 5 && <StepBackstory form={form} onChange={patch} onOpenInfo={openInfo} />}
              {step === 6 && <StepReview form={form} />}

              <WizardNav
                savedAt={step >= 3 ? savedAt : null}
                onPrev={() => goToStep(Math.max(1, step - 1))}
                onNext={() => (step === TOTAL_STEPS ? submit() : goToStep(step + 1))}
                prevDisabled={step === 1}
                nextDisabled={!check.valid}
                nextLabel={step === TOTAL_STEPS ? "ยืนยันการสร้างตัวละคร →" : "ถัดไป →"}
                error={check.hint}
              />
            </div>
          </div>
        </div>

        <InfoPanel open={info.open} topic={info.topic} onClose={closeInfo} />
      </DraftFrame>
      {preview}
    </>
  )
}
