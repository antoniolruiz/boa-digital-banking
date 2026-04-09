import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil, switchMap, map, distinctUntilChanged, startWith } from 'rxjs/operators';
import { SsoAuthService } from '../../core/auth/sso-auth.service';
import { Account, AccountType } from '../../shared/models/account.model';
import { Transaction } from '../../shared/models/transaction.model';
import { Alert } from '../../shared/models/alert.model';
import { MOCK_ACCOUNTS } from '../../../test/mock-data/mock-accounts';
import { MOCK_TRANSACTIONS } from '../../../test/mock-data/mock-transactions';

/**
 * Dashboard Component - Main landing page after authentication.
 *
 * Heavy RxJS usage: combineLatest of 4+ observables, piped through
 * switchMap, map, distinctUntilChanged. This is a key migration target
 * for Angular Signals in v18.
 */
@Component({
  selector: 'boa-dashboard',
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>{{ welcomeMessage }}</h1>
        <p class="dashboard-date">{{ currentDate | date:'fullDate' }}</p>
      </div>

      <div class="dashboard-grid">
        <!-- Account Summary Section -->
        <section class="dashboard-section dashboard-accounts">
          <boa-account-overview
            [accounts]="accounts"
            [totalBalance]="totalBalance"
            (accountSelected)="navigateToAccount($event)">
          </boa-account-overview>
        </section>

        <!-- Quick Actions -->
        <section class="dashboard-section dashboard-quick-actions">
          <boa-quick-actions
            (actionSelected)="handleQuickAction($event)">
          </boa-quick-actions>
        </section>

        <!-- Spending Chart -->
        <section class="dashboard-section dashboard-spending">
          <boa-spending-chart
            [transactions]="recentTransactions">
          </boa-spending-chart>
        </section>

        <!-- Recent Transactions -->
        <section class="dashboard-section dashboard-transactions">
          <meridian-card title="Recent Activity" headerIcon="receipt_long">
            <div *ngFor="let txn of recentTransactions.slice(0, 5)" class="txn-item">
              <div class="txn-info">
                <span class="txn-description">{{ txn.description }}</span>
                <span class="txn-date">{{ txn.transactionDate | date:'shortDate' }}</span>
              </div>
              <span class="txn-amount" [class.txn-credit]="txn.amount > 0">
                {{ txn.amount | currency:'USD':'symbol':'1.2-2' }}
              </span>
            </div>
            <div class="dashboard-view-all">
              <a routerLink="/accounts">View All Transactions →</a>
            </div>
          </meridian-card>
        </section>

        <!-- Alerts Summary -->
        <section class="dashboard-section dashboard-alerts" *ngIf="unreadAlerts.length > 0">
          <meridian-card title="Alerts" headerIcon="notifications">
            <meridian-alert-banner
              *ngFor="let alert of unreadAlerts.slice(0, 3)"
              [type]="getAlertBannerType(alert)"
              [title]="alert.title">
              {{ alert.message }}
            </meridian-alert-banner>
            <div class="dashboard-view-all">
              <a routerLink="/alerts">View All Alerts →</a>
            </div>
          </meridian-card>
        </section>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { max-width: 1200px; margin: 0 auto; }
    .dashboard-header { margin-bottom: 24px; }
    .dashboard-header h1 { font-size: 28px; font-weight: 300; color: #012169; margin: 0; }
    .dashboard-date { color: #767676; font-size: 14px; margin-top: 4px; }
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .dashboard-accounts { grid-column: 1 / -1; }
    .dashboard-transactions { grid-column: 1 / -1; }
    .txn-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e0e0e0;
    }
    .txn-item:last-child { border-bottom: none; }
    .txn-info { display: flex; flex-direction: column; }
    .txn-description { font-weight: 500; font-size: 14px; }
    .txn-date { color: #767676; font-size: 12px; }
    .txn-amount { font-weight: 500; font-family: monospace; }
    .txn-credit { color: #2E7D32; }
    .dashboard-view-all { text-align: center; padding: 12px 0; }
    .dashboard-view-all a { color: #012169; font-weight: 500; }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  welcomeMessage = 'Welcome back';
  currentDate = new Date();
  accounts: Account[] = [];
  totalBalance = 0;
  recentTransactions: Transaction[] = [];
  unreadAlerts: Alert[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private authService: SsoAuthService,
    private router: Router
  ) {}

  /**
   * Heavy RxJS pattern: combineLatest of multiple observables
   * with switchMap, map, and distinctUntilChanged.
   * Migration target → Angular Signals
   */
  ngOnInit(): void {
    // Combine multiple data streams — classic RxJS pattern
    combineLatest([
      this.authService.currentUser$,
      this.authService.isAuthenticated$,
      this.authService.permissions$,
    ]).pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) =>
        JSON.stringify(prev) === JSON.stringify(curr)
      ),
      switchMap(([user, isAuth, _permissions]) => {
        if (!isAuth || !user) {
          return [];
        }

        this.welcomeMessage = `Welcome back, ${user.firstName}`;

        // In production, these would be API calls
        // For demo, using mock data
        return [{ user, isAuth }];
      }),
      map(() => {
        this.loadDashboardData();
      })
    ).subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigateToAccount(account: Account): void {
    this.router.navigate(['/accounts', account.id]);
  }

  handleQuickAction(action: string): void {
    switch (action) {
      case 'transfer':
        this.router.navigate(['/transfers']);
        break;
      case 'billpay':
        this.router.navigate(['/bill-pay']);
        break;
      case 'deposit':
        this.router.navigate(['/accounts']);
        break;
      case 'statements':
        this.router.navigate(['/accounts']);
        break;
    }
  }

  getAlertBannerType(alert: Alert): 'info' | 'success' | 'warning' | 'error' {
    switch (alert.severity) {
      case 'INFO': return 'info';
      case 'WARNING': return 'warning';
      case 'ERROR': return 'error';
      case 'CRITICAL': return 'error';
      default: return 'info';
    }
  }

  private loadDashboardData(): void {
    this.accounts = MOCK_ACCOUNTS;
    this.totalBalance = this.accounts.reduce((sum, acc) => sum + acc.balance, 0);
    this.recentTransactions = MOCK_TRANSACTIONS
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

    this.unreadAlerts = [
      {
        id: 'alert-001',
        userId: 'usr-001',
        type: 'PAYMENT_DUE' as never,
        severity: 'WARNING' as never,
        title: 'Payment Due Soon',
        message: 'Your Cash Rewards Visa payment of $35.00 is due on Feb 5, 2024.',
        accountId: 'acct-003',
        createdAt: new Date().toISOString(),
        isRead: false,
        isDismissed: false
      },
      {
        id: 'alert-002',
        userId: 'usr-001',
        type: 'LARGE_TRANSACTION' as never,
        severity: 'INFO' as never,
        title: 'Large Transaction',
        message: 'A direct deposit of $4,250.00 was posted to your checking account.',
        accountId: 'acct-001',
        createdAt: new Date().toISOString(),
        isRead: false,
        isDismissed: false
      }
    ];
  }
}
