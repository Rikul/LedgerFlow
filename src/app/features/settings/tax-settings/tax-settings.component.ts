import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings-tax',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">

      <!-- Organization Info -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Organization Tax Info</h3>
        <div formGroupName="org" class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label" for="entityType">Entity Type</label>
            <select id="entityType" class="form-input" formControlName="entityType">
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
            <label class="form-label" for="taxId">Tax ID (VAT/GST)</label>
            <input id="taxId" type="text" class="form-input" formControlName="taxId" placeholder="VAT123456" />
          </div>
          <div>
            <label class="form-label" for="country">Country</label>
            <input id="country" type="text" class="form-input" formControlName="country" placeholder="United States" />
          </div>
          <div>
            <label class="form-label" for="region">State/Province</label>
            <input id="region" type="text" class="form-input" formControlName="region" placeholder="California" />
          </div>
        </div>
      </div>

      <!-- Default Tax -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Default Tax</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label" for="defaultTaxRate">Default Tax Rate (%)</label>
            <input id="defaultTaxRate" type="number" min="0" step="0.01" class="form-input" formControlName="defaultTaxRate" placeholder="0.00" />
          </div>
        </div>
      </div>

      <!-- Additional Tax Rates -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Additional Tax Rates</h3>
          <button type="button" class="btn-outline" (click)="addRate()">+ Add rate</button>
        </div>
        <div class="space-y-4" formArrayName="rates">
          <ng-container *ngFor="let rate of rates.controls; index as i">
            <div [formGroupName]="i" class="grid grid-cols-1 md:grid-cols-8 gap-4 items-end">
              <div class="md:col-span-4">
                <label class="form-label" [for]="'rateName'+i">Name</label>
                <input [id]="'rateName'+i" type="text" class="form-input" formControlName="name" placeholder="e.g., State Tax" />
              </div>
              <div class="md:col-span-2">
                <label class="form-label" [for]="'rateValue'+i">Rate (%)</label>
                <input [id]="'rateValue'+i" type="number" min="0" step="0.01" class="form-input" formControlName="rate" placeholder="0.00" />
              </div>
              <div class="md:col-span-1">
                <label class="form-label">Compound</label>
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
        </div>
      </div>

      <div class="flex justify-end">
        <button class="btn-primary" type="submit">Save Changes</button>
      </div>
    </form>
  `,
})
export class TaxSettingsComponent implements OnDestroy {
  form: FormGroup;
  private sub?: any;

  constructor() {
    const fb = new FormBuilder();
    this.form = fb.group({
      enableTaxes: [true],
      taxBasis: ['accrual'],
      pricesIncludeTax: [false],
      org: fb.group({
        	entityType: ['llc'],
        taxId: [''],
        country: [''],
        region: [''],
      }),
      defaultTaxRate: [0, [Validators.min(0)]],
      rates: fb.array([]),
    });

    // Toggle enable/disable of tax detail fields
    this.sub = this.form.get('enableTaxes')?.valueChanges.subscribe((enabled: boolean) => {
      const controls = ['taxBasis', 'pricesIncludeTax', 'org', 'defaultTaxRate', 'rates'];
      controls.forEach(key => {
        const ctrl = this.form.get(key);
        if (!ctrl) return;
        if (enabled) {
          ctrl.enable({ emitEvent: false });
        } else {
          ctrl.disable({ emitEvent: false });
        }
      });
    });
  }

  get rates(): FormArray<FormGroup> {
    return this.form.get('rates') as unknown as FormArray<FormGroup>;
  }

  addRate() {
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
    // Placeholder for service call
    console.log('Tax settings saved', this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
