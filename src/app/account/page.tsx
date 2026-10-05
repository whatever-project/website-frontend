"use client"

import { useState } from "react"
import { ParchShell, ParchCurvedLabel, Flourish, InkDivider, WaxSeal } from "@/components/parchment"
import { useRouter } from "next/navigation"

interface CharProfile {
  id: string;
  name: string;
  status: 'Active' | 'Lock';
  pos: string;
  kind: 'visitor' | 'create' | 'char';
}

const PROFILES: CharProfile[] = [
  { id: 'visitor', name: 'Visitor Mode', status: 'Active', pos: 'lg:top-6 lg:left-[6%]', kind: 'visitor' },
  { id: 'karen', name: 'Karen Mason', status: 'Active', pos: 'lg:top-40 lg:left-[38%]', kind: 'char' },
  { id: 'jeanna', name: 'Jeanna Layne', status: 'Lock', pos: 'lg:top-10 lg:right-[14%]', kind: 'char' },
  { id: 'create', name: 'Create Character', status: 'Active', pos: 'lg:top-64 lg:right-[34%]', kind: 'create' },
];

function Emblem({ kind, locked }: { kind: CharProfile['kind']; locked?: boolean }) {
  const stroke = locked ? '#b3a07c' : '#5d4626';
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={stroke} strokeWidth="2">
      {kind === 'visitor' && (
        <>
          {/* sorting hat */}
          <path d="M14 56 Q40 64 66 56" />
          <path d="M22 54 Q30 26 44 12 Q42 26 54 30 Q46 32 42 30 Q48 42 58 54" />
          <circle cx="40" cy="40" r="1.5" fill={stroke} />
        </>
      )}
      {kind === 'create' && (
        <>
          {/* spellbook + quill */}
          <path d="M16 26 Q28 20 40 26 Q52 20 64 26 L64 54 Q52 48 40 54 Q28 48 16 54 Z" />
          <path d="M40 26 L40 54" />
          <path d="M58 14 Q64 22 58 34 L54 32 Q58 22 52 16" />
        </>
      )}
      {kind === 'char' && (
        <>
          {/* portrait figure */}
          <circle cx="40" cy="30" r="10" />
          <path d="M22 60 Q40 40 58 60" />
          <path d="M20 18 L60 62" opacity=".3" />
        </>
      )}
    </svg>
  );
}

export default function AccountPage() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  const handleBlueprint = (section: string) => {
    // In a real app, this would route to different sections
    console.log(`Navigate to ${section}`);
  };

  return (
    <ParchShell title="Manage Account" sub="— Choose Your Soul —" backHref="/login">
      <p className="mx-auto mt-4 max-w-xl px-6 text-center font-serif2 text-[15px] leading-relaxed text-[#6b5533] sm:px-12">
        เลือกโหมดการเข้าชม หรือเลือกตัวละครเพื่อเริ่มโรลเพลย์ — วางเมาส์บนตราวงกลมเพื่ออ่านรายละเอียดตัวละคร
      </p>

      {/* ==== scattered emblem field ==== */}
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-14 px-6 py-14 lg:block lg:h-[560px] lg:gap-0 lg:py-8">
        {PROFILES.map((p) => {
          const locked = p.status === 'Lock';
          return (
            <div
              key={p.id}
              className={`group relative flex flex-col items-center lg:absolute ${p.pos}`}
              onMouseEnter={() => setHovered(p.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                className={`relative h-40 w-40 rounded-full border-2 p-5 transition-all duration-300 sm:h-44 sm:w-44 ${
                  locked
                    ? 'cursor-not-allowed border-[#c3ab7d] bg-[#e9dcba] opacity-70'
                    : 'border-[#6b4f22] bg-[#f2e7cb] hover:-translate-y-2 hover:border-[#8a6a35] hover:shadow-[0_14px_30px_rgba(80,58,22,0.35),0_0_24px_rgba(190,150,80,0.3)]'
                }`}
                style={{ boxShadow: 'inset 0 0 30px rgba(150,115,60,.18)' }}
              >
                <Emblem kind={p.kind} locked={locked} />
                {locked && (
                  <span className="absolute -top-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border border-[#8a6a35] bg-[#efe3c6]">
                    <svg viewBox="0 0 24 24" className="h-4 w-4 text-[#8a6a35]" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="11" width="14" height="9" />
                      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                    </svg>
                  </span>
                )}
                {p.kind === 'create' && (
                  <span className="wax-seal absolute -right-1 -bottom-1 flex h-9 w-9 items-center justify-center rounded-full font-ui text-lg text-[#f3ddc0]">
                    +
                  </span>
                )}
              </button>
              <div className="mt-1">
                <ParchCurvedLabel text={p.name} size={190} />
              </div>

              {/* hover detail card — parchment slip */}
              <div
                className={`parch-sheet pointer-events-none absolute top-full left-1/2 z-30 mt-1 w-60 p-5 transition-all duration-300 ${
                  hovered === p.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="flex items-center gap-3">
                  {/* portrait placeholder */}
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#b89a63] bg-[#efe3c6]">
                    <span className="parch-label">IMG</span>
                  </div>
                  <div>
                    <p className="parch-label">Name</p>
                    <p className="font-display text-xl leading-tight text-[#3a2c1a]">{p.name}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#c9ad77] pt-3">
                  <span className="parch-label">Status</span>
                  <span className={`flex items-center gap-1.5 font-ui text-xs font-medium tracking-widest uppercase ${locked ? 'text-[#a68d5f]' : 'text-[#3a2c1a]'}`}>
                    <span className={`h-2 w-2 rounded-full ${locked ? 'bg-[#c3ab7d]' : 'bg-[#43331c]'}`} />
                    {p.status}
                  </span>
                </div>
                {locked && <p className="mt-2 font-ui text-[11px] text-[#8a7350]">ตัวละครนี้ถูกล็อก — ติดต่อผู้ดูแลเพื่อปลดล็อก</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* ==== gates to the boards ==== */}
      <div className="mx-auto max-w-5xl px-6 pb-4 sm:px-12">
        <InkDivider>
          <Flourish className="h-5 w-5" />
        </InkDivider>
        <p className="parch-label mt-2 mb-6 text-center">ประตูสู่แดนโรลเพลย์ (แบบร่าง Layout)</p>
        <div className="flex flex-wrap justify-center gap-7">
          {(
            [
              { key: 'notice', label: 'กระดานประกาศ', en: 'Notice Board' },
              { key: 'forum', label: 'บอร์ดกระทู้', en: 'Forum Boards' },
              { key: 'profile', label: 'หน้าโปรไฟล์ตัวละคร', en: 'Character Sheet' },
            ] as const
          ).map((b) => (
            <button
              key={b.key}
              onClick={() => handleBlueprint(b.key)}
              className="parch-sheet group relative px-8 py-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(80,58,22,0.4)]"
            >
              <p className="parch-label mb-1">{b.en} →</p>
              <p className="font-display text-2xl text-[#3a2c1a]">{b.label}</p>
              <div className="mt-2 h-px w-16 bg-[#b89a63] transition-all group-hover:w-24" />
            </button>
          ))}
        </div>
        <p className="mt-8 text-center font-ui text-xs text-[#a68d5f]">
          นี่คือหน้าแสดงตัวอย่าง Manage Account แบบไฟล์แยก — ไม่ต้องเข้าสู่ระบบ
        </p>
      </div>

      <div className="flex justify-center pb-2">
        <WaxSeal letter="A" size={50} />
      </div>
    </ParchShell>
  );
}
