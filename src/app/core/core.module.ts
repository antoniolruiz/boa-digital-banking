import { NgModule, Optional, SkipSelf, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

// Angular Material 14 imports for core components
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ReactiveFormsModule } from '@angular/forms';

// Auth
import { SsoAuthService } from './auth/sso-auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MfaChallengeComponent } from './auth/mfa-challenge.component';
import { SessionTimeoutService } from './auth/session-timeout.service';

// Analytics
import { EricaAnalyticsService } from './analytics/erica-analytics.service';
import { PageTrackingDirective } from './analytics/page-tracking.directive';
import { AnalyticsInterceptor } from './analytics/analytics.interceptor';

// Error Handling
import { GlobalErrorHandler } from './error-handling/global-error-handler';
import { ErrorPageComponent } from './error-handling/error-page.component';

/**
 * CoreModule - provides singleton services and app-wide components.
 * Uses the forRoot() pattern to ensure services are only provided once.
 *
 * This is a classic Angular 14 pattern:
 * - HttpClientModule imported here (deprecated in Angular 18, use provideHttpClient())
 * - HTTP_INTERCEPTORS multi-provider for class-based interceptors
 * - entryComponents array (ViewEngine artifact, no-op with Ivy but present in legacy code)
 */
@NgModule({
  declarations: [
    MfaChallengeComponent,
    ErrorPageComponent,
    PageTrackingDirective,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MfaChallengeComponent,
    ErrorPageComponent,
    PageTrackingDirective,
  ],
  // entryComponents is a ViewEngine-era artifact.
  // It's a no-op with Ivy but present in many Angular 14 codebases.
  entryComponents: [
    MfaChallengeComponent,
    ErrorPageComponent,
  ],
  providers: [
    // Class-based HTTP interceptors - migration target for Angular 15+
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AnalyticsInterceptor,
      multi: true
    },
    // Custom ErrorHandler
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
  ]
})
export class CoreModule {
  /**
   * Guard against re-importing CoreModule.
   * Classic Angular pattern to ensure singleton services.
   */
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it only in AppModule using CoreModule.forRoot().'
      );
    }
  }

  /**
   * forRoot() pattern for providing singleton services with configuration.
   * Migration target: In Angular 18, these would use providedIn: 'root'
   * or provideXxx() functions.
   */
  static forRoot(): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule,
      providers: [
        SsoAuthService,
        AuthGuard,
        SessionTimeoutService,
        EricaAnalyticsService,
      ]
    };
  }
}
