import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Account } from '../../shared/models/account.model';
import { MOCK_ACCOUNTS } from '../../../test/mock-data/mock-accounts';

@Component({
  selector: 'boa-account-detail',
  template: `
    <div class="account-detail" *ngIf="account">
      <div class="detail-header">
        <button mat-icon-button (click)="goBack()"><mat-icon>arrow_back</mat-icon></button>
        <h2>{{ account.accountName }}</h2>
        <span class="account-badge" [attr.data-type]="account.accountType">{{ account.accountType }}</span>
      </div>

      <div class="detail-grid">
        <meridian-card title="Balance Information" headerIcon="account_balance_wallet">
          <div class="balance-row">
            <span class="balance-label">Current Balance</span>
            <span class="balance-value">{{ account.balance | currency:'USD' }}</span>
          </div>
          <div class="balance-row">
            <span class="balance-label">Available Balance</span>
            <span class="balance-value">{{ account.availableBalance | currency:'USD' }}</span>
          </div>
          <div class="balance-row" *ngIf="account.interestRate">
            <span class="balance-label">Interest Rate (APY)</span>
            <span class="balance-value">{{ account.interestRate | percent:'1.2-2' }}</span>
          </div>
          <div class="balance-row" *ngIf="account.creditLimit">
            <span class="balance-label">Credit Limit</span>
            <span class="balance-value">{{ account.creditLimit | currency:'USD' }}</span>
          </div>
        </meridian-card>

        <meridian-card title="Account Details" headerIcon="info">
          <div class="detail-row">
            <span class="detail-label">Account Number</span>
            <meridian-secure-badge [value]="account.accountNumber"></meridian-secure-badge>
          </div>
          <div class="detail-row">
            <span class="detail-label">Routing Number</span>
            <span>{{ account.routingNumber }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status</span>
            <span class="status-badge" [attr.data-status]="account.status">{{ account.status }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Opened</span>
            <span>{{ account.openedDate | date:'mediumDate' }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Last Activity</span>
            <span>{{ account.lastActivityDate | date:'medium' }}</span>
          </div>
        </meridian-card>
      </div>

      <div class="detail-actions">
        <meridian-button variant="primary" icon="swap_horiz" (clicked)="initiateTransfer()">Transfer Money</meridian-button>
        <meridian-button variant="secondary" icon="description" (clicked)="downloadStatement()">Download Statement</meridian-button>
        <meridian-button variant="secondary" icon="receipt_long" (clicked)="viewTransactions()">View Transactions</meridian-button>
      </div>
    </div>
  `,
  styles: [`
    .detail-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
    .detail-header h2 { margin: 0; color: #012169; flex: 1; }
    .account-badge { padding: 4px 12px; border-radius: 16px; font-size: 12px; background: #e3e8f0; color: #012169; }
    .detail-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin-bottom: 24px; }
    .balance-row, .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .balance-row:last-child, .detail-row:last-child { border-bottom: none; }
    .balance-label, .detail-label { color: #767676; }
    .balance-value { font-weight: 600; font-family: monospace; }
    .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 12px; background: #E8F5E9; color: #2E7D32; }
    .detail-actions { display: flex; gap: 12px; flex-wrap: wrap; }
  `]
})
export class AccountDetailComponent implements OnInit {
  account: Account | null = null;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    this.account = MOCK_ACCOUNTS.find(a => a.id === accountId) || null;
  }

  goBack(): void { this.router.navigate(['/accounts']); }
  initiateTransfer(): void { this.router.navigate(['/transfers'], { queryParams: { from: this.account?.id } }); }
  downloadStatement(): void { /* mock */ }
  viewTransactions(): void { this.router.navigate(['/accounts', this.account?.id, 'transactions']); }
}
