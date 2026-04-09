import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Account } from '../../shared/models/account.model';
import { MOCK_ACCOUNTS } from '../../../test/mock-data/mock-accounts';
import { environment } from '../../../environments/environment';

/**
 * Transfer Form Component - Complex reactive form with custom validation.
 * Demonstrates deep reactive forms patterns that are common in enterprise banking.
 */
@Component({
  selector: 'boa-transfer-form',
  template: `
    <div class="transfer-form-container">
      <h2>New Transfer</h2>
      <form [formGroup]="transferForm" (ngSubmit)="onSubmit()" class="transfer-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>From Account</mat-label>
          <mat-select formControlName="fromAccount">
            <mat-option *ngFor="let account of fromAccounts" [value]="account.id">
              {{ account.accountName }} ({{ account.accountNumber }}) — {{ account.availableBalance | currency:'USD' }}
            </mat-option>
          </mat-select>
          <mat-error *ngIf="transferForm.get('fromAccount')?.hasError('required')">Please select a source account</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>To Account</mat-label>
          <mat-select formControlName="toAccount">
            <mat-option *ngFor="let account of toAccounts" [value]="account.id">
              {{ account.accountName }} ({{ account.accountNumber }})
            </mat-option>
          </mat-select>
          <mat-error *ngIf="transferForm.get('toAccount')?.hasError('required')">Please select a destination account</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Amount</mat-label>
          <span matPrefix>$ &nbsp;</span>
          <input matInput type="number" formControlName="amount" placeholder="0.00" step="0.01" min="0.01">
          <mat-error *ngIf="transferForm.get('amount')?.hasError('required')">Amount is required</mat-error>
          <mat-error *ngIf="transferForm.get('amount')?.hasError('min')">Amount must be greater than $0.00</mat-error>
          <mat-error *ngIf="transferForm.get('amount')?.hasError('max')">
            Maximum transfer amount is {{ maxAmount | currency:'USD' }}
          </mat-error>
          <mat-error *ngIf="transferForm.get('amount')?.hasError('insufficientFunds')">Insufficient funds</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Transfer Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="transferDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="transferForm.get('transferDate')?.hasError('required')">Date is required</mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Frequency</mat-label>
          <mat-select formControlName="frequency">
            <mat-option value="once">One-time</mat-option>
            <mat-option value="weekly">Weekly</mat-option>
            <mat-option value="biweekly">Every 2 weeks</mat-option>
            <mat-option value="monthly">Monthly</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Memo (optional)</mat-label>
          <textarea matInput formControlName="memo" rows="2" maxlength="140"></textarea>
          <mat-hint align="end">{{ transferForm.get('memo')?.value?.length || 0 }}/140</mat-hint>
        </mat-form-field>

        <div class="form-errors" *ngIf="transferForm.hasError('sameAccount')">
          <meridian-alert-banner type="error" [dismissible]="false">
            Source and destination accounts cannot be the same.
          </meridian-alert-banner>
        </div>

        <div class="transfer-actions">
          <meridian-button variant="secondary" (clicked)="cancel()">Cancel</meridian-button>
          <meridian-button variant="primary" type="submit" [disabled]="transferForm.invalid || isSubmitting"
                          [loading]="isSubmitting" loadingText="Processing...">
            Review Transfer
          </meridian-button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .transfer-form-container { max-width: 600px; margin: 0 auto; }
    h2 { color: #012169; font-weight: 400; margin-bottom: 24px; }
    .transfer-form { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .transfer-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 16px; }
    .form-errors { margin-bottom: 16px; }
  `]
})
export class TransferFormComponent implements OnInit {
  transferForm!: FormGroup;
  fromAccounts: Account[] = [];
  toAccounts: Account[] = [];
  isSubmitting = false;
  maxAmount = environment.maxTransferAmount;

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.fromAccounts = MOCK_ACCOUNTS.filter(a => a.availableBalance > 0);
    this.toAccounts = MOCK_ACCOUNTS;

    this.transferForm = this.fb.group({
      fromAccount: ['', Validators.required],
      toAccount: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0.01), Validators.max(this.maxAmount)]],
      transferDate: [new Date(), Validators.required],
      frequency: ['once'],
      memo: ['']
    }, { validators: [this.sameAccountValidator, this.sufficientFundsValidator.bind(this)] });
  }

  onSubmit(): void {
    if (this.transferForm.valid) {
      this.isSubmitting = true;
      setTimeout(() => {
        this.isSubmitting = false;
        this.router.navigate(['/transfers/review'], {
          state: { transferData: this.transferForm.value }
        });
      }, 1000);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }

  private sameAccountValidator(group: AbstractControl): ValidationErrors | null {
    const from = group.get('fromAccount')?.value;
    const to = group.get('toAccount')?.value;
    return from && to && from === to ? { sameAccount: true } : null;
  }

  private sufficientFundsValidator(group: AbstractControl): ValidationErrors | null {
    const fromAccountId = group.get('fromAccount')?.value;
    const amount = group.get('amount')?.value;
    if (!fromAccountId || !amount) return null;
    const account = this.fromAccounts.find(a => a.id === fromAccountId);
    if (account && amount > account.availableBalance) {
      group.get('amount')?.setErrors({ ...group.get('amount')?.errors, insufficientFunds: true });
      return { insufficientFunds: true };
    }
    return null;
  }
}
