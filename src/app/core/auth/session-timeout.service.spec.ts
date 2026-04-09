import { TestBed } from '@angular/core/testing';
import { SessionTimeoutService } from './session-timeout.service';
import { SsoAuthService } from './sso-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('SessionTimeoutService', () => {
  let service: SessionTimeoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [SessionTimeoutService, SsoAuthService]
    });
    service = TestBed.inject(SessionTimeoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should start monitoring', () => {
    expect(() => service.startMonitoring()).not.toThrow();
  });

  it('should stop monitoring', () => {
    service.startMonitoring();
    expect(() => service.stopMonitoring()).not.toThrow();
  });

  it('should extend session', () => {
    service.startMonitoring();
    expect(() => service.extendSession()).not.toThrow();
  });

  it('should have session state observable', () => {
    let state: unknown = null;
    service.sessionState$.subscribe((val: unknown) => state = val);
    expect(state).toBeTruthy();
  });

  it('should start as inactive', () => {
    let isActive = true;
    service.sessionState$.subscribe((val: { isActive: boolean }) => isActive = val.isActive);
    expect(isActive).toBeFalse();
  });

  it('should become active after startMonitoring', () => {
    service.startMonitoring();
    let isActive = false;
    service.sessionState$.subscribe((val: { isActive: boolean }) => isActive = val.isActive);
    expect(isActive).toBeTrue();
  });

  it('should clean up on destroy', () => {
    service.startMonitoring();
    expect(() => service.ngOnDestroy()).not.toThrow();
  });
});
