import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-bottle-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg class="bottle-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" [style.filter]="glow()">
      <defs>
        <linearGradient [attr.id]="gradId()" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" [attr.stop-color]="color()" stop-opacity="0.3" />
          <stop offset="100%" [attr.stop-color]="color()" stop-opacity="0.1" />
        </linearGradient>
      </defs>
      <rect x="32" y="42" width="36" height="48" rx="10" [attr.fill]="'url(#' + gradId() + ')'" [attr.stroke]="color()" stroke-width="2" stroke-opacity="0.6" />
      <rect x="40" y="24" width="20" height="22" rx="5" [attr.fill]="'url(#' + gradId() + ')'" [attr.stroke]="color()" stroke-width="2" stroke-opacity="0.6" />
      <rect x="38" y="16" width="24" height="12" rx="4" [attr.fill]="color()" opacity="0.7" />
      <rect x="38" y="48" width="6" height="30" rx="3" fill="white" opacity="0.08" />
      <rect x="36" y="56" width="28" height="22" rx="5" [attr.fill]="color()" opacity="0.15" [attr.stroke]="color()" stroke-width="1" stroke-opacity="0.3" />
    </svg>
  `,
  styles: [`
    :host { display: flex; }
    .bottle-svg { width: 90px; height: 90px; opacity: 0.9; }
  `],
})
export class BottleIconComponent {
  readonly color = input.required<string>();

  gradId(): string {
    return 'bg' + this.color().replace('#', '');
  }

  glow(): string {
    return `drop-shadow(0 0 20px ${this.color()})`;
  }
}
