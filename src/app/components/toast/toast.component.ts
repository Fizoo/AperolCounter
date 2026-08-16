import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toast" [class.show]="toast.visible()">{{ toast.message() }}</div>
  `,
})
export class ToastComponent {
  protected readonly toast = inject(ToastService);
}
