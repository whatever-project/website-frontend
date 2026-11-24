/**
 * Mock data for the bottom game HUD (player card, resources, world info).
 * Everything here is static sample data; replace with the real character / wallet / game-clock services later.
 */

/** Wallet rule from the GDD: 100 Kel = 1 Drankle. The two currencies are never merged automatically. */
export const KEL_PER_DRANKLE = 100

export interface WalletEntry {
  code: "D" | "K"
  name: string
  amount: number
  /** future: hide a wallet type from the HUD */
  hidden?: boolean
}

export const HUD_PLAYER = {
  name: "Karen Mason",
  role: "Professor",
  /** placeholder avatar: initials are drawn in the HUD until a picture exists */
  initials: "KM",
  /**
   * Portrait picture (public path, rendered with object-fit: cover in a circle). If the file is missing the initials are shown instead.
   * To change the picture later: put the file in public/assets/avatars/ and change these three values; no CSS needed.
   */
  avatarUrl: "/assets/avatar-1.jpg" as string | null,
  /** point of the picture that stays centred in the circle (the face): "x% y%" */
  avatarFocus: "47% 10%",
  /** 1 = whole picture; > 1 zooms in on avatarFocus so the face fills the circle */
  avatarZoom: 1.4,
}

export const HUD_WALLET: WalletEntry[] = [
  { code: "D", name: "Drankle", amount: 1280 },
  { code: "K", name: "Kel", amount: 45 },
]

export interface HudResource {
  key: "hp" | "mana"
  label: string
  cur: number
  max: number
  /** seconds between +1 */
  regenEvery: number
  /** seconds left until the next +1 when the HUD first renders */
  regenLeft: number
}

/** Any number of resources can be added here; the HUD renders the whole list. */
export const HUD_RESOURCES: HudResource[] = [
  { key: "hp", label: "HP", cur: 82, max: 100, regenEvery: 60, regenLeft: 42 },
  { key: "mana", label: "Mana", cur: 64, max: 100, regenEvery: 180, regenLeft: 135 },
]

export const HUD_WORLD = {
  date: "14 สิงหา ปี 1127",
  /** minutes since midnight at first render (21:00); the HUD advances it as a demo */
  startMinutes: 21 * 60,
  season: "ออสทารา",
  weather: "แจ่มใส",
  temperature: 22,
  moon: "ข้างขึ้น 8 ค่ำ",
}
