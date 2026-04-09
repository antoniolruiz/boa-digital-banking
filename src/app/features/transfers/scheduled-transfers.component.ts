import { Component, OnInit } from '@angular/core';

interface ScheduledTransfer {
  id: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  frequency: string;
  nextDate: string;
  status: string;
}

@Component({
  selector: 'boa-scheduled-transfers',
  template: `
    <meridian-card title="Scheduled Transfers" headerIcon="schedule">
      <div *ngIf="scheduledTransfers.length === 0" class="no-scheduled">
        <mat-icon>event_busy</mat-icon>
        <p>No scheduled transfers</p>
      </div>
      <div *ngFor="let transfer of scheduledTransfers" class="scheduled-item">
        <div class="scheduled-info">
          <span class="scheduled-desc">{{ transfer.fromAccount }} → {{ transfer.toAccount }}</span>
          <span class="scheduled-freq">{{ transfer.frequency }} · Next: {{ transfer.nextDate | date:'mediumDate' }}</span>
        </div>
        <div class="scheduled-right">
          <span class="scheduled-amount">{{ transfer.amount | currency:'USD' }}</span>
          <button mat-icon-button [matMenuTriggerFor]="menu"><mat-icon>more_vert</mat-icon></button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item><mat-icon>edit</mat-icon> Edit</button>
            <button mat-menu-item><mat-icon>pause</mat-icon> Pause</button>
            <button mat-menu-item><mat-icon>delete</mat-icon> Cancel</button>
          </mat-menu>
        </div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .no-scheduled { text-align: center; padding: 32px; color: #767676; }
    .no-scheduled mat-icon { font-size: 48px; width: 48px; height: 48px; }
    .scheduled-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px solid #e0e0e0; }
    .scheduled-info { display: flex; flex-direction: column; }
    .scheduled-desc { font-weight: 500; }
    .scheduled-freq { font-size: 12px; color: #767676; }
    .scheduled-right { display: flex; align-items: center; gap: 8px; }
    .scheduled-amount { font-weight: 500; font-family: monospace; }
  `]
})
export class ScheduledTransfersComponent implements OnInit {
  scheduledTransfers: ScheduledTransfer[] = [];

  ngOnInit(): void {
    this.scheduledTransfers = [
      { id: 'st-1', fromAccount: 'Checking ****4523', toAccount: 'Savings ****8891', amount: 500, frequency: 'Monthly', nextDate: '2024-02-01', status: 'Active' },
      { id: 'st-2', fromAccount: 'Checking ****4523', toAccount: 'Credit Card ****2210', amount: 35, frequency: 'Monthly', nextDate: '2024-02-05', status: 'Active' },
    ];
  }
}
