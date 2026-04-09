import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AnalyticsEvent {
  eventName: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
  eventValue?: number;
  timestamp: string;
  sessionId: string;
  userId?: string;
  pageUrl: string;
  properties?: Record<string, unknown>;
}

/**
 * Erica Analytics Service - erica-analytics-sdk wrapper
 * Named after BoA's virtual assistant "Erica".
 *
 * Wraps the proprietary analytics SDK for tracking user interactions,
 * page views, and business events across the digital banking platform.
 */
@Injectable({
  providedIn: 'root'
})
export class EricaAnalyticsService {
  private sessionId: string;
  private userId: string | null = null;
  private eventQueue: AnalyticsEvent[] = [];
  private isInitialized = new BehaviorSubject<boolean>(false);
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL_MS = 30000;
  private flushTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private http: HttpClient) {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Initialize the analytics service with user context
   */
  initialize(userId?: string): void {
    this.userId = userId || null;

    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }

    // Periodically flush queued events
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.FLUSH_INTERVAL_MS);

    this.isInitialized.next(true);

    if (environment.analyticsConfig.enableDebug) {
      console.log('[Erica Analytics] Initialized with session:', this.sessionId);
    }
  }

  /**
   * Track a page view event
   */
  trackPageView(pageName: string, pageUrl: string, properties?: Record<string, unknown>): void {
    this.trackEvent({
      eventName: 'page_view',
      eventCategory: 'navigation',
      eventAction: 'view',
      eventLabel: pageName,
      pageUrl,
      properties
    });
  }

  /**
   * Track a user interaction event
   */
  trackInteraction(action: string, category: string, label?: string, value?: number): void {
    this.trackEvent({
      eventName: 'user_interaction',
      eventCategory: category,
      eventAction: action,
      eventLabel: label,
      eventValue: value,
      pageUrl: window.location.href
    });
  }

  /**
   * Track a business event (transfer, payment, etc.)
   */
  trackBusinessEvent(eventName: string, properties?: Record<string, unknown>): void {
    this.trackEvent({
      eventName,
      eventCategory: 'business',
      eventAction: eventName,
      pageUrl: window.location.href,
      properties
    });
  }

  /**
   * Track an error event
   */
  trackError(errorType: string, errorMessage: string, stackTrace?: string): void {
    this.trackEvent({
      eventName: 'error',
      eventCategory: 'error',
      eventAction: errorType,
      eventLabel: errorMessage,
      pageUrl: window.location.href,
      properties: { stackTrace: stackTrace || '' }
    });
  }

  /**
   * Track API call timing
   */
  trackApiCall(endpoint: string, method: string, durationMs: number, statusCode: number): void {
    this.trackEvent({
      eventName: 'api_call',
      eventCategory: 'performance',
      eventAction: method,
      eventLabel: endpoint,
      eventValue: durationMs,
      pageUrl: window.location.href,
      properties: { statusCode, durationMs }
    });
  }

  /**
   * Flush all queued events to the analytics endpoint
   */
  flush(): Observable<unknown> {
    if (this.eventQueue.length === 0) {
      return of(null);
    }

    const events = [...this.eventQueue];
    this.eventQueue = [];

    if (environment.analyticsConfig.enableDebug) {
      console.log(`[Erica Analytics] Flushing ${events.length} events`);
    }

    // Apply sampling rate
    if (Math.random() > environment.analyticsConfig.samplingRate) {
      return of(null);
    }

    return this.http.post(environment.analyticsConfig.ericaEndpoint, { events }).pipe(
      tap(() => {
        if (environment.analyticsConfig.enableDebug) {
          console.log('[Erica Analytics] Events sent successfully');
        }
      }),
      catchError(error => {
        // Re-queue failed events
        this.eventQueue.unshift(...events);
        if (environment.analyticsConfig.enableDebug) {
          console.error('[Erica Analytics] Failed to send events:', error);
        }
        return of(null);
      })
    );
  }

  /**
   * Destroy the analytics service and flush remaining events
   */
  destroy(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
    }
    this.flush().subscribe();
    this.isInitialized.next(false);
  }

  private trackEvent(event: Partial<AnalyticsEvent>): void {
    if (!this.isInitialized.value && event.eventName !== 'page_view') {
      return;
    }

    const fullEvent: AnalyticsEvent = {
      eventName: event.eventName || 'unknown',
      eventCategory: event.eventCategory || 'general',
      eventAction: event.eventAction || 'unknown',
      eventLabel: event.eventLabel,
      eventValue: event.eventValue,
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId || undefined,
      pageUrl: event.pageUrl || window.location.href,
      properties: event.properties
    };

    this.eventQueue.push(fullEvent);

    if (this.eventQueue.length >= this.BATCH_SIZE) {
      this.flush().subscribe();
    }
  }

  private generateSessionId(): string {
    return 'boa-session-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}
