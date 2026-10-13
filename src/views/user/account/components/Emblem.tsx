import type { CharProfile } from "../types"

export default function Emblem({ kind, locked }: { kind: CharProfile['kind']; locked?: boolean }) {
  const stroke = locked ? '#b3a07c' : '#5d4626';
  return (
    <svg viewBox="0 0 80 80" className="h-full w-full" fill="none" stroke={stroke} strokeWidth="2">
      {kind === 'visitor' && (
        <>
          <path d="M14 56 Q40 64 66 56" />
          <path d="M22 54 Q30 26 44 12 Q42 26 54 30 Q46 32 42 30 Q48 42 58 54" />
          <circle cx="40" cy="40" r="1.5" fill={stroke} />
        </>
      )}
      {kind === 'create' && (
        <>
          <path d="M16 26 Q28 20 40 26 Q52 20 64 26 L64 54 Q52 48 40 54 Q28 48 16 54 Z" />
          <path d="M40 26 L40 54" />
          <path d="M58 14 Q64 22 58 34 L54 32 Q58 22 52 16" />
        </>
      )}
      {kind === 'char' && (
        <>
          <circle cx="40" cy="30" r="10" />
          <path d="M22 60 Q40 40 58 60" />
          <path d="M20 18 L60 62" opacity=".3" />
        </>
      )}
    </svg>
  );
}
