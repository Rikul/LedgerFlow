import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vendor } from './vendor.service';
import { PdfExportService } from '../../shared/services/pdf-export.service';

@Component({
  selector: 'app-vendor-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ vendor.company || vendor.contact || 'Vendor Details' }}</h1>
          <p class="text-gray-600">Vendor details and information</p>
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

      <!-- Vendor Information Card -->
      <div class="card">
        <div class="border-b border-gray-200 pb-4 mb-4">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900">Contact Information</h2>
            <span class="status-badge" [ngClass]="vendor.isActive ? 'status-paid' : 'status-overdue'">
              {{ vendor.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div *ngIf="vendor.company">
            <p class="text-sm font-medium text-gray-500 mb-1">Company</p>
            <p class="text-base text-gray-900">{{ vendor.company }}</p>
          </div>

          <div *ngIf="vendor.contact">
            <p class="text-sm font-medium text-gray-500 mb-1">Contact Person</p>
            <p class="text-base text-gray-900">{{ vendor.contact }}</p>
          </div>

          <div>
            <p class="text-sm font-medium text-gray-500 mb-1">Email</p>
            <div class="flex items-center text-base text-gray-900">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 1 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ vendor.email }}
            </div>
          </div>

          <div *ngIf="vendor.phone">
            <p class="text-sm font-medium text-gray-500 mb-1">Phone</p>
            <div class="flex items-center text-base text-gray-900">
              <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h2l2 5-2.5 1.5a11 11 0 005.5 5.5L14 13l5 2v2a2 2 0 01-2 2h-1C9.82 19 5 14.18 5 8V7a2 2 0 00-2-2z" />
              </svg>
              {{ vendor.phone }}
            </div>
          </div>
        </div>
      </div>

      <!-- Address Information -->
      <div class="card" *ngIf="hasAddress(vendor)">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Address Information</h2>

        <div class="text-base text-gray-900">
          <p *ngIf="vendor.address.street">{{ vendor.address.street }}</p>
          <p>
            <span *ngIf="vendor.address.city">{{ vendor.address.city }}<span *ngIf="vendor.address.state">, </span></span>
            <span *ngIf="vendor.address.state">{{ vendor.address.state }}</span>
            <span *ngIf="vendor.address.zipCode"> {{ vendor.address.zipCode }}</span>
          </p>
          <p *ngIf="vendor.address.country">{{ vendor.address.country }}</p>
        </div>
      </div>

      <!-- Business Information -->
      <div class="card">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Business Information</h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div *ngIf="vendor.category">
            <p class="text-sm font-medium text-gray-500 mb-1">Category</p>
            <p class="text-base text-gray-900">{{ getCategoryLabel(vendor.category) }}</p>
          </div>

          <div *ngIf="vendor.taxId">
            <p class="text-sm font-medium text-gray-500 mb-1">Tax ID</p>
            <p class="text-base text-gray-900">{{ vendor.taxId }}</p>
          </div>

          <div *ngIf="vendor.paymentTerms">
            <p class="text-sm font-medium text-gray-500 mb-1">Payment Terms</p>
            <p class="text-base text-gray-900">{{ formatPaymentTerms(vendor.paymentTerms) }}</p>
          </div>

          <div *ngIf="vendor.accountNumber">
            <p class="text-sm font-medium text-gray-500 mb-1">Account Number</p>
            <p class="text-base text-gray-900">{{ vendor.accountNumber }}</p>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="card" *ngIf="vendor.notes">
        <h2 class="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-4 mb-4">Notes</h2>
        <p class="text-base text-gray-700 whitespace-pre-line">{{ vendor.notes }}</p>
      </div>
    </div>
  `
})
export class VendorViewComponent {
  @Input() vendor!: Vendor;
  @Output() back = new EventEmitter<void>();
  isExporting = false;

  constructor(private pdfExportService: PdfExportService) {}

  hasAddress(vendor: Vendor): boolean {
    if (!vendor.address) {
      return false;
    }
    const { street, city, state, zipCode, country } = vendor.address;
    return Boolean(street || city || state || zipCode || country);
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'office_supplies': 'Office Supplies',
      'professional_services': 'Professional Services',
      'technology': 'Technology',
      'utilities': 'Utilities',
      'rent_lease': 'Rent & Lease',
      'marketing': 'Marketing',
      'travel': 'Travel',
      'other': 'Other'
    };
    return labels[category] || category;
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
      this.pdfExportService.exportVendor(this.vendor);
    } finally {
      this.isExporting = false;
    }
  }
}