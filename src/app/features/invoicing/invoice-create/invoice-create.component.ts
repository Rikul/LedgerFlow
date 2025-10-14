import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { InvoiceService, Invoice, InvoiceLineItem, InvoiceStatus } from '../invoice.service';
import { CustomerService, Customer } from '../../customers/customer.service';

interface InvoiceTotals {
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  total: number;
}

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="space-y-6" *ngIf="!loadingInvoice; else loadingTemplate">
      <!-- Page Header -->
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit Invoice' : 'Create Invoice' }}</h1>
          <p class="text-gray-600">{{ isEditMode ? 'Update your invoice details' : 'Create a new invoice for your customer' }}</p>
        </div>
        <div class="flex space-x-3">
          <button routerLink="/invoices" class="btn-secondary">Cancel</button>
          <button class="btn-primary" (click)="submit()" [disabled]="form.invalid || submitting">
            {{ submitting ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Invoice' : 'Create Invoice') }}
          </button>
        </div>
      </div>

      <div *ngIf="error" class="alert-danger">{{ error }}</div>

      <!-- Invoice Form -->
      <form [formGroup]="form" class="space-y-6">
        <!-- Invoice Details -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Select Customer</label>
              <ng-container *ngIf="customers.length; else noCustomers">
                <select class="form-input" formControlName="customerId">
                  <option value="" disabled>Select a customer</option>
                  <option *ngFor="let customer of customers" [value]="customer.id">{{ customer.name }}</option>
                </select>
              </ng-container>
              <ng-template #noCustomers>
                <div class="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                  No customers found. <a routerLink="/customers" class="text-primary-600 hover:text-primary-900">Create a customer</a> to invoice them.
                </div>
              </ng-template>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
              <input type="text" class="form-input" formControlName="invoiceNumber" placeholder="INV-0001" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
              <input type="date" class="form-input" formControlName="issueDate" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
              <input type="date" class="form-input" formControlName="dueDate" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
              <select class="form-input" formControlName="paymentTerms">
                <option value="net15">Net 15 days</option>
                <option value="net30">Net 30 days</option>
                <option value="net60">Net 60 days</option>
                <option value="due_on_receipt">Due on receipt</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select class="form-input" formControlName="status">
                <option *ngFor="let status of statusOptions" [value]="status">{{ status | titlecase }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Line Items -->
        <div class="card" formArrayName="lineItems">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">Line Items</h3>
            <button type="button" class="btn-secondary" (click)="addLineItem()">Add Item</button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
              <div class="col-span-5">Description</div>
              <div class="col-span-2">Qty</div>
              <div class="col-span-2">Rate</div>
              <div class="col-span-2">Tax %</div>
              <div class="col-span-1 text-right">Amount</div>
            </div>

            <div
              class="grid grid-cols-12 gap-2 items-start"
              *ngFor="let item of lineItems.controls; let i = index; trackBy: trackByIndex"
              [formGroupName]="i">
              <div class="col-span-5">
                <input type="text" class="form-input" formControlName="description" placeholder="Item description" />
              </div>
              <div class="col-span-2">
                <input type="number" min="0" step="1" class="form-input" formControlName="quantity" />
              </div>
              <div class="col-span-2">
                <input type="number" min="0" step="1" class="form-input" formControlName="rate" />
              </div>
              <div class="col-span-2">
                <input type="number" min="0" step="0.1" class="form-input" formControlName="taxRate" />
              </div>
              <div class="col-span-1 flex items-center justify-between">
                <span class="font-medium text-right">{{ calculateLineItemAmount(i) | currency }}</span>
                <button type="button" class="text-danger-600 hover:text-danger-900" (click)="removeLineItem(i)">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Information -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea class="form-input" rows="3" formControlName="notes" placeholder="Additional notes for the customer"></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Terms &amp; Conditions</label>
              <textarea class="form-input" rows="3" formControlName="terms" placeholder="Payment terms and conditions"></textarea>
            </div>
          </div>
        </div>

        <!-- Invoice Summary -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
          <div class="space-y-3">
            <div class="flex justify-between">
              <span class="text-gray-600">Subtotal:</span>
              <span class="font-medium">{{ totals.subtotal | currency }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Tax:</span>
              <span class="font-medium">{{ totals.taxTotal | currency }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span><label class="text-gray-600" for="discountTotal">Discount:</label></span>
              <span><input
                id="discountTotal"
                type="number"
                min="0"
                step="1"
                class="form-input w-20 text-right"
                formControlName="discountTotal" /></span>
            </div>
            <hr class="border-gray-200" />
            <div class="flex justify-between text-lg">
              <span class="font-semibold text-gray-900">Total:</span>
              <span class="font-bold text-gray-900">{{ totals.total | currency }}</span>
            </div>
          </div>
        </div>
      </form>
    </div>

    <ng-template #loadingTemplate>
      <div class="py-12 text-center text-gray-500">Loading invoice...</div>
    </ng-template>
  `,
  styles: []
})
export class InvoiceCreateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  customers: Customer[] = [];
  statusOptions: InvoiceStatus[] = ['draft', 'sent', 'paid', 'overdue'];
  totals: InvoiceTotals = { subtotal: 0, taxTotal: 0, discountTotal: 0, total: 0 };
  submitting = false;
  loadingInvoice = false;
  isEditMode = false;
  error: string | null = null;
  private invoiceId?: number;
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private customerService: CustomerService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.form = this.fb.group({
      invoiceNumber: ['', Validators.required],
      customerId: [null, Validators.required],
      status: ['draft', Validators.required],
      issueDate: ['', Validators.required],
      dueDate: ['', Validators.required],
      paymentTerms: ['net30', Validators.required],
      notes: [''],
      terms: [''],
      discountTotal: [0, [Validators.min(0)]],
      lineItems: this.fb.array([this.createLineItemGroup()])
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
    this.observeTotals();

    this.route.paramMap.pipe(takeUntil(this.destroy$)).subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.invoiceId = Number(id);
        this.loadInvoice(this.invoiceId);
      } else {
        this.isEditMode = false;
        this.invoiceId = undefined;
        this.ensureInvoiceNumber();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get lineItems(): FormArray {
    return this.form.get('lineItems') as FormArray;
  }

  addLineItem(): void {
    this.lineItems.push(this.createLineItemGroup());
  }

  removeLineItem(index: number): void {
    if (this.lineItems.length === 1) {
      this.lineItems.at(0).reset({ description: '', quantity: 1, rate: 0, taxRate: 0 });
      this.calculateTotals();
      return;
    }
    this.lineItems.removeAt(index);
    this.calculateTotals();
  }

  trackByIndex(index: number): number {
    return index;
  }

  calculateLineItemAmount(index: number): number {
    const group = this.lineItems.at(index);
    if (!group) {
      return 0;
    }
    const { quantity, rate } = group.value as InvoiceLineItem;
    return this.toNumber(quantity) * this.toNumber(rate);
  }

  submit(): void {
    if (this.form.invalid || this.submitting) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.buildPayload();
    if (!payload.lineItems.length) {
      this.error = 'Add at least one line item before saving the invoice.';
      return;
    }

    this.submitting = true;
    this.error = null;

    const request$ = this.isEditMode && this.invoiceId
      ? this.invoiceService.updateInvoice({ ...payload, id: this.invoiceId })
            : this.invoiceService.createInvoice(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: invoice => {
        this.submitting = false;
        this.router.navigate(['/invoices/view', invoice.id]);
      },
      error: () => {
        this.submitting = false;
        this.error = 'Failed to save invoice. Please check the details and try again.';
      }
    });
  }

  private createLineItemGroup(item?: InvoiceLineItem): FormGroup {
    return this.fb.group({
      description: [item?.description || '', Validators.required],
      quantity: [item?.quantity ?? 1, [Validators.required, Validators.min(0)]],
      rate: [item?.rate ?? 0, [Validators.required, Validators.min(0)]],
      taxRate: [item?.taxRate ?? 0, [Validators.min(0)]],
    });
  }

  private loadCustomers(): void {
    this.customerService.getCustomers().pipe(takeUntil(this.destroy$)).subscribe({
      next: customers => {
        this.customers = customers;
      },
      error: () => {
        this.error = 'Failed to load customers. Please refresh the page.';
      }
    });
  }

  private loadInvoice(id: number): void {
    this.loadingInvoice = true;
    this.invoiceService.getInvoice(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: invoice => {
        this.loadingInvoice = false;
        this.patchInvoice(invoice);
      },
      error: () => {
        this.loadingInvoice = false;
        this.error = 'Unable to load the invoice. It may have been removed.';
        this.router.navigate(['/invoices']);
      }
    });
  }

  private patchInvoice(invoice: Invoice): void {
    this.form.patchValue({
      invoiceNumber: invoice.invoiceNumber,
      customerId: invoice.customerId,
      status: invoice.status,
      issueDate: invoice.issueDate,
      dueDate: invoice.dueDate,
      paymentTerms: invoice.paymentTerms,
      notes: invoice.notes,
      terms: invoice.terms,
      discountTotal: invoice.discountTotal ?? 0,
    });

    this.lineItems.clear();
    if (invoice.lineItems?.length) {
      invoice.lineItems.forEach(item => this.lineItems.push(this.createLineItemGroup(item)));
    } else {
      this.lineItems.push(this.createLineItemGroup());
    }
    this.calculateTotals();
  }

  private buildPayload(): Invoice {
    const value = this.form.value;
    const discount = this.toNumber(value.discountTotal);
    const lineItems = this.lineItems.controls
      .map(group => group.value as InvoiceLineItem)
      .filter(item => (item.description || '').trim().length > 0)
      .map(item => ({
        description: item.description.trim(),
        quantity: this.toNumber(item.quantity),
        rate: this.toNumber(item.rate),
        taxRate: this.toNumber(item.taxRate),
      }));

    const totals = this.calculateTotals();

    return {
      invoiceNumber: value.invoiceNumber.trim(),
      customerId: Number(value.customerId),
      status: value.status,
      issueDate: value.issueDate,
      dueDate: value.dueDate,
      paymentTerms: value.paymentTerms,
      notes: value.notes,
      terms: value.terms,
      subtotal: totals.subtotal,
      taxTotal: totals.taxTotal,
      discountTotal: discount,
      total: totals.total,
      lineItems,
    };
  }

  private observeTotals(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.calculateTotals();
    });
    this.calculateTotals();
  }

  private calculateTotals(): InvoiceTotals {
    const items = this.lineItems.controls.map(group => group.value as InvoiceLineItem);
    const subtotal = items.reduce((sum, item) => sum + this.toNumber(item.quantity) * this.toNumber(item.rate), 0);
    const taxTotal = items.reduce((sum, item) => {
      const amount = this.toNumber(item.quantity) * this.toNumber(item.rate);
      return sum + amount * (this.toNumber(item.taxRate) / 100);
    }, 0);
    const discount = this.toNumber(this.form.get('discountTotal')?.value);
    const total = subtotal + taxTotal - discount;

    this.totals = {
      subtotal,
      taxTotal,
      discountTotal: discount,
      total: total < 0 ? 0 : total,
    };

    return this.totals;
  }

  private toNumber(value: unknown): number {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  private ensureInvoiceNumber(): void {
    const current = this.form.get('invoiceNumber')?.value;
    if (!current) {
      const unique = `INV-${Date.now().toString().slice(-6)}`;
      this.form.get('invoiceNumber')?.setValue(unique);
    }
  }
}
