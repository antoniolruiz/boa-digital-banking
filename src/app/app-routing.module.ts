import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';

/**
 * App Routing Module - uses string-based loadChildren syntax (deprecated pattern).
 * This is a key migration target: Angular 15+ requires arrow function imports.
 *
 * Also uses class-based Resolve interface (deprecated in Angular 15+).
 */
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    // String-based lazy loading syntax — deprecated migration target
    // Modern: loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard],
    data: { permissions: ['accounts:read'] }
  },
  {
    path: 'accounts',
    loadChildren: () => import('./features/accounts/accounts.module').then(m => m.AccountsModule),
    canActivate: [AuthGuard],
    data: { permissions: ['accounts:read'] }
  },
  {
    path: 'transfers',
    loadChildren: () => import('./features/transfers/transfers.module').then(m => m.TransfersModule),
    canActivate: [AuthGuard],
    data: { permissions: ['transfers:initiate'] }
  },
  {
    path: 'bill-pay',
    loadChildren: () => import('./features/bill-pay/bill-pay.module').then(m => m.BillPayModule),
    canActivate: [AuthGuard],
    data: { permissions: ['billpay:read'] }
  },
  {
    path: 'alerts',
    loadChildren: () => import('./features/alerts/alerts.module').then(m => m.AlertsModule),
    canActivate: [AuthGuard],
    data: { permissions: ['alerts:read'] }
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [AuthGuard],
    data: { permissions: ['profile:read'] }
  },
  {
    path: 'error',
    // Error page is eagerly loaded (no guard)
    loadChildren: () => import('./core/error-handling/error-page.module').then(m => m.ErrorPageModule)
  },
  {
    path: '**',
    redirectTo: 'error',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled',
    anchorScrolling: 'enabled',
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
