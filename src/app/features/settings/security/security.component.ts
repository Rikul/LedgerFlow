import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Change Password -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div formGroupName="password" class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label" for="currentPassword">Current Password</label>
            <input id="currentPassword" type="password" class="form-input" formControlName="current" />
          </div>
          <div>
            <label class="form-label" for="newPassword">New Password</label>
            <input id="newPassword" type="password" class="form-input" formControlName="new" />
          </div>
          <div>
            <label class="form-label" for="confirmPassword">Confirm New Password</label>
            <input id="confirmPassword" type="password" class="form-input" formControlName="confirm" />
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button type="button" class="btn-outline" (click)="changePassword()">Update Password</button>
        </div>
      </div>

      <!-- Two-Factor Authentication -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Two-Factor Authentication (2FA)</h3>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="enable2fa" />
            Enable 2FA
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" *ngIf="form.get('enable2fa')?.value">
          <div class="md:col-span-2">
            <label class="form-label" for="twoFactorMethod">Method</label>
            <select id="twoFactorMethod" class="form-input" formControlName="twoFactorMethod">
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
          </div>
          <div>
            <label class="form-label" for="twoFactorPhone">Phone (if SMS)</label>
            <input id="twoFactorPhone" type="tel" class="form-input" formControlName="twoFactorPhone" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  `,
})
export class SecurityComponent implements OnDestroy {
  form: FormGroup;
  private sub?: any;

  constructor() {
    const fb = new FormBuilder();
    this.form = fb.group({
      password: fb.group({
        current: [''],
        new: [''],
        confirm: [''],
      }),
      enable2fa: [false],
      twoFactorMethod: ['authenticator'],
      twoFactorPhone: [''],
    });

    this.sub = this.form.valueChanges.subscribe(() => {
      // Placeholder for validation hooks
    });
  }

  changePassword() {
    const pwd = this.form.get('password')?.value;
    if (pwd?.new !== pwd?.confirm) {
      alert('New password and confirm password do not match.');
      return;
    }
    console.log('Password change submitted');
  }

  onSubmit() {
    console.log('Security settings saved', this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
