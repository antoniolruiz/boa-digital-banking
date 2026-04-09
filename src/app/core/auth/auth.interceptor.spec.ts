import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { SsoAuthService } from './sso-auth.service';

describe('AuthInterceptor', () => {
  let httpClient: HttpClient;
  let httpMock: HttpTestingController;
  let mockAuthService: jasmine.SpyObj<SsoAuthService>;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('SsoAuthService', ['getAccessToken', 'refreshToken', 'logout']);
    mockAuthService.getAccessToken.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: SsoAuthService, useValue: mockAuthService },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true
        }
      ]
    });

    httpClient = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should not add Authorization header when not authenticated', () => {
    mockAuthService.getAccessToken.and.returnValue(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });

  it('should add Authorization header when authenticated', () => {
    mockAuthService.getAccessToken.and.returnValue('test-token-123');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
    req.flush({});
  });

  it('should add BOA client headers when authenticated', () => {
    mockAuthService.getAccessToken.and.returnValue('test-token');

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('X-BOA-Client-Id')).toBeTrue();
    expect(req.request.headers.get('X-BOA-Client-Id')).toBe('boa-digital-banking-spa');
    expect(req.request.headers.has('X-BOA-Correlation-Id')).toBeTrue();
    expect(req.request.headers.has('X-BOA-Request-Timestamp')).toBeTrue();
    req.flush({});
  });

  it('should skip auth for public endpoints', () => {
    mockAuthService.getAccessToken.and.returnValue('test-token');

    httpClient.get('/auth/login').subscribe();

    const req = httpMock.expectOne('/auth/login');
    expect(req.request.headers.has('Authorization')).toBeFalse();
    req.flush({});
  });
});
