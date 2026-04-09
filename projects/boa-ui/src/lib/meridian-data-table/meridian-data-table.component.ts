import {
  Component, Input, Output, EventEmitter, ViewChild,
  AfterViewInit, OnChanges, SimpleChanges
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

export interface MeridianColumn {
  key: string;
  label: string;
  type?: 'text' | 'currency' | 'date' | 'badge' | 'action';
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  formatter?: (value: unknown, row: unknown) => string;
}

/**
 * Meridian Data Table - Enterprise data table with sorting, pagination, and export.
 * Wraps mat-table with BoA design patterns.
 */
@Component({
  selector: 'meridian-data-table',
  template: `
    <div class="meridian-table-container">
      <div class="meridian-table-toolbar" *ngIf="showToolbar">
        <div class="meridian-table-title" *ngIf="tableTitle">
          <h3>{{ tableTitle }}</h3>
          <span class="meridian-table-count" *ngIf="showCount">
            {{ dataSource.filteredData.length }} records
          </span>
        </div>
        <div class="meridian-table-actions">
          <mat-form-field *ngIf="showFilter" appearance="outline" class="meridian-table-filter">
            <mat-label>Search</mat-label>
            <input matInput (keyup)="applyFilter($event)" placeholder="Filter..." #filterInput>
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>
          <button mat-icon-button *ngIf="exportable" (click)="exportData()" matTooltip="Export to CSV">
            <mat-icon>download</mat-icon>
          </button>
          <button mat-icon-button *ngIf="printable" (click)="printTable()" matTooltip="Print">
            <mat-icon>print</mat-icon>
          </button>
        </div>
      </div>

      <div class="meridian-table-wrapper" [class.meridian-table-loading]="loading">
        <mat-spinner *ngIf="loading" diameter="40" class="meridian-table-spinner"></mat-spinner>

        <table mat-table [dataSource]="dataSource" matSort class="meridian-table">
          <ng-container *ngFor="let column of columns" [matColumnDef]="column.key">
            <th mat-header-cell *matHeaderCellDef
                [mat-sort-header]="column.sortable !== false ? column.key : ''"
                [disabled]="column.sortable === false"
                [style.text-align]="column.align || 'left'"
                [style.width]="column.width || 'auto'">
              {{ column.label }}
            </th>
            <td mat-cell *matCellDef="let row"
                [style.text-align]="column.align || 'left'">
              <ng-container [ngSwitch]="column.type">
                <span *ngSwitchCase="'currency'" [class.amount-negative]="row[column.key] < 0">
                  {{ row[column.key] | currency:'USD':'symbol':'1.2-2' }}
                </span>
                <span *ngSwitchCase="'date'">
                  {{ row[column.key] | date:'mediumDate' }}
                </span>
                <span *ngSwitchCase="'badge'" class="meridian-badge" [attr.data-status]="row[column.key]">
                  {{ row[column.key] }}
                </span>
                <span *ngSwitchDefault>
                  {{ column.formatter ? column.formatter(row[column.key], row) : row[column.key] }}
                </span>
              </ng-container>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns; sticky: stickyHeader"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"
              [class.meridian-row-clickable]="rowClickable"
              (click)="onRowClick(row)"></tr>

          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell meridian-no-data" [attr.colspan]="columns.length">
              {{ emptyMessage }}
            </td>
          </tr>
        </table>
      </div>

      <mat-paginator *ngIf="paginate"
                     [pageSizeOptions]="pageSizeOptions"
                     [pageSize]="pageSize"
                     showFirstLastButtons
                     aria-label="Select page">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .meridian-table-container {
      width: 100%;
      background: white;
      border-radius: 8px;
      overflow: hidden;
    }

    .meridian-table-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #e0e0e0;
    }

    .meridian-table-title h3 {
      margin: 0;
      color: #012169;
    }

    .meridian-table-count {
      color: #767676;
      font-size: 13px;
    }

    .meridian-table-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .meridian-table-filter {
      font-size: 14px;
    }

    .meridian-table-wrapper {
      position: relative;
      overflow-x: auto;
    }

    .meridian-table-loading {
      opacity: 0.5;
      pointer-events: none;
    }

    .meridian-table-spinner {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    .meridian-table {
      width: 100%;
    }

    .meridian-table th {
      color: #012169;
      font-weight: 600;
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .meridian-row-clickable {
      cursor: pointer;
      &:hover { background-color: rgba(1, 33, 105, 0.04); }
    }

    .amount-negative {
      color: #C62828;
    }

    .meridian-badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .meridian-no-data {
      text-align: center;
      padding: 48px;
      color: #767676;
    }
  `]
})
export class MeridianDataTableComponent implements AfterViewInit, OnChanges {
  @Input() columns: MeridianColumn[] = [];
  @Input() data: unknown[] = [];
  @Input() tableTitle?: string;
  @Input() loading = false;
  @Input() paginate = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 50];
  @Input() showFilter = true;
  @Input() showToolbar = true;
  @Input() showCount = true;
  @Input() exportable = true;
  @Input() printable = false;
  @Input() stickyHeader = true;
  @Input() rowClickable = false;
  @Input() emptyMessage = 'No data available';

  @Output() rowClicked = new EventEmitter<unknown>();
  @Output() exported = new EventEmitter<void>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<unknown>([]);

  get displayedColumns(): string[] {
    return this.columns.map(c => c.key);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.dataSource.data = this.data;
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(row: unknown): void {
    if (this.rowClickable) {
      this.rowClicked.emit(row);
    }
  }

  exportData(): void {
    const csvContent = this.convertToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${this.tableTitle || 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    this.exported.emit();
  }

  printTable(): void {
    window.print();
  }

  private convertToCSV(): string {
    const headers = this.columns.map(c => c.label);
    const rows = this.dataSource.filteredData.map((row: unknown) => {
      const record = row as Record<string, unknown>;
      return this.columns.map(c => {
        const value = record[c.key];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : String(value ?? '');
      });
    });

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
