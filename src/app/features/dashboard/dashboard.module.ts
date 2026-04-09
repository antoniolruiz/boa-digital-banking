import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';

import { DashboardComponent } from './dashboard.component';
import { AccountOverviewComponent } from './account-overview.component';
import { QuickActionsComponent } from './quick-actions.component';
import { SpendingChartComponent } from './spending-chart.component';

const routes: Routes = [
  { path: '', component: DashboardComponent }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AccountOverviewComponent,
    QuickActionsComponent,
    SpendingChartComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    RouterModule.forChild(routes),
  ]
})
export class DashboardModule { }
