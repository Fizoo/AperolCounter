import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { BarStateService } from '../services/bar-state.service';
import { ToastService } from '../services/toast.service';
import { ConfirmDialogService } from '../services/confirm-dialog.service';
import { CardComponent } from '../components/card/card.component';
import { BackupRowComponent } from '../components/backup-row/backup-row.component';
import { JournalModalComponent } from '../components/journal-modal/journal-modal.component';
import { AddFormModalComponent, NewItemData } from '../components/add-form-modal/add-form-modal.component';
import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { ToastComponent } from '../components/toast/toast.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    CardComponent,
    BackupRowComponent,
    JournalModalComponent,
    AddFormModalComponent,
    ConfirmDialogComponent,
    ToastComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="header">
      <div class="header-title">🍸 Bar Tracker</div>
      <div class="header-actions">
        <button class="btn-icon btn-journal" (click)="journalOpen.set(true)">📋 Журнал</button>
        <button class="btn-icon" title="Нова позиція" (click)="addFormOpen.set(true)">＋</button>
      </div>
    </div>

    <app-backup-row (exportClicked)="onExport()" (fileSelected)="onImport($event)" />

    <div class="cards-container">
      @for (item of state.items(); track item.id) {
        <app-card
          [item]="item"
          (history)="openHistory(item.id)"
          (addMl)="onAddMl(item.id, item.name)"
          (reset)="onReset(item.id, item.name)"
        />
      }
    </div>

    <div class="add-card-wrap">
      <button class="add-card-btn" (click)="addFormOpen.set(true)">
        <span class="plus-icon">＋</span>
        <span>Нова позиція</span>
      </button>
    </div>

    <app-journal-modal [items]="state.items()" [visible]="journalOpen()" (close)="journalOpen.set(false)" />
    <app-add-form-modal [visible]="addFormOpen()" (close)="addFormOpen.set(false)" (create)="onCreate($event)" />
    <app-confirm-dialog />
    <app-toast />
  `,
  styles: [`
    .header { position: sticky; top: 0; z-index: 100; background: rgba(10,10,15,0.85); backdrop-filter: blur(20px); border-bottom: 1px solid var(--glass-border); padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .header-title { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.6) 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .header-actions { display: flex; gap: 8px; align-items: center; }
    .btn-journal { padding: 0 14px; width: auto; font-size: 13px; font-weight: 600; gap: 5px; white-space: nowrap; }
    .cards-container { padding: 16px; display: flex; flex-direction: column; gap: 16px; }
    .add-card-wrap { padding: 0 16px 30px; }
    .add-card-btn { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 20px; border-radius: var(--radius); border: 2px dashed rgba(255,255,255,0.15); background: rgba(255,255,255,0.02); color: var(--text-dim); font-size: 16px; font-weight: 600; cursor: pointer; transition: var(--transition); width: 100%; letter-spacing: 0.3px; }
    .add-card-btn:active { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.3); color: var(--text); }
    .plus-icon { font-size: 22px; }
  `],
})
export class HomePageComponent {
  protected readonly state = inject(BarStateService);
  private readonly toast = inject(ToastService);
  private readonly confirm = inject(ConfirmDialogService);
  private readonly router = inject(Router);
  protected readonly journalOpen = signal(false);
  protected readonly addFormOpen = signal(false);

  openHistory(id: string): void { void this.router.navigate(['/history', id]); }
  onAddMl(id: string, name: string): void {
    const amount = id === 'aperol' ? 200 : 50;

    this.state.addMl(id, amount);
    this.toast.show(`+${amount} мл — ${name}`);
/*
    this.state.addMl(id);
    this.toast.show(`+50 мл — ${name}`);*/
  }
  async onReset(id: string, name: string): Promise<void> {
    const confirmed = await this.confirm.ask({ title: `Скинути "${name}"?`, text: 'Загальна сума буде обнулена. Запис про скидання збережеться в історії.', confirmLabel: 'Скинути', danger: true });
    if (confirmed) { this.state.resetItem(id); this.toast.show(`${name} — скинуто`); }
  }
  onCreate(data: NewItemData): void { this.state.addItem(data); this.addFormOpen.set(false); this.toast.show(`✨ "${data.name}" додано`); }
  onExport(): void {
    const data = this.state.exportBackup(); const blob = new Blob([data], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); const now = new Date();
    a.href = url; a.download = `bar_backup_${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}.json`; a.click(); URL.revokeObjectURL(url); this.toast.show('✅ Резервну копію збережено');
  }
  onImport(file: File): void { const reader = new FileReader(); reader.onload = (ev) => { const ok = this.state.importBackup(ev.target?.result as string); this.toast.show(ok ? '✅ Дані імпортовано' : '❌ Помилка імпорту'); }; reader.readAsText(file); }
}
