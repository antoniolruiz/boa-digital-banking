import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SsoAuthService } from '../../core/auth/sso-auth.service';
import { UserProfile } from '../../shared/models/user-profile.model';

@Component({
  selector: 'boa-profile-settings',
  template: `
    <div class="profile-container">
      <h2>Profile & Settings</h2>
      <mat-tab-group animationDuration="200ms">
        <mat-tab label="Personal Information">
          <div class="tab-content" *ngIf="user">
            <meridian-card title="Personal Details" headerIcon="person">
              <form [formGroup]="profileForm" class="profile-form">
                <div class="form-row">
                  <mat-form-field appearance="outline"><mat-label>First Name</mat-label><input matInput formControlName="firstName"></mat-form-field>
                  <mat-form-field appearance="outline"><mat-label>Last Name</mat-label><input matInput formControlName="lastName"></mat-form-field>
                </div>
                <mat-form-field appearance="outline" class="full-width"><mat-label>Email</mat-label><input matInput formControlName="email" type="email"></mat-form-field>
                <mat-form-field appearance="outline" class="full-width"><mat-label>Phone</mat-label><input matInput formControlName="phone" type="tel"></mat-form-field>
                <meridian-card title="Address" variant="outlined">
                  <mat-form-field appearance="outline" class="full-width"><mat-label>Street Address</mat-label><input matInput formControlName="addressLine1"></mat-form-field>
                  <div class="form-row">
                    <mat-form-field appearance="outline"><mat-label>City</mat-label><input matInput formControlName="city"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>State</mat-label><input matInput formControlName="state"></mat-form-field>
                    <mat-form-field appearance="outline"><mat-label>ZIP</mat-label><input matInput formControlName="zipCode"></mat-form-field>
                  </div>
                </meridian-card>
                <div class="form-actions">
                  <meridian-button variant="primary" (clicked)="saveProfile()">Save Changes</meridian-button>
                </div>
              </form>
            </meridian-card>
          </div>
        </mat-tab>
        <mat-tab label="Security"><div class="tab-content"><boa-security-settings></boa-security-settings></div></mat-tab>
        <mat-tab label="Notifications"><div class="tab-content"><boa-notification-preferences></boa-notification-preferences></div></mat-tab>
      </mat-tab-group>
    </div>
  `,
  styles: [`
    .profile-container { max-width: 800px; margin: 0 auto; }
    h2 { color: #012169; font-weight: 400; margin-bottom: 24px; }
    .tab-content { padding: 24px 0; }
    .profile-form { display: flex; flex-direction: column; gap: 8px; }
    .form-row { display: flex; gap: 16px; }
    .form-row mat-form-field { flex: 1; }
    .full-width { width: 100%; }
    .form-actions { display: flex; justify-content: flex-end; margin-top: 16px; }
  `]
})
export class ProfileSettingsComponent implements OnInit {
  user: UserProfile | null = null;
  profileForm!: FormGroup;

  constructor(private fb: FormBuilder, private authService: SsoAuthService) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      firstName: [''], lastName: [''], email: [''], phone: [''],
      addressLine1: [''], city: [''], state: [''], zipCode: ['']
    });

    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.user = user;
        this.profileForm.patchValue({
          firstName: user.firstName, lastName: user.lastName,
          email: user.email, phone: user.phone,
          addressLine1: user.address?.line1, city: user.address?.city,
          state: user.address?.state, zipCode: user.address?.zipCode
        });
      }
    });
  }

  saveProfile(): void { console.log('Profile saved:', this.profileForm.value); }
}
