import { Component } from '@angular/core';

@Component({
  selector: 'boa-statement-download',
  template: `
    <meridian-card title="Statement Download" headerIcon="description">
      <div class="statement-options">
        <mat-form-field appearance="outline">
          <mat-label>Statement Period</mat-label>
          <mat-select [(value)]="selectedPeriod">
            <mat-option *ngFor="let period of periods" [value]="period.value">{{ period.label }}</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Format</mat-label>
          <mat-select [(value)]="selectedFormat">
            <mat-option value="pdf">PDF</mat-option>
            <mat-option value="csv">CSV</mat-option>
          </mat-select>
        </mat-form-field>
        <meridian-button variant="primary" icon="download" (clicked)="downloadStatement()">
          Download Statement
        </meridian-button>
      </div>
    </meridian-card>
  `,
  styles: [`
    .statement-options { display: flex; flex-direction: column; gap: 16px; max-width: 400px; }
  `]
})
export class StatementDownloadComponent {
  selectedPeriod = '2024-01';
  selectedFormat = 'pdf';
  periods = [
    { value: '2024-01', label: 'January 2024' },
    { value: '2023-12', label: 'December 2023' },
    { value: '2023-11', label: 'November 2023' },
    { value: '2023-10', label: 'October 2023' },
  ];

  downloadStatement(): void {
    // Mock download
    console.log(`Downloading ${this.selectedFormat} statement for ${this.selectedPeriod}`);
  }
}
