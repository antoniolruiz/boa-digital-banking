import { TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SharedModule } from './shared/shared.module';
import { BoaUiModule } from 'boa-ui';
import { AppComponent } from './app.component';
import { SsoAuthService } from './core/auth/sso-auth.service';
import { EricaAnalyticsService } from './core/analytics/erica-analytics.service';
import { SessionTimeoutService } from './core/auth/session-timeout.service';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> { return of({}); }
}

describe('AppComponent', () => {
  beforeEach(async () => {
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
      declarations: [AppComponent],
      providers: [SsoAuthService, EricaAnalyticsService, SessionTimeoutService]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should have app title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.appTitle).toEqual('BoA Digital Banking');
  });

  it('should have navigation items', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.navItems.length).toBeGreaterThan(0);
  });
});
