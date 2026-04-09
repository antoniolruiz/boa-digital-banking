import { Component, OnInit } from '@angular/core';

interface PaymentRecord { id: string; payee: string; amount: number; date: string; status: string; confirmationNumber: string; }

@Component({
  selector: 'boa-payment-history',
  template: `
    <meridian-card title="Payment History" headerIcon="history">
      <table mat-table [dataSource]="payments" class="payment-table">
        <ng-container matColumnDef="date">
          <th mat-header-cell *matHeaderCellDef>Date</th>
          <td mat-cell *matCellDef="let p">{{ p.date | date:'shortDate' }}</td>
        </ng-container>
        <ng-container matColumnDef="payee">
          <th mat-header-cell *matHeaderCellDef>Payee</th>
          <td mat-cell *matCellDef="let p">{{ p.payee }}</td>
        </ng-container>
        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef>Amount</th>
          <td mat-cell *matCellDef="let p">{{ p.amount | currency:'USD' }}</td>
        </ng-container>
        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef>Status</th>
          <td mat-cell *matCellDef="let p"><span class="status" [attr.data-status]="p.status">{{ p.status }}</span></td>
        </ng-container>
        <ng-container matColumnDef="confirmation">
          <th mat-header-cell *matHeaderCellDef>Confirmation #</th>
          <td mat-cell *matCellDef="let p" class="mono">{{ p.confirmationNumber }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </meridian-card>
  `,
  styles: [`
    .payment-table { width: 100%; }
    .mono { font-family: monospace; font-size: 12px; }
    .status { padding: 2px 8px; border-radius: 12px; font-size: 11px;
      &[data-status="Completed"] { background: #E8F5E9; color: #2E7D32; }
      &[data-status="Processing"] { background: #FFF8E1; color: #F57F17; }
    }
  `]
})
export class PaymentHistoryComponent implements OnInit {
  displayedColumns = ['date', 'payee', 'amount', 'status', 'confirmation'];
  payments: PaymentRecord[] = [];

  ngOnInit(): void {
    this.payments = [
      { id: 'pay-1', payee: 'Duke Energy Carolinas', amount: 189.34, date: '2024-01-14', status: 'Completed', confirmationNumber: 'BOA-PAY-8K2M1' },
      { id: 'pay-2', payee: 'AT&T Wireless', amount: 95.00, date: '2024-01-10', status: 'Completed', confirmationNumber: 'BOA-PAY-7J3N2' },
      { id: 'pay-3', payee: 'State Farm Insurance', amount: 147.50, date: '2024-01-01', status: 'Completed', confirmationNumber: 'BOA-PAY-6H4P3' },
      { id: 'pay-4', payee: 'Charlotte Water', amount: 62.18, date: '2023-12-28', status: 'Completed', confirmationNumber: 'BOA-PAY-5G5Q4' },
    ];
  }
}
