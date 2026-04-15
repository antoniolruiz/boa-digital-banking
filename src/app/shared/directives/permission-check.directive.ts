import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { SsoAuthService } from '../../core/auth/sso-auth.service';

/**
 * Structural directive that conditionally renders content based on user permissions.
 * Uses the SSO auth service to check if the current user has the required permission.
 *
 * Usage: <div *boaPermissionCheck="'accounts:write'">Only visible to authorized users</div>
 * Usage with else: <div *boaPermissionCheck="'admin'; else noAccess">Admin content</div>
 */
@Directive({
  selector: '[boaPermissionCheck]',
  standalone: true
})
export class PermissionCheckDirective implements OnInit {
  private permission = '';
  private isRendered = false;

  @Input() set boaPermissionCheck(permission: string) {
    this.permission = permission;
    this.updateView();
  }

  @Input() boaPermissionCheckElse?: TemplateRef<unknown>;

  constructor(
    private templateRef: TemplateRef<unknown>,
    private viewContainer: ViewContainerRef,
    private authService: SsoAuthService
  ) {}

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const hasPermission = this.authService.hasPermission(this.permission);

    if (hasPermission && !this.isRendered) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.isRendered = true;
    } else if (!hasPermission) {
      this.viewContainer.clear();
      if (this.boaPermissionCheckElse) {
        this.viewContainer.createEmbeddedView(this.boaPermissionCheckElse);
      }
      this.isRendered = false;
    }
  }
}
