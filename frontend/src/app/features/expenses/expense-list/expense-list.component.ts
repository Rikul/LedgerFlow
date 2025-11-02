import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExpenseService, Expense } from '../expense.service';
import { FileExportService } from '../../../shared/services/file-export.service';

interface ExpenseSummary {
  total: number;
  count: number;
  taxDeductible: number;
}

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6 p-6">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
          <p class="text-gray-600">Track and manage your business expenses</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="btn-secondary flex items-center justify-center" (click)="exportExpensesToCsv()" [disabled]="!filteredExpenses.length">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Export to CSV
          </button>
          <button routerLink="/expenses/create" class="btn-primary flex items-center justify-center">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      <!-- Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.count }}</p>
          <p class="text-sm text-gray-500">Total Expenses</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ summary.total | currency }}</p>
          <p class="text-sm text-gray-500">Total Spend</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-success-600">{{ summary.taxDeductible }}</p>
          <p class="text-sm text-gray-500">Tax Deductible</p>
        </div>
        <div class="card text-center">
          <p class="text-xl font-bold text-gray-900">{{ currentMonthTotal | currency }}</p>
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
                  placeholder="Search by description, vendor or reference..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [(ngModel)]="searchTerm"
                  (input)="applyFilters()" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select class="input-field" [(ngModel)]="typeFilter" (change)="applyFilters()">
                <option value="">All Categories</option>
                <option *ngFor="let option of expenseTypes" [value]="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div class="flex items-end">
              <button class="btn-secondary w-full" (click)="resetFilters()">Reset</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Expense Table -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200">
        <div *ngIf="loading" class="py-12 px-6 text-center text-gray-500">Loading expenses...</div>
        <ng-container *ngIf="!loading">
          <div class="overflow-x-auto" *ngIf="paginatedExpenses.length; else emptyState">
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
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Payee</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('type')">
                    <div class="flex items-center">
                      Category
                      <svg *ngIf="sortColumn === 'type'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('amount')">
                    <div class="flex items-center">
                      Amount
                      <svg *ngIf="sortColumn === 'amount'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Payment Method</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Reference</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Tax Deductible</th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr *ngFor="let expense of paginatedExpenses; trackBy: trackByExpense">
                  <td class="px-2 py-2 whitespace-nowrap">{{ expense.date | date: 'mediumDate' }}</td>
                  <td class="px-2 py-2">
                    <div>
                      <p class="font-medium text-gray-900">{{ getPayeeName(expense) }}</p>
                      <p class="text-sm text-gray-500" *ngIf="expense.vendor?.email || expense.customer?.email">
                        {{ expense.vendor?.email || expense.customer?.email }}
                      </p>
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {{ getTypeLabel(expense.type) }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap font-medium">{{ expense.amount | currency }}</td>
                  <td class="px-2 py-2 whitespace-nowrap text-gray-700">{{ expense.paymentMethod || '—' }}</td>
                  <td class="px-2 py-2 whitespace-nowrap text-gray-700">{{ expense.referenceNumber || '—' }}</td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span class="status-badge" [ngClass]="expense.taxDeductible ? 'status-paid' : 'status-pending'">
                      {{ expense.taxDeductible ? 'Yes' : 'No' }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <a
                        *ngIf="expense.id"
                        [routerLink]="['/expenses/view', expense.id]"
                        class="text-primary-600 hover:text-primary-900"
                        title="View">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </a>
                      <a [routerLink]="['/expenses/edit', expense.id]" class="text-primary-600 hover:text-primary-900" title="Edit">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </a>
                      <button class="text-danger-600 hover:text-danger-900" (click)="deleteExpense(expense)" title="Delete">
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
              <p class="text-lg font-medium">No expenses found</p>
              <p class="text-sm">Create your first expense to see it listed here.</p>
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
export class ExpenseListComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private fileExportService = inject(FileExportService);

  expenses: Expense[] = [];
  filteredExpenses: Expense[] = [];
  paginatedExpenses: Expense[] = [];
  loading = false;
  error: string | null = null;

  summary: ExpenseSummary = { total: 0, count: 0, taxDeductible: 0 };
  currentMonthTotal = 0;

  searchTerm = '';
  typeFilter = '';

  sortColumn: 'date' | 'type' | 'amount' = 'date';
  sortDirection: 'asc' | 'desc' = 'desc';

  currentPage = 1;
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  startItem = 0;
  endItem = 0;

  expenseTypes = [
    { value: 'travel', label: 'Travel' },
    { value: 'meals', label: 'Meals & Entertainment' },
    { value: 'supplies', label: 'Office Supplies' },
    { value: 'utilities', label: 'Utilities' },
    { value: 'rent', label: 'Rent' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'software', label: 'Software' },
    { value: 'other', label: 'Other' },
  ];

  ngOnInit(): void {
    this.loadExpenses();
  }

  exportExpensesToCsv(): void {
    if (!this.filteredExpenses.length) {
      return;
    }

    const headers = ['Date', 'Payee', 'Category', 'Amount', 'Payment Method', 'Reference', 'Tax Deductible'];
    const rows = this.filteredExpenses.map(expense => [
      this.formatDateForExport(expense.date),
      this.getPayeeName(expense),
      this.getTypeLabel(expense.type),
      (expense.amount ?? 0).toFixed(2),
      expense.paymentMethod ?? '',
      expense.referenceNumber ?? '',
      expense.taxDeductible ? 'Yes' : 'No',
    ]);

    const filename = `expenses-${new Date().toISOString().slice(0, 10)}.csv`;
    this.fileExportService.exportToCsv(filename, headers, rows);
  }

  loadExpenses(): void {
    this.loading = true;
    this.expenseService.getExpenses().subscribe({
      next: expenses => {
        this.expenses = expenses ?? [];
        this.loading = false;
        this.updateSummary();
        this.applyFilters();
      },
      error: () => {
        this.loading = false;
        this.error = 'Unable to load expenses. Please try again later.';
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredExpenses = this.expenses.filter(expense => {
      const matchesType = !this.typeFilter || expense.type === this.typeFilter;
      if (!matchesType) {
        return false;
      }
      if (!term) {
        return true;
      }
      const haystack = [
        expense.description,
        expense.referenceNumber,
        expense.tag,
        expense.vendor?.name,
        expense.customer?.name,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(term);
    });

    this.sortExpenses();
    this.currentPage = 1;
    this.updatePagination();
  }

  sort(column: 'date' | 'type' | 'amount'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = column === 'type' ? 'asc' : 'desc';
    }
    this.sortExpenses();
    this.updatePagination();
  }

  private sortExpenses(): void {
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    this.filteredExpenses = [...this.filteredExpenses].sort((a, b) => {
      if (this.sortColumn === 'amount') {
        return (a.amount - b.amount) * direction;
      }
      if (this.sortColumn === 'type') {
        return a.type.localeCompare(b.type) * direction;
      }
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return (dateA - dateB) * direction;
    });
  }

  updatePagination(): void {
    this.totalItems = this.filteredExpenses.length;
    this.totalPages = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
    this.currentPage = Math.min(this.currentPage, this.totalPages);
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedExpenses = this.filteredExpenses.slice(startIndex, endIndex);
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
    this.typeFilter = '';
    this.applyFilters();
  }

  deleteExpense(expense: Expense): void {
    if (!expense.id) {
      return;
    }
    const confirmed = confirm(`Delete expense "${this.getPayeeName(expense)}"?`);
    if (!confirmed) {
      return;
    }

    this.expenseService.deleteExpense(expense.id).subscribe({
      next: () => {
        this.expenses = this.expenses.filter(e => e.id !== expense.id);
        this.updateSummary();
        this.applyFilters();
      },
      error: () => {
        this.error = 'Failed to delete expense. Please try again later.';
      }
    });
  }

  trackByExpense(index: number, expense: Expense): number | string {
    return expense.id ?? index;
  }

  getPayeeName(expense: Expense): string {
    if (expense.vendor?.name) {
      return expense.vendor.name;
    }
    if (expense.customer?.name) {
      return expense.customer.name;
    }
    return expense.tag || 'Unspecified';
  }

  getTypeLabel(type: string): string {
    const match = this.expenseTypes.find(option => option.value === type);
    return match ? match.label : type;
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
    const total = this.expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
    const taxDeductible = this.expenses.filter(expense => expense.taxDeductible).length;
    this.summary = {
      total,
      count: this.expenses.length,
      taxDeductible,
    };

    const currentMonth = new Date().toISOString().slice(0, 7);
    this.currentMonthTotal = this.expenses
      .filter(expense => (expense.date || '').startsWith(currentMonth))
      .reduce((sum, expense) => sum + (expense.amount || 0), 0);
  }
}
