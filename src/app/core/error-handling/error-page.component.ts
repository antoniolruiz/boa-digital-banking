import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

/**
 * Error Page Component - displays user-friendly error messages
 * for HTTP errors and unhandled exceptions.
 */
@Component({
  selector: 'boa-error-page',
  template: `
    <div class="error-page">
      <div class="error-content">
        <div class="error-icon-container">
          <mat-icon class="error-icon">{{ getErrorIcon() }}</mat-icon>
        </div>

        <h1 class="error-code">{{ errorCode }}</h1>
        <h2 class="error-title">{{ getErrorTitle() }}</h2>
        <p class="error-message">{{ errorMessage }}</p>

        <div class="error-actions">
          <button mat-raised-button color="primary" (click)="goHome()">
            <mat-icon>home</mat-icon>
            Go to Dashboard
          </button>
          <button mat-stroked-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            Go Back
          </button>
          <button mat-stroked-button (click)="retry()" *ngIf="canRetry">
            <mat-icon>refresh</mat-icon>
            Try Again
          </button>
        </div>

        <div class="error-help">
          <p>If this problem persists, please contact support:</p>
          <p class="error-phone">1-800-432-1000</p>
          <p class="error-ref">Reference: {{ referenceId }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 24px;
    }

    .error-content {
      text-align: center;
      max-width: 500px;
    }

    .error-icon-container {
      margin-bottom: 16px;
    }

    .error-icon {
      font-size: 72px;
      width: 72px;
      height: 72px;
      color: #DC1431;
    }

    .error-code {
      font-size: 64px;
      font-weight: 300;
      color: #012169;
      margin: 0;
    }

    .error-title {
      font-size: 24px;
      color: #333;
      margin: 8px 0 16px;
    }

    .error-message {
      color: #767676;
      font-size: 16px;
      line-height: 1.5;
      margin-bottom: 32px;
    }

    .error-actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 32px;
    }

    .error-help {
      color: #767676;
      font-size: 14px;
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
    }

    .error-phone {
      font-size: 18px;
      font-weight: 500;
      color: #012169;
    }

    .error-ref {
      font-size: 12px;
      font-family: monospace;
    }
  `]
})
export class ErrorPageComponent implements OnInit {
  errorCode = '500';
  errorMessage = 'An unexpected error occurred. Please try again later.';
  canRetry = true;
  referenceId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.referenceId = 'ERR-' + Date.now().toString(36).toUpperCase();
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['code']) {
        this.errorCode = params['code'];
      }
      if (params['message']) {
        this.errorMessage = params['message'];
      }
    });
  }

  getErrorIcon(): string {
    switch (this.errorCode) {
      case '403': return 'lock';
      case '404': return 'search_off';
      case '503': return 'engineering';
      case '0': return 'wifi_off';
      default: return 'error_outline';
    }
  }

  getErrorTitle(): string {
    switch (this.errorCode) {
      case '403': return 'Access Denied';
      case '404': return 'Page Not Found';
      case '503': return 'Service Unavailable';
      case '0': return 'Connection Error';
      default: return 'Something Went Wrong';
    }
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  goBack(): void {
    window.history.back();
  }

  retry(): void {
    window.location.reload();
  }
}
