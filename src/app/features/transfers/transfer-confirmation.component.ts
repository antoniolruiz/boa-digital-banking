import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'boa-transfer-confirmation',
  template: `
    <div class="confirmation-container">
      <meridian-card>
        <div class="confirmation-content">
          <mat-icon class="confirmation-icon">check_circle</mat-icon>
          <h2>Transfer Successful</h2>
          <p>Your transfer has been submitted successfully.</p>
          <p class="confirmation-ref">Confirmation #: BOA-TXF-{{ confirmationNumber }}</p>
          <div class="confirmation-actions">
            <meridian-button variant="primary" (clicked)="goToDashboard()">Go to Dashboard</meridian-button>
            <meridian-button variant="secondary" (clicked)="makeAnother()">Make Another Transfer</meridian-button>
          </div>
        </div>
      </meridian-card>
    </div>
  `,
  styles: [`
    .confirmation-container { max-width: 500px; margin: 0 auto; }
    .confirmation-content { text-align: center; padding: 32px 0; }
    .confirmation-icon { font-size: 64px; width: 64px; height: 64px; color: #2E7D32; }
    h2 { color: #012169; margin: 16px 0 8px; }
    .confirmation-ref { font-family: monospace; color: #767676; margin: 16px 0 24px; }
    .confirmation-actions { display: flex; justify-content: center; gap: 12px; }
  `]
})
export class TransferConfirmationComponent {
  confirmationNumber = Date.now().toString(36).toUpperCase();

  constructor(private router: Router) {}
  goToDashboard(): void { this.router.navigate(['/dashboard']); }
  makeAnother(): void { this.router.navigate(['/transfers']); }
}
