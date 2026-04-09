import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { ProfileSettingsComponent } from './profile-settings.component';
import { SecuritySettingsComponent } from './security-settings.component';
import { NotificationPreferencesComponent } from './notification-preferences.component';

const routes: Routes = [
  { path: '', component: ProfileSettingsComponent },
];

@NgModule({
  declarations: [
    ProfileSettingsComponent,
    SecuritySettingsComponent,
    NotificationPreferencesComponent,
  ],
  imports: [
    SharedModule,
    BoaUiModule,
    MatSlideToggleModule,
    RouterModule.forChild(routes),
  ]
})
export class ProfileModule { }
