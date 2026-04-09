import {
  Injectable,
  ComponentFactoryResolver,
  ViewContainerRef,
  Type,
  Injector,
  ComponentRef
} from '@angular/core';
import { Subject } from 'rxjs';

export interface ModalConfig {
  title?: string;
  width?: string;
  height?: string;
  disableClose?: boolean;
  data?: unknown;
  panelClass?: string;
}

export interface ModalRef<T = unknown> {
  componentInstance: T;
  afterClosed: Subject<unknown>;
  close: (result?: unknown) => void;
}

/**
 * Meridian Modal Service - Dynamic dialog creation using ComponentFactoryResolver.
 *
 * CRITICAL MIGRATION TARGET: ComponentFactoryResolver was deprecated in Angular 13
 * and removed in Angular 16+. This service must be refactored to use ViewContainerRef.createComponent()
 * or the built-in MatDialog service directly.
 *
 * This pattern is common in enterprise Angular apps where teams built custom dialog
 * systems before MatDialog was mature enough for their needs.
 */
@Injectable({
  providedIn: 'root'
})
export class MeridianModalService {
  private viewContainerRef: ViewContainerRef | null = null;
  private activeModals: Array<ModalRef<unknown>> = [];

  // ComponentFactoryResolver is deprecated but used here intentionally
  // to demonstrate a real migration pain point
  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector
  ) {}

  /**
   * Register the root ViewContainerRef for modal rendering.
   * Called once from AppComponent.
   */
  registerViewContainerRef(vcr: ViewContainerRef): void {
    this.viewContainerRef = vcr;
  }

  /**
   * Open a modal dialog with the given component.
   * Uses ComponentFactoryResolver (deprecated) to dynamically create the component.
   *
   * @deprecated ComponentFactoryResolver usage — migrate to ViewContainerRef.createComponent()
   */
  open<T>(component: Type<T>, config: ModalConfig = {}): ModalRef<T> {
    if (!this.viewContainerRef) {
      throw new Error('MeridianModalService: ViewContainerRef not registered. Call registerViewContainerRef() in AppComponent.');
    }

    // Using deprecated ComponentFactoryResolver
    // In Angular 16+, use: this.viewContainerRef.createComponent(component)
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef: ComponentRef<T> = this.viewContainerRef.createComponent(
      componentFactory,
      undefined,
      this.createInjector(config)
    );

    const afterClosed = new Subject<unknown>();

    const modalRef: ModalRef<T> = {
      componentInstance: componentRef.instance,
      afterClosed,
      close: (result?: unknown) => {
        componentRef.destroy();
        afterClosed.next(result);
        afterClosed.complete();
        this.removeModal(modalRef);
      }
    };

    // Set data on the component if it has a 'data' property
    if (config.data && typeof componentRef.instance === 'object') {
      (componentRef.instance as Record<string, unknown>)['data'] = config.data;
    }

    this.activeModals.push(modalRef as ModalRef<unknown>);
    this.applyModalStyles(componentRef, config);

    return modalRef;
  }

  /**
   * Close all open modals
   */
  closeAll(): void {
    [...this.activeModals].forEach(modal => modal.close());
  }

  /**
   * Get the count of currently open modals
   */
  getOpenCount(): number {
    return this.activeModals.length;
  }

  private createInjector(config: ModalConfig): Injector {
    return Injector.create({
      providers: [
        { provide: 'MODAL_CONFIG', useValue: config },
        { provide: 'MODAL_DATA', useValue: config.data }
      ],
      parent: this.injector
    });
  }

  private applyModalStyles<T>(componentRef: ComponentRef<T>, config: ModalConfig): void {
    const element = componentRef.location.nativeElement as HTMLElement;
    element.classList.add('meridian-modal-container');
    if (config.panelClass) {
      element.classList.add(config.panelClass);
    }
    if (config.width) {
      element.style.width = config.width;
    }
    if (config.height) {
      element.style.height = config.height;
    }
  }

  private removeModal(modalRef: ModalRef<unknown>): void {
    const index = this.activeModals.indexOf(modalRef);
    if (index > -1) {
      this.activeModals.splice(index, 1);
    }
  }
}
