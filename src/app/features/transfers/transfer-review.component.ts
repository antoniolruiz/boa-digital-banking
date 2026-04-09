import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'boa-transfer-review',
  template: `
    <div class="review-container">
      <meridian-card title="Review Transfer" headerIcon="rate_review">
        <div class="review-details" *ngIf="transferData">
          <div class="review-row"><span class="review-label">From</span><span>{{ transferData['fromAccount'] }}</span></div>
          <div class="review-row"><span class="review-label">To</span><span>{{ transferData['toAccount'] }}</span></div>
          <div class="review-row"><span class="review-label">Amount</span><span class="review-amount">{{ $any(transferData['amount']) | currency:'USD' }}</span></div>
          <div class="review-row"><span class="review-label">Date</span><span>{{ $any(transferData['transferDate']) | date:'mediumDate' }}</span></div>
          <div class="review-row"><span class="review-label">Frequency</span><span>{{ transferData['frequency'] }}</span></div>
          <div class="review-row" *ngIf="transferData['memo']"><span class="review-label">Memo</span><span>{{ transferData['memo'] }}</span></div>
        </div>
        <div class="review-actions">
          <meridian-button variant="secondary" (clicked)="goBack()">Edit</meridian-button>
          <meridian-button variant="primary" (clicked)="confirmTransfer()" [loading]="isProcessing">Confirm Transfer</meridian-button>
        </div>
      </meridian-card>
    </div>
  `,
  styles: [`
    .review-container { max-width: 600px; margin: 0 auto; }
    .review-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .review-row:last-child { border-bottom: none; }
    .review-label { color: #767676; }
    .review-amount { font-size: 20px; font-weight: 600; color: #012169; }
    .review-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; }
  `]
})
export class TransferReviewComponent {
  transferData: Record<string, unknown> | null = null;
  isProcessing = false;

  constructor(private router: Router) {
    const nav = this.router.getCurrentNavigation();
    this.transferData = nav?.extras?.state?.['transferData'] as Record<string, unknown> || null;
  }

  goBack(): void { this.router.navigate(['/transfers']); }

  confirmTransfer(): void {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;
      this.router.navigate(['/transfers/confirmation']);
    }, 2000);
  }
}
