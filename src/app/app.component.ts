import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SsoAuthService } from './core/auth/sso-auth.service';
import { SessionTimeoutService } from './core/auth/session-timeout.service';
import { EricaAnalyticsService } from './core/analytics/erica-analytics.service';
import { MeridianModalService } from 'boa-ui';
import { NavItem } from 'boa-ui';

/**
 * Root Application Component.
 * Initializes auth, analytics, session monitoring, and modal service.
 */
@Component({
  selector: 'boa-root',
  template: `
    <meridian-nav-shell
      [appTitle]="appTitle"
      [navItems]="navItems"
      (logoutClicked)="onLogout()"
      (profileClicked)="onProfile()"
      (settingsClicked)="onSettings()">

      <div meridian-header-actions>
        <button mat-icon-button matTooltip="Notifications" routerLink="/alerts">
          <mat-icon [matBadge]="alertCount > 0 ? alertCount : null" matBadgeColor="accent" matBadgeSize="small">
            notifications
          </mat-icon>
        </button>
      </div>

      <router-outlet boaPageTracking="main"></router-outlet>

      <div meridian-sidenav-footer>
        <p class="sidenav-member-since" *ngIf="memberSince">
          Member since {{ memberSince | date:'yyyy' }}
        </p>
      </div>
    </meridian-nav-shell>
  `,
  styles: [`
    .sidenav-member-since {
      font-size: 12px;
      color: #767676;
      text-align: center;
      margin: 0;
    }
  `]
})
export class AppComponent implements OnInit {
  appTitle = 'BoA Digital Banking';
  alertCount = 2;
  memberSince: string | null = null;

  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Accounts', icon: 'account_balance', route: '/accounts' },
    { label: 'Transfers & Payments', icon: 'swap_horiz', route: '/transfers' },
    { label: 'Bill Pay', icon: 'payment', route: '/bill-pay' },
    { label: 'Alerts', icon: 'notifications', route: '/alerts', badge: 2 },
    { label: 'Profile & Settings', icon: 'person', route: '/profile' },
  ];

  constructor(
    private authService: SsoAuthService,
    private sessionTimeoutService: SessionTimeoutService,
    private analyticsService: EricaAnalyticsService,
    private modalService: MeridianModalService,
    private viewContainerRef: ViewContainerRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Register ViewContainerRef for modal service (uses ComponentFactoryResolver)
    this.modalService.registerViewContainerRef(this.viewContainerRef);

    // Initialize analytics
    this.analyticsService.initialize();

    // Auto-login for demo purposes
    this.authService.login();

    // Start session monitoring after auth
    this.authService.isAuthenticated$.subscribe(isAuth => {
      if (isAuth) {
        this.sessionTimeoutService.startMonitoring();
      }
    });

    // Load user data for UI
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.memberSince = user.memberSince;
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  onProfile(): void {
    this.router.navigate(['/profile']);
  }

  onSettings(): void {
    this.router.navigate(['/profile']);
  }
}
