"use client"

import { useState } from "react"
import { Flourish, InkDivider, SheetCorners } from "@/components/Parchment"
import { PHOTO_PRESETS } from "../_mock/options"

interface PhotoPickerProps {
  /** currently chosen preset id ("" = none) */
  initial: string
  onCancel: () => void
  onConfirm: (id: string) => void
}

/** Modal with the preset avatars (step 3 "เลือกรูปภาพโปรไฟล์"). New element: InkModal is a different layout. */
export default function PhotoPicker({ initial, onCancel, onConfirm }: PhotoPickerProps) {
  const [sel, setSel] = useState(initial || PHOTO_PRESETS[0].id)

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="เลือกรูปภาพโปรไฟล์"
    >
      <button
        type="button"
        aria-label="ปิด"
        className="absolute inset-0 h-full w-full cursor-default bg-[#2a1f10]/45 backdrop-blur-[2px]"
        onClick={onCancel}
      />
      <div className="parch-sheet relative max-h-[85vh] w-full max-w-md overflow-y-auto p-6 sm:p-8">
        <SheetCorners />
        <p className="parch-label text-center">เลือกรูปภาพโปรไฟล์</p>
        <h3 className="font-jimthompson mt-1 text-center text-2xl text-[#3a2c1a]">รูปประจำตัว</h3>
        <div className="mx-auto mt-3 max-w-[180px]">
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
        </div>

        <div className="mt-5 grid grid-cols-4 gap-3" role="radiogroup" aria-label="รูปประจำตัว">
          {PHOTO_PRESETS.map((p, i) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={sel === p.id}
              aria-label={`รูปที่ ${i + 1}`}
              onClick={() => setSel(p.id)}
              className={`aspect-square overflow-hidden rounded-full border-2 transition ${
                sel === p.id
                  ? "border-[#8a6a35] shadow-[0_6px_16px_rgba(80,58,22,0.4)]"
                  : "border-[#b89a63] opacity-75 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <button type="button" onClick={onCancel} className="parch-btn-outline px-8 py-2.5 text-sm">
            ยกเลิก
          </button>
          <button type="button" onClick={() => onConfirm(sel)} className="parch-btn w-auto px-10 py-2.5 text-sm">
            ตกลง
          </button>
        </div>
      </div>
    </div>
  )
}
