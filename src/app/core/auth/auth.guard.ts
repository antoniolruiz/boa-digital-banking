import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { SsoAuthService } from './sso-auth.service';

/**
 * Functional route guard using Angular 15 CanActivateFn.
 * Replaces the deprecated class-based AuthGuard (CanActivate interface).
 *
 * Uses inject() to obtain dependencies instead of constructor injection.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(SsoAuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (isAuthenticated) {
        // Check for required permissions if specified in route data
        const requiredPermissions = route.data['permissions'] as string[] | undefined;
        if (requiredPermissions && requiredPermissions.length > 0) {
          const hasPermission = authService.hasAnyPermission(requiredPermissions);
          if (!hasPermission) {
            return router.createUrlTree(['/error'], {
              queryParams: { code: '403', message: 'Insufficient permissions' }
            });
          }
        }
        return true;
      }

      // Store the attempted URL for redirecting after login
      return router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    })
  );
};

/**
 * @deprecated Use the functional `authGuard` instead.
 * Class-based guards are deprecated in Angular 15+ in favor of functional guards.
 * Kept for backward compatibility during the migration period.
 */
export { authGuard as AuthGuard };
