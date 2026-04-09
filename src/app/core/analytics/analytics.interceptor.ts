import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EricaAnalyticsService } from './erica-analytics.service';

/**
 * Analytics HTTP Interceptor - tracks API call timing and status.
 * Class-based interceptor pattern (migration target → functional interceptor).
 *
 * Captures request/response metrics for performance monitoring
 * via the Erica Analytics SDK.
 */
@Injectable()
export class AnalyticsInterceptor implements HttpInterceptor {

  constructor(private analyticsService: EricaAnalyticsService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Skip analytics tracking for analytics endpoint itself to avoid infinite loop
    if (req.url.includes('erica-analytics')) {
      return next.handle(req);
    }

    const startTime = Date.now();

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            this.analyticsService.trackApiCall(
              this.sanitizeUrl(req.url),
              req.method,
              duration,
              event.status
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.analyticsService.trackApiCall(
            this.sanitizeUrl(req.url),
            req.method,
            duration,
            error.status || 0
          );
        }
      })
    );
  }

  /**
   * Remove sensitive data from URLs before sending to analytics
   */
  private sanitizeUrl(url: string): string {
    // Replace account numbers, IDs, and tokens in URL paths
    return url
      .replace(/\/\d{4,}/g, '/{id}')
      .replace(/\/[a-f0-9-]{36}/gi, '/{uuid}')
      .replace(/token=[^&]+/g, 'token={redacted}')
      .replace(/key=[^&]+/g, 'key={redacted}');
  }
}
