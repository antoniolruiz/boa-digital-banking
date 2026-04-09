import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { AlertPreferencesComponent } from './alert-preferences.component';
import { AlertFeedComponent } from './alert-feed.component';
import { AlertDetailComponent } from './alert-detail.component';

const routes: Routes = [
  { path: '', component: AlertFeedComponent },
  { path: 'preferences', component: AlertPreferencesComponent },
  { path: ':id', component: AlertDetailComponent },
];

@NgModule({
  declarations: [
    AlertPreferencesComponent,
    AlertFeedComponent,
    AlertDetailComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    MatButtonToggleModule,
    RouterModule.forChild(routes),
  ]
})
export class AlertsModule { }
