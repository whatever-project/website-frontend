/**
 * Mock option lists for the character-create wizard.
 * Fixed in-setting text (not user input). User-entered values live in page state.
 * Long guide copy is in ./guideContent.ts; the in-setting calendar is in ../_components/settingCalendar.ts.
 */
import avatar3 from "../_assets/avatar-3.png"
import avatar4 from "../_assets/avatar-4.png"
import avatar5 from "../_assets/avatar-5.png"
import avatar6 from "../_assets/avatar-6.png"
import avatar7 from "../_assets/avatar-7.png"
import avatar8 from "../_assets/avatar-8.png"

export interface ChipOption {
  /** internal value */
  id: string
  /** label shown in the UI */
  label: string
}

export const BLOODLINE_TYPES: ChipOption[] = [
  { id: "pure", label: "สายเลือดบริสุทธิ์" },
  { id: "mixed", label: "สายเลือดผสม" },
]

export const DOMINANT_BLOODLINES: ChipOption[] = [
  { id: "human", label: "มนุษย์" },
  { id: "witch", label: "ผู้วิเศษ" },
  { id: "halfbeast", label: "ฮาล์ฟบีสต์" },
  { id: "nymph", label: "นิมฟ์" },
]

/** Sub-race, shown only when the dominant bloodline is ฮาล์ฟบีสต์. */
export const BEAST_RACES: ChipOption[] = [
  { id: "terra", label: "ชาวเทอร์ร่า" },
  { id: "avian", label: "ชาวเอเวียน" },
  { id: "aqua", label: "ชาวอควา" },
  { id: "reptile", label: "ชาวเรพเทียล" },
]

/** Spirit, shown only when the dominant bloodline is นิมฟ์. */
export const NYMPH_SPIRITS: ChipOption[] = [
  { id: "dryad", label: "ดรายแอด (Dryad — ต้นไม้)" },
  { id: "naiad", label: "ไนแอด (Naiad — น้ำ)" },
  { id: "aura", label: "ออรา (Aura — ลมและฟ้า)" },
]

export const MAX_CUSTOM_TOPICS = 3

export const BIRTH_MODES: ChipOption[] = [
  { id: "real", label: "วันที่สากล (ปฏิทินโลกจริง)" },
  { id: "setting", label: "วันที่ของระบบเวลาในเซตติ้ง" },
]

export const NAME_FORMATS: { id: "first-last" | "last-first"; label: string }[] = [
  { id: "first-last", label: "Firstname Lastname" },
  { id: "last-first", label: "Lastname Firstname" },
]

/**
 * Profile-picture presets. The form stores the preset **id**, not the URL, so a saved draft
 * survives rebuilds (static imports get hashed file names). avatar-1/2 already live in public/assets;
 * avatar-3..8 are draft-only files in ../_assets (to be optimised / moved to public/assets on promotion).
 */
export interface PhotoPreset {
  id: string
  src: string
}

export const PHOTO_PRESETS: PhotoPreset[] = [
  { id: "avatar-1", src: "/assets/avatar-1.jpg" },
  { id: "avatar-2", src: "/assets/avatar-2.jpg" },
  { id: "avatar-3", src: avatar3.src },
  { id: "avatar-4", src: avatar4.src },
  { id: "avatar-5", src: avatar5.src },
  { id: "avatar-6", src: avatar6.src },
  { id: "avatar-7", src: avatar7.src },
  { id: "avatar-8", src: avatar8.src },
]

export function getPhotoSrc(id: string): string | null {
  return PHOTO_PRESETS.find((p) => p.id === id)?.src ?? null
}

/** Label for an option id, "—" when nothing is selected. */
export function optionLabel(list: readonly ChipOption[], id: string): string {
  return list.find((o) => o.id === id)?.label ?? "—"
}
