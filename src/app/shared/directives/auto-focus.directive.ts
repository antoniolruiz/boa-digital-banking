import { Directive, ElementRef, AfterViewInit, Input } from '@angular/core';

/**
 * Automatically focuses the host element after view initialization.
 * Supports a delay parameter for elements that render asynchronously.
 *
 * Usage: <input boaAutoFocus />
 * Usage with delay: <input boaAutoFocus [autoFocusDelay]="200" />
 */
@Directive({
  selector: '[boaAutoFocus]'
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() autoFocusDelay = 0;
  @Input() autoFocusEnabled = true;

  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (!this.autoFocusEnabled) {
      return;
    }

    if (this.autoFocusDelay > 0) {
      setTimeout(() => {
        this.focusElement();
      }, this.autoFocusDelay);
    } else {
      this.focusElement();
    }
  }

  private focusElement(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    if (element && typeof element.focus === 'function') {
      element.focus();
    }
  }
}
