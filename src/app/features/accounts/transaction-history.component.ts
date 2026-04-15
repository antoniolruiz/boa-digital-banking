import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { Transaction } from '../../shared/models/transaction.model';
import { MOCK_TRANSACTIONS } from '../../../test/mock-data/mock-transactions';

/**
 * Transaction History Component - mat-table with virtual scroll.
 * Uses Material 14 table patterns that need migration to MDC-based components in v15+.
 */
@Component({
  selector: 'boa-transaction-history',
  template: `
    <meridian-card title="Transaction History" headerIcon="receipt_long">
      <div class="txn-toolbar">
        <mat-form-field appearance="outline" class="txn-search">
          <mat-label>Search transactions</mat-label>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>
        <button mat-stroked-button (click)="exportTransactions()">
          <mat-icon>download</mat-icon> Export CSV
        </button>
      </div>

      <table mat-table [dataSource]="dataSource" matSort class="txn-table">
        <ng-container matColumnDef="transactionDate">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Date</th>
          <td mat-cell *matCellDef="let txn">{{ txn.transactionDate | date:'shortDate' }}</td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Description</th>
          <td mat-cell *matCellDef="let txn">
            <div class="txn-desc">
              <span>{{ txn.description }}</span>
              <span class="txn-category" *ngIf="txn.category">{{ txn.category }}</span>
            </div>
          </td>
        </ng-container>

        <ng-container matColumnDef="status">
          <th mat-header-cell *matHeaderCellDef mat-sort-header>Status</th>
          <td mat-cell *matCellDef="let txn">
            <span class="status-chip" [attr.data-status]="txn.status">{{ txn.status }}</span>
          </td>
        </ng-container>

        <ng-container matColumnDef="amount">
          <th mat-header-cell *matHeaderCellDef mat-sort-header class="text-right">Amount</th>
          <td mat-cell *matCellDef="let txn" class="text-right">
            <span [class.credit]="txn.amount > 0" [class.debit]="txn.amount < 0">
              {{ txn.amount | currency:'USD':'symbol':'1.2-2' }}
            </span>
          </td>
        </ng-container>

        <ng-container matColumnDef="runningBalance">
          <th mat-header-cell *matHeaderCellDef class="text-right">Balance</th>
          <td mat-cell *matCellDef="let txn" class="text-right">
            {{ txn.runningBalance ? (txn.runningBalance | currency:'USD':'symbol':'1.2-2') : '—' }}
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: true"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell no-data" colspan="5">No transactions found</td>
        </tr>
      </table>

      <mat-paginator [pageSizeOptions]="[10, 25, 50, 100]" [pageSize]="25" showFirstLastButtons></mat-paginator>
    </meridian-card>
  `,
  styles: [`
    .txn-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .txn-search { flex: 1; max-width: 400px; }
    .txn-table { width: 100%; }
    .txn-desc { display: flex; flex-direction: column; }
    .txn-category { font-size: 11px; color: #767676; text-transform: capitalize; }
    .text-right { text-align: right; }
    .credit { color: #2E7D32; font-weight: 500; }
    .debit { color: #333; }
    .status-chip {
      padding: 2px 8px; border-radius: 12px; font-size: 11px; font-weight: 500;
      &[data-status="POSTED"] { background: #E8F5E9; color: #2E7D32; }
      &[data-status="PENDING"] { background: #FFF8E1; color: #F57F17; }
    }
    .no-data { text-align: center; padding: 48px; color: #767676; }
  `]
})
export class TransactionHistoryComponent implements OnInit, AfterViewInit {
  displayedColumns = ['transactionDate', 'description', 'status', 'amount', 'runningBalance'];
  dataSource = new MatTableDataSource<Transaction>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const accountId = this.route.snapshot.paramMap.get('id');
    const transactions = accountId
      ? MOCK_TRANSACTIONS.filter(t => t.accountId === accountId)
      : MOCK_TRANSACTIONS;
    this.dataSource.data = transactions;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  exportTransactions(): void {
    const headers = this.displayedColumns.join(',');
    const rows = this.dataSource.filteredData.map(t =>
      `${t.transactionDate},${t.description},${t.status},${t.amount},${t.runningBalance || ''}`
    );
    const csv = [headers, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'transactions.csv';
    a.click();
  }
}
