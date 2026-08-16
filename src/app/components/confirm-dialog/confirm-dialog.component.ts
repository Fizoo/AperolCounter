import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ConfirmDialogService } from '../../services/confirm-dialog.service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="confirm-overlay" [class.active]="dialog.visible()">
      <div class="confirm-box">
        <div class="confirm-icon">⚠️</div>
        <div class="confirm-title">{{ dialog.options().title }}</div>
        <div class="confirm-text">{{ dialog.options().text }}</div>
        <div class="confirm-buttons">
          <button class="btn-confirm-cancel" (click)="dialog.resolve(false)">Скасувати</button>
          <button
            class="btn-confirm-ok"
            [class.danger]="dialog.options().danger"
            (click)="dialog.resolve(true)"
          >{{ dialog.options().confirmLabel ?? 'Підтвердити' }}</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .confirm-overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.7);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex; align-items: center; justify-content: center;
      padding: 20px;
      opacity: 0; pointer-events: none;
      transition: opacity 0.25s;
    }
    .confirm-overlay.active { opacity: 1; pointer-events: all; }
    .confirm-box {
      background: #1a1a24;
      border: 1px solid var(--glass-border);
      border-radius: 24px;
      padding: 28px 24px;
      width: 100%; max-width: 320px;
      text-align: center;
      transform: scale(0.9);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1);
    }
    .confirm-overlay.active .confirm-box { transform: scale(1); }
    .confirm-icon { font-size: 40px; margin-bottom: 12px; }
    .confirm-title { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
    .confirm-text { font-size: 14px; color: var(--text-dim); margin-bottom: 24px; line-height: 1.5; }
    .confirm-buttons { display: flex; gap: 10px; }
    .btn-confirm-cancel, .btn-confirm-ok {
      flex: 1; padding: 14px; border-radius: 14px; border: none;
      font-size: 15px; font-weight: 700; cursor: pointer; transition: var(--transition);
    }
    .btn-confirm-cancel { border: 1px solid var(--glass-border); background: var(--glass); color: var(--text); font-weight: 600; }
    .btn-confirm-ok { background: linear-gradient(135deg, #667eea, #764ba2); color: #fff; }
    .btn-confirm-ok.danger { background: linear-gradient(135deg, #ff4444, #cc0000); }
    .btn-confirm-cancel:active, .btn-confirm-ok:active { transform: scale(0.95); }
  `],
})
export class ConfirmDialogComponent {
  protected readonly dialog = inject(ConfirmDialogService);
}
