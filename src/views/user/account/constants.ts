import type { CharProfile } from "./types"

export const PROFILES: CharProfile[] = [
  { id: 'visitor', name: 'Visitor Mode', status: 'Active', pos: 'lg:top-6 lg:left-[6%]', kind: 'visitor' },
  { id: 'karen', name: 'Karen Mason', status: 'Active', pos: 'lg:top-40 lg:left-[38%]', kind: 'char' },
  { id: 'jeanna', name: 'Jeanna Layne', status: 'Lock', pos: 'lg:top-10 lg:right-[14%]', kind: 'char' },
  { id: 'create', name: 'Create Character', status: 'Active', pos: 'lg:top-64 lg:right-[34%]', kind: 'create' },
];
