import { Injectable, signal } from '@angular/core';
import { BarItem, BarState, DEFAULT_ITEMS, HistoryEntry } from '../models/bar-item.model';

const STORAGE_KEY = 'barTracker_v2_ng';
const ADD_AMOUNT = 50;

function genId(): string {
  return 'item_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

@Injectable({ providedIn: 'root' })
export class BarStateService {
  readonly items = signal<BarItem[]>(this.loadInitial());

  addMl(id: string, amount: number = ADD_AMOUNT): BarItem | undefined {
    let updated: BarItem | undefined;
    this.items.update((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const entry: HistoryEntry = { ts: Date.now(), amount, type: 'add' };
        updated = { ...item, total: item.total + amount, history: [...item.history, entry] };
        return updated;
      }),
    );
    this.persist();
    return updated;
  }

  resetItem(id: string): BarItem | undefined {
    let updated: BarItem | undefined;
    this.items.update((items) =>
      items.map((item) => {
        if (item.id !== id) return item;
        const entry: HistoryEntry = { ts: Date.now(), amount: item.total, type: 'reset' };
        updated = { ...item, total: 0, history: [...item.history, entry] };
        return updated;
      }),
    );
    this.persist();
    return updated;
  }

  addItem(data: { name: string; color: string; photo: string }): BarItem {
    const newItem: BarItem = {
      id: genId(),
      name: data.name,
      color: data.color,
      photo: data.photo,
      total: 0,
      history: [],
    };
    this.items.update((items) => [...items, newItem]);
    this.persist();
    return newItem;
  }

  exportBackup(): string {
    const state: BarState = { items: this.items() };
    return JSON.stringify(state, null, 2);
  }

  importBackup(json: string): boolean {
    try {
      const parsed = JSON.parse(json) as BarState;
      if (!parsed.items || !Array.isArray(parsed.items)) throw new Error('bad format');
      this.items.set(parsed.items);
      this.persist();
      return true;
    } catch {
      return false;
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: this.items() }));
  }

  private loadInitial(): BarItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BarState;
        return parsed.items.map((item) => ({
          ...item,
          history: item.history ?? [],
          total: item.total ?? 0,
          id: item.id ?? genId(),
        }));
      }
    } catch {
      // fall through to defaults
    }
    const defaults = DEFAULT_ITEMS.map((d) => ({ ...d, total: 0, history: [] as HistoryEntry[] }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: defaults }));
    return defaults;
  }
}
