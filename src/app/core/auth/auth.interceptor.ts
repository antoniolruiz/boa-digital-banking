import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { SsoAuthService } from './sso-auth.service';

/**
 * Class-based HTTP interceptor that attaches auth tokens to outgoing requests.
 * This is a migration target: Angular 15+ supports functional interceptors via
 * withInterceptors() in provideHttpClient().
 *
 * Migration: Convert to `export const authInterceptor: HttpInterceptorFn = (req, next) => { ... }`
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject = new BehaviorSubject<string | null>(null);

  constructor(private authService: SsoAuthService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip auth for public endpoints
    if (this.isPublicEndpoint(req.url)) {
      return next.handle(req);
    }

    const token = this.authService.getAccessToken();
    if (token) {
      req = this.addToken(req, token);
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private addToken(request: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'X-BOA-Client-Id': 'boa-digital-banking-spa',
        'X-BOA-Correlation-Id': this.generateCorrelationId(),
        'X-BOA-Request-Timestamp': new Date().toISOString()
      }
    });
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap(tokens => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(tokens.accessToken);
          return next.handle(this.addToken(request, tokens.accessToken));
        }),
        catchError(error => {
          this.isRefreshing = false;
          this.authService.logout();
          return throwError(() => error);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap(token => {
        return next.handle(this.addToken(request, token!));
      })
    );
  }

  private isPublicEndpoint(url: string): boolean {
    const publicPaths = [
      '/auth/',
      '/public/',
      '/health',
      '/assets/'
    ];
    return publicPaths.some(path => url.includes(path));
  }

  private generateCorrelationId(): string {
    return 'boa-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}
