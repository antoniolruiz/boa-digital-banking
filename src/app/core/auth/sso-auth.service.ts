import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, tap, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { UserProfile } from '../../shared/models/user-profile.model';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
  scope: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: UserProfile | null;
  tokens: AuthTokens | null;
  permissions: string[];
  loading: boolean;
  error: string | null;
}

const INITIAL_AUTH_STATE: AuthState = {
  isAuthenticated: false,
  user: null,
  tokens: null,
  permissions: [],
  loading: false,
  error: null
};

/**
 * SSO Authentication Service - boa-auth-sso
 * Implements mock OIDC/OAuth 2.0 flow for the BoA digital banking platform.
 *
 * In production, this would integrate with BoA's internal SSO provider.
 * Uses BehaviorSubject for state management (migration target → Signals in Angular 18).
 */
@Injectable({
  providedIn: 'root'
})
export class SsoAuthService {
  private authStateSubject = new BehaviorSubject<AuthState>(INITIAL_AUTH_STATE);
  public authState$ = this.authStateSubject.asObservable();

  public isAuthenticated$ = this.authState$.pipe(map(state => state.isAuthenticated));
  public currentUser$ = this.authState$.pipe(map(state => state.user));
  public permissions$ = this.authState$.pipe(map(state => state.permissions));

  private tokenRefreshTimer: ReturnType<typeof setTimeout> | null = null;

  // Default permissions for the mock user
  private readonly DEFAULT_PERMISSIONS = [
    'accounts:read',
    'accounts:write',
    'transactions:read',
    'transfers:initiate',
    'transfers:approve',
    'billpay:read',
    'billpay:write',
    'alerts:read',
    'alerts:write',
    'profile:read',
    'profile:write'
  ];

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.initializeAuth();
  }

  /**
   * Initialize authentication by checking for existing session
   */
  private initializeAuth(): void {
    const storedTokens = this.getStoredTokens();
    if (storedTokens && !this.isTokenExpired(storedTokens)) {
      this.updateState({ loading: true });
      this.fetchUserProfile(storedTokens.accessToken).subscribe({
        next: (user) => {
          this.updateState({
            isAuthenticated: true,
            user,
            tokens: storedTokens,
            permissions: this.DEFAULT_PERMISSIONS,
            loading: false,
            error: null
          });
          this.scheduleTokenRefresh(storedTokens.expiresIn);
        },
        error: () => {
          this.clearSession();
        }
      });
    }
  }

  /**
   * Initiate OIDC authorization code flow
   */
  login(returnUrl?: string): void {
    const config = environment.authConfig;
    const state = this.generateState();
    const nonce = this.generateNonce();
    const codeVerifier = this.generateCodeVerifier();

    // Store PKCE values and return URL
    sessionStorage.setItem('boa_auth_state', state);
    sessionStorage.setItem('boa_auth_nonce', nonce);
    sessionStorage.setItem('boa_code_verifier', codeVerifier);
    if (returnUrl) {
      sessionStorage.setItem('boa_return_url', returnUrl);
    }

    // For demo purposes, simulate the OIDC redirect by directly calling the token endpoint
    this.simulateOidcLogin().subscribe({
      next: (tokens) => {
        this.handleAuthSuccess(tokens);
      },
      error: (error) => {
        this.updateState({
          ...INITIAL_AUTH_STATE,
          error: error.message || 'Authentication failed'
        });
      }
    });
  }

  /**
   * Handle the OIDC callback after redirect
   */
  handleCallback(code: string, state: string): Observable<boolean> {
    const storedState = sessionStorage.getItem('boa_auth_state');
    if (state !== storedState) {
      return throwError(() => new Error('Invalid state parameter. Possible CSRF attack.'));
    }

    return this.exchangeCodeForTokens(code).pipe(
      tap(tokens => this.handleAuthSuccess(tokens)),
      map(() => true),
      catchError(error => {
        this.updateState({
          ...INITIAL_AUTH_STATE,
          error: error.message
        });
        return of(false);
      })
    );
  }

  /**
   * Logout and revoke tokens
   */
  logout(): void {
    const tokens = this.authStateSubject.value.tokens;
    if (tokens) {
      // Revoke tokens on the server (fire and forget)
      this.http.post(`${environment.authConfig.issuer}/protocol/openid-connect/revoke`, {
        token: tokens.refreshToken,
        client_id: environment.authConfig.clientId
      }).subscribe();
    }

    this.clearSession();
    this.router.navigate(['/login']);
  }

  /**
   * Refresh the access token using the refresh token
   */
  refreshToken(): Observable<AuthTokens> {
    const currentTokens = this.authStateSubject.value.tokens;
    if (!currentTokens) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<AuthTokens>(
      `${environment.authConfig.issuer}/protocol/openid-connect/token`,
      {
        grant_type: 'refresh_token',
        refresh_token: currentTokens.refreshToken,
        client_id: environment.authConfig.clientId
      }
    ).pipe(
      tap(tokens => {
        this.storeTokens(tokens);
        this.updateState({
          tokens,
          error: null
        });
        this.scheduleTokenRefresh(tokens.expiresIn);
      }),
      catchError(error => {
        this.clearSession();
        this.router.navigate(['/login']);
        return throwError(() => error);
      })
    );
  }

  /**
   * Check if the current user has a specific permission
   */
  hasPermission(permission: string): boolean {
    return this.authStateSubject.value.permissions.includes(permission);
  }

  /**
   * Check if the user has any of the specified permissions
   */
  hasAnyPermission(permissions: string[]): boolean {
    const userPermissions = this.authStateSubject.value.permissions;
    return permissions.some(p => userPermissions.includes(p));
  }

  /**
   * Get the current access token for API calls
   */
  getAccessToken(): string | null {
    return this.authStateSubject.value.tokens?.accessToken || null;
  }

  /**
   * Check if the current session is valid
   */
  isSessionValid(): boolean {
    const state = this.authStateSubject.value;
    return state.isAuthenticated && !!state.tokens && !this.isTokenExpired(state.tokens);
  }

  // --- Private Helper Methods ---

  private simulateOidcLogin(): Observable<AuthTokens> {
    // Simulate OIDC token exchange for demo
    const mockTokens: AuthTokens = {
      accessToken: 'boa_access_' + this.generateNonce(),
      refreshToken: 'boa_refresh_' + this.generateNonce(),
      idToken: 'boa_id_' + this.generateNonce(),
      expiresIn: environment.sessionTimeoutMinutes * 60,
      tokenType: 'Bearer',
      scope: environment.authConfig.scope
    };
    return of(mockTokens);
  }

  private exchangeCodeForTokens(code: string): Observable<AuthTokens> {
    const codeVerifier = sessionStorage.getItem('boa_code_verifier');
    return this.http.post<AuthTokens>(
      `${environment.authConfig.issuer}/protocol/openid-connect/token`,
      {
        grant_type: 'authorization_code',
        code,
        client_id: environment.authConfig.clientId,
        redirect_uri: environment.authConfig.redirectUri,
        code_verifier: codeVerifier
      }
    );
  }

  private fetchUserProfile(accessToken: string): Observable<UserProfile> {
    // For demo, return mock user data
    return this.http.get<UserProfile>(`${environment.apiBaseUrl}/users/me`).pipe(
      catchError(() => {
        // Fallback to mock data if API is unavailable
        return of({
          id: 'usr-001',
          customerId: 'CUST-78459201',
          firstName: 'Alexandra',
          lastName: 'Richardson',
          email: 'a.richardson@example.com',
          phone: '(704) 555-0142',
          dateOfBirth: '1985-07-22',
          ssn: '****6789',
          address: {
            line1: '4200 Gateway Blvd',
            city: 'Charlotte',
            state: 'NC',
            zipCode: '28217',
            country: 'US'
          },
          preferences: {
            language: 'en',
            timezone: 'America/New_York',
            dateFormat: 'MM/DD/YYYY',
            currencyDisplay: 'USD',
            defaultAccountId: 'acct-001',
            dashboardLayout: 'standard',
            enablePaperless: true,
            marketingOptIn: false
          },
          securitySettings: {
            mfaEnabled: true,
            mfaMethod: 'AUTHENTICATOR' as never,
            lastPasswordChange: '2023-11-15T00:00:00Z',
            trustedDevices: [],
            loginNotifications: true,
            transactionAlerts: true
          },
          enrollmentDate: '2018-03-22T00:00:00Z',
          lastLoginDate: new Date().toISOString(),
          memberSince: '2018-03-22T00:00:00Z',
          segment: 'PREFERRED_REWARDS_PLATINUM' as never
        } as UserProfile);
      })
    );
  }

  private handleAuthSuccess(tokens: AuthTokens): void {
    this.storeTokens(tokens);
    this.fetchUserProfile(tokens.accessToken).pipe(
      switchMap(user => {
        this.updateState({
          isAuthenticated: true,
          user,
          tokens,
          permissions: this.DEFAULT_PERMISSIONS,
          loading: false,
          error: null
        });
        this.scheduleTokenRefresh(tokens.expiresIn);
        return of(user);
      })
    ).subscribe();
  }

  private scheduleTokenRefresh(expiresIn: number): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    // Refresh 60 seconds before expiry
    const refreshIn = (expiresIn - 60) * 1000;
    if (refreshIn > 0) {
      this.tokenRefreshTimer = setTimeout(() => {
        this.refreshToken().subscribe();
      }, refreshIn);
    }
  }

  private storeTokens(tokens: AuthTokens): void {
    sessionStorage.setItem('boa_tokens', JSON.stringify(tokens));
    sessionStorage.setItem('boa_token_expiry', String(Date.now() + tokens.expiresIn * 1000));
  }

  private getStoredTokens(): AuthTokens | null {
    const stored = sessionStorage.getItem('boa_tokens');
    return stored ? JSON.parse(stored) : null;
  }

  private isTokenExpired(tokens: AuthTokens): boolean {
    const expiry = sessionStorage.getItem('boa_token_expiry');
    if (!expiry) return true;
    return Date.now() > Number(expiry);
  }

  private clearSession(): void {
    if (this.tokenRefreshTimer) {
      clearTimeout(this.tokenRefreshTimer);
    }
    sessionStorage.removeItem('boa_tokens');
    sessionStorage.removeItem('boa_token_expiry');
    sessionStorage.removeItem('boa_auth_state');
    sessionStorage.removeItem('boa_auth_nonce');
    sessionStorage.removeItem('boa_code_verifier');
    sessionStorage.removeItem('boa_return_url');
    this.updateState(INITIAL_AUTH_STATE);
  }

  private updateState(partial: Partial<AuthState>): void {
    this.authStateSubject.next({
      ...this.authStateSubject.value,
      ...partial
    });
  }

  private generateState(): string {
    return this.randomString(32);
  }

  private generateNonce(): string {
    return this.randomString(32);
  }

  private generateCodeVerifier(): string {
    return this.randomString(64);
  }

  private randomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}
