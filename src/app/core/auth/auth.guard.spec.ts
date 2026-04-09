import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { SsoAuthService } from './sso-auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let isAuthenticated$: BehaviorSubject<boolean>;
  let mockAuthService: Partial<SsoAuthService>;

  beforeEach(() => {
    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    mockAuthService = {
      isAuthenticated$: isAuthenticated$.asObservable(),
      hasAnyPermission: jasmine.createSpy('hasAnyPermission').and.returnValue(true)
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: SsoAuthService, useValue: mockAuthService }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should redirect to login when not authenticated', (done) => {
    isAuthenticated$.next(false);
    const mockRoute = { data: {} } as any;
    const mockState = { url: '/dashboard' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      done();
    });
  });

  it('should allow access when authenticated', (done) => {
    isAuthenticated$.next(true);
    const mockRoute = { data: {} } as any;
    const mockState = { url: '/dashboard' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should check permissions when route requires them', (done) => {
    isAuthenticated$.next(true);
    (mockAuthService.hasAnyPermission as jasmine.Spy).and.returnValue(false);

    const mockRoute = { data: { permissions: ['admin.manage'] } } as any;
    const mockState = { url: '/admin' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(result => {
      // Should return UrlTree redirect to /error for insufficient permissions
      expect(result instanceof UrlTree).toBeTrue();
      done();
    });
  });

  it('should deny access for missing permissions', (done) => {
    isAuthenticated$.next(true);
    (mockAuthService.hasAnyPermission as jasmine.Spy).and.returnValue(false);

    const mockRoute = { data: { permissions: ['nonexistent.permission'] } } as any;
    const mockState = { url: '/restricted' } as any;

    guard.canActivate(mockRoute, mockState).subscribe(result => {
      expect(result).not.toBeTrue();
      done();
    });
  });
});
