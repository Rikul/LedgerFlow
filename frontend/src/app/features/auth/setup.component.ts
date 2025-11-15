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
  selector: 'app-setup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div class="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
        <div class="flex flex-col items-center">
          <h1 class="text-3xl font-extrabold text-blue-700 mb-2 text-center">LedgerFlow</h1>
          <h2 class="text-xl font-semibold mb-6 text-center text-gray-700">Set Up Your Account</h2>
        </div>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6 w-full">
          <div *ngIf="!passwordIsSet">
            <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">1. Company Information</h3>
            <div formGroupName="company">
              <label class="form-label" for="companyName">Company Name</label>
              <input id="companyName" type="text" class="form-input w-full" formControlName="name" />
              <label class="form-label mt-4" for="contactEmail">Contact Email</label>
              <input id="contactEmail" type="email" class="form-input w-full" formControlName="contactEmail" />
              <label class="form-label mt-4" for="companyPhone">Company Phone</label>
              <input id="companyPhone" type="tel" class="form-input w-full" formControlName="companyPhone" />
              <div formGroupName="mailing">
                <h4 class="text-md font-semibold text-gray-700 mt-4">Mailing Address</h4>
                <label class="form-label" for="mailingAddress1">Address 1</label>
                <input id="mailingAddress1" type="text" class="form-input w-full" formControlName="address1" />
                <label class="form-label mt-4" for="mailingAddress2">Address 2</label>
                <input id="mailingAddress2" type="text" class="form-input w-full" formControlName="address2" />
                <label class="form-label mt-4" for="mailingCity">City</label>
                <input id="mailingCity" type="text" class="form-input w-full" formControlName="city" />
                <label class="form-label mt-4" for="mailingState">State</label>
                <input id="mailingState" type="text" class="form-input w-full" formControlName="state" />
                <label class="form-label mt-4" for="mailingPostalCode">Postal Code</label>
                <input id="mailingPostalCode" type="text" class="form-input w-full" formControlName="postalCode" />
                <label class="form-label mt-4" for="mailingCountry">Country</label>
                <input id="mailingCountry" type="text" class="form-input w-full" formControlName="country" />
              </div>
            </div>
          </div>

          <div *ngIf="!passwordIsSet">
            <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">2. Set Your Password</h3>
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
          </div>
          <div *ngIf="passwordIsSet">
            <h3 class="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Password Set!</h3>
            <p class="text-center">Your password has been set. You will be redirected to the dashboard.</p>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || saving">
              {{ saving ? 'Saving...' : 'Save and Continue' }}
            </button>
          </div>
        </form>
        <div *ngIf="errorMessage" class="mt-4 text-sm text-red-600 text-center">{{ errorMessage }}</div>
      </div>
    </div>
  `,
})
export class SetupComponent {
  form: FormGroup;
  saving = false;
  errorMessage = '';
  passwordValidationErrors: string[] = [];
  passwordIsSet = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.form = this.fb.group({
      password: this.fb.group({
        new: ['', [Validators.required, this.passwordValidator.bind(this)]],
        confirm: ['', Validators.required],
      }, { validators: passwordMatchValidator }),
      company: this.fb.group({
        name: ['', Validators.required],
        contactEmail: [''],
        companyPhone: [''],
        mailing: this.fb.group({
          address1: [''],
          address2: [''],
          city: [''],
          state: [''],
          postalCode: [''],
          country: [''],
        }),
      })
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
    const { new: newPassword } = this.form.value.password;
    const company = this.form.value.company;
    try {
      await this.securityService.initialSetup(newPassword, company);
      this.passwordIsSet = true;
      this.router.navigate(['/dashboard']);
    } catch (err) {
      this.errorMessage = 'Failed to set password or save company information';
    } finally {
      this.saving = false;
    }
  }
}
