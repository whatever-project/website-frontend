"use client"

import { useState, type CSSProperties } from "react"
import Placeholder from "./Placeholder"
import { QUEST } from "../_mock/copy"
import { HONOR, PATCHES, type BoardPost, type Citizen, type HonorEntry, type OrbitPost, type Patch, type Post, type Role } from "../_mock/home"
import type { Crystal } from "../_mock/crystals"
import { PLAYER } from "../_mock/guide"

/**
 * Bodies of the generic "info" overlay panel (the wireframe's openInfo(title, html) calls).
 * Each one is a small presentational component; the title is built where it is opened.
 */

const body: CSSProperties = { fontSize: 12.5, lineHeight: 1.8 }
const muted: CSSProperties = { color: "var(--muted)" }
const faint: CSSProperties = { color: "var(--faint)" }
const bold: CSSProperties = { fontWeight: 600 }

const MOCK_LINK = <span style={faint}>ลิงก์จำลอง</span>
const MOCK = <span style={faint}>จำลอง</span>

function Rune() {
  return (
    <div className="rune" style={{ marginBottom: 8 }}>
      <span>✦</span>
    </div>
  )
}

const tagCls = (category: string) => `tag${category === "อีเวนต์" ? " solid" : ""}`

export function PatchInfo({ patch }: { patch: Patch }) {
  return (
    <div style={body}>
      <div style={{ marginBottom: 8, display: "flex", gap: 6 }}>
        <span className={tagCls(patch.category)}>{patch.category}</span>
        <span className="tag">{patch.date}</span>
      </div>
      <p>{patch.body}</p>
      <Placeholder style={{ marginTop: 10, height: 90 }} tag="[ภาพประกอบแพตช์]" />
    </div>
  )
}

export function PatchLogInfo() {
  return (
    <>
      {PATCHES.map((p) => (
        <div className="roll" key={p.version}>
          <span style={{ flex: 1 }}>
            <b style={bold}>{p.version}</b>
            <span style={{ fontSize: 12, ...muted }}> — {p.title}</span>
          </span>
          <span className={tagCls(p.category)}>{p.category}</span>
        </div>
      ))}
    </>
  )
}

export function OrbitPostInfo({ category, post }: { category: string; post: OrbitPost }) {
  return (
    <div style={body}>
      <p style={muted}>
        หมวด {category} · อัปเดต {post.time}
      </p>
      <p style={{ fontStyle: "italic", ...muted }}>“…ย่อหน้าเปิดของโพสต์จะแสดงที่นี่ ส่วนเนื้อเต็มเปิดได้ในฟอรั่มจริง”</p>
      <button type="button" className="btn">
        เปิดโพสต์
      </button>{" "}
      {MOCK_LINK}
    </div>
  )
}

export function PostInfo({ post }: { post: Post }) {
  return (
    <div style={body}>
      <p style={muted}>
        {post.author} · {post.forum} · อัปเดต {post.age}ที่แล้ว · {post.replies} ตอบกลับ · อ่าน {post.views}
      </p>
      <p style={{ fontStyle: "italic", ...muted }}>“…ย่อหน้าเปิดของกระทู้จะแสดงที่นี่ ส่วนฉากเต็มเปิดได้ในฟอรั่มจริง”</p>
      <button type="button" className="btn">
        เปิดกระทู้
      </button>{" "}
      {MOCK_LINK}
    </div>
  )
}

export function HonorInfo({ entry }: { entry: HonorEntry }) {
  return (
    <div style={body}>
      <Rune />
      <p>
        <b style={bold}>{entry.name}</b> สำเร็จเควส “{entry.quest}” {entry.when}
      </p>
      <p style={faint}>รูนได้รับ: 3 · ชื่อเสียง: +120 · จดลงกระดานเกียรติยศแล้ว</p>
    </div>
  )
}

export function AchieveInfo() {
  return (
    <>
      {HONOR.map((h) => (
        <div className="roll" key={h.name}>
          <div className="rune">
            <span>✦</span>
          </div>
          <span style={{ flex: 1 }}>
            <b style={bold}>{h.name}</b>
            <span style={{ fontSize: 12, ...muted }}> — “{h.quest}”</span>
          </span>
          <span style={{ fontSize: 12, ...faint }}>{h.when}</span>
        </div>
      ))}
    </>
  )
}

export function QuestInfo() {
  return (
    <div style={body}>
      <p style={muted}>{QUEST.infoIntro}</p>
      <p>
        ภารกิจปัจจุบันของคุณ: <b>{QUEST.infoMission}</b>
        {QUEST.infoTail}
      </p>
      <div style={{ marginTop: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
        {QUEST.infoTags.map((t, i) => (
          <span className={`tag${i === 0 ? " solid" : ""}`} key={t}>
            {t}
          </span>
        ))}
      </div>
    </div>
  )
}

export function EmergencyInfo({ meta, quote, cta }: { meta: string; quote: string; cta: string }) {
  return (
    <div style={body}>
      <p style={muted}>{meta}</p>
      <p style={{ fontStyle: "italic" }}>{quote}</p>
      <Placeholder style={{ margin: "10px 0", height: 100 }} tag="[ภาพประกอบฉาก]" />
      <button type="button" className="btn">
        {cta}
      </button>{" "}
      {MOCK_LINK}
    </div>
  )
}

export function PurseInfo() {
  return (
    <div style={body}>
      <p>เงินสดของคุณ แยกจากไอเทมในคลัง</p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
        <span className="tag solid">อาร์เจนต์ {PLAYER.kell.toLocaleString("en-US")}</span>
        <span className="tag">ทองคำก้อน 3</span>
        <span className="tag">ตราประทับ 12</span>
      </div>
      <p style={{ ...faint, marginTop: 8 }}>ข้อมูลจำลอง — ไม่ได้เชื่อมต่อระบบเศรษฐกิจจริง</p>
    </div>
  )
}

export function CitizenInfo({ citizen }: { citizen: Citizen }) {
  return (
    <div style={{ display: "flex", gap: 14 }}>
      <Placeholder style={{ width: 90, height: 110 }} tag="[รูป]" />
      <div style={body}>
        <b style={{ ...bold, fontSize: 15 }}>{citizen.name}</b>
        <div style={muted}>
          {citizen.role} · เดินทางมาถึง {citizen.place} · ยังไม่มีกระทู้
        </div>
        <button type="button" className="btn" style={{ marginTop: 8 }}>
          ส่งจดหมายต้อนรับ
        </button>{" "}
        {MOCK}
      </div>
    </div>
  )
}

export function PatronInfo() {
  return (
    <div style={body}>
      <Placeholder style={{ height: 80, marginBottom: 8 }} tag="[แบนเนอร์ผู้สนับสนุน]" />
      <p style={muted}>ตราสัญลักษณ์ของพวกเขาห้อยอยู่เหนือห้องอ่านตะวันตกมาหลายปีแล้ว</p>
    </div>
  )
}

export function BoardInfo({ board }: { board: BoardPost }) {
  return (
    <div style={body}>
      <p style={muted}>
        โดย {board.poster} · {board.tag}
      </p>
      <Placeholder style={{ margin: "8px 0", height: 90 }} tag="[ภาพประกอบประกาศ]" />
      <p style={muted}>เนื้อความเต็มของประกาศจะแสดงที่นี่ พร้อมตัวเลือกตอบกลับและสมัคร</p>
      <button type="button" className="btn">
        ติดต่อ {board.poster}
      </button>{" "}
      {MOCK}
    </div>
  )
}

export function RoleInfo({ role }: { role: Role }) {
  return (
    <div style={body}>
      <Rune />
      <p>
        <b style={bold}>{role.name}</b> — สมาชิก {role.members.toLocaleString("en-US")} ท่าน · ออนไลน์วันนี้ {role.online} ท่าน
      </p>
      <p style={faint}>ข้อมูลกลุ่ม เงื่อนไขการเข้าร่วม และกระทู้เฉพาะกลุ่มจะแสดงที่นี่</p>
      <button type="button" className="btn">
        ดูหน้ากลุ่ม
      </button>{" "}
      {MOCK_LINK}
    </div>
  )
}

export function CrystalInfo({ crystal }: { crystal: Crystal }) {
  const [liked, setLiked] = useState(false)
  return (
    <div style={body}>
      <Rune />
      <p style={muted}>
        {crystal.name} · {crystal.time}
      </p>
      {crystal.img && (
        <Placeholder style={{ height: 150, margin: "10px 0", padding: 0, overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element -- may be a user-uploaded data URL */}
          <img src={crystal.img} alt="รูปในคริสตัล" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(1)" }} />
        </Placeholder>
      )}
      <p style={{ fontStyle: "italic" }}>“{crystal.text}”</p>
      <div className="sb-react" style={{ marginTop: 10 }}>
        <button type="button" className={`sb-like${liked ? " liked" : ""}`} aria-pressed={liked} onClick={() => setLiked((v) => !v)}>
          ♡ <i>{crystal.likes + (liked ? 1 : 0)}</i>
        </button>
        <span>ความคิดเห็น ({crystal.comments})</span>
      </div>
    </div>
  )
}
