import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaymentService, Payment } from '../payment.service';
import { FileExportService } from '../../../shared/services/file-export.service';

interface PaymentSummary {
  totalAmount: number;
  count: number;
  linkedToInvoices: number;
  currentMonthTotal: number;
}

@Component({
  selector: 'app-payment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 p-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Payments</h1>
          <p class="text-gray-600">Monitor and reconcile your business payments</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="btn-secondary flex items-center justify-center" (click)="exportPaymentsToCsv()" [disabled]="!filteredPayments.length">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Export to CSV
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.count }}</p>
          <p class="text-sm text-gray-500">Total Payments</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.totalAmount | currency }}</p>
          <p class="text-sm text-gray-500">Total Amount</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.linkedToInvoices }}</p>
          <p class="text-sm text-gray-500">Linked to Invoices</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.currentMonthTotal | currency }}</p>
          <p class="text-sm text-gray-500">This Month</p>
        </div>
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <!-- Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div class="p-4">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search by customer, vendor, invoice or reference..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [(ngModel)]="searchTerm"
                  (input)="applyFilters()" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select class="input-field" [(ngModel)]="methodFilter" (change)="applyFilters()">
                <option value="">All Methods</option>
                <option *ngFor="let option of paymentMethods" [value]="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="input-field" [(ngModel)]="statusFilter" (change)="applyFilters()">
                <option value="">All Statuses</option>
                <option *ngFor="let option of statusOptions" [value]="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button class="btn-secondary w-full" (click)="resetFilters()">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Payments Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div *ngIf="loading" class="py-12 px-6 text-center text-gray-500">Loading payments...</div>
        <ng-container *ngIf="!loading">
          <div class="overflow-x-auto" *ngIf="paginatedPayments.length; else emptyState">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('date')">
                    <div class="flex items-center">
                      Date
                      <svg *ngIf="sortColumn === 'date'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Party</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Invoice</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('amount')">
                    <div class="flex items-center">
                      Amount
                      <svg *ngIf="sortColumn === 'amount'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Method</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('status')">
                    <div class="flex items-center">
                      Status
                      <svg *ngIf="sortColumn === 'status'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Reference</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let payment of paginatedPayments; trackBy: trackByPayment">
                  <td class="px-2 py-2 whitespace-nowrap">{{ payment.date | date: 'mediumDate' }}</td>
                  <td class="px-2 py-2">
                    <div>
                      <p class="font-medium text-gray-900">{{ getPartyName(payment) }}</p>
                      <p class="text-sm text-gray-500" *ngIf="getPartyEmail(payment)">{{ getPartyEmail(payment) }}</p>
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <ng-container *ngIf="payment.invoice; else noInvoice">
                      <a [routerLink]="['/invoices', 'view', payment.invoice?.id]" class="text-primary-600 hover:text-primary-900">
                        {{ getInvoiceLabel(payment) }}
                      </a>
                    </ng-container>
                    <ng-template #noInvoice>—</ng-template>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap font-medium">{{ payment.amount | currency }}</td>
                  <td class="px-2 py-2 whitespace-nowrap text-gray-700">{{ formatMethod(payment.paymentMethod) }}</td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span class="status-badge" [ngClass]="getStatusClass(payment.status)">
                      {{ formatStatus(payment.status) }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap text-gray-700">{{ payment.referenceNumber || '—' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <ng-template #emptyState>
            <div class="py-12 px-6 text-center text-gray-500">
              <p class="text-lg font-medium">No payments found</p>
              <p class="text-sm">Record payments to see them listed here.</p>
            </div>
          </ng-template>
        </ng-container>

        <!-- Pagination -->
        <div *ngIf="totalItems > pageSize" class="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0 mt-6 pt-4 px-4 pb-4 border-t border-gray-200">
          <p class="text-sm text-gray-700">Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} results</p>
          <div class="flex space-x-2">
            <button class="btn-secondary" [disabled]="currentPage === 1" [class.opacity-50]="currentPage === 1" (click)="previousPage()">Previous</button>
            <button
              *ngFor="let page of pages"
              [ngClass]="currentPage === page ? 'btn-primary' : 'btn-secondary'"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button class="btn-secondary" [disabled]="currentPage === totalPages" [class.opacity-50]="currentPage === totalPages" (click)="nextPage()">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class PaymentListComponent implements OnInit {
  private paymentService = inject(PaymentService);
  private fileExportService = inject(FileExportService);

  payments: Payment[] = [];
  filteredPayments: Payment[] = [];
  paginatedPayments: Payment[] = [];
  loading = false;
  error: string | null = null;

  summary: PaymentSummary = {
    totalAmount: 0,
    count: 0,
    linkedToInvoices: 0,
    currentMonthTotal: 0,
  };

  searchTerm = '';
  methodFilter = '';
  statusFilter = '';

  sortColumn: 'date' | 'amount' | 'status' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  startItem = 0;
  endItem = 0;

  paymentMethods = [
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'cash', label: 'Cash' },
    { value: 'check', label: 'Check' },
    { value: 'ach', label: 'ACH' },
    { value: 'wire', label: 'Wire' },
    { value: 'other', label: 'Other' },
  ];

  statusOptions = [
    { value: 'completed', label: 'Completed' },
    { value: 'pending', label: 'Pending' },
    { value: 'reconciled', label: 'Reconciled' },
    { value: 'failed', label: 'Failed' },
  ];

  ngOnInit(): void {
    this.loadPayments();
  }

  exportPaymentsToCsv(): void {
    if (!this.filteredPayments.length) {
      return;
    }

    const headers = ['Date', 'Party', 'Invoice', 'Amount', 'Method', 'Status', 'Reference'];
    const rows = this.filteredPayments.map(payment => [
      this.formatDateForExport(payment.date),
      this.getPartyName(payment),
      this.getInvoiceLabel(payment) || '',
      (payment.amount ?? 0).toFixed(2),
      this.formatMethod(payment.paymentMethod, true),
      this.formatStatus(payment.status, true),
      payment.referenceNumber ?? '',
    ]);

    const filename = `payments-${new Date().toISOString().slice(0, 10)}.csv`;
    this.fileExportService.exportToCsv(filename, headers, rows);
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getPayments().subscribe({
      next: payments => {
        this.payments = payments ?? [];
        this.loading = false;
        this.updateSummary();
        this.applyFilters();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load payments. Please try again later.';
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredPayments = this.payments.filter(payment => {
      const matchesMethod = !this.methodFilter || (payment.paymentMethod || '') === this.methodFilter;
      const matchesStatus = !this.statusFilter || (payment.status || 'completed') === this.statusFilter;
      if (!matchesMethod || !matchesStatus) {
        return false;
      }
      if (!term) {
        return true;
      }
      const haystack = [
        this.getPartyName(payment),
        this.getPartyEmail(payment) || '',
        payment.invoice?.invoiceNumber || '',
        payment.referenceNumber || '',
        payment.notes || '',
        payment.status || '',
        payment.paymentMethod || '',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });

    this.sortPayments();
    this.currentPage = 1;
    this.updatePagination();
  }

  sort(column: 'date' | 'amount' | 'status'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = column === 'amount' ? 'desc' : 'asc';
    }
    this.sortPayments();
    this.updatePagination();
  }

  private sortPayments(): void {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.filteredPayments = [...this.filteredPayments].sort((a, b) => {
      if (this.sortColumn === 'amount') {
        return ((a.amount || 0) - (b.amount || 0)) * direction;
      }
      if (this.sortColumn === 'status') {
        return (a.status || '').localeCompare(b.status || '') * direction;
      }
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (dateA - dateB) * direction;
    });
  }

  updatePagination(): void {
    this.totalItems = this.filteredPayments.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedPayments = this.filteredPayments.slice(startIndex, endIndex);
    this.startItem = this.totalItems === 0 ? 0 : startIndex + 1;
    this.endItem = Math.min(endIndex, this.totalItems);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.methodFilter = '';
    this.statusFilter = '';
    this.applyFilters();
  }

  trackByPayment(index: number, payment: Payment): number | string {
    return payment.id ?? index;
  }

  getPartyName(payment: Payment): string {
    if (payment.vendor?.name) {
      return payment.vendor.name;
    }
    if (payment.customer?.name) {
      return payment.customer.name;
    }
    return 'Unassigned';
  }

  getPartyEmail(payment: Payment): string | null {
    return payment.vendor?.email || payment.customer?.email || null;
  }

  getInvoiceLabel(payment: Payment): string {
    const invoiceNumber = (payment.invoice?.invoiceNumber || '').trim();
    if (!invoiceNumber) {
      return '';
    }
    const status = payment.invoice?.status ? this.formatStatus(payment.invoice.status, true) : '';
    return status ? `${invoiceNumber} (${status})` : invoiceNumber;
  }

  getStatusClass(status: string | null | undefined): string {
    const normalized = (status || 'completed').toLowerCase();
    if (normalized === 'pending') {
      return 'status-pending';
    }
    if (normalized === 'failed') {
      return 'status-overdue';
    }
    return 'status-paid';
  }

  formatMethod(method?: string | null, raw = false): string {
    if (!method) {
      return raw ? '' : '—';
    }
    return this.prettify(method);
  }

  formatStatus(status?: string | null, _raw = false): string {
    return this.prettify(status || 'completed');
  }

  private formatDateForExport(value?: string | null): string {
    if (!value) {
      return '';
    }
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString();
  }

  private updateSummary(): void {
    const totalAmount = this.payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
    const linkedToInvoices = this.payments.filter(payment => !!payment.invoiceId).length;
    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthTotal = this.payments
      .filter(payment => (payment.date || '').startsWith(currentMonth))
      .reduce((sum, payment) => sum + (payment.amount || 0), 0);

    this.summary = {
      totalAmount,
      count: this.payments.length,
      linkedToInvoices,
      currentMonthTotal,
    };
  }

  private prettify(value: string): string {
    return value
      .toString()
      .replace(/[_-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }
}
