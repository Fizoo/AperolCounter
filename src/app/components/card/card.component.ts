import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { BarItem } from '../../models/bar-item.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="card" [style]="cardVars()">
      <div class="card-bg" [style.background-image]="bgImage()"></div>
      <div class="card-overlay"></div>
      <div class="card-glass"></div>
      <div class="card-content">
        <div class="card-header-row">
          <div class="card-name">{{ item().name }}</div>
          <button class="card-history-btn" type="button" (click)="openHistory($event)">
            <span>Історія</span><span>→</span>
          </button>
        </div>

        <div class="counter-area">
        <!--  <div class="bottle-icon-wrap"><app-bottle-icon [color]="item().color" /></div>-->
          <div class="counter-value" [class.bump]="bumping()">{{ item().total }}</div>
          <div class="counter-unit">мл</div>
        </div>

        <div class="card-buttons">
          <button class="btn-reset" type="button" (click)="reset.emit()">Скинути</button>
          <button class="btn-plus" type="button" [class.rippling]="rippling()" (click)="onAdd()">＋</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      height: 420px;
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--glass-border);
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
    }

    .card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 1;
      //filter: none;
      filter: blur(1px);
      z-index: 0;
    }
   /* .card-bg {
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      opacity: 1;
      filter: none;

     // opacity: 0.52;
     // filter: blur(1px);
    }*/
    .card-overlay {

      display: none;
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, var(--card-color-dark) 0%, rgba(0,0,0,0.7) 100%);
      /*position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.7) 100%),
        linear-gradient(135deg, rgba(255,107,53,0.22) 0%, rgba(0,0,0,0.45) 100%);*/
    }
    .card-glass {
      position: absolute;
      inset: 0;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      display: none;

      /*position: absolute; inset: 0; background: rgba(255,255,255,0.03); backdrop-filter: blur(20px);*/ }
    .card-content { position: relative; z-index: 2; height: 100%; display: flex; flex-direction: column; padding: 22px 20px 18px; }
    .card-header-row { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 8px; gap: 12px; }
    .card-name { font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-shadow: 0 2px 10px rgba(0,0,0,0.5); line-height: 1.2; max-width: 68%; }
    .card-history-btn { font-size: 14px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 20px; padding: 6px 14px; backdrop-filter: blur(8px); cursor: pointer; white-space: nowrap; transition: background 0.2s, transform 0.2s; }
    .card-history-btn:active { background: rgba(255,255,255,0.22); transform: scale(0.96); }
    .counter-area { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .bottle-icon-wrap { margin-bottom: 4px; }
    .counter-value { font-size: 52px; font-weight: 900; letter-spacing: -2px; line-height: 1; color: #fff; text-shadow: 0 0 30px var(--card-color), 0 4px 20px rgba(0,0,0,0.5); transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1); }
    .counter-value.bump { transform: scale(1.18); }
    .counter-unit { font-size: 18px; font-weight: 600; color: var(--text-dim); margin-top: 2px; letter-spacing: 1px; }
    .card-buttons { display: flex; gap: 12px; align-items: center; justify-content: center; margin-top: 12px; }
    .btn-reset { padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.15); background: rgba(255,255,255,0.07); color: var(--text-dim); font-size: 13px; font-weight: 600; cursor: pointer; transition: var(--transition); backdrop-filter: blur(10px); letter-spacing: 0.3px; }
    .btn-reset:active { transform: scale(0.95); background: rgba(255,60,60,0.2); color: #ff6b6b; }
    .btn-plus { width: 72px; height: 72px; border-radius: 50%; border: none; background: var(--card-color); color: #fff; font-size: 32px; font-weight: 300; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px var(--card-color), 0 8px 24px rgba(0,0,0,0.4); transition: var(--transition); flex-shrink: 0; }
    .btn-plus:active { transform: scale(0.92); }
    .btn-plus.rippling { animation: ripplePulse 0.5s ease-out; }
    @keyframes ripplePulse { 0% { box-shadow: 0 0 30px var(--card-color), 0 8px 24px rgba(0,0,0,0.4); } 50% { box-shadow: 0 0 60px var(--card-color), 0 0 80px var(--card-color), 0 8px 24px rgba(0,0,0,0.4); } 100% { box-shadow: 0 0 30px var(--card-color), 0 8px 24px rgba(0,0,0,0.4); } }
  `],
})
export class CardComponent {
  readonly item = input.required<BarItem>();
  readonly addMl = output<void>();
  readonly reset = output<void>();
  readonly history = output<void>();
  protected readonly bumping = signal(false);
  protected readonly rippling = signal(false);
  protected readonly cardVars = computed(() => { const color = this.item().color; return { '--card-color': color, '--card-color-dark': this.darkenColor(color) }; });
  protected readonly bgImage = computed(() => { const photo = this.item().photo; const color = this.item().color; return photo ? `url('${photo}')` : `radial-gradient(circle at 60% 40%, ${color}22, transparent 70%)`; });
  openHistory(event: Event): void { event.stopPropagation(); this.history.emit(); }
  onAdd(): void { this.addMl.emit(); this.bumping.set(false); this.rippling.set(false); requestAnimationFrame(() => { this.bumping.set(true); this.rippling.set(true); setTimeout(() => { this.bumping.set(false); this.rippling.set(false); }, 500); }); }
  private darkenColor(hex: string, amount = 0.5): string { const r = Math.round(parseInt(hex.slice(1, 3), 16) * amount); const g = Math.round(parseInt(hex.slice(3, 5), 16) * amount); const b = Math.round(parseInt(hex.slice(5, 7), 16) * amount); return `rgba(${r},${g},${b},0.6)`; }
}
