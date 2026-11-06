// Every asset URL the landing draft uses, in one place.
//
//  Static images in public/assets, referenced by URL:
//   /assets/landing/quill/      the Midnight Arcane quill
//   /assets/village.jpg         the backdrop, SHARED with the live landing page (src/views/public/landing): deliberately not moved
//
//  The parchment model is a BUNDLER asset, not a public/ file: it is resolved relative to this file with import.meta.url and
//  emitted with a hashed name. It cannot live in public/assets because src/proxy.ts (shared, outside this folder) routes every
//  request whose extension is not in its static list through i18n, and .glb is not in that list: /assets/....glb would be
//  rewritten to /en/assets/....glb and 404 (verified). Its Blender sources, older exports and previews are NOT here any more:
//  they are parked as zip files in ../_archive/ (see _archive/README.md) and are not referenced by any code.

export const BACKDROP_SRC = "/assets/village.jpg"

export const QUILL_SRC = "/assets/landing/quill/midnight-arcane-quill.png"

export const PARCHMENT_GLB_URL = new URL("../_assets/scroll/Parchment_Rolling_Animation_v03.glb", import.meta.url).href
