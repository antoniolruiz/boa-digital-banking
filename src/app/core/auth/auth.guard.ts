import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { SsoAuthService } from './sso-auth.service';

/**
 * Route guard implementing the deprecated CanActivate interface.
 * This is a key migration target: Angular 15+ deprecates class-based guards
 * in favor of functional guards using inject().
 *
 * Migration: Convert to `canActivate: [() => inject(SsoAuthService).isAuthenticated$]`
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: SsoAuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.isAuthenticated$.pipe(
      take(1),
      map(isAuthenticated => {
        if (isAuthenticated) {
          // Check for required permissions if specified in route data
          const requiredPermissions = route.data['permissions'] as string[] | undefined;
          if (requiredPermissions && requiredPermissions.length > 0) {
            const hasPermission = this.authService.hasAnyPermission(requiredPermissions);
            if (!hasPermission) {
              return this.router.createUrlTree(['/error'], {
                queryParams: { code: '403', message: 'Insufficient permissions' }
              });
            }
          }
          return true;
        }

        // Store the attempted URL for redirecting after login
        return this.router.createUrlTree(['/login'], {
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
}
