import { Injectable, signal } from '@angular/core';

export interface ConfirmOptions {
  title: string;
  text: string;
  confirmLabel?: string;
  danger?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  readonly visible = signal(false);
  readonly options = signal<ConfirmOptions>({ title: '', text: '' });

  private resolver?: (result: boolean) => void;

  ask(options: ConfirmOptions): Promise<boolean> {
    this.options.set(options);
    this.visible.set(true);
    return new Promise<boolean>((resolve) => {
      this.resolver = resolve;
    });
  }

  resolve(result: boolean): void {
    this.visible.set(false);
    this.resolver?.(result);
    this.resolver = undefined;
  }
}
