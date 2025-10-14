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
              class="w-full input-field border border-gray-300 rounded-md"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"/>
          </div>
          <div  class="md:col-span-1">
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
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div *ngIf="loading" class="py-12 px-6 text-center text-gray-500">Loading invoices...</div>
        <ng-container *ngIf="!loading">
          <div class="overflow-x-auto" *ngIf="filteredInvoices.length; else emptyState">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('invoiceNumber')">
                    <div class="flex items-center">
                      Invoice #
                      <svg *ngIf="sortColumn === 'invoiceNumber'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('customer')">
                    <div class="flex items-center">
                      Customer
                      <svg *ngIf="sortColumn === 'customer'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('date')">
                    <div class="flex items-center">
                      Date
                      <svg *ngIf="sortColumn === 'date'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('dueDate')">
                    <div class="flex items-center">
                      Due Date
                      <svg *ngIf="sortColumn === 'dueDate'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('total')">
                    <div class="flex items-center">
                      Total
                      <svg *ngIf="sortColumn === 'total'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('status')">
                    <div class="flex items-center">
                      Status
                      <svg *ngIf="sortColumn === 'status'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let invoice of filteredInvoices; trackBy: trackByInvoice">
                  <td class="px-2 py-2 whitespace-nowrap font-medium text-primary-600">{{ invoice.invoiceNumber }}</td>
                  <td class="px-2 py-2">
                    <div>
                      <p class="font-medium text-gray-900">{{ invoice.customer?.name || 'Unknown Customer' }}</p>
                      <p class="text-sm text-gray-500" *ngIf="invoice.customer?.email">{{ invoice.customer?.email }}</p>
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">{{ invoice.issueDate | date: 'mediumDate' }}</td>
                  <td class="px-2 py-2 whitespace-nowrap">{{ invoice.dueDate | date: 'mediumDate' }}</td>
                  <td class="px-2 py-2 whitespace-nowrap font-medium">{{ invoice.total | currency }}</td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span class="status-badge" [ngClass]="getStatusBadgeClass(invoice.status)">
                      {{ invoice.status | titlecase }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <a [routerLink]="['/invoices/view', invoice.id]" class="text-primary-600 hover:text-primary-900" title="View">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <a [routerLink]="['/invoices/edit', invoice.id]" class="text-gray-600 hover:text-gray-900" title="Edit">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button class="text-danger-600 hover:text-danger-900" (click)="deleteInvoice(invoice)" title="Delete">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyState>
            <div class="py-12 px-6 text-center text-gray-500">
              <p class="text-lg font-medium">No invoices found</p>
              <p class="text-sm">Create your first invoice to see it listed here.</p>
            </div>
          </ng-template>
        </ng-container>
      </div>
    </div>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];
  filteredInvoices: Invoice[] = [];
  loading = false;
  error: string | null = null;
  searchTerm = '';
  statusFilter = '';
  sortColumn = '';
  sortDirection: 'asc' | 'desc' = 'asc';
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
    this.applySorting();
    this.updateStatusCounts();
  }

  sort(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySorting();
  }

  private applySorting(): void {
    if (!this.sortColumn) return;

    this.filteredInvoices.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (this.sortColumn) {
        case 'invoiceNumber':
          aValue = a.invoiceNumber;
          bValue = b.invoiceNumber;
          break;
        case 'customer':
          aValue = a.customer?.name || '';
          bValue = b.customer?.name || '';
          break;
        case 'date':
          aValue = a.issueDate ? new Date(a.issueDate) : new Date(0);
          bValue = b.issueDate ? new Date(b.issueDate) : new Date(0);
          break;
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate) : new Date(0);
          bValue = b.dueDate ? new Date(b.dueDate) : new Date(0);
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.statusFilter = '';
    this.filteredInvoices = [...this.invoices];
    this.applySorting();
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
