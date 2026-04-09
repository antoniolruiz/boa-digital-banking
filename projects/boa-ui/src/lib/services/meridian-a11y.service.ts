import { Injectable } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

/**
 * Meridian Accessibility Service - manages a11y features across the design system.
 * Provides utilities for screen reader announcements, focus management,
 * and ARIA attribute helpers.
 */
@Injectable({
  providedIn: 'root'
})
export class MeridianA11yService {
  private reducedMotionQuery: MediaQueryList;

  constructor(private liveAnnouncer: LiveAnnouncer) {
    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  }

  /**
   * Announce a message to screen readers using ARIA live regions
   */
  announce(message: string, politeness: 'polite' | 'assertive' = 'polite'): Promise<void> {
    return this.liveAnnouncer.announce(message, politeness);
  }

  /**
   * Check if user prefers reduced motion
   */
  prefersReducedMotion(): boolean {
    return this.reducedMotionQuery.matches;
  }

  /**
   * Focus the first focusable element within a container
   */
  focusFirstElement(container: HTMLElement): void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }
  }

  /**
   * Trap focus within a container (for modals/dialogs)
   */
  trapFocus(container: HTMLElement): () => void {
    const focusable = this.getFocusableElements(container);
    if (focusable.length === 0) return () => {};

    const first = focusable[0] as HTMLElement;
    const last = focusable[focusable.length - 1] as HTMLElement;

    const handler = (event: KeyboardEvent): void => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          event.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          event.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handler);
    first.focus();

    return () => container.removeEventListener('keydown', handler);
  }

  /**
   * Get all focusable elements within a container
   */
  private getFocusableElements(container: HTMLElement): NodeListOf<Element> {
    return container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
  }
}
