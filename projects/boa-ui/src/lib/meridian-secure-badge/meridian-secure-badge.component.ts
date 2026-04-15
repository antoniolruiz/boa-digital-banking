import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule } from '@angular/material/legacy-button';
import { MatLegacyTooltipModule } from '@angular/material/legacy-tooltip';

/**
 * Meridian Secure Badge - PII masking toggle component.
 * Allows users to show/hide sensitive information like account numbers.
 */
@Component({
  selector: 'meridian-secure-badge',
  standalone: true,
  imports: [MatIconModule, MatLegacyButtonModule, MatLegacyTooltipModule],
  template: `
    <span class="meridian-secure" [attr.aria-label]="getAriaLabel()">
      <span class="meridian-secure-value">{{ displayValue }}</span>
      <button mat-icon-button
              class="meridian-secure-toggle"
              (click)="toggleVisibility()"
              [attr.aria-label]="isRevealed ? 'Hide sensitive data' : 'Show sensitive data'"
              [matTooltip]="isRevealed ? 'Hide' : 'Show'">
        <mat-icon>{{ isRevealed ? 'visibility_off' : 'visibility' }}</mat-icon>
      </button>
    </span>
  `,
  styles: [`
    .meridian-secure {
      display: inline-flex;
      align-items: center;
      gap: 4px;
    }

    .meridian-secure-value {
      font-family: monospace;
      font-size: 14px;
      letter-spacing: 1px;
    }

    .meridian-secure-toggle {
      transform: scale(0.8);
      color: #767676;

      &:hover { color: #012169; }
    }
  `]
})
export class MeridianSecureBadgeComponent {
  @Input() value = '';
  @Input() maskChar = '•';
  @Input() visibleChars = 4;
  @Input() maskPosition: 'start' | 'end' = 'start';

  @Output() visibilityChanged = new EventEmitter<boolean>();

  isRevealed = false;

  get displayValue(): string {
    if (this.isRevealed) {
      return this.value;
    }
    return this.getMaskedValue();
  }

  toggleVisibility(): void {
    this.isRevealed = !this.isRevealed;
    this.visibilityChanged.emit(this.isRevealed);
  }

  getAriaLabel(): string {
    return this.isRevealed ? `Sensitive data: ${this.value}` : 'Sensitive data hidden';
  }

  private getMaskedValue(): string {
    if (!this.value) return '';

    const maskLength = Math.max(0, this.value.length - this.visibleChars);
    const mask = this.maskChar.repeat(maskLength);

    if (this.maskPosition === 'start') {
      return mask + this.value.slice(-this.visibleChars);
    } else {
      return this.value.slice(0, this.visibleChars) + mask;
    }
  }
}
