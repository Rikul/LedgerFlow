import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { PaymentService, Payment } from '../payment.service';

@Component({
  selector: 'app-payment-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 space-y-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payment Details</h1>
          <p class="text-gray-600">Review the payment record and related entities.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button type="button" class="btn-secondary" (click)="goBack()">Back to Payments</button>
          <a *ngIf="payment?.id" [routerLink]="['/payments/edit', payment?.id]" class="btn-primary">Edit Payment</a>
          <button
            type="button"
            class="btn-danger"
            (click)="deletePayment()"
            [disabled]="isDeleting || !payment?.id">
            {{ isDeleting ? 'Deleting...' : 'Delete Payment' }}
          </button>
        </div>
      </div>

      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <div *ngIf="loading" class="card text-center py-12 text-gray-500">Loading payment...</div>

      <ng-container *ngIf="!loading && payment">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="card space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">Payment Summary</h2>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span class="text-gray-600">Amount</span>
                <span class="text-gray-900 font-semibold">{{ payment.amount | currency }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Date</span>
                <span class="text-gray-900">{{ payment.date | date: 'longDate' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Method</span>
                <span class="text-gray-900">{{ payment.paymentMethod || '—' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Reference</span>
                <span class="text-gray-900">{{ payment.referenceNumber || '—' }}</span>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-2">Notes</h3>
              <p class="text-gray-700 whitespace-pre-line" *ngIf="payment.notes; else noNotes">{{ payment.notes }}</p>
              <ng-template #noNotes><span class="text-gray-500">No notes provided.</span></ng-template>
            </div>
          </div>

          <div class="card space-y-4">
            <h2 class="text-lg font-semibold text-gray-900">Associations</h2>
            <div class="space-y-3">
              <div>
                <p class="text-sm font-medium text-gray-600">Invoice</p>
                <ng-container *ngIf="payment.invoice; else noInvoice">
                  <a [routerLink]="['/invoices', 'view', payment.invoice?.id]" class="text-primary-600 hover:text-primary-900">
                    {{ payment.invoice?.invoiceNumber }}
                  </a>
                  <p class="text-xs text-gray-500" *ngIf="payment.invoice?.status">Status: {{ prettify(payment.invoice?.status || '') }}</p>
                  <p class="text-xs text-gray-500" *ngIf="payment.invoice?.total">Total: {{ payment.invoice?.total | currency }}</p>
                </ng-container>
                <ng-template #noInvoice><span class="text-gray-500">Not linked to an invoice.</span></ng-template>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-600">Vendor</p>
                <ng-container *ngIf="payment.vendor; else noVendor">
                  <p class="text-gray-900">{{ payment.vendor?.name }}</p>
                  <p class="text-xs text-gray-500" *ngIf="payment.vendor?.email">{{ payment.vendor?.email }}</p>
                </ng-container>
                <ng-template #noVendor><span class="text-gray-500">Not linked to a vendor.</span></ng-template>
              </div>

              <div>
                <p class="text-sm font-medium text-gray-600">Customer</p>
                <ng-container *ngIf="payment.customer; else noCustomer">
                  <p class="text-gray-900">{{ payment.customer?.name }}</p>
                  <p class="text-xs text-gray-500" *ngIf="payment.customer?.email">{{ payment.customer?.email }}</p>
                </ng-container>
                <ng-template #noCustomer><span class="text-gray-500">Not linked to a customer.</span></ng-template>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <h2 class="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div class="flex justify-between">
              <span>Created</span>
              <span>{{ payment.createdAt ? (payment.createdAt | date: 'medium') : '—' }}</span>
            </div>
            <div class="flex justify-between">
              <span>Updated</span>
              <span>{{ payment.updatedAt ? (payment.updatedAt | date: 'medium') : '—' }}</span>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: []
})
export class PaymentViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private paymentService = inject(PaymentService);

  payment: Payment | null = null;
  loading = false;
  error: string | null = null;
  isDeleting = false;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.error = 'Invalid payment identifier.';
      return;
    }
    const id = Number(idParam);
    if (Number.isNaN(id)) {
      this.error = 'Invalid payment identifier.';
      return;
    }
    this.loadPayment(id);
  }

  private loadPayment(id: number): void {
    this.loading = true;
    this.paymentService.getPayment(id).subscribe({
      next: payment => {
        this.loading = false;
        if (!payment) {
          this.error = 'Payment not found.';
          return;
        }
        this.payment = payment;
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load payment details. Please try again later.';
      }
    });
  }

  deletePayment(): void {
    if (!this.payment?.id || this.isDeleting) {
      return;
    }
    const confirmed = typeof window === 'undefined' ? true : window.confirm('Are you sure you want to delete this payment?');
    if (!confirmed) {
      return;
    }
    this.isDeleting = true;
    this.paymentService.deletePayment(this.payment.id).subscribe({
      next: () => {
        this.isDeleting = false;
        this.router.navigate(['/payments']);
      },
      error: () => {
        this.isDeleting = false;
        this.error = 'Failed to delete payment. Please try again later.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/payments']);
  }

  prettify(value: string): string {
    return value
      .toString()
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
