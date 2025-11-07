import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from './customer.service';
import { PdfExportService } from '../../shared/services/pdf-export.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h1>
          <p class="text-gray-600">Customer details and information</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="btn-secondary" (click)="back.emit()">Back to List</button>
          <button class="btn-primary flex items-center justify-center" (click)="exportToPdf()" [disabled]="isExporting">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            {{ isExporting ? 'Preparing…' : 'Export to PDF' }}
          </button>
        </div>
      </div>

      <!-- Customer Information Card -->
      <div class="card">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Contact Information</h2>
            <span class="status-badge" [ngClass]="customer.isActive ? 'status-paid' : 'status-overdue'">
              {{ customer.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Customer Name</p>
            <p class="text-base text-gray-900">{{ customer.name }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Email</p>
            <div class="flex items-center text-base text-gray-900">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 1 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ customer.email }}
            </div>
          </div>

          <div *ngIf="customer.company">
            <p class="text-sm font-medium text-gray-500 mb-1">Company</p>
            <p class="text-base text-gray-900">{{ customer.company }}</p>
          </div>

          <div *ngIf="customer.phone">
            <p class="text-sm font-medium text-gray-500 mb-1">Phone</p>
            <div class="flex items-center text-base text-gray-900">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h2l2 5-2.5 1.5a11 11 0 005.5 5.5L14 13l5 2v2a2 2 0 01-2 2h-1C9.82 19 5 14.18 5 8V7a2 2 0 00-2-2z" />
              </svg>
              {{ customer.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="card" *ngIf="hasAddress(customer.address) || hasAddress(customer.billingAddress)">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Address Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngIf="hasAddress(customer.address)">
            <p class="text-sm font-medium text-gray-500 mb-2">Primary Address</p>
            <div class="text-base text-gray-900">
              <p *ngIf="customer.address.street">{{ customer.address.street }}</p>
              <p>
                <span *ngIf="customer.address.city">{{ customer.address.city }}<span *ngIf="customer.address.state">, </span></span>
                <span *ngIf="customer.address.state">{{ customer.address.state }}</span>
                <span *ngIf="customer.address.zipCode"> {{ customer.address.zipCode }}</span>
              </p>
              <p *ngIf="customer.address.country">{{ customer.address.country }}</p>
            </div>
          </div>

          <div *ngIf="hasAddress(customer.billingAddress)">
            <p class="text-sm font-medium text-gray-500 mb-2">Billing Address</p>
            <div class="text-base text-gray-900">
              <p *ngIf="customer.billingAddress!.street">{{ customer.billingAddress!.street }}</p>
              <p>
                <span *ngIf="customer.billingAddress!.city">{{ customer.billingAddress!.city }}<span *ngIf="customer.billingAddress!.state">, </span></span>
                <span *ngIf="customer.billingAddress!.state">{{ customer.billingAddress!.state }}</span>
                <span *ngIf="customer.billingAddress!.zipCode"> {{ customer.billingAddress!.zipCode }}</span>
              </p>
              <p *ngIf="customer.billingAddress!.country">{{ customer.billingAddress!.country }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Business Information -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Business Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngIf="customer.taxId">
            <p class="text-sm font-medium text-gray-500 mb-1">Tax ID</p>
            <p class="text-base text-gray-900">{{ customer.taxId }}</p>
          </div>

          <div *ngIf="customer.paymentTerms">
            <p class="text-sm font-medium text-gray-500 mb-1">Payment Terms</p>
            <p class="text-base text-gray-900">{{ formatPaymentTerms(customer.paymentTerms) }}</p>
          </div>

          <div *ngIf="customer.creditLimit">
            <p class="text-sm font-medium text-gray-500 mb-1">Credit Limit</p>
            <p class="text-base text-gray-900">{{ customer.creditLimit | currency }}</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="card" *ngIf="customer.notes">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Notes</h2>
        <p class="text-base text-gray-700 whitespace-pre-line">{{ customer.notes }}</p>
      </div>
    </div>
  `
})
export class CustomerViewComponent {
  @Input() customer!: Customer;
  @Output() back = new EventEmitter<void>();
  isExporting = false;

  constructor(private pdfExportService: PdfExportService) {}

  hasAddress(address: any): boolean {
    if (!address) {
      return false;
    }
    return Boolean(address.street || address.city || address.state || address.zipCode || address.country);
  }

  formatPaymentTerms(value?: string | null): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  exportToPdf(): void {
    this.isExporting = true;
    try {
      this.pdfExportService.exportCustomer(this.customer);
    } finally {
      this.isExporting = false;
    }
  }
}
