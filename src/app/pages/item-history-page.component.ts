import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BarStateService } from '../services/bar-state.service';

@Component({
  selector: 'app-item-history-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="history-page">
      <div class="history-header" [style]="cardVars()">
        <a class="back-btn" routerLink="/">← Назад</a>
        @if (item(); as currentItem) {
          <div class="title-wrap">
            <div class="eyebrow">Історія</div>
            <h1>{{ currentItem.name }}</h1>
            <div class="total">{{ currentItem.total }} мл</div>
          </div>
        }
      </div>

      @if (item(); as currentItem) {
        <div class="hero-card" [style]="cardVars()">
          <div class="card-bg" [style.background-image]="bgImage()"></div>
          <div class="card-overlay"></div>
          <div class="hero-content">
            <div class="hero-name">{{ currentItem.name }}</div>
            <div class="hero-total">{{ currentItem.total }} <span>мл</span></div>
          </div>
        </div>

        <div class="history-list">
          @if (currentItem.history.length === 0) {
            <div class="history-empty">Ще немає записів</div>
          } @else {
            @for (h of reversedHistory(); track h.ts) {
              <div class="history-item" [class.reset-item]="h.type === 'reset'">
                <div class="history-datetime">{{ formatDateTime(h.ts) }}</div>
                <div class="history-amount" [class.reset-amount]="h.type === 'reset'">
                  {{ h.type === 'reset' ? '🔄 Скинуто ' + h.amount + ' мл' : '+' + h.amount + ' мл' }}
                </div>
              </div>
            }
          }
        </div>
      } @else {
        <div class="not-found">
          <h1>Картку не знайдено</h1>
          <a routerLink="/">Повернутись на головну</a>
        </div>
      }
    </div>
  `,
  styles: [`
    .history-page { min-height: 100dvh; padding-bottom: 28px; }
    .history-header { position: sticky; top: 0; z-index: 10; padding: 14px 16px 18px; background: linear-gradient(135deg, var(--card-color-dark), rgba(10,10,15,0.94)); border-bottom: 1px solid var(--glass-border); backdrop-filter: blur(18px); }
    .back-btn { display: inline-flex; align-items: center; gap: 6px; height: 38px; padding: 0 14px; border-radius: 999px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.16); color: #fff; text-decoration: none; font-weight: 700; }
    .title-wrap { margin-top: 18px; }
    .eyebrow { color: var(--text-dim); font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; }
    h1 { margin: 2px 0 0; font-size: 32px; line-height: 1.05; letter-spacing: -1px; }
    .total { margin-top: 8px; color: var(--card-color); font-size: 26px; font-weight: 900; text-shadow: 0 0 22px var(--card-color); }
    .hero-card { margin: 16px; height: 220px; border-radius: var(--radius); overflow: hidden; position: relative; border: 1px solid var(--glass-border); box-shadow: 0 8px 32px rgba(0,0,0,0.45); }
    .card-bg { position: absolute; inset: 0; background-size: cover; background-position: center; opacity: 0.16; filter: blur(1px); }
    .card-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, var(--card-color-dark), rgba(0,0,0,0.76)); }
    .hero-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; justify-content: flex-end; padding: 22px; }
    .hero-name { font-size: 18px; color: rgba(255,255,255,0.72); font-weight: 800; }
    .hero-total { font-size: 58px; line-height: 1; font-weight: 950; letter-spacing: -2px; color: #fff; text-shadow: 0 0 30px var(--card-color); }
    .hero-total span { font-size: 20px; color: var(--text-dim); letter-spacing: 0; }
    .history-list { padding: 0 16px; display: flex; flex-direction: column; gap: 8px; }
    .history-item { display: flex; justify-content: space-between; align-items: center; padding: 14px; background: var(--glass); border-radius: 16px; border: 1px solid var(--glass-border); }
    .history-item.reset-item { border-color: rgba(255,100,100,0.2); background: rgba(255,60,60,0.08); }
    .history-datetime { font-size: 13px; color: var(--text-dim); line-height: 1.4; }
    .history-amount { font-size: 18px; font-weight: 900; color: var(--card-color); }
    .history-amount.reset-amount { color: #ff6b6b; }
    .history-empty, .not-found { margin: 16px; padding: 34px 18px; text-align: center; color: var(--text-dim); background: var(--glass); border: 1px solid var(--glass-border); border-radius: var(--radius); }
    .not-found a { color: #fff; font-weight: 800; }
  `],
})
export class ItemHistoryPageComponent {
  readonly id = input.required<string>();
  private readonly state = inject(BarStateService);
  protected readonly item = computed(() => this.state.items().find((item) => item.id === this.id()));
  protected readonly reversedHistory = computed(() => [...(this.item()?.history ?? [])].reverse());
  protected readonly cardVars = computed(() => {
    const color = this.item()?.color ?? '#4a90e2';
    return { '--card-color': color, '--card-color-dark': this.darkenColor(color) };
  });
  protected readonly bgImage = computed(() => {
    const currentItem = this.item(); const photo = currentItem?.photo; const color = currentItem?.color ?? '#4a90e2';
    return photo ? `url('${photo}')` : `radial-gradient(circle at 60% 40%, ${color}22, transparent 70%)`;
  });
  formatDateTime(ts: number): string { const d = new Date(ts); const dd = String(d.getDate()).padStart(2, '0'); const mm = String(d.getMonth() + 1).padStart(2, '0'); const yyyy = d.getFullYear(); const hh = String(d.getHours()).padStart(2, '0'); const min = String(d.getMinutes()).padStart(2, '0'); return `${dd}.${mm}.${yyyy} ${hh}:${min}`; }
  private darkenColor(hex: string, amount = 0.5): string { const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount); const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount); const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount); return `rgba(${r},${g},${b},0.6)`; }
}
