import { Component, Input, Output, EventEmitter } from '@angular/core';

export type AlertBannerType = 'info' | 'success' | 'warning' | 'error';

/**
 * Meridian Alert Banner - notification/alert banner component
 * with BoA theming and accessibility support.
 */
@Component({
  selector: 'meridian-alert-banner',
  template: `
    <div [ngClass]="bannerClasses"
         [attr.role]="role"
         [attr.aria-live]="ariaLive"
         *ngIf="visible">
      <mat-icon class="meridian-alert-icon">{{ getIcon() }}</mat-icon>
      <div class="meridian-alert-content">
        <strong *ngIf="title" class="meridian-alert-title">{{ title }}</strong>
        <p class="meridian-alert-message">
          <ng-content></ng-content>
        </p>
        <div class="meridian-alert-actions" *ngIf="actionLabel">
          <button mat-button (click)="onAction()">{{ actionLabel }}</button>
        </div>
      </div>
      <button mat-icon-button
              *ngIf="dismissible"
              (click)="dismiss()"
              class="meridian-alert-close"
              aria-label="Dismiss alert">
        <mat-icon>close</mat-icon>
      </button>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .meridian-alert {
      display: flex;
      align-items: flex-start;
      padding: 12px 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      gap: 12px;
    }

    .meridian-alert--info {
      background-color: #E3F2FD;
      border-left: 4px solid #0277BD;
      .meridian-alert-icon { color: #0277BD; }
    }

    .meridian-alert--success {
      background-color: #E8F5E9;
      border-left: 4px solid #2E7D32;
      .meridian-alert-icon { color: #2E7D32; }
    }

    .meridian-alert--warning {
      background-color: #FFF8E1;
      border-left: 4px solid #F57F17;
      .meridian-alert-icon { color: #F57F17; }
    }

    .meridian-alert--error {
      background-color: #FFEBEE;
      border-left: 4px solid #C62828;
      .meridian-alert-icon { color: #C62828; }
    }

    .meridian-alert-content {
      flex: 1;
    }

    .meridian-alert-title {
      display: block;
      margin-bottom: 4px;
      color: #333;
    }

    .meridian-alert-message {
      margin: 0;
      color: #555;
      font-size: 14px;
      line-height: 1.5;
    }

    .meridian-alert-close {
      margin: -8px -8px -8px 0;
    }
  `]
})
export class MeridianAlertBannerComponent {
  @Input() type: AlertBannerType = 'info';
  @Input() title?: string;
  @Input() dismissible = true;
  @Input() actionLabel?: string;
  @Input() role: 'alert' | 'status' | 'log' = 'status';
  @Input() ariaLive: 'polite' | 'assertive' | 'off' = 'polite';

  @Output() dismissed = new EventEmitter<void>();
  @Output() actionClicked = new EventEmitter<void>();

  visible = true;

  get bannerClasses(): Record<string, boolean> {
    return {
      'meridian-alert': true,
      [`meridian-alert--${this.type}`]: true,
    };
  }

  getIcon(): string {
    switch (this.type) {
      case 'info': return 'info';
      case 'success': return 'check_circle';
      case 'warning': return 'warning';
      case 'error': return 'error';
    }
  }

  dismiss(): void {
    this.visible = false;
    this.dismissed.emit();
  }

  onAction(): void {
    this.actionClicked.emit();
  }
}
