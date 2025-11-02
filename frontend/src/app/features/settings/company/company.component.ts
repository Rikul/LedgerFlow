import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CompanyService } from './company.service';

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full p-6">
      
      <!-- Toast Messages -->
      <div *ngIf="showToast" class="mb-4 p-4 rounded-md" 
           [ngClass]="toastType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ toastMessage }}
      </div>
      
      <form [formGroup]="companyForm" (ngSubmit)="onSubmit()" class="space-y-8">
        
        <!-- Company Information -->
        <div class="bg-white shadow rounded-lg p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="md:col-span-2 lg:col-span-3">
              <label for="companyName" class="block text-sm font-medium text-gray-700 mb-1">
                Company Name <span class="text-red-500">*</span>
              </label>
              <input
                id="companyName"
                type="text"
                formControlName="companyName"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('companyName')?.invalid && companyForm.get('companyName')?.touched"
              />
              <div *ngIf="companyForm.get('companyName')?.invalid && companyForm.get('companyName')?.touched" class="text-red-500 text-sm mt-1">
                Company name is required
              </div>
            </div>
            
            <div>
              <label for="contactEmail" class="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                id="contactEmail"
                type="email"
                formControlName="contactEmail"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('contactEmail')?.invalid && companyForm.get('contactEmail')?.touched"
              />
              <div *ngIf="companyForm.get('contactEmail')?.invalid && companyForm.get('contactEmail')?.touched" class="text-red-500 text-sm mt-1">
                Please enter a valid email address
              </div>
            </div>
            
            <div>
              <label for="companyPhone" class="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
              <input
                id="companyPhone"
                type="tel"
                formControlName="companyPhone"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <!-- Mailing Address -->
        <div class="bg-white shadow rounded-lg p-6" formGroupName="mailing">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Mailing Address</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="md:col-span-2 lg:col-span-3">
              <label for="mailingAddress1" class="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 <span class="text-red-500">*</span>
              </label>
              <input
                id="mailingAddress1"
                type="text"
                formControlName="address1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('mailing.address1')?.invalid && companyForm.get('mailing.address1')?.touched"
              />
              <div *ngIf="companyForm.get('mailing.address1')?.invalid && companyForm.get('mailing.address1')?.touched" class="text-red-500 text-sm mt-1">
                Address line 1 is required
              </div>
            </div>
            
            <div class="md:col-span-2 lg:col-span-3">
              <label for="mailingAddress2" class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                id="mailingAddress2"
                type="text"
                formControlName="address2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label for="mailingCity" class="block text-sm font-medium text-gray-700 mb-1">
                City <span class="text-red-500">*</span>
              </label>
              <input
                id="mailingCity"
                type="text"
                formControlName="city"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('mailing.city')?.invalid && companyForm.get('mailing.city')?.touched"
              />
              <div *ngIf="companyForm.get('mailing.city')?.invalid && companyForm.get('mailing.city')?.touched" class="text-red-500 text-sm mt-1">
                City is required
              </div>
            </div>
            
            <div>
              <label for="mailingState" class="block text-sm font-medium text-gray-700 mb-1">
                State/Province <span class="text-red-500">*</span>
              </label>
              <input
                id="mailingState"
                type="text"
                formControlName="state"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('mailing.state')?.invalid && companyForm.get('mailing.state')?.touched"
              />
              <div *ngIf="companyForm.get('mailing.state')?.invalid && companyForm.get('mailing.state')?.touched" class="text-red-500 text-sm mt-1">
                State/Province is required
              </div>
            </div>
            
            <div>
              <label for="mailingPostalCode" class="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code <span class="text-red-500">*</span>
              </label>
              <input
                id="mailingPostalCode"
                type="text"
                formControlName="postalCode"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('mailing.postalCode')?.invalid && companyForm.get('mailing.postalCode')?.touched"
              />
              <div *ngIf="companyForm.get('mailing.postalCode')?.invalid && companyForm.get('mailing.postalCode')?.touched" class="text-red-500 text-sm mt-1">
                ZIP/Postal Code is required
              </div>
            </div>
            
            <div>
              <label for="mailingCountry" class="block text-sm font-medium text-gray-700 mb-1">
                Country <span class="text-red-500">*</span>
              </label>
              <input
                id="mailingCountry"
                type="text"
                formControlName="country"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('mailing.country')?.invalid && companyForm.get('mailing.country')?.touched"
              />
              <div *ngIf="companyForm.get('mailing.country')?.invalid && companyForm.get('mailing.country')?.touched" class="text-red-500 text-sm mt-1">
                Country is required
              </div>
            </div>
          </div>
        </div>

        <!-- Physical Address -->
        <div class="bg-white shadow rounded-lg p-6" formGroupName="physical">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-medium text-gray-900">Physical Address</h3>
            <label class="flex items-center">
              <input
                type="checkbox"
                (change)="onSameAsMailingChange($event)"
                class="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span class="text-sm text-gray-700">Same as mailing address</span>
            </label>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="md:col-span-2 lg:col-span-3">
              <label for="physicalAddress1" class="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 <span class="text-red-500">*</span>
              </label>
              <input
                id="physicalAddress1"
                type="text"
                formControlName="address1"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('physical.address1')?.invalid && companyForm.get('physical.address1')?.touched"
                [disabled]="sameAsMailing"
              />
              <div *ngIf="companyForm.get('physical.address1')?.invalid && companyForm.get('physical.address1')?.touched" class="text-red-500 text-sm mt-1">
                Address line 1 is required
              </div>
            </div>
            
            <div class="md:col-span-2 lg:col-span-3">
              <label for="physicalAddress2" class="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
              <input
                id="physicalAddress2"
                type="text"
                formControlName="address2"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [disabled]="sameAsMailing"
              />
            </div>
            
            <div>
              <label for="physicalCity" class="block text-sm font-medium text-gray-700 mb-1">
                City <span class="text-red-500">*</span>
              </label>
              <input
                id="physicalCity"
                type="text"
                formControlName="city"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('physical.city')?.invalid && companyForm.get('physical.city')?.touched"
                [disabled]="sameAsMailing"
              />
              <div *ngIf="companyForm.get('physical.city')?.invalid && companyForm.get('physical.city')?.touched" class="text-red-500 text-sm mt-1">
                City is required
              </div>
            </div>
            
            <div>
              <label for="physicalState" class="block text-sm font-medium text-gray-700 mb-1">
                State/Province <span class="text-red-500">*</span>
              </label>
              <input
                id="physicalState"
                type="text"
                formControlName="state"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('physical.state')?.invalid && companyForm.get('physical.state')?.touched"
                [disabled]="sameAsMailing"
              />
              <div *ngIf="companyForm.get('physical.state')?.invalid && companyForm.get('physical.state')?.touched" class="text-red-500 text-sm mt-1">
                State/Province is required
              </div>
            </div>
            
            <div>
              <label for="physicalPostalCode" class="block text-sm font-medium text-gray-700 mb-1">
                ZIP/Postal Code <span class="text-red-500">*</span>
              </label>
              <input
                id="physicalPostalCode"
                type="text"
                formControlName="postalCode"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('physical.postalCode')?.invalid && companyForm.get('physical.postalCode')?.touched"
                [disabled]="sameAsMailing"
              />
              <div *ngIf="companyForm.get('physical.postalCode')?.invalid && companyForm.get('physical.postalCode')?.touched" class="text-red-500 text-sm mt-1">
                ZIP/Postal Code is required
              </div>
            </div>
            
            <div>
              <label for="physicalCountry" class="block text-sm font-medium text-gray-700 mb-1">
                Country <span class="text-red-500">*</span>
              </label>
              <input
                id="physicalCountry"
                type="text"
                formControlName="country"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                [class.border-red-500]="companyForm.get('physical.country')?.invalid && companyForm.get('physical.country')?.touched"
                [disabled]="sameAsMailing"
              />
              <div *ngIf="companyForm.get('physical.country')?.invalid && companyForm.get('physical.country')?.touched" class="text-red-500 text-sm mt-1">
                Country is required
              </div>
            </div>
          </div>
        </div>

        <!-- Save Button -->
        <div class="flex justify-end">
          <button
            type="submit"
            class="btn-primary"
            [disabled]="companyForm.invalid || isLoading"
          >
            {{ isLoading ? 'Saving...' : 'Save Changes' }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class CompanyComponent implements OnInit {
  companyForm: FormGroup;
  sameAsMailing = false;
  isLoading = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService
  ) {
    this.companyForm = this.fb.group({
      companyName: ['', [Validators.required]],
      contactEmail: ['', [Validators.email]],
      companyPhone: [''],
      mailing: this.fb.group({
        address1: ['', [Validators.required]],
        address2: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      }),
      physical: this.fb.group({
        address1: ['', [Validators.required]],
        address2: [''],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        postalCode: ['', [Validators.required]],
        country: ['', [Validators.required]]
      })
    });
  }

  ngOnInit() {
    this.loadCompany();
  }

  loadCompany() {
    this.companyService.getCompany().subscribe({
      next: (company) => {
        if (company) {
          this.companyForm.patchValue({
            companyName: company.name,
            contactEmail: company.contactEmail,
            companyPhone: company.companyPhone,
            mailing: company.mailing,
            physical: company.physical
          });
        }
      },
      error: (error) => {
        this.showToastMessage('Failed to load company data', 'error');
      }
    });
  }

  onSameAsMailingChange(event: any) {
    this.sameAsMailing = event.target.checked;
    if (this.sameAsMailing) {
      const mailingValues = this.companyForm.get('mailing')?.value;
      this.companyForm.get('physical')?.patchValue(mailingValues);
      this.companyForm.get('physical')?.disable();
    } else {
      this.companyForm.get('physical')?.enable();
    }
  }

  onSubmit() {
    if (this.companyForm.valid) {
      this.isLoading = true;
      
      // Temporarily enable physical form to get values
      const wasDisabled = this.companyForm.get('physical')?.disabled;
      if (wasDisabled) {
        this.companyForm.get('physical')?.enable();
      }
      
      const formValue = this.companyForm.value;
      
      // Re-disable if needed
      if (wasDisabled) {
        this.companyForm.get('physical')?.disable();
      }

      this.companyService.upsertCompany(formValue).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.showToastMessage('Company settings saved successfully!', 'success');
        },
        error: (error) => {
          this.isLoading = false;
          this.showToastMessage('Failed to save company settings', 'error');
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.companyForm.controls).forEach(key => {
        const control = this.companyForm.get(key);
        if (control) {
          control.markAsTouched();
          if (control instanceof FormGroup) {
            Object.keys(control.controls).forEach(nestedKey => {
              control.get(nestedKey)?.markAsTouched();
            });
          }
        }
      });
      this.showToastMessage('Please fill in all required fields', 'error');
    }
  }

  private showToastMessage(message: string, type: 'success' | 'error') {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    // Auto-hide toast after 3 seconds
    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}
