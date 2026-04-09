import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alert } from '../../shared/models/alert.model';

@Component({
  selector: 'boa-alert-detail',
  template: `
    <meridian-card *ngIf="alert" [title]="alert.title">
      <meridian-alert-banner [type]="getBannerType()" [dismissible]="false">
        {{ alert.message }}
      </meridian-alert-banner>
      <div class="alert-meta">
        <div class="meta-row"><span class="meta-label">Type</span><span>{{ alert.type }}</span></div>
        <div class="meta-row"><span class="meta-label">Severity</span><span>{{ alert.severity }}</span></div>
        <div class="meta-row"><span class="meta-label">Date</span><span>{{ alert.createdAt | date:'medium' }}</span></div>
        <div class="meta-row" *ngIf="alert.accountId"><span class="meta-label">Account</span><span>{{ alert.accountId }}</span></div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .alert-meta { margin-top: 16px; }
    .meta-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e0e0e0; }
    .meta-label { color: #767676; }
  `]
})
export class AlertDetailComponent implements OnInit {
  alert: Alert | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const alertId = params.get('id');
      if (alertId) {
        // In production, would load alert detail from API using alertId
        console.log('[AlertDetail] Loading alert:', alertId);
      }
    });
  }

  getBannerType(): 'info' | 'warning' | 'error' {
    if (!this.alert) return 'info';
    switch (this.alert.severity) {
      case 'CRITICAL' as never:
      case 'ERROR' as never: return 'error';
      case 'WARNING' as never: return 'warning';
      default: return 'info';
    }
  }
}
