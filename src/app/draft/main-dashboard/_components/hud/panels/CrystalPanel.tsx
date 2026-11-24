"use client"

import { useRef, useState } from "react"
import { useSkeleton } from "../../SkeletonContext"
import PanelShell from "./PanelShell"
import { CrystalInfo } from "../../infoContent"
import { PLAYER } from "../../../_mock/guide"

/** "Wake a crystal": post a text status (optionally with a picture) that floats to the front of the rail. */
export default function CrystalPanel() {
  const { addCrystal, closeAll, openInfo } = useSkeleton()
  const [text, setText] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [fileName, setFileName] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const pickFile = (file: File | undefined) => {
    if (!file) return
    setFileName(file.name)
    const reader = new FileReader()
    reader.onload = () => setImage(typeof reader.result === "string" ? reader.result : null)
    reader.readAsDataURL(file)
  }

  const send = () => {
    const v = text.trim()
    if (!v && !image) return
    const crystal = addCrystal(v, image)
    setText("")
    setImage(null)
    setFileName("")
    if (fileRef.current) fileRef.current.value = ""
    closeAll()
    openInfo(`Crystal — ${crystal.name}`, <CrystalInfo crystal={crystal} />)
  }

  return (
    <PanelShell id="crys" title="ปลุกคริสตัลแห่งสถานะ">
      <div style={{ marginBottom: 10 }}>
        <span className="sb-av" style={{ display: "inline-flex" }}>
          [รูป]
        </span>{" "}
        <b style={{ fontSize: 13 }}>{PLAYER.name}</b>{" "}
        <span style={{ fontSize: 11, color: "var(--faint)" }}>— คริสตัลนี้จะลอยขึ้นแถวหน้าสุด</span>
      </div>
      <textarea
        id="crysText"
        aria-label="ข้อความในคริสตัล"
        placeholder="บ่น ระบาย เล่าเรื่อง หรือพูดอะไรก็ได้ที่อยากให้ชุมชนรู้…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{
          width: "100%",
          border: "1px solid var(--g3)",
          borderRadius: 12,
          resize: "vertical",
          font: "inherit",
          fontSize: 13,
          padding: 12,
          minHeight: 96,
          background: "var(--white)",
          color: "var(--ink)",
        }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
        <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
          อัปโหลดรูป
        </button>
        <input ref={fileRef} type="file" accept="image/*" hidden aria-label="เลือกรูปสำหรับคริสตัล" onChange={(e) => pickFile(e.target.files?.[0])} />
        <span style={{ fontSize: 11, color: "var(--faint)" }}>{fileName || "ยังไม่ได้เลือกรูป"}</span>
      </div>
      {image && (
        <div style={{ marginTop: 10 }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local preview of a data URL */}
          <img src={image} alt="พรีวิวรูป" style={{ maxHeight: 150, border: "1px solid var(--g3)", borderRadius: 8, filter: "grayscale(1)" }} />
        </div>
      )}
      <div className="sb-foot" style={{ marginTop: 12 }}>
        <button type="button" className="btn" onClick={send}>
          ปลุกคริสตัล
        </button>
      </div>
    </PanelShell>
  )
}
