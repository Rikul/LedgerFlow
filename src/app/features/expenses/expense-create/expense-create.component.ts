import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-expense-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Expense' : 'Create New Expense' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEditMode ? 'Update expense details' : 'Add a new business expense' }}
        </p>
      </div>

      <form [formGroup]="expenseForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Expense Details</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Expense Type -->
            <div>
              <label class="form-label">Expense Type *</label>
              <select formControlName="type" class="form-input">
                <option value="">Select expense type</option>
                <option value="travel">Travel</option>
                <option value="meals">Meals & Entertainment</option>
                <option value="supplies">Office Supplies</option>
                <option value="utilities">Utilities</option>
                <option value="rent">Rent</option>
                <option value="marketing">Marketing</option>
                <option value="software">Software</option>
                <option value="other">Other</option>
              </select>
              <div *ngIf="expenseForm.get('type')?.errors?.['required'] && expenseForm.get('type')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Expense type is required
              </div>
            </div>

            <!-- Amount -->
            <div>
              <label class="form-label">Amount *</label>
              <div class="relative">
                <span class="absolute left-3 top-2 text-gray-500">$</span>
                <input type="number" 
                       formControlName="amount" 
                       class="form-input pl-8" 
                       placeholder="0.00"
                       step="0.01">
              </div>
              <div *ngIf="expenseForm.get('amount')?.errors?.['required'] && expenseForm.get('amount')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Amount is required
              </div>
            </div>

            <!-- Date -->
            <div>
              <label class="form-label">Date *</label>
              <input type="date" 
                     formControlName="date" 
                     class="form-input">
              <div *ngIf="expenseForm.get('date')?.errors?.['required'] && expenseForm.get('date')?.touched" 
                   class="text-red-500 text-sm mt-1">
                Date is required
              </div>
            </div>

            <!-- Vendor -->
            <div>
              <label class="form-label">Vendor/Merchant</label>
              <input type="text"
                     formControlName="vendor"
                     class="form-input"
                     placeholder="Enter company name">
            </div>

            <!-- Payment Method -->
            <div>
              <label class="form-label">Payment Method</label>
              <select formControlName="paymentMethod" class="form-input">
                <option value="">Select payment method</option>
                <option value="cash">Cash</option>
                <option value="credit-card">Credit Card</option>
                <option value="debit-card">Debit Card</option>
                <option value="bank-transfer">Bank Transfer</option>
                <option value="check">Check</option>
              </select>
            </div>

            <!-- Reference Number -->
            <div>
              <label class="form-label">Reference Number</label>
              <input type="text" 
                     formControlName="referenceNumber" 
                     class="form-input" 
                     placeholder="Invoice/Receipt number">
            </div>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <label class="form-label">Description</label>
            <textarea formControlName="description" 
                      class="form-input" 
                      rows="3" 
                      placeholder="Enter expense description"></textarea>
          </div>

          <!-- Tax Deductible -->
          <div class="mt-6">
            <label class="flex items-center">
              <input type="checkbox" 
                     formControlName="taxDeductible" 
                     class="rounded border-gray-300 text-blue-600 focus:ring-blue-500">
              <span class="ml-2 text-sm text-gray-700">This expense is tax deductible</span>
            </label>
          </div>
        </div>

        <!-- Receipt Upload -->
        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">Receipt</h2>
          
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <div class="mt-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="mt-2 block text-sm font-medium text-gray-900">
                  Upload receipt
                </span>
                <span class="mt-1 block text-sm text-gray-500">
                  PNG, JPG, PDF up to 10MB
                </span>
                <input id="file-upload" 
                       type="file" 
                       class="sr-only" 
                       accept=".png,.jpg,.jpeg,.pdf"
                       (change)="onFileSelected($event)">
              </label>
            </div>
          </div>

          <div *ngIf="selectedFile" class="mt-4 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clip-rule="evenodd" />
              </svg>
              <span class="ml-2 text-sm text-gray-900">{{ selectedFile.name }}</span>
              <button type="button" 
                      (click)="removeFile()" 
                      class="ml-auto text-red-500 hover:text-red-700">
                <svg class="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4">
          <button type="button" 
                  (click)="goBack()" 
                  class="btn btn-outline">
            Cancel
          </button>
          <button type="submit" 
                  [disabled]="expenseForm.invalid || isSubmitting"
                  class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
            <span *ngIf="isSubmitting" class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ isEditMode ? 'Updating...' : 'Creating...' }}
            </span>
            <span *ngIf="!isSubmitting">
              {{ isEditMode ? 'Update Expense' : 'Create Expense' }}
            </span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ExpenseCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  expenseForm: FormGroup;
  isEditMode = false;
  isSubmitting = false;
  selectedFile: File | null = null;

  constructor() {
    this.expenseForm = this.fb.group({
      type: ['', Validators.required],
      amount: ['', [Validators.required, Validators.min(0.01)]],
      date: ['', Validators.required],
      vendor: [''],
      paymentMethod: [''],
      referenceNumber: [''],
      description: [''],
      taxDeductible: [false]
    });
  }

  ngOnInit(): void {
    const expenseId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!expenseId;

    if (this.isEditMode) {
      this.loadExpense(expenseId!);
    } else {
      // Set default date to today
      const today = new Date().toISOString().split('T')[0];
      this.expenseForm.patchValue({ date: today });
    }
  }

  loadExpense(id: string): void {
    // TODO: Load expense data from service
    console.log('Loading expense:', id);
    
    // Mock data for now
    const mockExpense = {
      type: 'office-supplies',
      amount: 125.50,
      date: '2024-01-15',
      vendor: 'Office Depot',
      paymentMethod: 'credit-card',
      referenceNumber: 'INV-001234',
      description: 'Office supplies for Q1',
      taxDeductible: true
    };

    this.expenseForm.patchValue(mockExpense);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        alert('Only PNG, JPG, and PDF files are allowed');
        return;
      }

      this.selectedFile = file;
    }
  }

  removeFile(): void {
    this.selectedFile = null;
  }

  onSubmit(): void {
    if (this.expenseForm.valid) {
      this.isSubmitting = true;

      const expenseData = {
        ...this.expenseForm.value,
        receipt: this.selectedFile
      };

      console.log('Expense data:', expenseData);

      // TODO: Submit to service
      setTimeout(() => {
        this.isSubmitting = false;
        console.log(this.isEditMode ? 'Expense updated!' : 'Expense created!');
        this.router.navigate(['/expenses']);
      }, 1000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.expenseForm.controls).forEach(key => {
        this.expenseForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/expenses']);
  }
}