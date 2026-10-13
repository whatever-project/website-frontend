import type { Feedback } from "../types"

export default function FeedbackBar({ msg }: { msg: Feedback | null }) {
  if (!msg) return null
  return (
    <div
      className={`mb-4 rounded border p-3 font-ui text-[13px] ${
        msg.type === "success"
          ? "border-[#5b7a3d]/40 bg-[#d4e6c3]/50 text-[#3a5c27]"
          : "border-[#8a2a1f]/40 bg-red-50/60 text-[#8a2a1f]"
      }`}
    >
      {msg.type === "success" ? "✦ " : "⚠️ "}
      {msg.text}
    </div>
  )
}
