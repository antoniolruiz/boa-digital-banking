import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { EricaAnalyticsService } from '../analytics/erica-analytics.service';

/**
 * Global Error Handler for the BoA Digital Banking application.
 * Implements Angular's ErrorHandler interface to catch unhandled errors
 * across the application and route them to analytics + error pages.
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  // Use Injector to avoid circular dependency with Router and Analytics
  constructor(private injector: Injector) {}

  handleError(error: Error | HttpErrorResponse): void {
    const router = this.injector.get(Router);
    const analyticsService = this.injector.get(EricaAnalyticsService);

    let errorMessage: string;
    let errorType: string;
    let statusCode: number | undefined;

    if (error instanceof HttpErrorResponse) {
      // Server-side error
      errorType = 'http_error';
      statusCode = error.status;
      errorMessage = this.getHttpErrorMessage(error);

      // Track the error
      analyticsService.trackError(errorType, errorMessage, JSON.stringify({
        url: error.url,
        status: error.status,
        statusText: error.statusText
      }));

      // Navigate to error page for certain status codes
      if (error.status === 0) {
        router.navigate(['/error'], {
          queryParams: { code: '0', message: 'Unable to connect to the server' }
        });
      } else if (error.status === 503) {
        router.navigate(['/error'], {
          queryParams: { code: '503', message: 'Service temporarily unavailable' }
        });
      }
    } else {
      // Client-side error
      errorType = 'client_error';
      errorMessage = error.message || 'An unexpected error occurred';

      analyticsService.trackError(
        errorType,
        errorMessage,
        error.stack
      );

      // Log to console in development
      console.error('[BoA Error Handler]', error);
    }
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Network connectivity issue - unable to reach server';
      case 400:
        return `Bad Request: ${error.error?.message || 'Invalid request'}`;
      case 401:
        return 'Unauthorized - session may have expired';
      case 403:
        return 'Access denied - insufficient permissions';
      case 404:
        return `Resource not found: ${error.url}`;
      case 408:
        return 'Request timeout';
      case 429:
        return 'Too many requests - please try again later';
      case 500:
        return 'Internal server error';
      case 502:
        return 'Bad gateway';
      case 503:
        return 'Service unavailable - maintenance may be in progress';
      default:
        return `HTTP Error ${error.status}: ${error.statusText}`;
    }
  }
}
