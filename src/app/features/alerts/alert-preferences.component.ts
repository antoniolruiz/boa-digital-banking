import { Component, OnInit } from '@angular/core';
import { AlertType, AlertChannel } from '../../shared/models/alert.model';

interface AlertPref { type: string; label: string; enabled: boolean; channels: string[]; }

@Component({
  selector: 'boa-alert-preferences',
  template: `
    <meridian-card title="Alert Preferences" headerIcon="tune">
      <div class="prefs-list">
        <div *ngFor="let pref of preferences" class="pref-item">
          <div class="pref-info">
            <mat-checkbox [(ngModel)]="pref.enabled" color="primary">{{ pref.label }}</mat-checkbox>
          </div>
          <div class="pref-channels" *ngIf="pref.enabled">
            <mat-checkbox *ngFor="let ch of channels" [checked]="pref.channels.includes(ch)"
                          (change)="toggleChannel(pref, ch)" color="accent" class="channel-check">
              {{ ch }}
            </mat-checkbox>
          </div>
        </div>
      </div>
      <div class="prefs-actions">
        <meridian-button variant="primary" (clicked)="savePreferences()">Save Preferences</meridian-button>
      </div>
    </meridian-card>
  `,
  styles: [`
    .prefs-list { display: flex; flex-direction: column; }
    .pref-item { padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .pref-channels { display: flex; gap: 16px; margin-top: 8px; padding-left: 32px; }
    .channel-check { font-size: 13px; }
    .prefs-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
  `]
})
export class AlertPreferencesComponent implements OnInit {
  preferences: AlertPref[] = [];
  channels = ['In-App', 'Email', 'SMS', 'Push'];

  ngOnInit(): void {
    this.preferences = [
      { type: 'BALANCE_LOW', label: 'Low Balance Alert', enabled: true, channels: ['In-App', 'Email', 'Push'] },
      { type: 'LARGE_TRANSACTION', label: 'Large Transaction Alert', enabled: true, channels: ['In-App', 'Push'] },
      { type: 'PAYMENT_DUE', label: 'Payment Due Reminder', enabled: true, channels: ['In-App', 'Email'] },
      { type: 'SUSPICIOUS_ACTIVITY', label: 'Suspicious Activity', enabled: true, channels: ['In-App', 'Email', 'SMS', 'Push'] },
      { type: 'DEPOSIT_RECEIVED', label: 'Deposit Received', enabled: false, channels: [] },
      { type: 'STATEMENT_READY', label: 'Statement Ready', enabled: true, channels: ['Email'] },
    ];
  }

  toggleChannel(pref: AlertPref, channel: string): void {
    const idx = pref.channels.indexOf(channel);
    if (idx > -1) { pref.channels.splice(idx, 1); }
    else { pref.channels.push(channel); }
  }

  savePreferences(): void { console.log('Saving preferences:', this.preferences); }
}
