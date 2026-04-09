import { Directive, ElementRef, EventEmitter, HostListener, Output } from '@angular/core';

/**
 * Detects clicks outside the host element.
 * Used for closing dropdowns, menus, and popover components.
 *
 * Usage: <div boaClickOutside (clickOutside)="onClose()">
 */
@Directive({
  selector: '[boaClickOutside]'
})
export class ClickOutsideDirective {
  @Output() boaClickOutside = new EventEmitter<MouseEvent>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetElement = event.target as HTMLElement;

    if (targetElement && !this.elementRef.nativeElement.contains(targetElement)) {
      this.boaClickOutside.emit(event);
    }
  }
}
