import type { useTranslations } from "next-intl"
import type { DELETION_REASON_KEYS } from "./constants"

export type DeletionReasonKey = (typeof DELETION_REASON_KEYS)[number]

export type Feedback = { type: "success" | "error"; text: string }

export type DashboardT = ReturnType<typeof useTranslations<"dashboard">>
