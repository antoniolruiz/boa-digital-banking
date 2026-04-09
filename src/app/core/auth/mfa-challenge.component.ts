import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SsoAuthService } from './sso-auth.service';

/**
 * MFA Challenge Component - presented after initial SSO authentication
 * when the user's security settings require multi-factor verification.
 */
@Component({
  selector: 'boa-mfa-challenge',
  template: `
    <div class="mfa-container">
      <div class="mfa-card">
        <div class="mfa-header">
          <mat-icon class="mfa-icon">security</mat-icon>
          <h2>Verify Your Identity</h2>
          <p class="mfa-subtitle">
            For your security, we need to verify your identity.
            A verification code has been sent to your {{ mfaMethod }}.
          </p>
        </div>

        <form (ngSubmit)="verifyCode()" class="mfa-form">
          <mat-form-field appearance="outline" class="mfa-input">
            <mat-label>Verification Code</mat-label>
            <input matInput
                   [formControl]="verificationCode"
                   maxlength="6"
                   placeholder="Enter 6-digit code"
                   autocomplete="one-time-code"
                   inputmode="numeric">
            <mat-error *ngIf="verificationCode.hasError('required')">
              Verification code is required
            </mat-error>
            <mat-error *ngIf="verificationCode.hasError('pattern')">
              Code must be 6 digits
            </mat-error>
          </mat-form-field>

          <div class="mfa-error" *ngIf="errorMessage">
            <mat-icon>error_outline</mat-icon>
            <span>{{ errorMessage }}</span>
          </div>

          <button mat-raised-button color="primary"
                  type="submit"
                  [disabled]="verificationCode.invalid || isVerifying"
                  class="mfa-submit">
            <mat-icon *ngIf="isVerifying">
              <mat-spinner diameter="20"></mat-spinner>
            </mat-icon>
            {{ isVerifying ? 'Verifying...' : 'Verify' }}
          </button>

          <div class="mfa-actions">
            <button mat-button type="button" (click)="resendCode()" [disabled]="resendCooldown > 0">
              {{ resendCooldown > 0 ? 'Resend code in ' + resendCooldown + 's' : 'Resend Code' }}
            </button>
            <button mat-button type="button" (click)="useAlternateMethod()">
              Try a different method
            </button>
          </div>
        </form>

        <div class="mfa-footer">
          <button mat-button (click)="cancelAuth()">
            <mat-icon>arrow_back</mat-icon>
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .mfa-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }

    .mfa-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 420px;
      width: 100%;
    }

    .mfa-header {
      text-align: center;
      margin-bottom: 32px;
    }

    .mfa-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #012169;
    }

    .mfa-subtitle {
      color: #767676;
      font-size: 14px;
      line-height: 1.5;
    }

    .mfa-form {
      display: flex;
      flex-direction: column;
    }

    .mfa-input {
      width: 100%;
    }

    .mfa-error {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #C62828;
      margin-bottom: 16px;
      font-size: 14px;
    }

    .mfa-submit {
      margin-bottom: 16px;
      padding: 8px 0;
    }

    .mfa-actions {
      display: flex;
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .mfa-footer {
      text-align: center;
      border-top: 1px solid #e0e0e0;
      padding-top: 16px;
    }
  `]
})
export class MfaChallengeComponent implements OnInit, OnDestroy {
  verificationCode = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{6}$/)
  ]);

  mfaMethod = 'authenticator app';
  isVerifying = false;
  errorMessage = '';
  resendCooldown = 0;
  private destroy$ = new Subject<void>();
  private cooldownTimer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private authService: SsoAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user?.securitySettings?.mfaMethod) {
        this.mfaMethod = this.getMfaMethodLabel(user.securitySettings.mfaMethod);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.cooldownTimer) {
      clearInterval(this.cooldownTimer);
    }
  }

  verifyCode(): void {
    if (this.verificationCode.invalid) return;

    this.isVerifying = true;
    this.errorMessage = '';

    // Simulate MFA verification (in production, this calls the auth server)
    setTimeout(() => {
      const code = this.verificationCode.value;
      if (code === '123456' || code === '000000') {
        // Demo: accept these codes
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Invalid verification code. Please try again.';
      }
      this.isVerifying = false;
    }, 1500);
  }

  resendCode(): void {
    this.resendCooldown = 60;
    this.cooldownTimer = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0 && this.cooldownTimer) {
        clearInterval(this.cooldownTimer);
      }
    }, 1000);
  }

  useAlternateMethod(): void {
    // In production, this would show alternative MFA options
    this.mfaMethod = 'email';
  }

  cancelAuth(): void {
    this.authService.logout();
  }

  private getMfaMethodLabel(method: string): string {
    const labels: Record<string, string> = {
      'SMS': 'phone (SMS)',
      'EMAIL': 'email',
      'AUTHENTICATOR': 'authenticator app',
      'SECURITY_KEY': 'security key'
    };
    return labels[method] || method;
  }
}
