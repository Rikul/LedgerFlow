import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Company Info</h3>
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="form-label" for="companyName">Company Name</label>
            <input id="companyName" type="text" class="form-input" formControlName="companyName" placeholder="Acme Inc." />
          </div>
        </div>
      </div>

      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Mailing Address</h3>
        <div formGroupName="mailing" class="grid grid-cols-1 gap-4">
          <div>
            <label class="form-label" for="mailingAddress1">Address Line 1</label>
            <input id="mailingAddress1" type="text" class="form-input" formControlName="address1" />
          </div>
          <div>
            <label class="form-label" for="mailingAddress2">Address Line 2 (optional)</label>
            <input id="mailingAddress2" type="text" class="form-input" formControlName="address2" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="form-label" for="mailingCity">City</label>
              <input id="mailingCity" type="text" class="form-input" formControlName="city" />
            </div>
            <div>
              <label class="form-label" for="mailingState">State/Province</label>
              <input id="mailingState" type="text" class="form-input" formControlName="state" />
            </div>
            <div>
              <label class="form-label" for="mailingPostal">Postal Code</label>
              <input id="mailingPostal" type="text" class="form-input" formControlName="postalCode" />
            </div>
          </div>
          <div>
            <label class="form-label" for="mailingCountry">Country</label>
            <input id="mailingCountry" type="text" class="form-input" formControlName="country" />
          </div>
        </div>
      </div>

      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">Physical Address</h3>
          <label class="inline-flex items-center gap-2 text-sm text-gray-700">
            <input type="checkbox" class="h-4 w-4" formControlName="physicalSameAsMailing" />
            Same as mailing
          </label>
        </div>
        <div formGroupName="physical" class="grid grid-cols-1 gap-4">
          <div>
            <label class="form-label" for="physicalAddress1">Address Line 1</label>
            <input id="physicalAddress1" type="text" class="form-input" formControlName="address1" [disabled]="form.get('physicalSameAsMailing')?.value" />
          </div>
          <div>
            <label class="form-label" for="physicalAddress2">Address Line 2 (optional)</label>
            <input id="physicalAddress2" type="text" class="form-input" formControlName="address2" [disabled]="form.get('physicalSameAsMailing')?.value" />
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="form-label" for="physicalCity">City</label>
              <input id="physicalCity" type="text" class="form-input" formControlName="city" [disabled]="form.get('physicalSameAsMailing')?.value" />
            </div>
            <div>
              <label class="form-label" for="physicalState">State/Province</label>
              <input id="physicalState" type="text" class="form-input" formControlName="state" [disabled]="form.get('physicalSameAsMailing')?.value" />
            </div>
            <div>
              <label class="form-label" for="physicalPostal">Postal Code</label>
              <input id="physicalPostal" type="text" class="form-input" formControlName="postalCode" [disabled]="form.get('physicalSameAsMailing')?.value" />
            </div>
          </div>
          <div>
            <label class="form-label" for="physicalCountry">Country</label>
            <input id="physicalCountry" type="text" class="form-input" formControlName="country" [disabled]="form.get('physicalSameAsMailing')?.value" />
          </div>
        </div>
      </div>

      <div class="flex justify-end">
        <button class="btn-primary" type="submit">Save Changes</button>
      </div>
    </form>
  `,
})
export class CompanyComponent implements OnDestroy {
  form: FormGroup;
  private sub?: any;

  constructor() {
    const fb = new FormBuilder();
    this.form = fb.group({
      companyName: [''],
      mailing: fb.group({
        address1: [''],
        address2: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: [''],
      }),
      physicalSameAsMailing: [false],
      physical: fb.group({
        address1: [''],
        address2: [''],
        city: [''],
        state: [''],
        postalCode: [''],
        country: [''],
      }),
    });

    // Keep physical address in sync when "Same as mailing" is checked
    this.sub = this.form.valueChanges.subscribe(v => {
      const same = v.physicalSameAsMailing;
      if (same) {
        this.form.get('physical')?.patchValue(v.mailing, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    // Placeholder action: replace with service call later
    console.log('Company settings saved', this.form.getRawValue());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe?.();
  }
}
