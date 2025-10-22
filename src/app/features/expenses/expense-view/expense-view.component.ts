import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Expense, ExpenseService } from '../expense.service';
import { PdfExportService } from '../../../shared/services/pdf-export.service';

@Component({
  selector: 'app-expense-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6 p-6" *ngIf="expense; else loadingTemplate">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Expense Details</h1>
          <p class="text-gray-600">Review a single expense record and export the summary</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button routerLink="/expenses" class="btn-secondary">Back to List</button>
          <a *ngIf="expense?.id" [routerLink]="['/expenses/edit', expense.id]" class="btn-secondary">Edit</a>
          <button class="btn-primary" (click)="exportExpenseToPdf()" [disabled]="isExporting">{{ isExporting ? 'Preparing...' : 'Export to PDF' }}</button>
        </div>
      </div>

      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-6">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Expense Overview</h2>
            <dl class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt class="text-sm text-gray-500">Amount</dt>
                <dd class="text-base font-medium text-gray-900">{{ expense.amount | currency }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Date</dt>
                <dd class="text-base font-medium text-gray-900">{{ expense.date | date: 'mediumDate' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Category</dt>
                <dd class="text-base font-medium text-gray-900">{{ formatCategory(expense.type) }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Payment Method</dt>
                <dd class="text-base font-medium text-gray-900">{{ expense.paymentMethod || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Reference #</dt>
                <dd class="text-base font-medium text-gray-900">{{ expense.referenceNumber || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Tag</dt>
                <dd class="text-base font-medium text-gray-900">{{ expense.tag || '—' }}</dd>
              </div>
              <div>
                <dt class="text-sm text-gray-500">Tax Deductible</dt>
                <dd>
                  <span class="status-badge" [ngClass]="expense.taxDeductible ? 'status-paid' : 'status-pending'">
                    {{ expense.taxDeductible ? 'Yes' : 'No' }}
                  </span>
                </dd>
              </div>
            </dl>
          </div>

          <div class="card" *ngIf="expense.description">
            <h2 class="text-lg font-semibold text-gray-900 mb-3">Description</h2>
            <p class="text-gray-700 whitespace-pre-line">{{ expense.description }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="card">
            <h2 class="text-lg font-semibold text-gray-900 mb-4">Associated Contact</h2>
            <ng-container *ngIf="hasAssociation(); else noAssociation">
              <div class="space-y-3" *ngIf="expense.vendor">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Vendor</h3>
                <p class="text-base font-medium text-gray-900">{{ expense.vendor.name }}</p>
                <p *ngIf="expense.vendor.email" class="text-sm text-gray-600">{{ expense.vendor.email }}</p>
              </div>
              <div class="space-y-3" *ngIf="expense.customer">
                <h3 class="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer</h3>
                <p class="text-base font-medium text-gray-900">{{ expense.customer.name }}</p>
                <p *ngIf="expense.customer.email" class="text-sm text-gray-600">{{ expense.customer.email }}</p>
              </div>
            </ng-container>
            <ng-template #noAssociation>
              <p class="text-sm text-gray-500">No associated vendor or customer was recorded for this expense.</p>
            </ng-template>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="py-12 text-center text-gray-500 space-y-3">
        <p class="text-lg">{{ error ? error : 'Loading expense...' }}</p>
        <div *ngIf="error">
          <a routerLink="/expenses" class="btn-secondary inline-flex items-center justify-center">Back to list</a>
        </div>
      </div>
    </ng-template>
  `,
  styles: []
})
export class ExpenseViewComponent implements OnInit {
  expense: Expense | null = null;
  error: string | null = null;
  isExporting = false;

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly pdfExportService: PdfExportService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) {
        this.router.navigate(['/expenses']);
        return;
      }

      this.loadExpense(Number(id));
    });
  }

  exportExpenseToPdf(): void {
    if (!this.expense) {
      return;
    }
    this.isExporting = true;
    try {
      this.pdfExportService.exportExpense(this.expense);
    } finally {
      this.isExporting = false;
    }
  }

  formatCategory(category: string | undefined | null): string {
    if (!category) {
      return '—';
    }
    return category.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  }

  hasAssociation(): boolean {
    return Boolean(this.expense?.vendor || this.expense?.customer);
  }

  private loadExpense(id: number): void {
    this.error = null;
    this.expense = null;

    this.expenseService.getExpense(id).subscribe({
      next: expense => {
        this.expense = expense;
        this.error = null;
      },
      error: () => {
        this.error = 'Unable to load the requested expense.';
      }
    });
  }
}
