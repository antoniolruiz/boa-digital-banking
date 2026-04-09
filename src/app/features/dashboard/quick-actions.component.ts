import { Component, Output, EventEmitter } from '@angular/core';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  description: string;
  route: string;
}

@Component({
  selector: 'boa-quick-actions',
  template: `
    <meridian-card title="Quick Actions" headerIcon="flash_on">
      <div class="quick-actions-grid">
        <button *ngFor="let action of actions"
                class="quick-action-item"
                (click)="actionSelected.emit(action.id)"
                [attr.aria-label]="action.description">
          <mat-icon class="quick-action-icon">{{ action.icon }}</mat-icon>
          <span class="quick-action-label">{{ action.label }}</span>
        </button>
      </div>
    </meridian-card>
  `,
  styles: [`
    .quick-actions-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .quick-action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border: 1px solid #D1D1D1;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        border-color: #012169;
        background: rgba(1, 33, 105, 0.04);
      }
    }
    .quick-action-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #012169;
      margin-bottom: 8px;
    }
    .quick-action-label {
      font-size: 13px;
      font-weight: 500;
      color: #333;
    }
  `]
})
export class QuickActionsComponent {
  @Output() actionSelected = new EventEmitter<string>();

  actions: QuickAction[] = [
    { id: 'transfer', label: 'Transfer Money', icon: 'swap_horiz', description: 'Transfer money between accounts', route: '/transfers' },
    { id: 'billpay', label: 'Pay Bills', icon: 'payment', description: 'Pay your bills online', route: '/bill-pay' },
    { id: 'deposit', label: 'Mobile Deposit', icon: 'photo_camera', description: 'Deposit a check using your camera', route: '/deposit' },
    { id: 'statements', label: 'Statements', icon: 'description', description: 'View and download statements', route: '/accounts' },
  ];
}
