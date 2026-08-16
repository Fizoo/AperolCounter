export type HistoryEntryType = 'add' | 'reset';

export interface HistoryEntry {
  ts: number;
  amount: number;
  type: HistoryEntryType;
}

export interface BarItem {
  id: string;
  name: string;
  color: string;
  photo: string;
  total: number;
  history: HistoryEntry[];
}

export interface BarState {
  items: BarItem[];
}

export const PRESET_COLORS: string[] = [
  '#ff6b35', '#4a90e2', '#e74c3c', '#2ecc71', '#f1c40f',
  '#9b59b6', '#1abc9c', '#e91e63', '#ff9800', '#00bcd4',
];

export const DEFAULT_ITEMS: Omit<BarItem, 'total' | 'history'>[] = [
  { id: 'aperol', name: 'Aperol', color: '#ff6b35', photo: 'img/aperol.png' },
  { id: 'gordons', name: "Gordon's", color: '#4a90e2', photo: 'img/gordons.png' },
  { id: 'captain0', name: 'Captain Morgan 0.0', color: '#2ecc71', photo: 'img/rum-zero.png' },
  { id: 'captain', name: 'Captain Morgan', color: '#e74c3c', photo: 'img/rum.png' },
  { id: 'tequila', name: 'Tequila', color: '#f1c40f', photo: 'img/tequila.png' },
];
