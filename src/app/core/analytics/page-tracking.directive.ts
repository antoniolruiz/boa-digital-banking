import { Directive, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { EricaAnalyticsService } from './erica-analytics.service';

/**
 * Page tracking directive for automatic analytics on route changes.
 * Applied to the app-root or router-outlet container.
 *
 * Usage: <router-outlet boaPageTracking></router-outlet>
 */
@Directive({
  selector: '[boaPageTracking]'
})
export class PageTrackingDirective implements OnInit, OnDestroy {
  @Input() boaPageTracking = '';
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private analyticsService: EricaAnalyticsService
  ) {}

  ngOnInit(): void {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(event => {
      const pageName = this.extractPageName(event.urlAfterRedirects);
      this.analyticsService.trackPageView(pageName, event.urlAfterRedirects, {
        previousUrl: event.url !== event.urlAfterRedirects ? event.url : undefined,
        sectionName: this.boaPageTracking || undefined
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private extractPageName(url: string): string {
    const pathSegments = url.split('/').filter(s => s && !s.startsWith('?'));
    if (pathSegments.length === 0) {
      return 'Home';
    }
    return pathSegments
      .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' > ');
  }
}
