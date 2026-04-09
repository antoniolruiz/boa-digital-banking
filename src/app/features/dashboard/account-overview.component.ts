import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Account, AccountType } from '../../shared/models/account.model';

/**
 * Account Overview Component - displays all accounts on the dashboard.
 *
 * Demonstrates manual subscription in ngOnInit and unsubscription in ngOnDestroy.
 * Migration target → Angular Signals or async pipe.
 */
@Component({
  selector: 'boa-account-overview',
  template: `
    <meridian-card title="Account Summary" headerIcon="account_balance">
      <div class="account-overview">
        <div class="total-balance-section">
          <span class="total-label">Total Balance</span>
          <span class="total-value">{{ formatCurrency(totalBalance) }}</span>
        </div>

        <div class="accounts-grid">
          <meridian-account-summary
            *ngFor="let account of accounts"
            [accountName]="account.accountName"
            [accountNumber]="account.accountNumber"
            [accountType]="getAccountTypeLabel(account.accountType)"
            [balance]="account.balance"
            [availableBalance]="account.availableBalance"
            (click)="accountSelected.emit(account)">
            <div meridian-account-actions>
              <button mat-button color="primary" (click)="accountSelected.emit(account); $event.stopPropagation()">
                View Details
              </button>
            </div>
          </meridian-account-summary>
        </div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .account-overview { padding: 8px 0; }
    .total-balance-section {
      text-align: center;
      padding: 16px;
      margin-bottom: 24px;
      background: linear-gradient(135deg, #012169 0%, #1565C0 100%);
      border-radius: 8px;
      color: white;
    }
    .total-label {
      display: block;
      font-size: 14px;
      opacity: 0.8;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .total-value {
      display: block;
      font-size: 36px;
      font-weight: 300;
      margin-top: 8px;
    }
    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
    }
  `]
})
export class AccountOverviewComponent implements OnInit, OnDestroy {
  @Input() accounts: Account[] = [];
  @Input() totalBalance = 0;
  @Output() accountSelected = new EventEmitter<Account>();

  private destroy$ = new Subject<void>();

  // Manual subscription pattern — migration target for Signals
  private refreshInterval: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    // Simulate periodic refresh of account data
    // This manual subscription pattern is a migration target
    this.refreshInterval = setInterval(() => {
      // In production, this would fetch fresh data
    }, 60000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  getAccountTypeLabel(type: AccountType): 'checking' | 'savings' | 'credit' | 'investment' | 'default' {
    switch (type) {
      case AccountType.CHECKING: return 'checking';
      case AccountType.SAVINGS: return 'savings';
      case AccountType.CREDIT_CARD: return 'credit';
      case AccountType.BROKERAGE:
      case AccountType.IRA: return 'investment';
      default: return 'default';
    }
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
}
