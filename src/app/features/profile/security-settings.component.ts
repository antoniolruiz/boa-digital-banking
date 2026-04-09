import { Component } from '@angular/core';

@Component({
  selector: 'boa-security-settings',
  template: `
    <meridian-card title="Security Settings" headerIcon="security">
      <div class="security-options">
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">Multi-Factor Authentication</span>
            <span class="security-desc">Add an extra layer of security</span>
          </div>
          <mat-slide-toggle [checked]="mfaEnabled" (change)="mfaEnabled = $event.checked" color="primary"></mat-slide-toggle>
        </div>
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">Login Notifications</span>
            <span class="security-desc">Get notified of new sign-ins</span>
          </div>
          <mat-slide-toggle [checked]="loginNotifications" (change)="loginNotifications = $event.checked" color="primary"></mat-slide-toggle>
        </div>
        <div class="security-item">
          <div class="security-info">
            <span class="security-label">Transaction Alerts</span>
            <span class="security-desc">Alert for transactions over $100</span>
          </div>
          <mat-slide-toggle [checked]="transactionAlerts" (change)="transactionAlerts = $event.checked" color="primary"></mat-slide-toggle>
        </div>
        <mat-divider></mat-divider>
        <div class="security-action">
          <meridian-button variant="secondary" icon="vpn_key" (clicked)="changePassword()">Change Password</meridian-button>
          <meridian-button variant="secondary" icon="devices" (clicked)="manageTrustedDevices()">Manage Trusted Devices</meridian-button>
        </div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .security-options { display: flex; flex-direction: column; }
    .security-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid #e0e0e0; }
    .security-info { display: flex; flex-direction: column; }
    .security-label { font-weight: 500; }
    .security-desc { font-size: 13px; color: #767676; }
    .security-action { display: flex; gap: 12px; margin-top: 16px; }
  `]
})
export class SecuritySettingsComponent {
  mfaEnabled = true;
  loginNotifications = true;
  transactionAlerts = true;

  changePassword(): void { console.log('Change password'); }
  manageTrustedDevices(): void { console.log('Manage trusted devices'); }
}
