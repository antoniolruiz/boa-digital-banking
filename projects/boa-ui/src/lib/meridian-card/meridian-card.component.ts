import { Component, Input } from '@angular/core';

/**
 * Meridian Card Component - Themed card container
 * Wraps mat-card with BoA design system styles.
 */
@Component({
  selector: 'meridian-card',
  template: `
    <mat-card [ngClass]="cardClasses" [attr.role]="role">
      <mat-card-header *ngIf="title || subtitle">
        <mat-icon mat-card-avatar *ngIf="headerIcon" class="meridian-card-header-icon">{{ headerIcon }}</mat-icon>
        <mat-card-title *ngIf="title">{{ title }}</mat-card-title>
        <mat-card-subtitle *ngIf="subtitle">{{ subtitle }}</mat-card-subtitle>
        <div class="meridian-card-header-actions">
          <ng-content select="[meridian-card-actions]"></ng-content>
        </div>
      </mat-card-header>

      <mat-card-content>
        <ng-content></ng-content>
      </mat-card-content>

      <mat-card-footer *ngIf="showFooter">
        <ng-content select="[meridian-card-footer]"></ng-content>
      </mat-card-footer>
    </mat-card>
  `,
  styles: [`
    :host { display: block; }

    .meridian-card {
      border-radius: 8px;
      margin-bottom: 16px;
      transition: box-shadow 0.2s ease;
    }

    .meridian-card--elevated {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      &:hover { box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12); }
    }

    .meridian-card--outlined {
      box-shadow: none;
      border: 1px solid #D1D1D1;
    }

    .meridian-card--flat {
      box-shadow: none;
    }

    .meridian-card--interactive {
      cursor: pointer;
      &:hover { box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12); }
      &:focus-visible { outline: 2px solid #012169; outline-offset: 2px; }
    }

    .meridian-card--accent {
      border-top: 3px solid #012169;
    }

    .meridian-card-header-icon {
      background-color: #012169;
      color: white;
      border-radius: 50%;
      padding: 8px;
      font-size: 20px;
      width: 36px;
      height: 36px;
    }

    .meridian-card-header-actions {
      margin-left: auto;
    }

    mat-card-header {
      display: flex;
      align-items: center;
    }

    mat-card-title {
      font-size: 18px;
      font-weight: 500;
      color: #012169;
    }
  `]
})
export class MeridianCardComponent {
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() headerIcon?: string;
  @Input() variant: 'elevated' | 'outlined' | 'flat' = 'elevated';
  @Input() interactive = false;
  @Input() accent = false;
  @Input() showFooter = false;
  @Input() role = 'region';

  get cardClasses(): Record<string, boolean> {
    return {
      'meridian-card': true,
      [`meridian-card--${this.variant}`]: true,
      'meridian-card--interactive': this.interactive,
      'meridian-card--accent': this.accent,
    };
  }
}
