import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, interval, merge, fromEvent } from 'rxjs';
import { takeUntil, switchMap, tap, startWith, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SsoAuthService } from './sso-auth.service';

export interface SessionState {
  isActive: boolean;
  lastActivity: number;
  timeoutWarningShown: boolean;
  remainingSeconds: number;
}

/**
 * Session Timeout Service
 * Monitors user activity and enforces session timeout per BoA security policy.
 *
 * Uses BehaviorSubject for session state (migration target → Signals).
 * Listens for user activity events to reset the timeout timer.
 */
@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService implements OnDestroy {
  private readonly TIMEOUT_MS = environment.sessionTimeoutMinutes * 60 * 1000;
  private readonly WARNING_THRESHOLD_MS = 2 * 60 * 1000; // Show warning 2 minutes before timeout

  private sessionStateSubject = new BehaviorSubject<SessionState>({
    isActive: false,
    lastActivity: Date.now(),
    timeoutWarningShown: false,
    remainingSeconds: environment.sessionTimeoutMinutes * 60
  });

  public sessionState$ = this.sessionStateSubject.asObservable();
  private destroy$ = new Subject<void>();
  private activityEvents$ = new Subject<void>();

  constructor(
    private authService: SsoAuthService,
    private router: Router
  ) {}

  /**
   * Start monitoring session activity.
   * Called after successful authentication.
   */
  startMonitoring(): void {
    this.resetTimer();

    // Listen for user activity events
    const activitySources$ = merge(
      fromEvent(document, 'click'),
      fromEvent(document, 'keypress'),
      fromEvent(document, 'mousemove'),
      fromEvent(document, 'scroll'),
      fromEvent(document, 'touchstart')
    );

    activitySources$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.onActivity();
    });

    // Check timeout every second
    interval(1000).pipe(
      takeUntil(this.destroy$),
      filter(() => this.sessionStateSubject.value.isActive)
    ).subscribe(() => {
      this.checkTimeout();
    });
  }

  /**
   * Stop monitoring (on logout or destruction)
   */
  stopMonitoring(): void {
    this.updateState({
      isActive: false,
      timeoutWarningShown: false
    });
  }

  /**
   * Extend the session (e.g., when user clicks "Stay Signed In" on the warning dialog)
   */
  extendSession(): void {
    this.resetTimer();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private onActivity(): void {
    const state = this.sessionStateSubject.value;
    if (state.isActive && !state.timeoutWarningShown) {
      this.resetTimer();
    }
  }

  private resetTimer(): void {
    this.updateState({
      isActive: true,
      lastActivity: Date.now(),
      timeoutWarningShown: false,
      remainingSeconds: environment.sessionTimeoutMinutes * 60
    });
  }

  private checkTimeout(): void {
    const state = this.sessionStateSubject.value;
    const elapsed = Date.now() - state.lastActivity;
    const remaining = Math.max(0, this.TIMEOUT_MS - elapsed);
    const remainingSeconds = Math.ceil(remaining / 1000);

    this.updateState({ remainingSeconds });

    if (remaining <= 0) {
      this.handleTimeout();
    } else if (remaining <= this.WARNING_THRESHOLD_MS && !state.timeoutWarningShown) {
      this.showTimeoutWarning();
    }
  }

  private showTimeoutWarning(): void {
    this.updateState({ timeoutWarningShown: true });
    // The component layer will observe this and show the dialog
  }

  private handleTimeout(): void {
    this.stopMonitoring();
    this.authService.logout();
    this.router.navigate(['/login'], {
      queryParams: { reason: 'session_timeout' }
    });
  }

  private updateState(partial: Partial<SessionState>): void {
    this.sessionStateSubject.next({
      ...this.sessionStateSubject.value,
      ...partial
    });
  }
}
