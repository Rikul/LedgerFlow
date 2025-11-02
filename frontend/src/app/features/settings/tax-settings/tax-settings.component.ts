import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TaxSettingsService } from './tax-settings.service';

@Component({
  selector: 'app-settings-tax',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full p-6">
      
      <!-- Toast Messages -->
      <div *ngIf="showToast" class="mb-4 p-4 rounded-md" 
           [ngClass]="toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ toastMessage }}
      </div>
      
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

        <!-- Organization Info -->
        <div class="bg-white shadow rounded-lg p-6">
          <div formGroupName="org" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="entityType">Entity Type</label>
              <select id="entityType" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="entityType">
                <option value="llc">LLC</option>
                <option value="s-corp">S-Corp</option>
                <option value="c-corp">C-Corp</option>
                <option value="sole-prop">Sole Proprietorship</option>
                <option value="partnership">Partnership</option>
                <option value="nonprofit">Nonprofit</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="taxId">Tax ID (VAT/GST)</label>
              <input id="taxId" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="taxId" placeholder="VAT123456" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="country">Country</label>
              <input id="country" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="country" placeholder="United States" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="region">State/Province</label>
              <input id="region" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="region" placeholder="California" />
            </div>
          </div>
        </div>

        <!-- Default Tax -->
        <div class="bg-white shadow rounded-lg p-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Default Tax</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1" for="defaultTaxRate">Default Tax Rate (%)</label>
              <input id="defaultTaxRate" type="number" min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="defaultTaxRate" placeholder="0.00" />
            </div>
          </div>
        </div>

        <!-- Additional Tax Rates -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Additional Tax Rates</h3>
            <button type="button" class="btn-outline" (click)="addRate()" [disabled]="rates.length >= 5">+ Add rate</button>
          </div>
          <div class="space-y-4" formArrayName="rates">
            <ng-container *ngFor="let rate of rates.controls; index as i">
              <div [formGroupName]="i" class="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
                <div class="md:col-span-4">
                  <label class="block text-sm font-medium text-gray-700 mb-1" [for]="'rateName'+i">Name</label>
                  <input [id]="'rateName'+i" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="name" placeholder="e.g., State Tax" />
                </div>
                <div class="md:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-1" [for]="'rateValue'+i">Rate (%)</label>
                  <input [id]="'rateValue'+i" type="number" min="0" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" formControlName="rate" placeholder="0.00" />
                </div>
                <div class="md:col-span-1">
                  <label class="block text-sm font-medium text-gray-700 mb-1">Compound</label>
                  <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" class="h-4 w-4" formControlName="compound" />
                    Yes
                  </label>
                </div>
                <div class="md:col-span-1 flex md:justify-end">
                  <button type="button" class="btn-outline" (click)="removeRate(i)">Remove</button>
                </div>
              </div>
            </ng-container>
            <p class="text-sm text-gray-500" *ngIf="rates.length === 0">No additional tax rates added.</p>
            <p class="text-sm text-gray-500" *ngIf="rates.length >= 5">Maximum of 5 additional tax rates allowed.</p>
          </div>
        </div>

        <div class="flex justify-end">
          <button class="btn-primary" type="submit" [disabled]="isLoading">
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class TaxSettingsComponent implements OnInit, OnDestroy {
  form: FormGroup;
  private sub?: any;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private taxSettingsService: TaxSettingsService
  ) {
    const fb = new FormBuilder();
    this.form = fb.group({
      org: fb.group({
        entityType: ['llc'],
        taxId: [''],
        country: [''],
        region: [''],
      }),
      defaultTaxRate: [0, [Validators.min(0)]],
      rates: fb.array([]),
    });
  }

  ngOnInit() {
    this.loadTaxSettings();
  }

  loadTaxSettings() {
    this.taxSettingsService.getTaxSettings().subscribe({
      next: (settings) => {
        if (settings) {
          // Clear existing rates
          while (this.rates.length > 0) {
            this.rates.removeAt(0);
          }
          
          // Patch form with loaded data
          this.form.patchValue({
            org: settings.org,
            defaultTaxRate: settings.defaultTaxRate
          });
          
          // Add loaded rates
          if (settings.rates) {
            settings.rates.forEach((rate: any) => {
              const fb = new FormBuilder();
              const group = fb.group({
                name: [rate.name, [Validators.required]],
                rate: [rate.rate, [Validators.required, Validators.min(0)]],
                compound: [rate.compound],
              });
              this.rates.push(group as unknown as FormGroup);
            });
          }
        }
      },
      error: (error) => {
        this.showToastMessage('Failed to load tax settings', 'error');
      }
    });
  }

  get rates(): FormArray<FormGroup> {
    return this.form.get('rates') as unknown as FormArray<FormGroup>;
  }

  addRate() {
    if (this.rates.length >= 5) return; // Limit to 5 rates
    
    const fb = new FormBuilder();
    const group = fb.group({
      name: ['', [Validators.required]],
      rate: [0, [Validators.required, Validators.min(0)]],
      compound: [false],
    });
    this.rates.push(group as unknown as FormGroup);
  }

  removeRate(index: number) {
    this.rates.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      this.isLoading = true;
      
      const formValue = this.form.value;
      
      this.taxSettingsService.upsertTaxSettings(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showToastMessage('Tax settings saved successfully!', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          this.showToastMessage('Failed to save tax settings', 'error');
        }
      });
    } else {
      this.showToastMessage('Please fix form errors before saving', 'error');
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
