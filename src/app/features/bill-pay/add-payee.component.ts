import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'boa-add-payee',
  template: `
    <div class="add-payee-overlay" (click)="close()">
      <div class="add-payee-modal" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h3>Add New Payee</h3>
          <button mat-icon-button (click)="close()"><mat-icon>close</mat-icon></button>
        </div>
        <form [formGroup]="payeeForm" (ngSubmit)="addPayee()" class="payee-form">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Payee Name</mat-label>
            <input matInput formControlName="name" placeholder="e.g., Duke Energy">
            <mat-error>Payee name is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Account Number</mat-label>
            <input matInput formControlName="accountNumber" placeholder="Enter account number">
            <mat-error>Account number is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Category</mat-label>
            <mat-select formControlName="category">
              <mat-option value="Utilities">Utilities</mat-option>
              <mat-option value="Telecommunications">Telecommunications</mat-option>
              <mat-option value="Insurance">Insurance</mat-option>
              <mat-option value="Mortgage">Mortgage/Rent</mat-option>
              <mat-option value="Other">Other</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="modal-actions">
            <meridian-button variant="secondary" (clicked)="close()">Cancel</meridian-button>
            <meridian-button variant="primary" type="submit" [disabled]="payeeForm.invalid">Add Payee</meridian-button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .add-payee-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1050; }
    .add-payee-modal { background: white; border-radius: 8px; padding: 24px; width: 450px; max-width: 90vw; }
    .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .modal-header h3 { margin: 0; color: #012169; }
    .payee-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .modal-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 8px; }
  `]
})
export class AddPayeeComponent {
  @Output() closed = new EventEmitter<void>();
  @Output() payeeAdded = new EventEmitter<{ id: string; name: string; accountNumber: string; category: string }>();

  payeeForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.payeeForm = this.fb.group({
      name: ['', Validators.required],
      accountNumber: ['', Validators.required],
      category: ['Utilities']
    });
  }

  addPayee(): void {
    if (this.payeeForm.valid) {
      this.payeeAdded.emit({ id: 'p-' + Date.now(), ...this.payeeForm.value });
    }
  }

  close(): void { this.closed.emit(); }
}
