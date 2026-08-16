import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { BarItem } from '../../models/bar-item.model';

interface JournalEntry {
  ts: number;
  amount: number;
  type: 'add' | 'reset';
  itemName: string;
  itemColor: string;
}

@Component({
  selector: 'app-journal-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" [class.active]="visible()" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">📋 Весь список</div>
          <button class="modal-close" (click)="close.emit()">✕</button>
        </div>
        <div class="modal-body">
          <div class="journal-stats">
            <div class="stat-card">
              <div class="stat-value">{{ totalEntries() }}</div>
              <div class="stat-label">Записів</div>
            </div>
            <div class="stat-card">
              <div class="stat-value">{{ totalMl() }} мл</div>
              <div class="stat-label">Загалом</div>
            </div>
          </div>
          <div class="journal-controls">
            <input class="journal-search form-input" type="text" placeholder="🔍 Пошук..." [value]="search()" (input)="search.set($any($event.target).value)" />
            <select class="journal-sort" [value]="sort()" (change)="sort.set($any($event.target).value)">
              <option value="newest">Нові ↑</option>
              <option value="oldest">Старі ↑</option>
            </select>
          </div>
          @if (filteredEntries().length === 0) {
            <div class="journal-empty">Записів не знайдено</div>
          } @else {
            @for (e of filteredEntries(); track e.ts + e.itemName) {
              <div class="journal-entry">
                <div class="journal-entry-left">
                  <div class="journal-entry-date">{{ formatDateTime(e.ts) }}</div>
                  <div class="journal-entry-name" [style.color]="e.itemColor">{{ e.itemName }}</div>
                </div>
                <div class="journal-entry-amount" [style.color]="e.type === 'reset' ? '#ff6b6b' : e.itemColor">
                  {{ e.type === 'reset' ? '🔄 Скинуто ' + e.amount + ' мл' : '+' + e.amount + ' мл' }}
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .journal-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .stat-card { background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px; padding: 14px; text-align: center; }
    .stat-value {
      font-size: 26px; font-weight: 900; letter-spacing: -1px;
      background: linear-gradient(135deg, #fff, rgba(255,255,255,0.6));
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }
    .stat-label { font-size: 11px; color: var(--text-dim); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 2px; }

    .journal-controls { display: flex; gap: 8px; margin-bottom: 14px; }
    .journal-search { flex: 1; padding: 11px 14px; }
    .journal-sort {
      padding: 11px 12px; border-radius: 14px; border: 1px solid var(--glass-border);
      background: var(--glass); color: var(--text); font-size: 13px; outline: none; cursor: pointer; min-width: 110px;
    }

    .journal-entry {
      padding: 14px; background: var(--glass); border: 1px solid var(--glass-border); border-radius: 16px;
      margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;
    }
    .journal-entry-date { font-size: 12px; color: var(--text-dim); margin-bottom: 3px; }
    .journal-entry-name { font-size: 16px; font-weight: 700; }
    .journal-entry-amount { font-size: 20px; font-weight: 900; letter-spacing: -0.5px; }
    .journal-empty { text-align: center; color: var(--text-dim); padding: 40px 0; font-size: 15px; opacity: 0.5; }
  `],
})
export class JournalModalComponent {
  readonly items = input.required<BarItem[]>();
  readonly visible = input.required<boolean>();
  readonly close = output<void>();

  protected readonly search = signal('');
  protected readonly sort = signal<'newest' | 'oldest'>('newest');

  private readonly allEntries = computed<JournalEntry[]>(() =>
    this.items().flatMap((item) =>
      item.history.map((h) => ({ ...h, itemName: item.name, itemColor: item.color })),
    ),
  );

  protected readonly totalEntries = computed(
    () => this.allEntries().filter((e) => e.type === 'add').length,
  );

  protected readonly totalMl = computed(() =>
    this.allEntries()
      .filter((e) => e.type === 'add')
      .reduce((sum, e) => sum + e.amount, 0),
  );

  protected readonly filteredEntries = computed(() => {
    const term = this.search().toLowerCase();
    let entries = this.allEntries();
    if (term) entries = entries.filter((e) => e.itemName.toLowerCase().includes(term));
    const dir = this.sort();
    return [...entries].sort((a, b) => (dir === 'newest' ? b.ts - a.ts : a.ts - b.ts));
  });

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  formatDateTime(ts: number): string {
    const d = new Date(ts);
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const hh = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${dd}.${mm}.${yyyy} ${hh}:${min}`;
  }
}
