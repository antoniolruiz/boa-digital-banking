import { TestBed, ComponentFixture } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { BoaUiModule } from 'boa-ui';

import { AlertFeedComponent } from './alert-feed.component';

class FakeTranslateLoader implements TranslateLoader {
  getTranslation(): Observable<Record<string, string>> { return of({}); }
}

describe('AlertFeedComponent', () => {
  let component: AlertFeedComponent;
  let fixture: ComponentFixture<AlertFeedComponent>;

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
      declarations: [AlertFeedComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlertFeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have mock alerts', () => {
    expect(component.alerts.length).toBeGreaterThan(0);
  });

  it('should have filtered alerts', () => {
    expect(component.filteredAlerts.length).toBeGreaterThan(0);
  });

  it('should default filter to all', () => {
    expect(component.filterSeverity).toBe('all');
  });

  it('should filter by severity', () => {
    component.filterSeverity = 'CRITICAL';
    component.filterAlerts();
    component.filteredAlerts.forEach(alert => {
      expect(alert.severity).toBe('CRITICAL');
    });
  });

  it('should show all alerts when filter is all', () => {
    component.filterSeverity = 'all';
    component.filterAlerts();
    expect(component.filteredAlerts.length).toBe(component.alerts.length);
  });

  it('should mark alert as read', () => {
    const alert = component.alerts[0];
    component.markRead(alert);
    expect(alert.isRead).toBeTrue();
  });

  it('should dismiss alert', () => {
    const initialCount = component.alerts.length;
    component.dismissAlert(component.alerts[0]);
    expect(component.alerts.length).toBe(initialCount - 1);
  });

  it('should clean up on destroy', () => {
    expect(() => component.ngOnDestroy()).not.toThrow();
  });
});
