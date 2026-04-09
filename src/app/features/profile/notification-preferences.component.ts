import { Component } from '@angular/core';

@Component({
  selector: 'boa-notification-preferences',
  template: `
    <meridian-card title="Notification Preferences" headerIcon="notifications_active">
      <div class="notif-options">
        <div class="notif-item" *ngFor="let pref of preferences">
          <div class="notif-info">
            <span class="notif-label">{{ pref.label }}</span>
            <span class="notif-desc">{{ pref.description }}</span>
          </div>
          <mat-slide-toggle [(ngModel)]="pref.enabled" color="primary"></mat-slide-toggle>
        </div>
      </div>
      <div class="notif-actions">
        <meridian-button variant="primary" (clicked)="save()">Save Preferences</meridian-button>
      </div>
    </meridian-card>
  `,
  styles: [`
    .notif-options { display: flex; flex-direction: column; }
    .notif-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .notif-info { display: flex; flex-direction: column; }
    .notif-label { font-weight: 500; }
    .notif-desc { font-size: 13px; color: #767676; }
    .notif-actions { display: flex; justify-content: flex-end; margin-top: 16px; }
  `]
})
export class NotificationPreferencesComponent {
  preferences = [
    { label: 'Email Notifications', description: 'Receive account alerts via email', enabled: true },
    { label: 'SMS Alerts', description: 'Receive text message alerts', enabled: true },
    { label: 'Push Notifications', description: 'Receive push notifications on mobile', enabled: true },
    { label: 'Marketing Communications', description: 'Receive promotional offers', enabled: false },
    { label: 'Monthly Statements', description: 'Electronic statement notifications', enabled: true },
  ];

  save(): void { console.log('Saving notification preferences'); }
}
