import { Component, OnInit } from '@angular/core';

interface Payee { id: string; name: string; accountNumber: string; category: string; lastPayment?: string; }

@Component({
  selector: 'boa-payee-list',
  template: `
    <div class="payee-container">
      <div class="payee-header">
        <h2>Your Payees</h2>
        <meridian-button variant="primary" icon="add" (clicked)="showAddPayee = true">Add Payee</meridian-button>
      </div>
      <div class="payee-grid">
        <meridian-card *ngFor="let payee of payees" [title]="payee.name" variant="outlined" [interactive]="true">
          <div class="payee-info">
            <span class="payee-category">{{ payee.category }}</span>
            <span class="payee-account">Account: {{ payee.accountNumber }}</span>
            <span class="payee-last" *ngIf="payee.lastPayment">Last payment: {{ payee.lastPayment | date:'mediumDate' }}</span>
          </div>
          <div class="payee-actions">
            <meridian-button variant="primary" size="sm" (clicked)="payBill(payee)">Pay Now</meridian-button>
            <meridian-button variant="text" size="sm" (clicked)="editPayee(payee)">Edit</meridian-button>
          </div>
        </meridian-card>
      </div>
    </div>
    <boa-add-payee *ngIf="showAddPayee" (closed)="showAddPayee = false" (payeeAdded)="onPayeeAdded($event)"></boa-add-payee>
  `,
  styles: [`
    .payee-container { max-width: 1200px; margin: 0 auto; }
    .payee-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .payee-header h2 { color: #012169; font-weight: 400; }
    .payee-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
    .payee-info { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
    .payee-category { font-size: 12px; color: #767676; text-transform: uppercase; }
    .payee-account { font-family: monospace; font-size: 13px; }
    .payee-last { font-size: 12px; color: #767676; }
    .payee-actions { display: flex; gap: 8px; }
  `]
})
export class PayeeListComponent implements OnInit {
  payees: Payee[] = [];
  showAddPayee = false;

  ngOnInit(): void {
    this.payees = [
      { id: 'p-1', name: 'Duke Energy Carolinas', accountNumber: '****4521', category: 'Utilities', lastPayment: '2024-01-14' },
      { id: 'p-2', name: 'AT&T Wireless', accountNumber: '****8830', category: 'Telecommunications', lastPayment: '2024-01-10' },
      { id: 'p-3', name: 'State Farm Insurance', accountNumber: '****1199', category: 'Insurance', lastPayment: '2024-01-01' },
      { id: 'p-4', name: 'Charlotte Water', accountNumber: '****7744', category: 'Utilities', lastPayment: '2023-12-28' },
    ];
  }

  payBill(payee: Payee): void { console.log('Pay bill for:', payee.name); }
  editPayee(payee: Payee): void { console.log('Edit payee:', payee.name); }
  onPayeeAdded(payee: Payee): void { this.payees.push(payee); this.showAddPayee = false; }
}
