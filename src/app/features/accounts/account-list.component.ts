import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account } from '../../shared/models/account.model';
import { MOCK_ACCOUNTS } from '../../../test/mock-data/mock-accounts';

@Component({
  selector: 'boa-account-list',
  template: `
    <div class="account-list-container">
      <div class="account-list-header">
        <h2>Your Accounts</h2>
      </div>
      <div class="accounts-grid">
        <meridian-account-summary
          *ngFor="let account of accounts"
          [accountName]="account.accountName"
          [accountNumber]="account.accountNumber"
          [accountType]="getTypeLabel(account.accountType)"
          [balance]="account.balance"
          [availableBalance]="account.availableBalance"
          (click)="viewAccount(account)">
          <div meridian-account-actions>
            <button mat-button color="primary" (click)="viewAccount(account); $event.stopPropagation()">Details</button>
            <button mat-button (click)="viewTransactions(account); $event.stopPropagation()">Transactions</button>
          </div>
        </meridian-account-summary>
      </div>
    </div>
  `,
  styles: [`
    .account-list-container { max-width: 1200px; margin: 0 auto; }
    .account-list-header { margin-bottom: 24px; }
    .account-list-header h2 { color: #012169; font-weight: 400; }
    .accounts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 16px;
    }
  `]
})
export class AccountListComponent implements OnInit {
  accounts: Account[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.accounts = MOCK_ACCOUNTS;
  }

  viewAccount(account: Account): void {
    this.router.navigate(['/accounts', account.id]);
  }

  viewTransactions(account: Account): void {
    this.router.navigate(['/accounts', account.id, 'transactions']);
  }

  getTypeLabel(type: string): 'checking' | 'savings' | 'credit' | 'investment' | 'default' {
    const map: Record<string, 'checking' | 'savings' | 'credit' | 'investment' | 'default'> = {
      'CHECKING': 'checking', 'SAVINGS': 'savings', 'CREDIT_CARD': 'credit',
      'BROKERAGE': 'investment', 'IRA': 'investment'
    };
    return map[type] || 'default';
  }
}
