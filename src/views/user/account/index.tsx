"use client"

import { useState } from "react"
import { ParchShell, ParchCurvedLabel, Flourish, InkDivider, WaxSeal } from "@/components/ParchmentNew"
import { useTranslations } from "next-intl"
import { routes } from "@/config/routes"
import { PROFILES } from "./constants"
import Emblem from "./components/Emblem"

export default function AccountView() {
  const t = useTranslations("account")
  const [hovered, setHovered] = useState<string | null>(null);

  const BOARDS = [
    { key: 'notice', label: t("noticeBoardTh"), en: t("noticeBoardLabel") },
    { key: 'forum', label: t("forumBoardTh"), en: t("forumBoardLabel") },
    { key: 'profile', label: t("characterSheetTh"), en: t("characterSheetLabel") },
  ] as const

  return (
    <ParchShell title={t("pageTitle")} sub={t("pageSub")} backHref={routes.login}>
      <p className="mx-auto mt-4 max-w-xl px-6 text-center font-serif2 text-[15px] leading-relaxed text-[#6b5533] sm:px-12">
        {t("intro")}
      </p>

      {/* ==== scattered emblem field ==== */}
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-16 gap-y-14 px-6 py-14 lg:block lg:h-[560px] lg:gap-0 lg:py-8">
        {PROFILES.map((p) => {
          const locked = p.status === 'Lock';
          const name = p.kind === 'visitor' ? t("profileVisitor") : p.kind === 'create' ? t("profileCreate") : p.name;
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
                <ParchCurvedLabel text={name} size={190} />
              </div>

              {/* hover detail card */}
              <div
                className={`parch-sheet pointer-events-none absolute top-full left-1/2 z-30 mt-1 w-60 p-5 transition-all duration-300 ${
                  hovered === p.id ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                }`}
                style={{ transform: 'translateX(-50%)' }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#b89a63] bg-[#efe3c6]">
                    <span className="parch-label">IMG</span>
                  </div>
                  <div>
                    <p className="parch-label">{t("nameLabel")}</p>
                    <p className="font-display text-xl leading-tight text-[#3a2c1a]">{name}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-dashed border-[#c9ad77] pt-3">
                  <span className="parch-label">{t("statusLabel")}</span>
                  <span className={`flex items-center gap-1.5 font-ui text-xs font-medium tracking-widest uppercase ${locked ? 'text-[#a68d5f]' : 'text-[#3a2c1a]'}`}>
                    <span className={`h-2 w-2 rounded-full ${locked ? 'bg-[#c3ab7d]' : 'bg-[#43331c]'}`} />
                    {locked ? t("statusLock") : t("statusActive")}
                  </span>
                </div>
                {locked && <p className="mt-2 font-ui text-[11px] text-[#8a7350]">{t("lockedNote")}</p>}
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
        <p className="parch-label mt-2 mb-6 text-center">{t("boardsHeading")}</p>
        <div className="flex flex-wrap justify-center gap-7">
          {BOARDS.map((b) => (
            <button
              key={b.key}
              className="parch-sheet group relative px-8 py-5 text-left transition-all hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(80,58,22,0.4)]"
            >
              <p className="parch-label mb-1">{b.en} →</p>
              <p className="font-display text-2xl text-[#3a2c1a]">{b.label}</p>
              <div className="mt-2 h-px w-16 bg-[#b89a63] transition-all group-hover:w-24" />
            </button>
          ))}
        </div>
        <p className="mt-8 text-center font-ui text-xs text-[#a68d5f]">
          {t("draftNote")}
        </p>
      </div>

      <div className="flex justify-center pb-2">
        <WaxSeal letter="A" size={50} />
      </div>
    </ParchShell>
  );
}
