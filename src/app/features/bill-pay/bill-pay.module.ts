import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';

import { PayeeListComponent } from './payee-list.component';
import { AddPayeeComponent } from './add-payee.component';
import { PaymentHistoryComponent } from './payment-history.component';

const routes: Routes = [
  { path: '', component: PayeeListComponent },
  { path: 'history', component: PaymentHistoryComponent },
];

@NgModule({
  declarations: [
    PayeeListComponent,
    AddPayeeComponent,
    PaymentHistoryComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    RouterModule.forChild(routes),
  ]
})
export class BillPayModule { }
