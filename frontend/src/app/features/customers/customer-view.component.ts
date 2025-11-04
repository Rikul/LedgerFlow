import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from './customer.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6 space-y-6">
      <button class="btn-outline w-fit" (click)="back.emit()">Back to the list</button>

      <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div class="space-y-3">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">{{ customer.name }}</h2>
            <p *ngIf="customer.company" class="text-gray-500">{{ customer.company }}</p>
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-600">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ customer.email }}
            </div>
            <div *ngIf="customer.phone" class="flex items-center gap-2">
              <svg class="w-4 h-4 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h2l2 5-2.5 1.5a11 11 0 005.5 5.5L14 13l5 2v2a2 2 0 01-2 2h-1C9.82 19 5 14.18 5 8V7a2 2 0 00-2-2z" />
              </svg>
              {{ customer.phone }}
            </div>
          </div>
        </div>

        <div class="flex flex-col items-start md:items-end gap-3">
          <span class="px-3 py-1 rounded-full text-sm font-medium" [ngClass]="customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
            {{ customer.isActive ? 'Active Customer' : 'Inactive Customer' }}
          </span>

          <div class="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-700 space-y-2">
            <div><span class="font-medium text-gray-600">Payment Terms:</span> <span class="text-gray-900">{{ formatPaymentTerms(customer.paymentTerms) }}</span></div>
            <div *ngIf="customer.creditLimit"><span class="font-medium text-gray-600">Credit Limit:</span> <span class="text-gray-900">{{ customer.creditLimit | currency:'USD':'symbol':'1.0-0' }}</span></div>
            <div *ngIf="customer.taxId"><span class="font-medium text-gray-600">Tax ID:</span> <span class="text-gray-900">{{ customer.taxId }}</span></div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section class="border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14c-4.418 0-8 2.015-8 4.5V21h16v-2.5c0-2.485-3.582-4.5-8-4.5z" />
            </svg>
            Contact Details
          </h3>

          <div class="space-y-2 text-sm text-gray-700">
            <div><span class="font-medium text-gray-600">Email:</span> {{ customer.email }}</div>
            <div *ngIf="customer.phone"><span class="font-medium text-gray-600">Phone:</span> {{ customer.phone }}</div>
            <div *ngIf="customer.company"><span class="font-medium text-gray-600">Company:</span> {{ customer.company }}</div>
          </div>

          <div *ngIf="customer.notes" class="pt-4 border-t border-gray-200 text-sm text-gray-700">
            <h4 class="font-medium text-gray-900 mb-1">Notes</h4>
            <p class="leading-relaxed">{{ customer.notes }}</p>
          </div>
        </section>

        <section class="border border-gray-200 rounded-lg p-5 space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <svg class="w-5 h-5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7l9-4 9 4-9 4-9-4z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10l-9 4-9-4" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12v6l7 3 7-3v-6" />
            </svg>
            Addresses
          </h3>

          <div class="space-y-3 text-sm text-gray-700">
            <div *ngIf="hasAddress(customer.address)">
              <h4 class="font-medium text-gray-900 mb-1">Primary Address</h4>
              <p class="leading-relaxed">{{ formatAddress(customer.address) }}</p>
            </div>
            <div *ngIf="customer.billingAddress && hasAddress(customer.billingAddress)">
              <h4 class="font-medium text-gray-900 mb-1">Billing Address</h4>
              <p class="leading-relaxed">{{ formatAddress(customer.billingAddress) }}</p>
            </div>
            <p *ngIf="!hasAddress(customer.address) && !(customer.billingAddress && hasAddress(customer.billingAddress))" class="text-gray-500">
              No address information provided.
            </p>
          </div>
        </section>
      </div>
    </div>
  `
})
export class CustomerViewComponent {
  @Input() customer!: Customer;
  @Output() back = new EventEmitter<void>();

  formatPaymentTerms(value?: string | null): string {
    if (!value) {
      return '—';
    }
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  hasAddress(address?: Customer['address'] | Customer['billingAddress']): boolean {
    if (!address) {
      return false;
    }
    const { street, city, state, zipCode, country } = address;
    return Boolean(street || city || state || zipCode || country);
  }

  formatAddress(address?: Customer['address'] | Customer['billingAddress']): string {
    if (!address) {
      return '';
    }
    const { street, city, state, zipCode, country } = address;
    return [street, city, state, zipCode, country].filter(Boolean).join(', ');
  }
}
