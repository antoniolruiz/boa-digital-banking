import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: number;
  children?: NavItem[];
  permissions?: string[];
}

/**
 * Meridian Nav Shell - Application shell with header, sidebar, and footer.
 * Provides the standard BoA navigation layout.
 */
@Component({
  selector: 'meridian-nav-shell',
  template: `
    <div class="meridian-shell">
      <!-- Top Header Bar -->
      <mat-toolbar class="meridian-header" color="primary">
        <button mat-icon-button (click)="toggleSidenav()" aria-label="Toggle navigation">
          <mat-icon>menu</mat-icon>
        </button>
        <span class="meridian-logo">{{ appTitle }}</span>
        <span class="meridian-spacer"></span>
        <ng-content select="[meridian-header-actions]"></ng-content>
        <button mat-icon-button [matMenuTriggerFor]="userMenu" aria-label="User menu">
          <mat-icon>account_circle</mat-icon>
        </button>
        <mat-menu #userMenu="matMenu">
          <button mat-menu-item (click)="profileClicked.emit()">
            <mat-icon>person</mat-icon>
            <span>Profile</span>
          </button>
          <button mat-menu-item (click)="settingsClicked.emit()">
            <mat-icon>settings</mat-icon>
            <span>Settings</span>
          </button>
          <mat-divider></mat-divider>
          <button mat-menu-item (click)="logoutClicked.emit()">
            <mat-icon>exit_to_app</mat-icon>
            <span>Sign Out</span>
          </button>
        </mat-menu>
      </mat-toolbar>

      <!-- Main Content Area with Sidenav -->
      <mat-sidenav-container class="meridian-sidenav-container">
        <mat-sidenav #sidenav
                     [mode]="(isHandset$ | async) ? 'over' : 'side'"
                     [opened]="!(isHandset$ | async)"
                     class="meridian-sidenav">
          <mat-nav-list>
            <ng-container *ngFor="let item of navItems">
              <a mat-list-item
                 [routerLink]="item.route"
                 routerLinkActive="active"
                 [routerLinkActiveOptions]="{ exact: item.route === '/dashboard' }"
                 (click)="onNavItemClick(item)">
                <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                <span matListItemTitle>{{ item.label }}</span>
                <span *ngIf="item.badge" matBadge="{{ item.badge }}" matBadgeColor="accent" matBadgeSize="small"></span>
              </a>
            </ng-container>
          </mat-nav-list>

          <div class="meridian-sidenav-footer">
            <mat-divider></mat-divider>
            <div class="meridian-sidenav-footer-content">
              <ng-content select="[meridian-sidenav-footer]"></ng-content>
            </div>
          </div>
        </mat-sidenav>

        <mat-sidenav-content class="meridian-content">
          <ng-content></ng-content>
        </mat-sidenav-content>
      </mat-sidenav-container>

      <!-- Footer -->
      <footer class="meridian-footer" *ngIf="showFooter">
        <div class="meridian-footer-content">
          <span>{{ footerText }}</span>
          <span class="meridian-footer-links">
            <a href="javascript:void(0)">Privacy</a> |
            <a href="javascript:void(0)">Security</a> |
            <a href="javascript:void(0)">Terms</a> |
            <a href="javascript:void(0)">Accessibility</a>
          </span>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .meridian-shell {
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    .meridian-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background-color: #012169;
    }

    .meridian-logo {
      font-size: 20px;
      font-weight: 500;
      margin-left: 8px;
      letter-spacing: 0.5px;
    }

    .meridian-spacer {
      flex: 1 1 auto;
    }

    .meridian-sidenav-container {
      flex: 1;
    }

    .meridian-sidenav {
      width: 260px;
      background-color: white;
      border-right: 1px solid #D1D1D1;
    }

    .meridian-sidenav .active {
      background-color: rgba(1, 33, 105, 0.08);
      color: #012169;
      font-weight: 500;
    }

    .meridian-sidenav-footer {
      position: absolute;
      bottom: 0;
      width: 100%;
    }

    .meridian-sidenav-footer-content {
      padding: 16px;
    }

    .meridian-content {
      padding: 24px;
      background-color: #F5F5F5;
      min-height: calc(100vh - 64px);
    }

    .meridian-footer {
      background-color: #012169;
      color: white;
      padding: 16px 24px;
      font-size: 13px;
    }

    .meridian-footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .meridian-footer-links a {
      color: white;
      text-decoration: none;
      margin: 0 4px;
      &:hover { text-decoration: underline; }
    }
  `]
})
export class MeridianNavShellComponent {
  @Input() appTitle = 'Digital Banking';
  @Input() navItems: NavItem[] = [];
  @Input() showFooter = true;
  @Input() footerText = '© 2024 Demo Banking Application. All rights reserved.';

  @Output() profileClicked = new EventEmitter<void>();
  @Output() settingsClicked = new EventEmitter<void>();
  @Output() logoutClicked = new EventEmitter<void>();
  @Output() navItemSelected = new EventEmitter<NavItem>();

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset$: Observable<boolean>;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    );
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
  }

  onNavItemClick(item: NavItem): void {
    this.navItemSelected.emit(item);
    // Auto-close sidenav on mobile
    this.isHandset$.subscribe(isHandset => {
      if (isHandset) {
        this.sidenav.close();
      }
    });
  }
}
