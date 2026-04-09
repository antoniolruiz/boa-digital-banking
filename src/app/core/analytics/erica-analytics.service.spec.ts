import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EricaAnalyticsService } from './erica-analytics.service';

describe('EricaAnalyticsService', () => {
  let service: EricaAnalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EricaAnalyticsService]
    });
    service = TestBed.inject(EricaAnalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize analytics SDK', () => {
    expect(() => service.initialize()).not.toThrow();
  });

  it('should track page views', () => {
    service.initialize();
    expect(() => service.trackPageView('/dashboard', 'Dashboard')).not.toThrow();
  });

  it('should track interactions', () => {
    service.initialize();
    expect(() => service.trackInteraction('click', 'button', 'Transfer Money')).not.toThrow();
  });

  it('should track business events', () => {
    service.initialize();
    expect(() => service.trackBusinessEvent('transfer_initiated', { amount: 500 })).not.toThrow();
  });

  it('should track errors', () => {
    service.initialize();
    expect(() => service.trackError('TypeError', 'Something went wrong')).not.toThrow();
  });

  it('should not throw when tracking before initialization', () => {
    expect(() => service.trackPageView('/test', 'Test')).not.toThrow();
  });
});
