import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';

import { TransferFormComponent } from './transfer-form.component';
import { TransferReviewComponent } from './transfer-review.component';
import { TransferConfirmationComponent } from './transfer-confirmation.component';
import { ScheduledTransfersComponent } from './scheduled-transfers.component';

const routes: Routes = [
  { path: '', component: TransferFormComponent },
  { path: 'review', component: TransferReviewComponent },
  { path: 'confirmation', component: TransferConfirmationComponent },
  { path: 'scheduled', component: ScheduledTransfersComponent },
];

@NgModule({
  declarations: [
    TransferFormComponent,
    TransferReviewComponent,
    TransferConfirmationComponent,
    ScheduledTransfersComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    RouterModule.forChild(routes),
  ]
})
export class TransfersModule { }
