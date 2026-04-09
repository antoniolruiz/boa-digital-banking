import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Transaction, TransactionCategory } from '../../shared/models/transaction.model';

interface SpendingCategory {
  category: string;
  amount: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'boa-spending-chart',
  template: `
    <meridian-card title="Spending Overview" headerIcon="pie_chart">
      <div class="spending-chart">
        <div class="spending-categories">
          <div *ngFor="let cat of spendingCategories"
               class="spending-category-item">
            <div class="spending-category-bar">
              <div class="spending-category-fill"
                   [style.width.%]="cat.percentage"
                   [style.backgroundColor]="cat.color">
              </div>
            </div>
            <div class="spending-category-info">
              <span class="spending-category-name">{{ cat.category }}</span>
              <span class="spending-category-amount">{{ cat.amount | currency:'USD':'symbol':'1.2-2' }}</span>
            </div>
          </div>
        </div>
        <div class="spending-total">
          <span class="spending-total-label">Total Spending</span>
          <span class="spending-total-value">{{ totalSpending | currency:'USD':'symbol':'1.2-2' }}</span>
        </div>
      </div>
    </meridian-card>
  `,
  styles: [`
    .spending-chart { padding: 8px 0; }
    .spending-categories { display: flex; flex-direction: column; gap: 12px; }
    .spending-category-item { display: flex; flex-direction: column; gap: 4px; }
    .spending-category-bar {
      height: 8px;
      background: #f0f0f0;
      border-radius: 4px;
      overflow: hidden;
    }
    .spending-category-fill {
      height: 100%;
      border-radius: 4px;
      transition: width 0.3s ease;
    }
    .spending-category-info {
      display: flex;
      justify-content: space-between;
      font-size: 13px;
    }
    .spending-category-name { color: #333; }
    .spending-category-amount { font-weight: 500; font-family: monospace; }
    .spending-total {
      margin-top: 16px;
      padding-top: 16px;
      border-top: 2px solid #012169;
      display: flex;
      justify-content: space-between;
      font-size: 16px;
    }
    .spending-total-label { font-weight: 500; color: #012169; }
    .spending-total-value { font-weight: 600; }
  `]
})
export class SpendingChartComponent implements OnChanges {
  @Input() transactions: Transaction[] = [];

  spendingCategories: SpendingCategory[] = [];
  totalSpending = 0;

  private categoryColors: Record<string, string> = {
    'GROCERIES': '#2E7D32',
    'DINING': '#F57F17',
    'TRANSPORTATION': '#0277BD',
    'UTILITIES': '#6A1B9A',
    'ENTERTAINMENT': '#E91E63',
    'SHOPPING': '#012169',
    'HEALTHCARE': '#00695C',
    'OTHER': '#767676'
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['transactions']) {
      this.calculateSpending();
    }
  }

  private calculateSpending(): void {
    const categoryMap = new Map<string, number>();

    this.transactions
      .filter(t => t.amount < 0)
      .forEach(t => {
        const category = t.category || TransactionCategory.OTHER;
        const current = categoryMap.get(category) || 0;
        categoryMap.set(category, current + Math.abs(t.amount));
      });

    this.totalSpending = Array.from(categoryMap.values()).reduce((sum, val) => sum + val, 0);

    this.spendingCategories = Array.from(categoryMap.entries())
      .map(([category, amount]) => ({
        category: this.formatCategoryName(category),
        amount,
        percentage: this.totalSpending > 0 ? (amount / this.totalSpending) * 100 : 0,
        color: this.categoryColors[category] || '#767676'
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  private formatCategoryName(category: string): string {
    return category.charAt(0) + category.slice(1).toLowerCase().replace(/_/g, ' ');
  }
}
