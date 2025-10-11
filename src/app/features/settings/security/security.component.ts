import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { SecurityService } from './security.service';

// Custom validator for password confirmation
function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('new');
  const confirmPassword = control.get('confirm');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-settings-security',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="space-y-6">
      <!-- Change Password Form -->
      <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label" for="currentPassword">Current Password</label>
            <input id="currentPassword" type="password" class="form-input"
                   formControlName="current"
                   [class.border-red-500]="passwordForm.get('current')?.invalid && passwordForm.get('current')?.touched" />
            @if (passwordForm.get('current')?.invalid && passwordForm.get('current')?.touched) {
              <div class="mt-1 text-sm text-red-600">Current password is required</div>
            }
          </div>
          <div>
            <label class="form-label" for="newPassword">New Password</label>
            <input id="newPassword" type="password" class="form-input"
                   formControlName="new"
                   [class.border-red-500]="passwordForm.get('new')?.invalid && passwordForm.get('new')?.touched" />
            @if (passwordForm.get('new')?.invalid && passwordForm.get('new')?.touched) {
              <div class="mt-1 text-sm text-red-600">
                @for (error of passwordValidationErrors; track error) {
                  <div>{{ error }}</div>
                }
              </div>
            }
          </div>
          <div>
            <label class="form-label" for="confirmPassword">Confirm New Password</label>
            <input id="confirmPassword" type="password" class="form-input"
                   formControlName="confirm"
                   [class.border-red-500]="passwordForm.get('confirm')?.invalid && passwordForm.get('confirm')?.touched" />
            @if (passwordForm.get('confirm')?.invalid && passwordForm.get('confirm')?.touched) {
              <div class="mt-1 text-sm text-red-600">
                @if (passwordForm.get('confirm')?.errors?.['required']) {
                  <div>Please confirm your password</div>
                }
              </div>
            }
            @if (passwordForm.errors?.['passwordMismatch'] && passwordForm.get('confirm')?.touched) {
              <div class="mt-1 text-sm text-red-600">Passwords do not match</div>
            }
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button type="submit" class="btn-outline"
                  [disabled]="passwordForm.invalid || changingPassword">
            {{ changingPassword ? 'Updating...' : 'Update Password' }}
          </button>
        </div>
      </form>

      <!-- Two-Factor Authentication Form -->
      <form [formGroup]="securityForm" (ngSubmit)="onSubmit()" class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Two-Factor Authentication (2FA)</h3>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="enable2fa" />
            Enable 2FA
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4" *ngIf="securityForm.get('enable2fa')?.value">
          <div class="md:col-span-2">
            <label class="form-label" for="twoFactorMethod">Method</label>
            <select id="twoFactorMethod" class="form-input" formControlName="twoFactorMethod">
              <option value="email">Email</option>
              <option value="sms">SMS</option>
            </select>
          </div>
        </div>
        <div class="mt-4 flex justify-end">
          <button type="submit" class="btn-primary" [disabled]="saving">
            {{ saving ? 'Saving...' : 'Save Security Settings' }}
          </button>
        </div>
      </form>
    </div>

    @if (errorMessage) {
      <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <div class="text-sm text-red-600">{{ errorMessage }}</div>
      </div>
    }

    @if (successMessage) {
      <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
        <div class="text-sm text-green-600">{{ successMessage }}</div>
      </div>
    }
  `,
})
export class SecurityComponent implements OnInit, OnDestroy {
  passwordForm: FormGroup;
  securityForm: FormGroup;
  saving = false;
  changingPassword = false;
  errorMessage = '';
  successMessage = '';
  passwordValidationErrors: string[] = [];
  private passwordSub?: any;

  constructor(
    private fb: FormBuilder,
    private securityService: SecurityService
  ) {
    this.passwordForm = this.fb.group({
      current: ['', Validators.required],
      new: ['', [Validators.required, this.passwordValidator.bind(this)]],
      confirm: ['', Validators.required],
    }, { validators: passwordMatchValidator });

    this.securityForm = this.fb.group({
      enable2fa: [false],
      twoFactorMethod: ['email']
    });

    this.passwordSub = this.passwordForm.valueChanges.subscribe(() => {
      this.clearMessages();
      this.updatePasswordValidationErrors();
    });
  }

  ngOnInit() {
    this.loadSecuritySettings();

    // Set email as default when 2FA is enabled
    this.securityForm.get('enable2fa')?.valueChanges.subscribe(enabled => {
      if (enabled && !this.securityForm.get('twoFactorMethod')?.value) {
        this.securityForm.patchValue({ twoFactorMethod: 'email' });
      }
    });
  }

  async loadSecuritySettings() {
    try {
      const settings = await this.securityService.getSecuritySettings().toPromise();
      if (settings) {
        this.securityForm.patchValue({
          enable2fa: settings.enable2fa,
          twoFactorMethod: settings.twoFactorMethod
        });
      }
    } catch (error) {
      this.errorMessage = 'Failed to load security settings';
      console.error('Error loading security settings:', error);
    }
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const validation = this.securityService.validatePassword(control.value);
    return validation.isValid ? null : { invalidPassword: validation.errors };
  }

  updatePasswordValidationErrors() {
    const newPasswordControl = this.passwordForm.get('new');
    if (newPasswordControl?.errors?.['invalidPassword']) {
      this.passwordValidationErrors = newPasswordControl.errors['invalidPassword'];
    } else {
      this.passwordValidationErrors = [];
    }
  }

  async changePassword() {
    if (this.passwordForm.invalid) return;

    this.changingPassword = true;
    this.clearMessages();

    const { current, new: newPassword } = this.passwordForm.value;

    try {
      await this.securityService.changePassword({
        currentPassword: current,
        newPassword: newPassword
      }).toPromise();
      
      this.successMessage = 'Password updated successfully';
      this.passwordForm.reset();
    } catch (error: any) {
      this.errorMessage = error?.error?.error || 'Failed to update password';
      console.error('Error changing password:', error);
    } finally {
      this.changingPassword = false;
    }
  }

  async onSubmit() {
    if (this.securityForm.invalid) return;

    this.saving = true;
    this.clearMessages();

    const { enable2fa, twoFactorMethod } = this.securityForm.value;

    try {
      await this.securityService.updateSecuritySettings({
        enable2fa,
        twoFactorMethod: enable2fa ? twoFactorMethod : 'email'
      }).toPromise();

      this.successMessage = 'Security settings saved successfully';
    } catch (error) {
      this.errorMessage = 'Failed to save security settings';
      console.error('Error saving security settings:', error);
    } finally {
      this.saving = false;
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnDestroy(): void {
    this.passwordSub?.unsubscribe?.();
  }
}
