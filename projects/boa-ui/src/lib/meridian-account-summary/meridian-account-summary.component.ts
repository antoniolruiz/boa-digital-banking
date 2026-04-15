import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

/**
 * Meridian Account Summary - Account card with balance display.
 * Shows account type, balance, and quick action buttons.
 */
@Component({
  selector: 'meridian-account-summary',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div [ngClass]="summaryClasses" (click)="!disabled && null" role="article"
         [attr.aria-label]="accountName + ' account summary'">
      <div class="meridian-acct-header">
        <div class="meridian-acct-type-badge" [attr.data-type]="accountType">
          <mat-icon>{{ getAccountIcon() }}</mat-icon>
        </div>
        <div class="meridian-acct-info">
          <span class="meridian-acct-name">{{ accountName }}</span>
          <span class="meridian-acct-number">{{ accountNumber }}</span>
        </div>
      </div>

      <div class="meridian-acct-balance">
        <span class="meridian-acct-balance-label">{{ balanceLabel }}</span>
        <span class="meridian-acct-balance-value" [class.negative]="balance < 0">
          {{ formatBalance(balance) }}
        </span>
      </div>

      <div class="meridian-acct-available" *ngIf="showAvailableBalance">
        <span class="meridian-acct-available-label">Available</span>
        <span class="meridian-acct-available-value">{{ formatBalance(availableBalance) }}</span>
      </div>

      <div class="meridian-acct-footer" *ngIf="showActions">
        <ng-content select="[meridian-account-actions]"></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .meridian-acct-summary {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      transition: box-shadow 0.2s ease;
      border-left: 4px solid transparent;

      &:hover { box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); }
    }

    .meridian-acct-summary--checking { border-left-color: #012169; }
    .meridian-acct-summary--savings { border-left-color: #1565C0; }
    .meridian-acct-summary--credit { border-left-color: #DC1431; }
    .meridian-acct-summary--investment { border-left-color: #2E7D32; }
    .meridian-acct-summary--default { border-left-color: #767676; }

    .meridian-acct-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .meridian-acct-type-badge {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #012169;
      color: white;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    .meridian-acct-info {
      display: flex;
      flex-direction: column;
    }

    .meridian-acct-name {
      font-weight: 500;
      color: #333;
      font-size: 15px;
    }

    .meridian-acct-number {
      color: #767676;
      font-size: 13px;
      font-family: monospace;
    }

    .meridian-acct-balance {
      margin-bottom: 8px;
    }

    .meridian-acct-balance-label {
      display: block;
      font-size: 12px;
      color: #767676;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meridian-acct-balance-value {
      font-size: 28px;
      font-weight: 300;
      color: #012169;

      &.negative { color: #DC1431; }
    }

    .meridian-acct-available {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-top: 1px solid #e0e0e0;
      font-size: 14px;
    }

    .meridian-acct-available-label { color: #767676; }
    .meridian-acct-available-value { font-weight: 500; }

    .meridian-acct-footer {
      margin-top: 12px;
      padding-top: 12px;
      border-top: 1px solid #e0e0e0;
    }
  `]
})
export class MeridianAccountSummaryComponent {
  @Input() accountName = '';
  @Input() accountNumber = '';
  @Input() accountType: 'checking' | 'savings' | 'credit' | 'investment' | 'default' = 'default';
  @Input() balance = 0;
  @Input() availableBalance = 0;
  @Input() balanceLabel = 'Current Balance';
  @Input() showAvailableBalance = true;
  @Input() showActions = true;
  @Input() disabled = false;

  get summaryClasses(): Record<string, boolean> {
    return {
      'meridian-acct-summary': true,
      [`meridian-acct-summary--${this.accountType}`]: true,
    };
  }

  getAccountIcon(): string {
    switch (this.accountType) {
      case 'checking': return 'account_balance';
      case 'savings': return 'savings';
      case 'credit': return 'credit_card';
      case 'investment': return 'trending_up';
      default: return 'account_balance_wallet';
    }
  }

  formatBalance(amount: number): string {
    const isNegative = amount < 0;
    const formatted = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return isNegative ? `($${formatted})` : `$${formatted}`;
  }
}
