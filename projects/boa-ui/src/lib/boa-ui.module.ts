import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material 14 - standard imports (no legacy prefix in v14)
// In v15+, these become MatLegacyXxxModule as the MDC migration begins
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';

// Components
import { MeridianButtonComponent } from './meridian-button/meridian-button.component';
import { MeridianCardComponent } from './meridian-card/meridian-card.component';
import { MeridianDataTableComponent } from './meridian-data-table/meridian-data-table.component';
import { MeridianFormFieldComponent } from './meridian-form-field/meridian-form-field.component';
import { MeridianAlertBannerComponent } from './meridian-alert-banner/meridian-alert-banner.component';
import { MeridianNavShellComponent } from './meridian-nav-shell/meridian-nav-shell.component';
import { MeridianAccountSummaryComponent } from './meridian-account-summary/meridian-account-summary.component';
import { MeridianSecureBadgeComponent } from './meridian-secure-badge/meridian-secure-badge.component';

// Services
import { MeridianModalService } from './meridian-modal/meridian-modal.service';
import { MeridianThemeService } from './services/meridian-theme.service';
import { MeridianA11yService } from './services/meridian-a11y.service';

/**
 * BoaUiModule - @boa-ui/meridian-design-system
 * Shared component library module that exports all Meridian design system components.
 *
 * This single NgModule export pattern is a migration target:
 * In Angular 18, each component would be standalone and imported individually.
 *
 * Note: In Angular Material 14, these are standard MatXxxModule imports.
 * When migrating to Material 15+, these become MatLegacyXxxModule (legacy prefix)
 * as the MDC-based components take over the non-prefixed names.
 *
 * entryComponents is a ViewEngine-era artifact (no-op with Ivy but present in legacy).
 */
@NgModule({
  declarations: [
    MeridianButtonComponent,
    MeridianCardComponent,
    MeridianDataTableComponent,
    MeridianFormFieldComponent,
    MeridianAlertBannerComponent,
    MeridianNavShellComponent,
    MeridianAccountSummaryComponent,
    MeridianSecureBadgeComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSortModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  exports: [
    MeridianButtonComponent,
    MeridianCardComponent,
    MeridianDataTableComponent,
    MeridianFormFieldComponent,
    MeridianAlertBannerComponent,
    MeridianNavShellComponent,
    MeridianAccountSummaryComponent,
    MeridianSecureBadgeComponent,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSortModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  // entryComponents is a ViewEngine-era artifact
  entryComponents: [
    MeridianButtonComponent,
    MeridianCardComponent,
    MeridianDataTableComponent,
    MeridianFormFieldComponent,
    MeridianAlertBannerComponent,
    MeridianNavShellComponent,
    MeridianAccountSummaryComponent,
    MeridianSecureBadgeComponent,
  ],
  providers: [
    MeridianModalService,
    MeridianThemeService,
    MeridianA11yService,
  ]
})
export class BoaUiModule { }
