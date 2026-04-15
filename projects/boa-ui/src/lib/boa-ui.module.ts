import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Angular Material 15 - legacy imports (MDC migration deferred to Phase 2)
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
  // entryComponents removed in Angular 15 (was a ViewEngine-era artifact, no-op with Ivy)
  providers: [
    MeridianModalService,
    MeridianThemeService,
    MeridianA11yService,
  ]
})
export class BoaUiModule { }
