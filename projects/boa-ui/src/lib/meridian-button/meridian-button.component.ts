import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Meridian Button Component - Custom button wrapping mat-button
 * Part of the @boa-ui/meridian-design-system library.
 * Provides consistent styling and behavior across all BoA applications.
 */
@Component({
  selector: 'meridian-button',
  template: `
    <button [ngClass]="buttonClasses"
            [attr.type]="type"
            [disabled]="disabled || loading"
            [attr.aria-label]="ariaLabel"
            [attr.aria-busy]="loading"
            (click)="handleClick($event)">
      <mat-icon *ngIf="icon && iconPosition === 'before'" class="meridian-btn-icon">{{ icon }}</mat-icon>
      <mat-spinner *ngIf="loading" [diameter]="18" class="meridian-btn-spinner"></mat-spinner>
      <span class="meridian-btn-label" *ngIf="!loading">
        <ng-content></ng-content>
      </span>
      <span class="meridian-btn-label" *ngIf="loading">{{ loadingText }}</span>
      <mat-icon *ngIf="icon && iconPosition === 'after'" class="meridian-btn-icon">{{ icon }}</mat-icon>
    </button>
  `,
  styles: [`
    :host { display: inline-block; }

    .meridian-btn {
      font-family: 'Connections', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      font-weight: 500;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      border: none;
      outline: none;
    }

    .meridian-btn--primary {
      background-color: #012169;
      color: white;
      padding: 10px 24px;
      &:hover:not(:disabled) { background-color: #001a52; }
      &:focus-visible { box-shadow: 0 0 0 3px rgba(1, 33, 105, 0.4); }
    }

    .meridian-btn--secondary {
      background-color: transparent;
      color: #012169;
      border: 2px solid #012169;
      padding: 8px 22px;
      &:hover:not(:disabled) { background-color: rgba(1, 33, 105, 0.08); }
    }

    .meridian-btn--danger {
      background-color: #DC1431;
      color: white;
      padding: 10px 24px;
      &:hover:not(:disabled) { background-color: #b81029; }
    }

    .meridian-btn--text {
      background-color: transparent;
      color: #012169;
      padding: 8px 16px;
      &:hover:not(:disabled) { text-decoration: underline; }
    }

    .meridian-btn--sm { font-size: 13px; padding: 6px 16px; }
    .meridian-btn--md { font-size: 14px; }
    .meridian-btn--lg { font-size: 16px; padding: 12px 32px; }

    .meridian-btn--full-width { width: 100%; justify-content: center; }

    .meridian-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .meridian-btn-spinner { margin-right: 4px; }
  `]
})
export class MeridianButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'danger' | 'text' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() loadingText = 'Loading...';
  @Input() icon?: string;
  @Input() iconPosition: 'before' | 'after' = 'before';
  @Input() fullWidth = false;
  @Input() ariaLabel?: string;

  @Output() clicked = new EventEmitter<MouseEvent>();

  get buttonClasses(): Record<string, boolean> {
    return {
      'meridian-btn': true,
      [`meridian-btn--${this.variant}`]: true,
      [`meridian-btn--${this.size}`]: true,
      'meridian-btn--full-width': this.fullWidth,
    };
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit(event);
    }
  }
}
