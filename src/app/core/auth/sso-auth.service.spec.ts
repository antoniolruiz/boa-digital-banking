import { TestBed, fakeAsync, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SsoAuthService } from './sso-auth.service';

describe('SsoAuthService', () => {
  let service: SsoAuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    // Clear sessionStorage to prevent initializeAuth from making HTTP calls
    sessionStorage.clear();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      providers: [SsoAuthService]
    });
    service = TestBed.inject(SsoAuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => {
    // Flush any pending requests
    httpMock.match(() => true).forEach(req => req.flush({}));
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize as not authenticated', () => {
    let isAuth = false;
    service.isAuthenticated$.subscribe((val: boolean) => isAuth = val);
    expect(isAuth).toBeFalse();
  });

  it('should have null user initially', () => {
    let user: unknown = 'not-null';
    service.currentUser$.subscribe((val: unknown) => user = val);
    expect(user).toBeNull();
  });

  it('should have empty permissions initially', () => {
    let perms: string[] = ['something'];
    service.permissions$.subscribe((val: string[]) => perms = val);
    expect(perms).toEqual([]);
  });

  it('should authenticate user on login', fakeAsync(() => {
    service.login();
    tick();

    const profileReq = httpMock.expectOne(req => req.url.includes('/users/me'));
    profileReq.flush({
      id: 'usr-001',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com'
    });
    tick();

    let isAuth = false;
    service.isAuthenticated$.subscribe((val: boolean) => isAuth = val);
    expect(isAuth).toBeTrue();

    // Clean up: logout clears the scheduleTokenRefresh timer
    service.logout();
    httpMock.match(() => true).forEach(r => r.flush({}));
  }));

  it('should set permissions on login', fakeAsync(() => {
    service.login();
    tick();

    const profileReq = httpMock.expectOne(req => req.url.includes('/users/me'));
    profileReq.flush({});
    tick();

    let perms: string[] = [];
    service.permissions$.subscribe((val: string[]) => perms = val);
    expect(perms.length).toBeGreaterThan(0);
    expect(perms).toContain('accounts:read');
    expect(perms).toContain('transfers:initiate');

    service.logout();
    httpMock.match(() => true).forEach(r => r.flush({}));
  }));

  it('should clear state on logout', fakeAsync(() => {
    service.login();
    tick();

    const profileReq = httpMock.expectOne(req => req.url.includes('/users/me'));
    profileReq.flush({});
    tick();

    service.logout();
    httpMock.match(() => true).forEach(r => r.flush({}));
    tick();

    let isAuth = true;
    service.isAuthenticated$.subscribe((val: boolean) => isAuth = val);
    expect(isAuth).toBeFalse();
  }));

  it('should check permissions correctly after login', fakeAsync(() => {
    service.login();
    tick();

    const profileReq = httpMock.expectOne(req => req.url.includes('/users/me'));
    profileReq.flush({});
    tick();

    expect(service.hasPermission('accounts:read')).toBeTrue();
    expect(service.hasPermission('admin:nuclear-launch')).toBeFalse();

    service.logout();
    httpMock.match(() => true).forEach(r => r.flush({}));
  }));

  it('should check hasAnyPermission', fakeAsync(() => {
    service.login();
    tick();

    const profileReq = httpMock.expectOne(req => req.url.includes('/users/me'));
    profileReq.flush({});
    tick();

    expect(service.hasAnyPermission(['accounts:read', 'nonexistent'])).toBeTrue();
    expect(service.hasAnyPermission(['nonexistent', 'also-nonexistent'])).toBeFalse();

    service.logout();
    httpMock.match(() => true).forEach(r => r.flush({}));
  }));
});
