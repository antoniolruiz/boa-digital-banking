import { TestBed } from '@angular/core/testing';
import { Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { authGuard } from './auth.guard';
import { SsoAuthService } from './sso-auth.service';

describe('authGuard', () => {
  let isAuthenticated$: BehaviorSubject<boolean>;
  let mockAuthService: Partial<SsoAuthService>;
  let router: Router;

  beforeEach(() => {
    isAuthenticated$ = new BehaviorSubject<boolean>(false);
    mockAuthService = {
      isAuthenticated$: isAuthenticated$.asObservable(),
      hasAnyPermission: jasmine.createSpy('hasAnyPermission').and.returnValue(true)
    };

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        { provide: SsoAuthService, useValue: mockAuthService }
      ]
    });

    router = TestBed.inject(Router);
  });

  function runGuard(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return TestBed.runInInjectionContext(() => authGuard(route, state)) as Observable<boolean | UrlTree>;
  }

  it('should redirect to login when not authenticated', (done) => {
    isAuthenticated$.next(false);
    const mockRoute = { data: {} } as unknown as ActivatedRouteSnapshot;
    const mockState = { url: '/dashboard' } as RouterStateSnapshot;

    runGuard(mockRoute, mockState).subscribe(result => {
      expect(result instanceof UrlTree).toBeTrue();
      done();
    });
  });

  it('should allow access when authenticated', (done) => {
    isAuthenticated$.next(true);
    const mockRoute = { data: {} } as unknown as ActivatedRouteSnapshot;
    const mockState = { url: '/dashboard' } as RouterStateSnapshot;

    runGuard(mockRoute, mockState).subscribe(result => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should check permissions when route requires them', (done) => {
    isAuthenticated$.next(true);
    (mockAuthService.hasAnyPermission as jasmine.Spy).and.returnValue(false);

    const mockRoute = { data: { permissions: ['admin.manage'] } } as unknown as ActivatedRouteSnapshot;
    const mockState = { url: '/admin' } as RouterStateSnapshot;

    runGuard(mockRoute, mockState).subscribe(result => {
      // Should return UrlTree redirect to /error for insufficient permissions
      expect(result instanceof UrlTree).toBeTrue();
      done();
    });
  });

  it('should deny access for missing permissions', (done) => {
    isAuthenticated$.next(true);
    (mockAuthService.hasAnyPermission as jasmine.Spy).and.returnValue(false);

    const mockRoute = { data: { permissions: ['nonexistent.permission'] } } as unknown as ActivatedRouteSnapshot;
    const mockState = { url: '/restricted' } as RouterStateSnapshot;

    runGuard(mockRoute, mockState).subscribe(result => {
      expect(result).not.toBeTrue();
      done();
    });
  });
});
