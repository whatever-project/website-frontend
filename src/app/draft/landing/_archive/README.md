# _archive: parked files (not used by the running Landing page)

Created during the Landing architecture refactor (Phase 0 / Phase 2). NOTHING here is imported by code.
Everything is stored as real .zip files on purpose: `tsc` and `eslint` scan every .ts/.tsx/.js file under the project,
but they do not look inside zip files, so the archived sources no longer produce errors or lint noise.

| File | Original location | Contents |
|---|---|---|
| scroll-source.zip | `_assets/scroll/source/` | Blender sources, Python build scripts, the Vite/shadcn demo app, restored JS versions (102 MB) |
| scroll-legacy-models.zip | `_assets/scroll/legacy-models/` | Older GLB exports of the scroll (30 MB) |
| scroll-previews.zip | `_assets/scroll/previews/` | Preview PNGs and the preview MP4 (30 MB) |
| reference.zip | `_assets/reference/` | The designer's HTML reference (never imported) |
| phase0-backup-code.zip | (rollback point) | Hand-written Landing code + `public/assets/landing` exactly as they were BEFORE the refactor |
| MANIFEST.sha256 | | SHA-256 of every archived file (paths relative to the landing folder) |

To restore a group, extract the zip from the landing folder (paths inside the zip start with `_assets/...`), e.g.
`tar -xf _archive/scroll-source.zip` (Windows `tar.exe`). The runtime model `_assets/scroll/Parchment_Rolling_Animation_v03.glb` was NOT moved.
These archives are temporary: they can be deleted once it is confirmed that nothing depends on them.
