import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { PaymentService, Payment } from '../payment.service';
import { InvoiceService, Invoice } from '../../invoicing/invoice.service';
import { VendorService, Vendor } from '../../vendors/vendor.service';
import { CustomerService, Customer } from '../../customers/customer.service';

@Component({
  selector: 'app-payment-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isEditMode ? 'Edit Payment' : 'Record Payment' }}
        </h1>
        <p class="text-gray-600 mt-1">
          {{ isEditMode ? 'Update payment details and associations.' : 'Capture a new payment and link it to invoices or contacts.' }}
        </p>
      </div>

      <div *ngIf="error" class="alert-danger mb-4">{{ error }}</div>
      <div *ngIf="lookupError" class="alert-warning mb-4">{{ lookupError }}</div>

      <form [formGroup]="paymentForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900">Payment Details</h2>
            <span *ngIf="isLoadingPayment" class="text-sm text-gray-500">Loading payment...</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="form-label">Amount *</label>
              <div class="flex">
                <span class="inline-flex items-center px-3 text-sm text-gray-500 bg-gray-50 border border-r-0 border-gray-300 rounded-l-lg">$</span>
                <input
                  type="number"
                  formControlName="amount"
                  class="form-input rounded-l-none flex-1"
                  placeholder="0.00"
                  step="0.01" />
              </div>
              <div *ngIf="paymentForm.get('amount')?.errors?.['required'] && paymentForm.get('amount')?.touched" class="text-red-500 text-sm mt-1">
                Amount is required
              </div>
              <div *ngIf="paymentForm.get('amount')?.errors?.['min'] && paymentForm.get('amount')?.touched" class="text-red-500 text-sm mt-1">
                Amount must be greater than zero
              </div>
            </div>

            <div>
              <label class="form-label">Date *</label>
              <input
                type="date"
                formControlName="date"
                class="form-input" />
              <div *ngIf="paymentForm.get('date')?.errors?.['required'] && paymentForm.get('date')?.touched" class="text-red-500 text-sm mt-1">
                Date is required
              </div>
            </div>

            <div>
              <label class="form-label">Payment Method</label>
              <select formControlName="paymentMethod" class="form-input">
                <option value="">Select payment method</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="credit_card">Credit Card</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
                <option value="ach">ACH</option>
                <option value="wire">Wire</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label class="form-label">Reference Number</label>
              <input
                type="text"
                formControlName="referenceNumber"
                class="form-input"
                placeholder="Reference or confirmation number" />
            </div>

            <div>
              <label class="form-label">Related Invoice</label>
              <select formControlName="invoiceId" class="form-input" [disabled]="lookupsLoading">
                <option [ngValue]="null">No invoice</option>
                <option *ngFor="let invoice of invoices" [ngValue]="invoice.id">
                  {{ invoice.invoiceNumber }}
                  <span *ngIf="invoice.total"> - {{ invoice.total | currency }}</span>
                </option>
              </select>
              <p class="text-xs text-gray-500 mt-1">Optional: link this payment to an existing invoice.</p>
            </div>

            <div>
              <label class="form-label">Vendor</label>
              <select formControlName="vendorId" class="form-input" [disabled]="lookupsLoading">
                <option [ngValue]="null">No vendor</option>
                <option *ngFor="let vendor of vendors" [ngValue]="vendor.id">
                  {{ vendor.company || vendor.contact || ('Vendor #' + vendor.id) }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label">Customer</label>
              <select formControlName="customerId" class="form-input" [disabled]="lookupsLoading">
                <option [ngValue]="null">No customer</option>
                <option *ngFor="let customer of customers" [ngValue]="customer.id">
                  {{ customer.name || customer.company || ('Customer #' + customer.id) }}
                </option>
              </select>
            </div>
          </div>

          <div class="mt-6">
            <label class="form-label">Notes</label>
            <textarea
              formControlName="notes"
              class="form-input"
              rows="4"
              placeholder="Add context or internal notes about this payment"></textarea>
          </div>
        </div>

        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <button type="button" class="btn-secondary" (click)="goBack()" [disabled]="isSubmitting">Cancel</button>
          <button type="submit" class="btn-primary" [disabled]="paymentForm.invalid || isSubmitting">
            {{ isEditMode ? (isSubmitting ? 'Saving Changes...' : 'Update Payment') : (isSubmitting ? 'Creating...' : 'Create Payment') }}
          </button>
        </div>
      </form>
    </div>
  `,
  styles: []
})
export class PaymentCreateComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private paymentService = inject(PaymentService);
  private invoiceService = inject(InvoiceService);
  private vendorService = inject(VendorService);
  private customerService = inject(CustomerService);

  paymentForm: FormGroup = this.fb.group({
    amount: [null, [Validators.required, Validators.min(0.01)]],
    date: ['', Validators.required],
    paymentMethod: [''],
    referenceNumber: [''],
    notes: [''],
    invoiceId: [null],
    vendorId: [null],
    customerId: [null],
  });

  isEditMode = false;
  paymentId: number | null = null;

  isSubmitting = false;
  isLoadingPayment = false;
  lookupsLoading = false;

  error: string | null = null;
  lookupError: string | null = null;

  invoices: Invoice[] = [];
  vendors: Vendor[] = [];
  customers: Customer[] = [];

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const parsed = Number(idParam);
      if (!Number.isNaN(parsed)) {
        this.paymentId = parsed;
        this.isEditMode = true;
      }
    }

    this.loadLookups();

    if (this.isEditMode && this.paymentId) {
      this.loadPayment(this.paymentId);
    }
  }

  private loadLookups(): void {
    this.lookupsLoading = true;
    forkJoin({
      invoices: this.invoiceService.getInvoices(),
      vendors: this.vendorService.getVendors(),
      customers: this.customerService.getCustomers(),
    }).subscribe({
      next: ({ invoices, vendors, customers }) => {
        this.invoices = invoices ?? [];
        this.vendors = vendors ?? [];
        this.customers = customers ?? [];
        this.lookupsLoading = false;
      },
      error: () => {
        this.lookupsLoading = false;
        this.lookupError = 'Unable to load related records. You can continue and link them later.';
      }
    });
  }

  private loadPayment(id: number): void {
    this.isLoadingPayment = true;
    this.paymentService.getPayment(id).subscribe({
      next: payment => {
        this.isLoadingPayment = false;
        if (!payment) {
          this.error = 'Payment not found.';
          return;
        }
        this.paymentForm.patchValue({
          amount: payment.amount,
          date: payment.date ? payment.date.slice(0, 10) : '',
          paymentMethod: payment.paymentMethod || '',
          referenceNumber: payment.referenceNumber || '',
          notes: payment.notes || '',
          invoiceId: payment.invoiceId ?? null,
          vendorId: payment.vendorId ?? null,
          customerId: payment.customerId ?? null,
        });
      },
      error: () => {
        this.isLoadingPayment = false;
        this.error = 'Unable to load payment details. Please try again later.';
      }
    });
  }

  onSubmit(): void {
    if (this.paymentForm.invalid) {
      this.paymentForm.markAllAsTouched();
      return;
    }

    const formValue = this.paymentForm.value;
    const payload: Payment = {
      id: this.isEditMode ? this.paymentId ?? undefined : undefined,
      amount: Number(formValue.amount),
      date: formValue.date,
      paymentMethod: formValue.paymentMethod || null,
      referenceNumber: formValue.referenceNumber || null,
      notes: formValue.notes || null,
      invoiceId: formValue.invoiceId ?? null,
      vendorId: formValue.vendorId ?? null,
      customerId: formValue.customerId ?? null,
    };

    this.isSubmitting = true;
    this.error = null;

    const request$ = this.isEditMode && payload.id
      ? this.paymentService.updatePayment(payload)
      : this.paymentService.createPayment(payload);

    request$.subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/payments']);
      },
      error: () => {
        this.isSubmitting = false;
        this.error = this.isEditMode
          ? 'Failed to update payment. Please try again later.'
          : 'Failed to create payment. Please try again later.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }
}
