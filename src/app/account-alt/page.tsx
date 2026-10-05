"use client"

import { useState } from 'react';
import { ParchShell, Flourish, InkDivider, WaxSeal, SheetCorners, PasswordInput } from '@/components/parchment';
import { useRouter } from 'next/navigation';

const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`;

/* ------------------------------------------------------------------ */
/* mock registry data                                                  */
/* ------------------------------------------------------------------ */

interface Character {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'locked';
  approvedAt: string;
  lockedAt?: string;
  lockReason?: string;
}

const CHARACTERS: Character[] = [
  {
    id: 'lilian',
    name: 'Lilian Everhart',
    avatar: asset('avatar-1.jpg'),
    status: 'active',
    approvedAt: '14 มกราคม 2568',
  },
  {
    id: 'seraphina',
    name: 'Seraphina Crowe',
    avatar: asset('avatar-2.jpg'),
    status: 'locked',
    approvedAt: '3 มีนาคม 2568',
    lockedAt: '12 กันยายน 2569',
    lockReason: 'ละเมิดกฎข้อ IV — Godmoding ระหว่างการโรลเพลย์',
  },
];

const SLOT_TOTAL = 10;
const SLOT_USED = 8;
const PRICE_RESTORE = '฿150';
const PRICE_UNLOCK = '฿100';

/* mock account data */
const ACCOUNT_EMAIL = 'wanderer@arcane.vale';
const TAKEN_EMAILS = ['wanderer@arcane.vale', 'admin@arcane.vale', 'keeper@arcane.vale'];

const DELETE_REASONS = [
  'ไม่มีเวลาเล่นแล้ว',
  'เหตุผลส่วนตัว',
  'ไม่พอใจการให้บริการ',
  'ต้องการเริ่มต้นใหม่',
  'พบปัญหาภายในชุมชน',
  'อื่น ๆ',
];

function validateUsername(v: string): string | null {
  if (v.length === 0) return null;
  if (/\s/.test(v)) return 'Username ต้องไม่มีช่องว่าง';
  if (v.length < 3) return 'Username ต้องมี 3 - 25 ตัวอักษร';
  if (!/^[A-Za-z0-9_.-]+$/.test(v)) return 'มีอักขระที่ไม่อนุญาต (ใช้ได้เฉพาะ A–Z, 0–9 และ _ . -)';
  return null;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskEmail(e: string) {
  const [u, d] = e.split('@');
  return `${u.slice(0, 2)}••••@${d}`;
}

/* ------------------------------------------------------------------ */
/* password requirement ticks                                          */
/* ------------------------------------------------------------------ */

function PassRules({ value }: { value: string }) {
  const rules = [
    { ok: value.length >= 8, label: 'อย่างน้อย 8 ตัวอักษร' },
    { ok: /[0-9]/.test(value), label: 'มีตัวเลขอย่างน้อย 1 ตัว' },
    { ok: /[A-Z]/.test(value) && /[a-z]/.test(value), label: 'มีทั้งตัวพิมพ์ใหญ่และตัวพิมพ์เล็กอย่างน้อย 1 ตัว' },
  ];
  return (
    <div className="mt-2 space-y-1 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-3">
      <p className="parch-label mb-1">Password Requirements</p>
      {rules.map((r, i) => (
        <p key={i} className={`flex items-center gap-2 font-ui text-[12px] ${r.ok ? 'text-[#5b7a3d]' : 'text-[#8a2a1f]'}`}>
          <span className="w-4 text-center">{r.ok ? '✓' : '✕'}</span>
          {r.label}
        </p>
      ))}
    </div>
  );
}

const passOk = (v: string) => v.length >= 8 && /[0-9]/.test(v) && /[A-Z]/.test(v) && /[a-z]/.test(v);

/* ------------------------------------------------------------------ */
/* small ink icons                                                     */
/* ------------------------------------------------------------------ */

function LockIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="1" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </svg>
  );
}

function WayfarerIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2 5-5 2 2-5z" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* parchment modal                                                     */
/* ------------------------------------------------------------------ */

function InkModal({ onClose, children, wide = false, corners = true }: { onClose: () => void; children: React.ReactNode; wide?: boolean; corners?: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2a1f10]/45 px-4 backdrop-blur-[2px]" onClick={onClose}>
      <div
        className={`parch-sheet relative w-full ${wide ? 'max-w-2xl' : 'max-w-md'} p-8 sm:p-10`}
        onClick={(e) => e.stopPropagation()}
      >
        {corners && <SheetCorners />}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2">
          <WaxSeal letter="✦" size={48} />
        </div>
        {children}
      </div>
    </div>
  );
}

function PriceRow({ label, price }: { label: string; price: string }) {
  return (
    <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#c9ad77] pt-4">
      <span className="parch-label">{label}</span>
      <span className="font-display text-2xl text-[#3a2c1a]">{price}</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* main page                                                           */
/* ------------------------------------------------------------------ */

type View = 'select' | 'create' | 'buy-slot';
type Modal =
  | { type: 'locked'; char: Character }
  | { type: 'restore'; char: Character }
  | { type: 'unlock'; char: Character }
  | { type: 'no-slot' }
  | { type: 'acc-menu' }
  | { type: 'acc-username' }
  | { type: 'acc-password' }
  | { type: 'acc-email' }
  | { type: 'acc-delete' }
  | { type: 'acc-logout' };

export default function AccountAltPage() {
  const router = useRouter();
  const onBack = () => router.push('/login');
  const standalone = false;
  const [view, setView] = useState<View>('select');
  const [modal, setModal] = useState<Modal | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [wayfarerInfo, setWayfarerInfo] = useState(false);
  const [slotsFullDemo, setSlotsFullDemo] = useState(false);

  /* account menu state */
  const [username, setUsername] = useState('wanderer_01');

  const freeSlots = slotsFullDemo ? 0 : SLOT_TOTAL - SLOT_USED;

  const openAcc = (m: Modal) => setModal(m);

  /* ================= create-character wireframe ================= */
  if (view === 'create') {
    return (
      <ParchShell title="สร้างตัวละครใหม่" sub="— The Birth of a Soul · Wireframe —" onBack={() => setView('select')}>
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-12">
          <div className="parch-sheet relative p-8 sm:p-12">
            <SheetCorners />
            <p className="font-ui text-[13px] text-[#8a7350]">
              แบบร่าง (Wireframe) หน้าสร้างตัวละคร — แสดงเพียงโครงและตำแหน่งองค์ประกอบ
            </p>
            <InkDivider>
              <Flourish className="h-4 w-4" />
            </InkDivider>

            <div className="grid gap-8 sm:grid-cols-[220px_1fr]">
              {/* portrait */}
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-dashed border-[#b89a63] bg-[#efe3c6]/60">
                  <span className="parch-label text-center">[ รูปตัวละคร ]</span>
                </div>
                <button type="button" className="font-ui text-[12px] text-[#8a6a35] underline decoration-dotted underline-offset-4">
                  อัปโหลดภาพ
                </button>
              </div>

              {/* identity fields */}
              <div className="space-y-5">
                <div>
                  <p className="parch-label mb-1.5">Display Name — ชื่อที่แสดงต่อสาธารณะ</p>
                  <div className="h-10 rounded-sm border border-dashed border-[#b89a63] bg-[#efe3c6]/40" />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <p className="parch-label mb-1.5">เผ่าพันธุ์ / Race</p>
                    <div className="h-10 rounded-sm border border-dashed border-[#b89a63] bg-[#efe3c6]/40" />
                  </div>
                  <div>
                    <p className="parch-label mb-1.5">สำนักเวท / House</p>
                    <div className="h-10 rounded-sm border border-dashed border-[#b89a63] bg-[#efe3c6]/40" />
                  </div>
                </div>
                <div>
                  <p className="parch-label mb-1.5">เรื่องย่อตัวละคร / Backstory</p>
                  <div className="h-28 rounded-sm border border-dashed border-[#b89a63] bg-[#efe3c6]/40" />
                </div>
                <div>
                  <p className="parch-label mb-1.5">ความสามารถเด่น (สูงสุด 3)</p>
                  <div className="flex gap-3">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-10 flex-1 rounded-sm border border-dashed border-[#b89a63] bg-[#efe3c6]/40" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center gap-3 border-t border-dashed border-[#c9ad77] pt-6 sm:flex-row sm:justify-between">
              <p className="font-ui text-[12px] text-[#a68d5f]">ตัวละครใหม่ต้องผ่านการอนุมัติจากทีมผู้ดูแลก่อนใช้งาน</p>
              <div className="flex gap-3">
                <button type="button" onClick={() => setView('select')} className="parch-btn-outline px-6 py-2.5 text-sm">
                  ยกเลิก
                </button>
                <button type="button" onClick={() => setView('select')} className="parch-btn w-auto px-8">
                  ส่งขออนุมัติตัวละคร
                </button>
              </div>
            </div>
          </div>
        </div>
      </ParchShell>
    );
  }

  /* ================= buy-slot page ================= */
  if (view === 'buy-slot') {
    return (
      <ParchShell title="ซื้อสล็อตตัวละคร" sub="— Expand Your Grimoire —" onBack={() => setView('select')}>
        <div className="mx-auto max-w-4xl px-6 py-10 sm:px-12">
          <p className="mx-auto mb-8 max-w-lg text-center font-ui text-[14px] leading-relaxed text-[#6b5533]">
            เลือกแพ็กเกจสล็อตเพิ่มเติมสำหรับสร้างตัวละคร — สล็อตใหม่จะผูกกับบัญชีของท่านถาวร
          </p>
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              { n: 1, price: '฿80', note: 'สล็อตเดียว' },
              { n: 3, price: '฿210', note: 'คุ้มกว่า · ลด 12%' },
              { n: 5, price: '฿320', note: 'สำหรับนักสร้างตัวละคร' },
            ].map((p) => (
              <div key={p.n} className="parch-sheet relative p-7 text-center">
                <SheetCorners />
                <p className="parch-label">{p.n} สล็อต</p>
                <p className="font-display mt-2 text-4xl text-[#3a2c1a]">{p.price}</p>
                <p className="mt-2 font-ui text-[12px] text-[#8a7350]">{p.note}</p>
                <button type="button" className="parch-btn mt-5 w-auto px-8" onClick={() => setView('select')}>
                  เลือกแพ็กเกจนี้
                </button>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center font-ui text-[12px] text-[#a68d5f]">(หน้าตัวอย่าง — ระบบชำระเงินจริงยังไม่เชื่อมต่อ)</p>
        </div>
      </ParchShell>
    );
  }

  /* ================= profile select view ================= */
  return (
    <ParchShell title="Manage Account" sub="— The Registry of Souls —" onBack={onBack}>
      <p className="mx-auto mt-2 max-w-xl px-6 text-center font-serif2 text-[15px] leading-relaxed text-[#6b5533] sm:px-12">
        เลือกตัวละครเพื่อก้าวเข้าสู่หุบเขา หรือเดินทางในฐานะผู้พเนจร
      </p>



      {/* ---- Wayfarer Mode ---- */}
      <div className="relative z-30 mt-7 flex justify-center px-6">
        <div
          className="relative"
          onMouseEnter={() => setWayfarerInfo(true)}
          onMouseLeave={() => setWayfarerInfo(false)}
        >
          <button
            type="button"
            className="parch-sheet group flex items-center gap-3 px-7 py-3.5 transition-all hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(80,58,22,0.35),0_0_24px_rgba(190,150,80,0.3)]"
          >
            <WayfarerIcon className="h-6 w-6 text-[#6b4f22] transition group-hover:text-[#3a2c1a]" />
            <span className="parch-label !tracking-[0.3em]">Wayfarer Mode</span>
            <span className="font-ui text-[11px] text-[#a68d5f]">?</span>
          </button>

          {/* hover explanation */}
          <div
            className={`parch-sheet pointer-events-none absolute top-full left-1/2 z-40 mt-3 w-80 -translate-x-1/2 p-5 transition-all duration-300 ${
              wayfarerInfo ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
            }`}
          >
            <p className="parch-label mb-2">โหมดผู้พเนจร</p>
            <p className="font-ui text-[13px] leading-relaxed text-[#5d4626]">
              โหมดสำหรับผู้เยี่ยมชมที่ยังไม่มีตัวละคร — เข้าชมหมู่บ้าน อ่านกระดานประกาศและกระทู้ต่าง ๆ ได้
              แต่ยังไม่สามารถโรลเพลย์หรือตั้งกระทู้ได้ จนกว่าจะสร้างตัวละครและผ่านการอนุมัติ
            </p>
          </div>
        </div>
      </div>

      {/* ---- character profiles (profile-picker style) ---- */}
      <div className="mx-auto flex max-w-5xl flex-wrap items-start justify-center gap-x-14 gap-y-12 px-6 pt-14 pb-28 sm:px-12">
        {CHARACTERS.map((c) => {
          const locked = c.status === 'locked';
          return (
            <div
              key={c.id}
              className="group relative flex w-44 flex-col items-center"
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <button
                type="button"
                onClick={() => locked && setModal({ type: 'locked', char: c })}
                className={`relative h-40 w-40 overflow-hidden rounded-full border-2 transition-all duration-300 ${
                  locked
                    ? 'cursor-pointer border-[#b3a07c] opacity-75'
                    : 'border-[#6b4f22] hover:-translate-y-2 hover:border-[#8a6a35] hover:shadow-[0_14px_30px_rgba(80,58,22,0.35),0_0_24px_rgba(190,150,80,0.3)]'
                }`}
                style={{ boxShadow: 'inset 0 0 30px rgba(150,115,60,.18)' }}
              >
                <img
                  src={c.avatar}
                  alt={c.name}
                  className={`h-full w-full object-cover transition-all duration-300 ${locked ? 'grayscale' : 'group-hover:scale-105'}`}
                />
                {locked && (
                  <>
                    <span className="absolute inset-0 bg-[#cbb98f]/45" />
                    <span className="absolute -top-1 -right-1 flex h-10 w-10 items-center justify-center rounded-full border border-[#8a6a35] bg-[#efe3c6] text-[#8a6a35] shadow-md">
                      <LockIcon />
                    </span>
                  </>
                )}
              </button>

              {/* display name under the avatar */}
              <p className={`mt-3 font-display text-lg leading-tight ${locked ? 'text-[#a68d5f]' : 'text-[#3a2c1a]'}`}>
                {c.name}
              </p>
              {locked && (
                <span className="mt-1 flex items-center gap-1 font-ui text-[11px] tracking-widest text-[#a68d5f] uppercase">
                  <LockIcon className="h-3 w-3" /> Locked
                </span>
              )}

              {/* hover detail card */}
              <div
                className={`parch-sheet pointer-events-none absolute top-[calc(100%+10px)] left-1/2 z-[70] w-72 -translate-x-1/2 p-5 text-left transition-all duration-300 ${
                  hovered === c.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={c.avatar}
                    alt=""
                    className={`h-12 w-12 shrink-0 rounded-full border border-[#b89a63] object-cover ${locked ? 'grayscale' : ''}`}
                  />
                  <div>
                    <p className="parch-label">Name</p>
                    <p className="font-display text-lg leading-tight text-[#3a2c1a]">{c.name}</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 border-t border-dashed border-[#c9ad77] pt-3">
                  <div className="flex items-center justify-between">
                    <span className="parch-label">Status</span>
                    <span className={`flex items-center gap-1.5 font-ui text-xs font-medium tracking-widest uppercase ${locked ? 'text-[#a68d5f]' : 'text-[#5b7a3d]'}`}>
                      <span className={`h-2 w-2 rounded-full ${locked ? 'bg-[#c3ab7d]' : 'bg-[#5b7a3d]'}`} />
                      {locked ? 'Locked' : 'Active'}
                    </span>
                  </div>
                  {locked && c.lockReason && (
                    <p className="font-ui text-[11.5px] leading-snug text-[#8a2a1f]">
                      เหตุผล: {c.lockReason}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="parch-label">อนุมัติเมื่อ</span>
                    <span className="font-ui text-xs text-[#3a2c1a]">{c.approvedAt}</span>
                  </div>
                  {locked && c.lockedAt && (
                    <div className="flex items-center justify-between">
                      <span className="parch-label">ถูกล็อกเมื่อ</span>
                      <span className="font-ui text-xs text-[#3a2c1a]">{c.lockedAt}</span>
                    </div>
                  )}
                </div>
                {locked && (
                  <p className="mt-3 border-t border-dashed border-[#c9ad77] pt-2 font-ui text-[11px] text-[#8a7350]">
                    กดที่ตัวละครเพื่อเลือก กู้คืนตัวละคร หรือ ปลดล็อกสล็อต
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {/* ---- create character slot ---- */}
        <div className="group relative flex w-44 flex-col items-center">
          <button
            type="button"
            onClick={() => (freeSlots > 0 ? setView('create') : setModal({ type: 'no-slot' }))}
            className="flex h-40 w-40 items-center justify-center rounded-full border-2 border-dashed border-[#a3854e] bg-[#efe3c6]/50 transition-all duration-300 hover:-translate-y-2 hover:border-[#8a6a35] hover:bg-[#f2e7cb] hover:shadow-[0_14px_30px_rgba(80,58,22,0.3)]"
          >
            <span className="wax-seal flex h-14 w-14 items-center justify-center rounded-full font-ui text-3xl text-[#f3ddc0]">+</span>
          </button>
          <p className="mt-3 font-display text-lg leading-tight text-[#5d4626]">Create Character</p>
          <p className="mt-1 font-ui text-[12px] tracking-wider text-[#8a7350]">
            สล็อตว่าง {freeSlots}/{SLOT_TOTAL} — สร้างได้อีก {freeSlots} ตัวละคร
          </p>
        </div>
      </div>

      {/* demo helper */}
      <div className="flex justify-center pb-2">
        <button
          type="button"
          onClick={() => setSlotsFullDemo((v) => !v)}
          className="font-ui text-[11px] tracking-wider text-[#b3a07c] underline decoration-dotted underline-offset-4 hover:text-[#8a6a35]"
        >
          {slotsFullDemo ? 'กลับสู่สถานะปกติ (มีสล็อตว่าง)' : 'จำลองสถานะสล็อตเต็ม (0/10) เพื่อดูตัวอย่าง'}
        </button>
      </div>

      {standalone && (
        <p className="mt-4 text-center font-ui text-xs text-[#a68d5f]">
          หน้าตัวอย่าง Manage Account แบบที่ 2 — ไม่ต้องเข้าสู่ระบบ
        </p>
      )}

      {/* ---- account chip (username) ---- */}
      <div className="flex flex-col items-center gap-2 pt-8 pb-4">
        <button
          type="button"
          onClick={() => setModal({ type: 'acc-menu' })}
          className="group flex items-center gap-3 border-2 border-[#8a6a35] bg-[#43331c] px-8 py-3 shadow-[0_6px_18px_rgba(50,36,14,0.4),inset_0_1px_0_rgba(233,217,174,0.2)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(50,36,14,0.5),0_0_20px_rgba(190,150,80,0.35)]"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#c9ad77]" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="12" cy="8" r="4" />
            <path d="M4.5 20c1.6-3.6 4.3-5 7.5-5s5.9 1.4 7.5 5" />
          </svg>
          <span className="font-display text-lg tracking-wide text-[#e9d9ae]">{username}</span>
          <span className="font-ui text-[10px] tracking-[0.25em] text-[#a68d5f] uppercase transition group-hover:text-[#c9ad77]">จัดการบัญชี</span>
        </button>
        <p className="font-ui text-[11px] tracking-wider text-[#a68d5f]">กดที่ชื่อเพื่อจัดการบัญชีของท่าน</p>
      </div>

      {/* ================= modals ================= */}
      {modal?.type === 'locked' && (
        <InkModal onClose={() => setModal(null)}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">{modal.char.name}</h3>
          <p className="mt-1 flex items-center justify-center gap-1.5 font-ui text-[12px] tracking-widest text-[#a68d5f] uppercase">
            <LockIcon className="h-3.5 w-3.5" /> ตัวละครนี้ถูกล็อก
          </p>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => setModal({ type: 'restore', char: modal.char })}
              className="parch-sheet w-full px-6 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(80,58,22,0.3)]"
            >
              <p className="font-display text-lg text-[#3a2c1a]">กู้คืนตัวละคร</p>
              <p className="font-ui text-[12px] text-[#8a7350]">นำตัวละครเดิมกลับมาใช้งานอีกครั้งพร้อมข้อมูลทั้งหมด</p>
            </button>
            <button
              type="button"
              onClick={() => setModal({ type: 'unlock', char: modal.char })}
              className="parch-sheet w-full px-6 py-4 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(80,58,22,0.3)]"
            >
              <p className="font-display text-lg text-[#3a2c1a]">ปลดล็อกสล็อต</p>
              <p className="font-ui text-[12px] text-[#8a7350]">คืนสล็อตให้ว่างสำหรับสร้างตัวละครใหม่</p>
            </button>
          </div>
          <button type="button" onClick={() => setModal(null)} className="mx-auto mt-5 block font-ui text-[12px] text-[#a68d5f] underline decoration-dotted underline-offset-4 hover:text-[#6b4f22]">
            ยกเลิก
          </button>
        </InkModal>
      )}

      {modal?.type === 'restore' && (
        <InkModal onClose={() => setModal(null)}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">กู้คืนตัวละคร</h3>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <div className="flex items-center gap-3">
            <img src={modal.char.avatar} alt="" className="h-12 w-12 rounded-full border border-[#b89a63] object-cover grayscale" />
            <p className="font-display text-lg text-[#3a2c1a]">{modal.char.name}</p>
          </div>
          <p className="mt-4 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            เป็นการกู้คืนไอดีการ์ดและข้อมูลของตัวละครเดิม ทำให้ตัวละครกลับมาใช้งานได้อีกครั้ง
          </p>
          <PriceRow label="ค่าธรรมเนียมกู้คืน" price={PRICE_RESTORE} />
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => setModal({ type: 'locked', char: modal.char })} className="parch-btn-outline px-6 py-2.5 text-sm">
              ย้อนกลับ
            </button>
            <button type="button" onClick={() => setModal(null)} className="parch-btn w-auto px-8">
              ยืนยันการกู้คืน
            </button>
          </div>
        </InkModal>
      )}

      {modal?.type === 'unlock' && (
        <InkModal onClose={() => setModal(null)}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">ปลดล็อกสล็อต</h3>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <div className="flex items-center gap-3">
            <img src={modal.char.avatar} alt="" className="h-12 w-12 rounded-full border border-[#b89a63] object-cover grayscale" />
            <p className="font-display text-lg text-[#3a2c1a]">{modal.char.name}</p>
          </div>
          <p className="mt-4 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            ปลดสถานะการครอบครองสล็อตของตัวละครที่ถูกล็อก ทำให้สล็อตกลับมาว่างสำหรับสร้างตัวละครใหม่
          </p>
          <p className="mt-2 font-ui text-[12px] leading-relaxed text-[#8a2a1f]">
            หมายเหตุ: ข้อมูลของตัวละครเดิมจะไม่ถูกกู้คืน และไม่สามารถย้อนกลับได้
          </p>
          <PriceRow label="ค่าธรรมเนียมปลดล็อก" price={PRICE_UNLOCK} />
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => setModal({ type: 'locked', char: modal.char })} className="parch-btn-outline px-6 py-2.5 text-sm">
              ย้อนกลับ
            </button>
            <button type="button" onClick={() => setModal(null)} className="parch-btn w-auto px-8">
              ยืนยันปลดล็อกสล็อต
            </button>
          </div>
        </InkModal>
      )}

      {modal?.type === 'no-slot' && (
        <InkModal onClose={() => setModal(null)}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">สล็อตตัวละครเต็มแล้ว</h3>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <p className="text-center font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            ท่านใช้สล็อตตัวละครครบทั้ง {SLOT_TOTAL} สล็อตแล้ว — หากต้องการสร้างตัวละครเพิ่ม
            กรุณาซื้อสล็อตตัวละครเพิ่มเติม
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => setModal(null)} className="parch-btn-outline px-6 py-2.5 text-sm">
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                setModal(null);
                setView('buy-slot');
              }}
              className="parch-btn w-auto px-8"
            >
              ซื้อสล็อตตัวละครเพิ่ม
            </button>
          </div>
        </InkModal>
      )}

      {/* ================= account management modals ================= */}
      {modal?.type === 'acc-menu' && (
        <InkModal onClose={() => setModal(null)} corners={false}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">จัดการบัญชี</h3>
          <p className="mt-1 text-center font-ui text-[12px] tracking-wider text-[#a68d5f]">@{username}</p>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <div className="space-y-2.5">
            {(
              [
                { key: 'acc-username', icon: '✎', label: 'เปลี่ยน Username', desc: 'ชื่อสำหรับเข้าสู่ระบบ' },
                { key: 'acc-password', icon: '⚿', label: 'เปลี่ยนรหัสผ่าน', desc: 'ยืนยันด้วยรหัสเดิมหรืออีเมล' },
                { key: 'acc-email', icon: '✉', label: 'เปลี่ยนอีเมล', desc: 'ต้องยืนยันอีเมลใหม่' },
              ] as const
            ).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => openAcc({ type: m.key })}
                className="parch-sheet flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(80,58,22,0.3)]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b89a63] text-sm text-[#6b4f22]">{m.icon}</span>
                <span>
                  <span className="block font-display text-[17px] leading-tight text-[#3a2c1a]">{m.label}</span>
                  <span className="block font-ui text-[11.5px] text-[#a68d5f]">{m.desc}</span>
                </span>
              </button>
            ))}

            <button
              type="button"
              onClick={() => openAcc({ type: 'acc-logout' })}
              className="parch-sheet flex w-full items-center gap-3.5 px-5 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(80,58,22,0.3)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b89a63] text-[#6b4f22]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <path d="m16 17 5-5-5-5" />
                  <path d="M21 12H9" />
                </svg>
              </span>
              <span>
                <span className="block font-display text-[17px] leading-tight text-[#3a2c1a]">ออกจากระบบ</span>
                <span className="block font-ui text-[11.5px] text-[#a68d5f]">กลับสู่ประตูหมู่บ้าน</span>
              </span>
            </button>

            <div className="my-1 border-t border-dashed border-[#c9ad77]" />
            <button
              type="button"
              onClick={() => openAcc({ type: 'acc-delete' })}
              className="parch-sheet flex w-full items-center gap-3.5 border-[#b06a5e]/60 bg-[#f3e2d8]/50 px-5 py-3.5 text-left transition hover:-translate-y-0.5 hover:shadow-[0_12px_26px_rgba(92,29,23,0.25)]"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#b06a5e] text-sm text-[#8a2a1f]">✕</span>
              <span>
                <span className="block font-display text-[17px] leading-tight text-[#8a2a1f]">ลบบัญชี</span>
                <span className="block font-ui text-[11.5px] text-[#b06a5e]">ลบถาวร ไม่สามารถย้อนกลับได้</span>
              </span>
            </button>
          </div>
        </InkModal>
      )}
      {modal?.type === 'acc-logout' && (
        <InkModal onClose={() => setModal(null)}>
          <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">ออกจากระบบ</h3>
          <InkDivider>
            <Flourish className="h-4 w-4" />
          </InkDivider>
          <p className="text-center font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            ท่านต้องการออกจากระบบและกลับสู่ประตูหมู่บ้านหรือไม่
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={() => setModal(null)} className="parch-btn-outline px-6 py-2.5 text-sm">
              ยกเลิก
            </button>
            <button type="button" onClick={onBack} className="parch-btn w-auto px-8">
              ออกจากระบบ
            </button>
          </div>
        </InkModal>
      )}
      {modal?.type === 'acc-username' && <AccUsernameModal current={username} onClose={() => setModal(null)} onDone={(u) => { setUsername(u); setModal(null); }} />}
      {modal?.type === 'acc-password' && <AccPasswordModal onClose={() => setModal(null)} />}
      {modal?.type === 'acc-email' && <AccEmailModal current={ACCOUNT_EMAIL} onClose={() => setModal(null)} />}
      {modal?.type === 'acc-delete' && <AccDeleteModal username={username} onClose={() => setModal(null)} />}
    </ParchShell>
  );
}

/* ------------------------------------------------------------------ */
/* account management modals                                           */
/* ------------------------------------------------------------------ */

function AccUsernameModal({ current, onClose, onDone }: { current: string; onClose: () => void; onDone: (u: string) => void }) {
  const [next, setNext] = useState('');
  const [touched, setTouched] = useState(false);
  const err = validateUsername(next);
  const valid = next.length > 0 && !err && next.toLowerCase() !== current.toLowerCase();

  return (
    <InkModal onClose={onClose}>
      <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">เปลี่ยน Username</h3>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>
      <div className="flex items-center justify-between">
        <span className="parch-label">Username ปัจจุบัน</span>
        <span className="font-display text-lg text-[#3a2c1a]">{current}</span>
      </div>

      <label className="parch-label mb-1.5 mt-5 block">Username ใหม่</label>
      <input
        className="parch-input w-full font-serithai"
        value={next}
        maxLength={25}
        onChange={(e) => setNext(e.target.value)}
        onBlur={() => setTouched(true)}
      />
      {next.length > 0 && !err && next.toLowerCase() === current.toLowerCase() && (
        <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ Username ใหม่ต้องไม่ซ้ำกับ Username ปัจจุบัน</p>
      )}
      {(touched || next.length > 0) && err && (
        <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ {err}</p>
      )}

      {/* Username Requirements — เหมือนหน้าสมัครสมาชิก */}
      <div className="mt-3 border border-dashed border-[#c9ad77] bg-[#efe3c6]/40 p-3">
        <p className="parch-label mb-1">Username Requirements</p>
        <p className="font-ui text-[12px] leading-relaxed text-[#8a7350]">
          Username ใช้สำหรับล็อกอินเข้าสู่ระบบเท่านั้น ไม่ใช่ชื่อ Display Name ที่แสดงต่อสาธารณะ
        </p>
        <p className={`mt-1.5 flex items-center gap-2 font-ui text-[12px] ${next.length >= 3 && next.length <= 25 ? 'text-[#5b7a3d]' : 'text-[#8a2a1f]'}`}>
          <span className="w-4 text-center">{next.length >= 3 && next.length <= 25 ? '✓' : '✕'}</span>
          3 - 25 ตัวอักษร
        </p>
        <p className={`flex items-center gap-2 font-ui text-[12px] ${next.length > 0 && /^[A-Za-z0-9_.-]+$/.test(next) ? 'text-[#5b7a3d]' : 'text-[#8a2a1f]'}`}>
          <span className="w-4 text-center">{next.length > 0 && /^[A-Za-z0-9_.-]+$/.test(next) ? '✓' : '✕'}</span>
          ใช้ได้เฉพาะตัวอักษรภาษาอังกฤษ (A–Z), ตัวเลข (0–9), และอักขระ _ . -
        </p>
        <p className={`flex items-center gap-2 font-ui text-[12px] ${next.length > 0 && !/\s/.test(next) ? 'text-[#5b7a3d]' : 'text-[#8a2a1f]'}`}>
          <span className="w-4 text-center">{next.length > 0 && !/\s/.test(next) ? '✓' : '✕'}</span>
          ไม่อนุญาตให้มีช่องว่าง (space)
        </p>
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={onClose} className="parch-btn-outline px-6 py-2.5 text-sm">
          ยกเลิก
        </button>
        <button type="button" disabled={!valid} onClick={() => onDone(next)} className="parch-btn w-auto px-8">
          บันทึก Username ใหม่
        </button>
      </div>
    </InkModal>
  );
}

function AccPasswordModal({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'old' | 'email'>('old');
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState(false);
  const mismatch = confirm.length > 0 && confirm !== newPass;
  const valid = oldPass.length > 0 && passOk(newPass) && confirm === newPass;

  const tabCls = (active: boolean) =>
    `flex-1 border px-3 py-2 font-ui text-[12px] tracking-widest uppercase transition ${
      active ? 'border-[#8a6a35] bg-[#43331c] text-[#e9d9ae]' : 'border-[#c9ad77] text-[#8a7350] hover:text-[#5d4626]'
    }`;

  return (
    <InkModal onClose={onClose}>
      <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">เปลี่ยนรหัสผ่าน</h3>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>

      {done ? (
        <div className="py-4 text-center">
          <WaxSeal letter="✓" size={56} className="mx-auto" />
          <p className="mt-4 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            {tab === 'old'
              ? 'เปลี่ยนรหัสผ่านเรียบร้อยแล้ว — ครั้งต่อไปกรุณาเข้าสู่ระบบด้วยรหัสผ่านใหม่'
              : `ส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่ ${maskEmail(ACCOUNT_EMAIL)} แล้ว กรุณาตรวจสอบกล่องจดหมาย`}
          </p>
          <button type="button" onClick={onClose} className="parch-btn mx-auto mt-6 w-auto px-10">
            ปิดหน้าต่าง
          </button>
        </div>
      ) : (
        <>
          <div className="flex gap-0">
            <button type="button" className={tabCls(tab === 'old')} onClick={() => setTab('old')}>
              ยืนยันด้วยรหัสเดิม
            </button>
            <button type="button" className={tabCls(tab === 'email')} onClick={() => setTab('email')}>
              ยืนยันทางอีเมล
            </button>
          </div>

          {tab === 'old' ? (
            <>
              <label className="parch-label mb-1.5 mt-5 block">รหัสผ่านเดิม</label>
              <PasswordInput className="parch-input w-full font-serithai" value={oldPass} onChange={(e) => setOldPass(e.target.value)} />

              <label className="parch-label mb-1.5 mt-4 block">รหัสผ่านใหม่</label>
              <PasswordInput className="parch-input w-full font-serithai" placeholder="••••••••••" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              {newPass.length > 0 && <PassRules value={newPass} />}

              <label className="parch-label mb-1.5 mt-4 block">ยืนยันรหัสผ่านใหม่</label>
              <PasswordInput className="parch-input w-full font-serithai" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
              {mismatch && <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ รหัสผ่านใหม่ไม่ตรงกัน</p>}
            </>
          ) : (
            <div className="mt-5 text-center">
              <p className="font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
                ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปยังอีเมลที่ผูกกับบัญชี
              </p>
              <p className="mt-3 font-display text-lg text-[#3a2c1a]">{maskEmail(ACCOUNT_EMAIL)}</p>
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={onClose} className="parch-btn-outline px-6 py-2.5 text-sm">
              ยกเลิก
            </button>
            {tab === 'old' ? (
              <button type="button" disabled={!valid} onClick={() => setDone(true)} className="parch-btn w-auto px-8">
                ยืนยันเปลี่ยนรหัสผ่าน
              </button>
            ) : (
              <button type="button" onClick={() => setDone(true)} className="parch-btn w-auto px-8">
                ส่งลิงก์ทางอีเมล
              </button>
            )}
          </div>
        </>
      )}
    </InkModal>
  );
}

function AccEmailModal({ current, onClose }: { current: string; onClose: () => void }) {
  const [next, setNext] = useState('');
  const [sent, setSent] = useState(false);
  const valid =
    EMAIL_RE.test(next) &&
    next.toLowerCase() !== current.toLowerCase() &&
    !TAKEN_EMAILS.includes(next.toLowerCase());

  return (
    <InkModal onClose={onClose}>
      <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#3a2c1a]">เปลี่ยนอีเมล</h3>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>

      {sent ? (
        <div className="py-4 text-center">
          <WaxSeal letter="✉" size={56} className="mx-auto" />
          <p className="mt-4 font-ui text-[13.5px] leading-relaxed text-[#5d4626]">
            ส่งจดหมายยืนยันไปที่ <span className="font-medium text-[#3a2c1a]">{next}</span> แล้ว —
            อีเมลใหม่จะมีผลหลังจากท่านกดยืนยันในจดหมายฉบับนั้น
          </p>
          <button type="button" onClick={onClose} className="parch-btn mx-auto mt-6 w-auto px-10">
            ปิดหน้าต่าง
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="parch-label">อีเมลปัจจุบัน</span>
            <span className="font-display text-lg text-[#3a2c1a]">{maskEmail(current)}</span>
          </div>

          <label className="parch-label mb-1.5 mt-5 block">อีเมลใหม่</label>
          <input
            className="parch-input w-full font-serithai"
            type="email"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
          {next.length > 0 && !EMAIL_RE.test(next) && (
            <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ กรุณากรอกอีเมลในรูปแบบที่ถูกต้อง</p>
          )}
          {next.length > 0 && EMAIL_RE.test(next) && next.toLowerCase() === current.toLowerCase() && (
            <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ อีเมลใหม่ต้องไม่ซ้ำกับอีเมลปัจจุบัน</p>
          )}
          {next.length > 0 && EMAIL_RE.test(next) && next.toLowerCase() !== current.toLowerCase() && TAKEN_EMAILS.includes(next.toLowerCase()) && (
            <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ พบว่ามีบัญชีที่ใช้อีเมลนี้อยู่แล้ว</p>
          )}
          <p className="mt-3 font-ui text-[12px] leading-relaxed text-[#8a7350]">
            หลังเปลี่ยนอีเมล ท่านต้องยืนยันอีเมลใหม่ผ่านจดหมายที่ระบบส่งให้ ก่อนอีเมลใหม่จะมีผลใช้งาน
          </p>

          <div className="mt-6 flex justify-center gap-3">
            <button type="button" onClick={onClose} className="parch-btn-outline px-6 py-2.5 text-sm">
              ยกเลิก
            </button>
            <button type="button" disabled={!valid} onClick={() => setSent(true)} className="parch-btn w-auto px-8">
              ส่งจดหมายยืนยัน
            </button>
          </div>
        </>
      )}
    </InkModal>
  );
}

function AccDeleteModal({ username, onClose }: { username: string; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [detail, setDetail] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const ready = reason !== '' && confirmName === username;

  return (
    <InkModal onClose={onClose}>
      <h3 className="font-jimthompson mt-2 text-center text-2xl text-[#8a2a1f]">ลบบัญชี</h3>
      <InkDivider>
        <Flourish className="h-4 w-4" />
      </InkDivider>

      <p className="border border-[#b06a5e]/50 bg-[#f3e2d8]/60 p-4 font-ui text-[13px] leading-relaxed text-[#8a2a1f]">
        การลบบัญชีเป็นการกระทำถาวร — ตัวละคร สล็อต และข้อมูลทั้งหมดที่ผูกกับบัญชี
        จะถูกลบและไม่สามารถกู้คืนได้
      </p>

      <label className="parch-label mb-1.5 mt-5 block">เหตุผลในการลบบัญชี</label>
      <select
        className="parch-input w-full font-serithai"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="" disabled>
          — เลือกเหตุผล —
        </option>
        {DELETE_REASONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      <label className="parch-label mb-1.5 mt-4 block">รายละเอียดเพิ่มเติม (ไม่บังคับ)</label>
      <textarea
        className="parch-input h-20 w-full resize-none font-serithai"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        placeholder="เล่าให้เราฟังเพิ่มเติมได้…"
      />

      <label className="parch-label mb-1.5 mt-4 block">
        พิมพ์ Username <span className="text-[#8a2a1f]">“{username}”</span> เพื่อยืนยันการลบ
      </label>
      <input
        className="parch-input w-full font-serithai"
        value={confirmName}
        onChange={(e) => setConfirmName(e.target.value)}
      />
      {confirmName.length > 0 && confirmName !== username && (
        <p className="mt-2 font-ui text-[12px] text-[#8a2a1f]">✕ Username ไม่ตรงกัน</p>
      )}

      <div className="mt-6 flex justify-center gap-3">
        <button type="button" onClick={onClose} className="parch-btn-outline px-6 py-2.5 text-sm">
          ยกเลิก
        </button>
        <button
          type="button"
          disabled={!ready}
          className="w-auto border border-[#7d2c24] bg-gradient-to-b from-[#7d2c24] to-[#5c1d17] px-8 py-3 font-serithai tracking-[0.22em] text-[#f3ddc0] transition enabled:hover:shadow-[0_6px_20px_rgba(92,29,23,0.5)] disabled:cursor-not-allowed disabled:opacity-35"
        >
          ลบบัญชีถาวร
        </button>
      </div>
    </InkModal>
  );
}
