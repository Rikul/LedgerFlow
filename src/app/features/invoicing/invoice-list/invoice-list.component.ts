import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InvoiceService, Invoice, InvoiceStatus } from '../invoice.service';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
          <p class="text-gray-600">Manage and track your invoices</p>
        </div>
        <button routerLink="/invoices/create" class="btn-primary flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Invoice
        </button>
      </div>

      <!-- Filters -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input
              type="text"
              placeholder="Search by number, customer or status..."
              class="input-field"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select class="input-field" [(ngModel)]="statusFilter" (change)="applyFilters()">
              <option value="">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="btn-secondary w-full" (click)="resetFilters()">Reset</button>
          </div>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-2xl font-bold text-gray-900">{{ statusCounts.total }}</p>
          <p class="text-sm text-gray-500">Total Invoices</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-gray-900">{{ statusCounts.draft }}</p>
          <p class="text-sm text-gray-500">Draft</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-success-600">{{ statusCounts.paid }}</p>
          <p class="text-sm text-gray-500">Paid</p>
        </div>
        <div class="card text-center">
          <p class="text-2xl font-bold text-warning-600">{{ statusCounts.overdue }}</p>
          <p class="text-sm text-gray-500">Overdue</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <!-- Invoice Table -->
      <div class="card">
        <div *ngIf="loading" class="py-12 text-center text-gray-500">Loading invoices...</div>
        <ng-container *ngIf="!loading">
          <div class="overflow-x-auto" *ngIf="filteredInvoices.length; else emptyState">
            <table class="table w-full">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Invoice #</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Due Date</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th scope="col" class="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let invoice of filteredInvoices; trackBy: trackByInvoice">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-primary-600">{{ invoice.invoiceNumber }}</td>
                  <td class="px-6 py-4">
                    <div>
                      <p class="font-medium text-gray-900">{{ invoice.customer?.name || 'Unknown Customer' }}</p>
                      <p class="text-sm text-gray-500" *ngIf="invoice.customer?.email">{{ invoice.customer?.email }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ invoice.issueDate | date: 'mediumDate' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ invoice.dueDate | date: 'mediumDate' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap font-medium">{{ invoice.total | currency }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="status-badge" [ngClass]="getStatusBadgeClass(invoice.status)">
                      {{ invoice.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <a [routerLink]="['/invoices/view', invoice.id]" class="text-primary-600 hover:text-primary-900">View</a>
                      <a [routerLink]="['/invoices/edit', invoice.id]" class="text-gray-600 hover:text-gray-900">Edit</a>
                      <button class="text-danger-600 hover:text-danger-900" (click)="deleteInvoice(invoice)">Delete</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyState>
            <div class="py-12 text-center text-gray-500">
              <p class="text-lg font-medium">No invoices found</p>
              <p class="text-sm">Create your first invoice to see it listed here.</p>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  statusFilter = '';
  statusCounts: Record<'total' | InvoiceStatus, number> = {
    total: 0,
    draft: 0,
    sent: 0,
    paid: 0,
    overdue: 0,
  };

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.error = null;
    this.invoiceService.getInvoices().subscribe({
      next: invoices => {
        this.invoices = invoices;
        this.filteredInvoices = [...invoices];
        this.loading = false;
        this.updateStatusCounts();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load invoices at this time.';
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    const status = this.statusFilter;
    this.filteredInvoices = this.invoices.filter(invoice => {
      const matchesTerm =
        !term ||
        invoice.invoiceNumber.toLowerCase().includes(term) ||
        (invoice.customer?.name || '').toLowerCase().includes(term) ||
        invoice.status.toLowerCase().includes(term);
      const matchesStatus = !status || invoice.status === status;
      return matchesTerm && matchesStatus;
    });
    this.updateStatusCounts();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredInvoices = [...this.invoices];
    this.updateStatusCounts();
  }

  deleteInvoice(invoice: Invoice): void {
    if (!invoice.id) {
      return;
    }
    const confirmed = confirm(`Delete invoice ${invoice.invoiceNumber}?`);
    if (!confirmed) {
      return;
    }
    this.invoiceService.deleteInvoice(invoice.id).subscribe({
      next: () => {
        this.invoices = this.invoices.filter(i => i.id !== invoice.id);
        this.applyFilters();
      },
      error: () => {
        this.error = 'Failed to delete invoice. Please try again.';
      }
    });
  }

  trackByInvoice(_: number, invoice: Invoice): number | undefined {
    return invoice.id;
  }

  getStatusBadgeClass(status: InvoiceStatus): string {
    switch (status) {
      case 'paid':
        return 'status-paid';
      case 'overdue':
        return 'status-overdue';
      case 'sent':
        return 'status-pending';
      default:
        return 'status-draft';
    }
  }

  private updateStatusCounts(): void {
    const counts: Record<'total' | InvoiceStatus, number> = {
      total: this.filteredInvoices.length,
      draft: 0,
      sent: 0,
      paid: 0,
      overdue: 0,
    };
    for (const invoice of this.filteredInvoices) {
      counts[invoice.status] = (counts[invoice.status] || 0) + 1;
    }
    this.statusCounts = counts;
  }
}
