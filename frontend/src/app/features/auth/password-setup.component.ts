import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../settings/security/security.service';

function passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('new');
  const confirmPassword = control.get('confirm');
  if (!password || !confirmPassword) return null;
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

@Component({
  selector: 'app-password-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div class="w-full max-w-md p-8 rounded-xl shadow-lg bg-white flex flex-col items-center">
        <h1 class="text-3xl font-extrabold text-blue-700 mb-2 text-center">LedgerFlow</h1>
        <h2 class="text-xl font-semibold mb-6 text-center text-gray-700">Set Up Password</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6 w-full">
          <div formGroupName="password">
            <label class="form-label" for="newPassword">New Password</label>
            <input id="newPassword" type="password" class="form-input w-full" formControlName="new" />
            <div *ngIf="form.get('password.new')?.invalid && form.get('password.new')?.touched" class="mt-1 text-sm text-red-600">
              <div *ngFor="let error of passwordValidationErrors">{{ error }}</div>
            </div>
            <label class="form-label mt-4" for="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" class="form-input w-full" formControlName="confirm" />
            <div *ngIf="form.get('password.confirm')?.invalid && form.get('password.confirm')?.touched" class="mt-1 text-sm text-red-600">
              Please confirm your password
            </div>
            <div *ngIf="form.get('password')?.errors?.['passwordMismatch'] && form.get('password.confirm')?.touched" class="mt-1 text-sm text-red-600">
              Passwords do not match
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Set Password' }}
            </button>
          </div>
        </form>
        <div *ngIf="errorMessage" class="mt-4 text-sm text-red-600 text-center">{{ errorMessage }}</div>
      </div>
    </div>
  `,
})
export class PasswordSetupComponent {
  form: FormGroup;
  saving = false;
  errorMessage = '';
  passwordValidationErrors: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.form = this.fb.group({
      password: this.fb.group({
        new: ['', [Validators.required, this.passwordValidator.bind(this)]],
        confirm: ['', Validators.required],
      }, { validators: passwordMatchValidator })
    });
    this.form.valueChanges.subscribe(() => this.updatePasswordValidationErrors());
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    const validation = this.securityService.validatePassword(control.value);
    return validation.isValid ? null : { invalidPassword: validation.errors };
  }

  updatePasswordValidationErrors() {
    const newPasswordControl = this.form.get('password.new');
    if (newPasswordControl?.errors?.['invalidPassword']) {
      this.passwordValidationErrors = newPasswordControl.errors['invalidPassword'];
    } else {
      this.passwordValidationErrors = [];
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.saving = true;
    this.errorMessage = '';
    const newPassword = this.form.value.password.new;
    try {
      await this.securityService.setInitialPassword(newPassword);
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.errorMessage = 'Failed to set password';
    } finally {
      this.saving = false;
    }
  }
}
