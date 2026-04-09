import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

// Angular Material 14 Modules - standard imports (no legacy prefix in v14)
// When migrating to Material 15+, these become MatLegacyXxxModule
// as the MDC-based components take over the non-prefixed names.
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';

// Pipes
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { AccountMaskPipe } from './pipes/account-mask.pipe';
import { DateRelativePipe } from './pipes/date-relative.pipe';

// Directives
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { AutoFocusDirective } from './directives/auto-focus.directive';
import { PermissionCheckDirective } from './directives/permission-check.directive';

/**
 * SharedModule re-exports common modules, pipes, and directives.
 * This is a classic Angular 14 pattern — migration target for standalone components.
 *
 * In Angular 18, each component would import only what it needs directly,
 * eliminating the need for this barrel module.
 */
@NgModule({
  declarations: [
    // Pipes
    CurrencyFormatPipe,
    AccountMaskPipe,
    DateRelativePipe,
    // Directives
    ClickOutsideDirective,
    AutoFocusDirective,
    PermissionCheckDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatDividerModule,
    MatExpansionModule,
  ],
  exports: [
    // Modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    // Material Modules
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTabsModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatBadgeModule,
    MatDividerModule,
    MatExpansionModule,
    // Pipes
    CurrencyFormatPipe,
    AccountMaskPipe,
    DateRelativePipe,
    // Directives
    ClickOutsideDirective,
    AutoFocusDirective,
    PermissionCheckDirective,
  ]
})
export class SharedModule { }
