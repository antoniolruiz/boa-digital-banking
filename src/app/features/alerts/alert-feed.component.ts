import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Alert, AlertSeverity } from '../../shared/models/alert.model';

/**
 * Alert Feed Component - Real-time alert display with WebSocket simulation.
 * In production, this would use a WebSocket connection to receive real-time alerts.
 */
@Component({
  selector: 'boa-alert-feed',
  template: `
    <meridian-card title="Alert Feed" headerIcon="notifications">
      <div class="feed-toolbar">
        <mat-button-toggle-group [(value)]="filterSeverity" (change)="filterAlerts()">
          <mat-button-toggle value="all">All</mat-button-toggle>
          <mat-button-toggle value="CRITICAL">Critical</mat-button-toggle>
          <mat-button-toggle value="WARNING">Warning</mat-button-toggle>
          <mat-button-toggle value="INFO">Info</mat-button-toggle>
        </mat-button-toggle-group>
        <span class="feed-count">{{ filteredAlerts.length }} alerts</span>
      </div>

      <div class="feed-list">
        <div *ngFor="let alert of filteredAlerts" class="feed-item" [class.feed-item--unread]="!alert.isRead">
          <div class="feed-severity" [attr.data-severity]="alert.severity">
            <mat-icon>{{ getSeverityIcon(alert.severity) }}</mat-icon>
          </div>
          <div class="feed-content">
            <span class="feed-title">{{ alert.title }}</span>
            <span class="feed-message">{{ alert.message }}</span>
            <span class="feed-time">{{ alert.createdAt | date:'short' }}</span>
          </div>
          <div class="feed-actions">
            <button mat-icon-button (click)="markRead(alert)" *ngIf="!alert.isRead" matTooltip="Mark as read">
              <mat-icon>done</mat-icon>
            </button>
            <button mat-icon-button (click)="dismissAlert(alert)" matTooltip="Dismiss">
              <mat-icon>close</mat-icon>
            </button>
          </div>
        </div>

        <div *ngIf="filteredAlerts.length === 0" class="feed-empty">
          <mat-icon>notifications_off</mat-icon>
          <p>No alerts</p>
        </div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .feed-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .feed-count { color: #767676; font-size: 13px; }
    .feed-list { display: flex; flex-direction: column; }
    .feed-item { display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #e0e0e0; align-items: flex-start; }
    .feed-item--unread { background-color: rgba(1, 33, 105, 0.03); }
    .feed-severity { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
      &[data-severity="CRITICAL"] { background: #FFEBEE; color: #C62828; }
      &[data-severity="WARNING"] { background: #FFF8E1; color: #F57F17; }
      &[data-severity="INFO"] { background: #E3F2FD; color: #0277BD; }
      &[data-severity="ERROR"] { background: #FFEBEE; color: #C62828; }
    }
    .feed-content { flex: 1; display: flex; flex-direction: column; gap: 2px; }
    .feed-title { font-weight: 500; font-size: 14px; }
    .feed-message { font-size: 13px; color: #555; }
    .feed-time { font-size: 11px; color: #767676; }
    .feed-empty { text-align: center; padding: 32px; color: #767676; }
  `]
})
export class AlertFeedComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  filteredAlerts: Alert[] = [];
  filterSeverity = 'all';
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadAlerts();

    // Simulate WebSocket - periodic polling for new alerts
    interval(30000).pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // In production, this would be a WebSocket connection
      this.checkForNewAlerts();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  filterAlerts(): void {
    this.filteredAlerts = this.filterSeverity === 'all'
      ? [...this.alerts]
      : this.alerts.filter(a => a.severity === this.filterSeverity);
  }

  markRead(alert: Alert): void {
    alert.isRead = true;
    alert.readAt = new Date().toISOString();
  }

  dismissAlert(alert: Alert): void {
    alert.isDismissed = true;
    this.alerts = this.alerts.filter(a => a.id !== alert.id);
    this.filterAlerts();
  }

  getSeverityIcon(severity: string): string {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'WARNING': return 'warning';
      case 'INFO': return 'info';
      default: return 'notifications';
    }
  }

  private loadAlerts(): void {
    this.alerts = [
      { id: 'a-1', userId: 'usr-001', type: 'PAYMENT_DUE' as never, severity: 'WARNING' as never, title: 'Payment Due Soon', message: 'Your Cash Rewards Visa payment of $35.00 is due on Feb 5.', accountId: 'acct-003', createdAt: new Date().toISOString(), isRead: false, isDismissed: false },
      { id: 'a-2', userId: 'usr-001', type: 'LARGE_TRANSACTION' as never, severity: 'INFO' as never, title: 'Direct Deposit Received', message: 'A deposit of $4,250.00 was posted to your checking.', accountId: 'acct-001', createdAt: new Date(Date.now() - 3600000).toISOString(), isRead: false, isDismissed: false },
      { id: 'a-3', userId: 'usr-001', type: 'SUSPICIOUS_ACTIVITY' as never, severity: 'CRITICAL' as never, title: 'Unusual Activity Detected', message: 'We detected an unusual login attempt from a new device.', createdAt: new Date(Date.now() - 7200000).toISOString(), isRead: true, isDismissed: false },
      { id: 'a-4', userId: 'usr-001', type: 'STATEMENT_READY' as never, severity: 'INFO' as never, title: 'Statement Ready', message: 'Your January 2024 statement is now available.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true, isDismissed: false },
    ];
    this.filterAlerts();
  }

  private checkForNewAlerts(): void {
    // Simulated WebSocket check
  }
}
