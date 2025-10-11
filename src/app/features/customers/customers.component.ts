import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CustomerService, Customer } from './customer.service';
import { CustomerViewComponent } from './customer-view.component';


@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, CustomerViewComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Customers</h1>
        <button
          class="btn-primary flex items-center"
          (click)="addNewCustomer()"
          *ngIf="!showCreateForm">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>Add Customer
        </button>
      </div>

      <!-- Create/Edit Customer Form -->
      <div class="card mb-6" *ngIf="showCreateForm">
        <button class="btn-outline mb-4" (click)="backToList()">Back to the list</button>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}
        </h2>
        
        <form [formGroup]="customerForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="name">Customer Name *</label>
              <input id="name" type="text" class="form-input" formControlName="name" placeholder="John Doe" />
            </div>
            <div>
              <label class="form-label" for="company">Company</label>
              <input id="company" type="text" class="form-input" formControlName="company" placeholder="Acme Inc." />
            </div>
            <div>
              <label class="form-label" for="email">Email *</label>
              <input id="email" type="email" class="form-input" formControlName="email" placeholder="john@example.com" />
            </div>
            <div>
              <label class="form-label" for="phone">Phone</label>
              <input id="phone" type="tel" class="form-input" formControlName="phone" placeholder="+1 555-555-5555" />
            </div>
          </div>

          <!-- Address -->
          <div formGroupName="address">
            <h3 class="text-md font-medium text-gray-900 mb-3">Billing Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="form-label" for="street">Street Address</label>
                <input id="street" type="text" class="form-input" formControlName="street" placeholder="123 Main St" />
              </div>
              <div>
                <label class="form-label" for="city">City</label>
                <input id="city" type="text" class="form-input" formControlName="city" placeholder="New York" />
              </div>
              <div>
                <label class="form-label" for="state">State/Province</label>
                <input id="state" type="text" class="form-input" formControlName="state" placeholder="NY" />
              </div>
              <div>
                <label class="form-label" for="zipCode">ZIP/Postal Code</label>
                <input id="zipCode" type="text" class="form-input" formControlName="zipCode" placeholder="10001" />
              </div>
              <div>
                <label class="form-label" for="country">Country</label>
                <input id="country" type="text" class="form-input" formControlName="country" placeholder="USA" />
              </div>
            </div>
          </div>

          <!-- Business Information -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="form-label" for="taxId">Tax ID</label>
              <input id="taxId" type="text" class="form-input" formControlName="taxId" placeholder="123-45-6789" />
            </div>
            <div>
              <label class="form-label" for="paymentTerms">Payment Terms</label>
              <select id="paymentTerms" class="form-input" formControlName="paymentTerms">
                <option value="net30">Net 30</option>
                <option value="net15">Net 15</option>
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net60">Net 60</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="creditLimit">Credit Limit</label>
              <input id="creditLimit" type="number" class="form-input" formControlName="creditLimit" placeholder="10000" />
            </div>
          </div>

          <!-- Notes -->
          <div>
            <label class="form-label" for="notes">Notes</label>
            <textarea id="notes" class="form-input" formControlName="notes" rows="3" placeholder="Additional notes..."></textarea>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input id="isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" formControlName="isActive" />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">Active Customer</label>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <button type="button" class="btn-outline" (click)="cancelForm()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="customerForm.invalid || saving">
              {{ saving ? 'Saving...' : (editingCustomer ? 'Update Customer' : 'Create Customer') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Customer View -->
      <app-customer-view *ngIf="viewingCustomer" [customer]="viewingCustomer" (back)="backToList()"></app-customer-view>

      <!-- Customers List -->
      <div class="card" *ngIf="!showCreateForm && !viewingCustomer">
        <div class="flex justify-between items-center mb-4">
          <div class="flex space-x-2">
            <input 
              type="text" 
              placeholder="Search customers..." 
              class="form-input w-64"
              [(ngModel)]="searchTerm"
              (input)="filterCustomers()" />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let customer of filteredCustomers">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900 cursor-pointer hover:underline" (click)="viewCustomer(customer)">{{ customer.name }}</div>
                    <div class="text-sm text-gray-500" *ngIf="customer.company">{{ customer.company }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ customer.email }}</div>
                  <div class="text-sm text-gray-500" *ngIf="customer.phone">{{ customer.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ customer.paymentTerms | titlecase }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [class]="customer.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ customer.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3" (click)="editCustomer(customer)">Edit</button>
                  <button class="text-red-600 hover:text-red-900" (click)="deleteCustomer(customer)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="filteredCustomers.length === 0" class="text-center py-8 text-gray-500">
            No customers found.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CustomersComponent implements OnInit {
  customerForm: FormGroup;
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  showCreateForm = false;
  editingCustomer: Customer | null = null;
  viewingCustomer: Customer | null = null;
  saving = false;

  constructor(private fb: FormBuilder, private customerService: CustomerService) {
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['USA'],
      }),
      billingAddress: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: [''],
      }),
      taxId: [''],
      paymentTerms: ['net30', Validators.required],
      creditLimit: [''],
      notes: [''],
      isActive: [true],
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe(customers => {
      this.customers = customers;
      this.filterCustomers();
    });
  }

  filterCustomers() {
    if (!this.searchTerm) {
      this.filteredCustomers = [...this.customers];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        customer.name.toLowerCase().includes(term) ||
        customer.email.toLowerCase().includes(term) ||
        (customer.company && customer.company.toLowerCase().includes(term))
      );
    }
  }

  editCustomer(customer: Customer) {
    this.editingCustomer = customer;
    this.customerForm.patchValue({
      ...customer,
      address: customer.address || {},
      billingAddress: customer.billingAddress || {}
    });
    this.showCreateForm = true;
    this.viewingCustomer = null;
  }

  viewCustomer(customer: Customer) {
    this.viewingCustomer = customer;
    this.showCreateForm = false;
    this.editingCustomer = null;
  }

  deleteCustomer(customer: Customer) {
    if (confirm(`Are you sure you want to delete ${customer.name}?`)) {
      this.saving = true;
      this.customerService.deleteCustomer(customer.id!).subscribe(() => {
        this.loadCustomers();
        this.saving = false;
      });
    }
  }

  onSubmit() {
    if (this.customerForm.invalid) return;
    this.saving = true;
    const formValue = this.customerForm.value;
    if (this.editingCustomer) {
      const updated = { ...formValue, id: this.editingCustomer.id };
      this.customerService.updateCustomer(updated).subscribe(() => {
        this.loadCustomers();
        this.cancelForm();
        this.saving = false;
      });
    } else {
      this.customerService.createCustomer(formValue).subscribe(() => {
        this.loadCustomers();
        this.cancelForm();
        this.saving = false;
      });
    }
  }

  cancelForm() {
    this.showCreateForm = false;
    this.editingCustomer = null;
    this.customerForm.reset({
      paymentTerms: 'net30',
      isActive: true,
      address: { country: 'USA' },
      billingAddress: {}
    });
  }

  backToList() {
    this.viewingCustomer = null;
    this.editingCustomer = null;
    this.showCreateForm = false;
  }

  addNewCustomer() {
    this.editingCustomer = null;
    this.viewingCustomer = null;
    this.customerForm.reset({
      paymentTerms: 'net30',
      isActive: true,
      address: { country: 'USA' },
      billingAddress: {}
    });
    this.showCreateForm = true;
  }
}