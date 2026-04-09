import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';

import { AccountListComponent } from './account-list.component';
import { AccountDetailComponent } from './account-detail.component';
import { TransactionHistoryComponent } from './transaction-history.component';
import { StatementDownloadComponent } from './statement-download.component';

const routes: Routes = [
  { path: '', component: AccountListComponent },
  { path: ':id', component: AccountDetailComponent },
  { path: ':id/transactions', component: TransactionHistoryComponent },
];

@NgModule({
  declarations: [
    AccountListComponent,
    AccountDetailComponent,
    TransactionHistoryComponent,
    StatementDownloadComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    RouterModule.forChild(routes),
  ]
})
export class AccountsModule { }
