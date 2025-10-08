import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Customer } from './customer.service';

@Component({
  selector: 'app-customer-view',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card p-6">
      <button class="btn-outline mb-4" (click)="back.emit()">Back to the list</button>
      <h2 class="text-xl font-bold mb-2">{{ customer.name }}</h2>
      <div class="mb-2"><strong>Email:</strong> {{ customer.email }}</div>
      <div *ngIf="customer.company" class="mb-2"><strong>Company:</strong> {{ customer.company }}</div>
      <div *ngIf="customer.phone" class="mb-2"><strong>Phone:</strong> {{ customer.phone }}</div>
      <div *ngIf="customer.address" class="mb-2">
        <strong>Address:</strong>
        {{ customer.address.street }}, {{ customer.address.city }}, {{ customer.address.state }} {{ customer.address.zipCode }}, {{ customer.address.country }}
      </div>
      <div *ngIf="customer.billingAddress" class="mb-2">
        <strong>Billing Address:</strong>
        {{ customer.billingAddress.street }}, {{ customer.billingAddress.city }}, {{ customer.billingAddress.state }} {{ customer.billingAddress.zipCode }}, {{ customer.billingAddress.country }}
      </div>
      <div *ngIf="customer.taxId" class="mb-2"><strong>Tax ID:</strong> {{ customer.taxId }}</div>
      <div *ngIf="customer.paymentTerms" class="mb-2"><strong>Payment Terms:</strong> {{ customer.paymentTerms }}</div>
      <div *ngIf="customer.creditLimit" class="mb-2"><strong>Credit Limit:</strong> {{ customer.creditLimit }}</div>
      <div *ngIf="customer.notes" class="mb-2"><strong>Notes:</strong> {{ customer.notes }}</div>
      <div class="mt-4"><span class="px-2 py-1 rounded-full" [class]="customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
        {{ customer.isActive ? 'Active' : 'Inactive' }}
      </span></div>
    </div>
  `
})
export class CustomerViewComponent {
  @Input() customer!: Customer;
  @Output() back = new EventEmitter<void>();
}
