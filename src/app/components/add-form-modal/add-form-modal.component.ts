import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { PRESET_COLORS } from '../../models/bar-item.model';

export interface NewItemData {
  name: string;
  color: string;
  photo: string;
}

@Component({
  selector: 'app-add-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="modal-overlay" [class.active]="visible()" (click)="onOverlayClick($event)">
      <div class="modal">
        <div class="modal-handle"></div>
        <div class="modal-header">
          <div class="modal-title">✨ Нова позиція</div>
          <button class="modal-close" (click)="close.emit()">✕</button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Назва</label>
            <input class="form-input" type="text" placeholder="Наприклад: Jägermeister" [value]="name()" (input)="name.set($any($event.target).value)" />
          </div>

          <div class="form-group">
            <label class="form-label">Колір картки</label>
            <div class="color-picker-row">
              @for (c of presetColors; track c) {
                <div
                  class="color-swatch"
                  [class.selected]="c === selectedColor()"
                  [style.background]="c"
                  (click)="selectedColor.set(c)"
                ></div>
              }
            </div>
            <div class="color-custom-row">
              <input type="color" class="color-custom-input" [value]="selectedColor()" (change)="selectedColor.set($any($event.target).value)" />
              <span class="custom-color-label">Свій колір</span>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Фото пляшки</label>
            <div class="photo-options">
              <div class="photo-tab" [class.active]="photoTab() === 'url'" (click)="photoTab.set('url')">URL</div>
              <div class="photo-tab" [class.active]="photoTab() === 'file'" (click)="photoTab.set('file')">Файл</div>
            </div>
            @if (photoTab() === 'url') {
              <input class="form-input" type="url" placeholder="https://..." [value]="photoUrl()" (input)="photoUrl.set($any($event.target).value)" />
              @if (photoUrl()) {
                <img class="photo-preview" [src]="photoUrl()" alt="preview" (error)="photoUrl.set('')" />
              }
            } @else {
              <div class="file-upload-area" (click)="fileInput.click()">
                <div class="file-upload-icon">📷</div>
                <div>Натисніть, щоб вибрати фото</div>
                <input #fileInput type="file" accept="image/*" hidden (change)="onFileSelected($event)" />
              </div>
              @if (photoFileData()) {
                <img class="photo-preview" [src]="photoFileData()" alt="preview" />
              }
            }
          </div>

          <button class="btn-submit" (click)="submit()">Створити картку</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .color-picker-row { display: flex; gap: 10px; flex-wrap: wrap; }
    .color-swatch {
      width: 44px; height: 44px; border-radius: 12px; cursor: pointer;
      border: 3px solid transparent; transition: var(--transition); position: relative;
    }
    .color-swatch.selected { border-color: #fff; transform: scale(1.1); }
    .color-swatch.selected::after {
      content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
      color: #fff; font-size: 18px; font-weight: 700;
    }
    .color-custom-row { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
    .color-custom-input { width: 50px; height: 44px; border-radius: 12px; border: 1px solid var(--glass-border); background: none; cursor: pointer; padding: 2px; overflow: hidden; }
    .custom-color-label { font-size: 13px; color: var(--text-dim); }

    .photo-options { display: flex; gap: 8px; margin-bottom: 10px; }
    .photo-tab {
      flex: 1; padding: 10px; border-radius: 12px; border: 1px solid var(--glass-border);
      background: var(--glass); color: var(--text-dim); font-size: 13px; font-weight: 600;
      cursor: pointer; text-align: center; transition: var(--transition);
    }
    .photo-tab.active { background: rgba(255,255,255,0.12); color: var(--text); border-color: rgba(255,255,255,0.25); }

    .file-upload-area {
      border: 2px dashed var(--glass-border); border-radius: 16px; padding: 24px; text-align: center;
      cursor: pointer; transition: var(--transition); color: var(--text-dim); font-size: 14px;
    }
    .file-upload-area:active { border-color: rgba(255,255,255,0.3); background: var(--glass); }
    .file-upload-icon { font-size: 28px; margin-bottom: 6px; }
    .photo-preview { width: 100%; height: 100px; object-fit: cover; border-radius: 12px; margin-top: 10px; }
  `],
})
export class AddFormModalComponent {
  readonly visible = input.required<boolean>();
  readonly close = output<void>();
  readonly create = output<NewItemData>();

  protected readonly presetColors = PRESET_COLORS;

  protected readonly name = signal('');
  protected readonly selectedColor = signal(PRESET_COLORS[0]);
  protected readonly photoTab = signal<'url' | 'file'>('url');
  protected readonly photoUrl = signal('');
  protected readonly photoFileData = signal('');

  constructor() {
    // reset the form each time the modal is opened
    effect(() => {
      if (this.visible()) {
        this.name.set('');
        this.selectedColor.set(PRESET_COLORS[0]);
        this.photoTab.set('url');
        this.photoUrl.set('');
        this.photoFileData.set('');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => this.photoFileData.set(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close.emit();
  }

  submit(): void {
    const trimmedName = this.name().trim();
    if (!trimmedName) return;
    const photo = this.photoTab() === 'url' ? this.photoUrl().trim() : this.photoFileData();
    this.create.emit({ name: trimmedName, color: this.selectedColor(), photo });
  }
}
