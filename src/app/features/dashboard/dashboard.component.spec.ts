import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { of, Observable } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { SsoAuthService } from '../../core/auth/sso-auth.service';
import { EricaAnalyticsService } from '../../core/analytics/erica-analytics.service';
import { AccountOverviewComponent } from './account-overview.component';
import { QuickActionsComponent } from './quick-actions.component';
import { SpendingChartComponent } from './spending-chart.component';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> { return of({}); }
}

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const mockAuthService = {
    isAuthenticated$: of(true),
    currentUser$: of({ id: 'usr-001', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }),
    permissions$: of(['accounts.view', 'transfers.create']),
    hasPermission: () => true,
    hasAnyPermission: () => true,
    getAccessToken: () => 'mock-token'
  };

  beforeEach(async () => {
    sessionStorage.clear();

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        SharedModule,
        BoaUiModule,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeTranslateLoader }
        })
      ],
      declarations: [
        DashboardComponent,
        AccountOverviewComponent,
        QuickActionsComponent,
        SpendingChartComponent,
      ],
      providers: [
        { provide: SsoAuthService, useValue: mockAuthService },
        EricaAnalyticsService,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load accounts on init', () => {
    expect(component.accounts.length).toBeGreaterThan(0);
  });

  it('should clean up subscriptions on destroy', () => {
    const destroySpy = spyOn(component['destroy$'], 'next');
    component.ngOnDestroy();
    expect(destroySpy).toHaveBeenCalled();
  });
});
