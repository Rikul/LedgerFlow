import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vendor } from './vendor.service';

@Component({
  selector: 'app-vendor-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6">
      <button class="btn-outline mb-4" (click)="back.emit()">Back to the list</button>
      <h2 class="text-xl font-bold mb-2">{{ vendor.company || vendor.contact || 'Vendor Details' }}</h2>
      <div *ngIf="vendor.contact" class="mb-2"><strong>Contact:</strong> {{ vendor.contact }}</div>
      <div class="mb-2"><strong>Email:</strong> {{ vendor.email }}</div>
      <div *ngIf="vendor.phone" class="mb-2"><strong>Phone:</strong> {{ vendor.phone }}</div>
      <div *ngIf="hasAddress(vendor)" class="mb-2">
        <strong>Address:</strong>
        {{ formatAddress(vendor) }}
      </div>
      <div *ngIf="vendor.taxId" class="mb-2"><strong>Tax ID:</strong> {{ vendor.taxId }}</div>
      <div *ngIf="vendor.paymentTerms" class="mb-2"><strong>Payment Terms:</strong> {{ vendor.paymentTerms }}</div>
      <div *ngIf="vendor.category" class="mb-2"><strong>Category:</strong> {{ getCategoryLabel(vendor.category) }}</div>
      <div *ngIf="vendor.accountNumber" class="mb-2"><strong>Account Number:</strong> {{ vendor.accountNumber }}</div>
      <div *ngIf="vendor.notes" class="mb-2"><strong>Notes:</strong> {{ vendor.notes }}</div>
      <div class="mt-4"><span class="px-2 py-1 rounded-full" [class]="vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ vendor.isActive ? 'Active' : 'Inactive' }}
      </span></div>
    </div>
  `
})
export class VendorViewComponent {
  @Input() vendor!: Vendor;
  @Output() back = new EventEmitter<void>();

  hasAddress(vendor: Vendor): boolean {
    if (!vendor.address) {
      return false;
    }
    const { street, city, state, zipCode, country } = vendor.address;
    return Boolean(street || city || state || zipCode || country);
  }

  formatAddress(vendor: Vendor): string {
    if (!vendor.address) {
      return '';
    }
    const { street, city, state, zipCode, country } = vendor.address;
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
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
}