import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationSettingsService } from './notifications.service';

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
      </div>

      <div class="flex justify-end">
        <button type="submit" class="btn-primary" [disabled]="form.invalid || saving">
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>

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
export class NotificationsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  saving = false;
  errorMessage = '';
  successMessage = '';
  private sub?: any;

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationSettingsService
  ) {
    this.form = this.fb.group({
      enableEmail: [false],
      emailAddress: ['', [Validators.email]],
      enableSms: [false],
      phoneNumber: [''],
    });

    this.sub = this.form.valueChanges.subscribe(() => {
      this.clearMessages();
    });
  }

  ngOnInit() {
    this.loadSettings();
  }

  async loadSettings() {
    try {
      const settings = await this.notificationService.getNotificationSettings().toPromise();
      if (settings) {
        this.form.patchValue(settings);
      }
    } catch (error) {
      this.errorMessage = 'Failed to load notification settings';
      console.error('Error loading notification settings:', error);
    }
  }

  async onSubmit() {
    if (this.form.invalid) return;

    this.saving = true;
    this.clearMessages();

    try {
      await this.notificationService.upsertNotificationSettings(this.form.getRawValue()).toPromise();
      this.successMessage = 'Notification settings saved successfully';
    } catch (error) {
      this.errorMessage = 'Failed to save notification settings';
      console.error('Error saving notification settings:', error);
    } finally {
      this.saving = false;
    }
  }

  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
