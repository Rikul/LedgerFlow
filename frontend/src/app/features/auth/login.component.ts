import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SecurityService } from '../settings/security/security.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div class="w-full max-w-md p-8 rounded-xl shadow-lg bg-white flex flex-col items-center">
        <h1 class="text-3xl font-extrabold text-blue-700 mb-2 text-center">LedgerFlow</h1>
        <h2 class="text-xl font-semibold mb-6 text-center text-gray-700">Sign In</h2>
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6 w-full">
          <div>
            <label class="form-label" for="password">Password</label>
            <input id="password" type="password" class="form-input w-full" formControlName="password" />
            <div *ngIf="form.get('password')?.invalid && form.get('password')?.touched" class="mt-1 text-sm text-red-600">
              Password is required
            </div>
          </div>
          <div class="flex justify-end">
            <button type="submit" class="btn-primary w-full" [disabled]="form.invalid || loading">
              {{ loading ? 'Signing In...' : 'Sign In' }}
            </button>
          </div>
        </form>
        <div *ngIf="errorMessage" class="mt-4 text-sm text-red-600 text-center">{{ errorMessage }}</div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  form: FormGroup;
  loading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private securityService: SecurityService
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required]
    });
    this.checkPasswordExists();
  }

  async checkPasswordExists() {
    const settings: any = await this.securityService.getSecuritySettings().toPromise();
    if (!settings || typeof settings.hasPassword === 'undefined' || !settings.hasPassword) {
      this.router.navigate(['/setup-password']);
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;
    this.loading = true;
    this.errorMessage = '';
    const password = this.form.value.password;
    try {
      const result = await this.securityService.login(password);
      if (result === true) {
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Incorrect password';
      }
    } catch (err) {
      this.errorMessage = 'Login failed';
    } finally {
      this.loading = false;
    }
  }
}
