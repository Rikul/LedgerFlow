import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { InvoiceService, Invoice, InvoiceStatus, InvoiceLineItem } from '../invoice.service';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="invoice; else loadingTemplate">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoice {{ invoice.invoiceNumber }}</h1>
          <p class="text-gray-600">View and manage invoice details</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button routerLink="/invoices" class="btn-secondary">Back to List</button>
          <a [routerLink]="['/invoices/edit', invoice.id]" class="btn-secondary">Edit</a>
          <button class="btn-primary" (click)="markAsSent()" *ngIf="invoice.status === 'draft'">Mark as Sent</button>
        </div>
      </div>

      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <!-- Invoice Summary -->
      <div class="card">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Status</h3>
            <span class="status-badge" [ngClass]="getStatusBadgeClass(invoice.status)">{{ invoice.status | titlecase }}</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Issue Date</p>
            <p class="font-medium text-gray-900">{{ invoice.issueDate | date: 'mediumDate' }}</p>
            <p class="text-sm text-gray-500 mt-2">Due Date</p>
            <p class="font-medium text-gray-900">{{ invoice.dueDate | date: 'mediumDate' }}</p>
          </div>
        </div>
      </div>

      <!-- Invoice Preview -->
      <div class="card bg-white">
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div class="flex flex-col md:flex-row md:justify-between md:items-start space-y-4 md:space-y-0">
            <div>
              <h2 class="text-2xl font-bold text-gray-900">Bill To</h2>
              <div class="mt-3 text-gray-700">
                <p class="font-medium text-lg">{{ invoice.customer?.name || 'Customer' }}</p>
                <p *ngIf="invoice.customer?.company">{{ invoice.customer?.company }}</p>
                <p *ngIf="invoice.customer?.email">{{ invoice.customer?.email }}</p>
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-900">Invoice</h2>
              <p class="text-lg font-medium text-gray-600 mt-1">{{ invoice.invoiceNumber }}</p>
              <div class="mt-4 text-sm">
                <p><span class="font-medium">Issue Date:</span> {{ invoice.issueDate | date: 'mediumDate' }}</p>
                <p><span class="font-medium">Due Date:</span> {{ invoice.dueDate | date: 'mediumDate' }}</p>
                <p><span class="font-medium">Payment Terms:</span> {{ invoice.paymentTerms | titlecase }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <div class="mb-6" *ngIf="invoice.lineItems?.length; else noItems">
          <table class="w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 text-gray-900 font-medium">Description</th>
                <th class="text-center py-3 text-gray-900 font-medium">Qty</th>
                <th class="text-right py-3 text-gray-900 font-medium">Rate</th>
                <th class="text-right py-3 text-gray-900 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-100" *ngFor="let item of invoice.lineItems">
                <td class="py-4">
                  <p class="font-medium text-gray-900">{{ item.description }}</p>
                </td>
                <td class="text-center py-4">{{ item.quantity }}</td>
                <td class="text-right py-4">{{ item.rate | currency }}</td>
                <td class="text-right py-4 font-medium">{{ getLineItemTotal(item) | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ng-template #noItems>
          <p class="text-center text-gray-500 py-6">No line items were added to this invoice.</p>
        </ng-template>

        <!-- Invoice Totals -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex justify-end">
            <div class="w-full md:w-72">
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">{{ invoice.subtotal | currency }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Tax ({{ invoice.taxRate || 0 }}%):</span>
                <span class="font-medium">{{ invoice.taxTotal | currency }}</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Discount:</span>
                <span class="font-medium">{{ invoice.discountTotal | currency }}</span>
              </div>
              <div class="flex justify-between py-2 border-t border-gray-200 mt-2">
                <span class="text-lg font-semibold text-gray-900">Total:</span>
                <span class="text-lg font-bold text-gray-900">{{ invoice.total | currency }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes -->
        <div class="mt-8 pt-6 border-t border-gray-200" *ngIf="invoice.notes || invoice.terms">
          <div *ngIf="invoice.notes" class="mb-4">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Notes</h3>
            <p class="text-gray-600 whitespace-pre-line">{{ invoice.notes }}</p>
          </div>
          <div *ngIf="invoice.terms">
            <h3 class="text-lg font-medium text-gray-900 mb-2">Terms &amp; Conditions</h3>
            <p class="text-gray-600 whitespace-pre-line">{{ invoice.terms }}</p>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate>
      <div class="py-12 text-center text-gray-500 space-y-3">
        <p class="text-lg">{{ error ? error : 'Loading invoice...' }}</p>
        <div *ngIf="error">
          <a routerLink="/invoices" class="btn-secondary inline-flex items-center justify-center">Back to list</a>
        </div>
      </div>
    </ng-template>
  `,
  styles: []
})
export class InvoiceViewComponent implements OnInit {
  invoice: Invoice | null = null;
  error: string | null = null;

  constructor(
    private invoiceService: InvoiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadInvoice(Number(id));
      } else {
        this.router.navigate(['/invoices']);
      }
    });
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

  getLineItemTotal(item: InvoiceLineItem): number {
    return (item.quantity || 0) * (item.rate || 0);
  }

  markAsSent(): void {
    if (!this.invoice?.id) {
      return;
    }
    const updated: Invoice = {
      ...this.invoice,
      status: 'sent',
    };
    this.invoiceService.updateInvoice(updated).subscribe({
      next: invoice => {
        this.invoice = invoice;
        this.error = null;
      },
      error: () => {
        this.error = 'Failed to update invoice status.';
      }
    });
  }

  private loadInvoice(id: number): void {
    this.invoiceService.getInvoice(id).subscribe({
      next: invoice => {
        this.invoice = invoice;
        this.error = null;
      },
      error: () => {
        this.error = 'Invoice not found.';
        this.invoice = null;
      }
    });
  }
}
