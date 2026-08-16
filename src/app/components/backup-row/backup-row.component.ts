import { ChangeDetectionStrategy, Component, output } from '@angular/core';

@Component({
  selector: 'app-backup-row',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="backup-row">
      <button class="btn-backup" (click)="exportClicked.emit()">⬇️ Експорт</button>
      <button class="btn-backup" (click)="fileInput.click()">⬆️ Імпорт</button>
      <input #fileInput type="file" accept=".json" (change)="onFileSelected($event)" hidden />
    </div>
  `,
  styles: [`
    .backup-row { display: flex; gap: 8px; padding: 0 16px 16px; }
    .btn-backup {
      flex: 1; padding: 12px; border-radius: 14px;
      border: 1px solid var(--glass-border); background: var(--glass); color: var(--text-dim);
      font-size: 12px; font-weight: 600; cursor: pointer; transition: var(--transition);
      display: flex; align-items: center; justify-content: center; gap: 6px; letter-spacing: 0.2px;
    }
    .btn-backup:active { transform: scale(0.96); background: rgba(255,255,255,0.1); color: var(--text); }
  `],
})
export class BackupRowComponent {
  readonly exportClicked = output<void>();
  readonly fileSelected = output<File>();

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.fileSelected.emit(file);
    input.value = '';
  }
}
