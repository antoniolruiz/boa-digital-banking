import { Component } from '@angular/core';

/**
 * Consumer page demonstrating usage of 4 Meridian Design System components.
 * This is the key downstream integration test — these components must
 * continue to work after the library is upgraded to Angular 18.
 */
@Component({
  selector: 'app-consumer-page',
  template: `
    <div class="consumer-page">
      <h2>Library Component Showcase</h2>

      <!-- 1. Meridian Button -->
      <section class="component-section">
        <h3>Meridian Button</h3>
        <div class="button-row">
          <meridian-button variant="primary" (clicked)="onButtonClick('primary')">Primary Action</meridian-button>
          <meridian-button variant="secondary" (clicked)="onButtonClick('secondary')">Secondary</meridian-button>
          <meridian-button variant="danger" (clicked)="onButtonClick('danger')">Delete</meridian-button>
          <meridian-button variant="primary" [loading]="isLoading" (clicked)="simulateLoading()">Submit</meridian-button>
        </div>
      </section>

      <!-- 2. Meridian Card -->
      <section class="component-section">
        <h3>Meridian Card</h3>
        <div class="card-grid">
          <meridian-card title="Account Summary" subtitle="Checking Account" headerIcon="account_balance" variant="elevated">
            <p>Available Balance: $12,456.78</p>
            <p>Pending Transactions: 3</p>
          </meridian-card>
          <meridian-card title="Quick Transfer" variant="outlined">
            <p>Send money to your accounts or other people.</p>
          </meridian-card>
        </div>
      </section>

      <!-- 3. Meridian Alert Banner -->
      <section class="component-section">
        <h3>Meridian Alert Banner</h3>
        <meridian-alert-banner
          type="info"
          message="Your statement is ready for download."
          [dismissible]="true">
        </meridian-alert-banner>
        <meridian-alert-banner
          type="warning"
          message="Scheduled maintenance this weekend."
          [dismissible]="false">
        </meridian-alert-banner>
      </section>

      <!-- 4. Meridian Account Summary -->
      <section class="component-section">
        <h3>Meridian Account Summary</h3>
        <div class="card-grid">
          <meridian-account-summary
            accountName="BoA Advantage Checking"
            accountNumber="****7890"
            accountType="checking"
            [balance]="12456.78"
            [availableBalance]="11200.00">
          </meridian-account-summary>
          <meridian-account-summary
            accountName="BoA Advantage Savings"
            accountNumber="****4567"
            accountType="savings"
            [balance]="45678.90"
            [availableBalance]="45678.90">
          </meridian-account-summary>
        </div>
      </section>

      <div class="status-bar" *ngIf="lastAction">
        <mat-icon>check_circle</mat-icon>
        Last action: {{ lastAction }}
      </div>
    </div>
  `,
  styles: [`
    .consumer-page { max-width: 960px; margin: 0 auto; }
    h2 { color: #012169; border-bottom: 2px solid #DC1431; padding-bottom: 8px; }
    h3 { color: #333; margin-top: 32px; }
    .component-section { margin-bottom: 32px; }
    .button-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }
    .status-bar {
      position: fixed; bottom: 0; left: 0; right: 0;
      background: #E8F5E9; color: #2E7D32;
      padding: 12px 24px; display: flex; align-items: center; gap: 8px;
    }
  `]
})
export class ConsumerPageComponent {
  lastAction = '';
  isLoading = false;

  onButtonClick(variant: string): void {
    this.lastAction = `Clicked ${variant} button at ${new Date().toLocaleTimeString()}`;
  }

  simulateLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.lastAction = 'Form submitted successfully';
    }, 2000);
  }
}
