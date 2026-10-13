export interface CharProfile {
  id: string;
  name: string;
  status: 'Active' | 'Lock';
  pos: string;
  kind: 'visitor' | 'create' | 'char';
}
