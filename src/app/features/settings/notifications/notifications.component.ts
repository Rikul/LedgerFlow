import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <!-- Email Notifications -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Email Notifications</h3>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="enableEmail" />
            Enable
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="form-label" for="emailAddress">Email Address</label>
            <input id="emailAddress" type="email" class="form-input" formControlName="emailAddress" [disabled]="!form.get('enableEmail')?.value" placeholder="you@example.com" />
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" formGroupName="emailPrefs">
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="invoices" [disabled]="!form.get('enableEmail')?.value" />
            Invoices
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="payments" [disabled]="!form.get('enableEmail')?.value" />
            Payments
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="reports" [disabled]="!form.get('enableEmail')?.value" />
            Reports
          </label>
        </div>
      </div>

      <!-- SMS Notifications -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">SMS Notifications</h3>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="enableSms" />
            Enable
          </label>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="md:col-span-2">
            <label class="form-label" for="phoneNumber">Phone Number</label>
            <input id="phoneNumber" type="tel" class="form-input" formControlName="phoneNumber" [disabled]="!form.get('enableSms')?.value" placeholder="+1 555-555-5555" />
          </div>
        </div>
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4" formGroupName="smsPrefs">
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="invoices" [disabled]="!form.get('enableSms')?.value" />
            Invoices
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="payments" [disabled]="!form.get('enableSms')?.value" />
            Payments
          </label>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="alerts" [disabled]="!form.get('enableSms')?.value" />
            Alerts
          </label>
        </div>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn-primary">Save Changes</button>
      </div>
    </form>
  `,
})
export class NotificationsComponent implements OnDestroy {
  form: FormGroup;
  private sub?: any;

  constructor() {
    const fb = new FormBuilder();
    this.form = fb.group({
      enableEmail: [true],
      emailAddress: [''],
      emailPrefs: fb.group({
        invoices: [true],
        payments: [true],
        reports: [false],
      }),
      enableSms: [false],
      phoneNumber: [''],
      smsPrefs: fb.group({
        invoices: [false],
        payments: [true],
        alerts: [true],
      }),
    });

    this.sub = this.form.valueChanges.subscribe(() => {
      // Placeholder hook for live validation or normalization
    });
  }

  onSubmit() {
    console.log('Notification settings saved', this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
