import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { VendorService, Vendor } from './vendor.service';
import { VendorViewComponent } from './vendor-view.component';
import { FileExportService } from '../../shared/services/file-export.service';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, VendorViewComponent],
  template: `
    <div class="space-y-6 p-6">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between border-b border-gray-200 pb-4 space-y-3 md:space-y-0" *ngIf="!showCreateForm && !viewingVendor">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Vendors</h1>
          <p class="text-gray-600">Track vendor contacts, categories, and payment terms</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <button class="btn-secondary flex items-center justify-center" (click)="exportVendorsToCsv()" [disabled]="!filteredVendors.length">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" />
            </svg>
            Export to CSV
          </button>
          <button class="btn-primary  flex items-center justify-center" (click)="addNewVendor()">
            <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Vendor
          </button>
        </div>
      </div>

      <!-- Create/Edit Vendor Form -->
      <div class="card" *ngIf="showCreateForm">
        <button class="btn-outline mb-4" (click)="backToList()">Back to the list</button>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingVendor ? 'Edit Vendor' : 'Add New Vendor' }}
        </h2>

        <form [formGroup]="vendorForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="company">Company *</label>
              <input id="company" type="text" class="form-input" formControlName="company" placeholder="ABC Supplies Inc." />
            </div>
            <div>
              <label class="form-label" for="contact">Contact</label>
              <input id="contact" type="text" class="form-input" formControlName="contact" placeholder="Jane Smith" />
            </div>
            <div>
              <label class="form-label" for="email">Email *</label>
              <input id="email" type="email" class="form-input" formControlName="email" placeholder="contact@abcsupplies.com" />
            </div>
            <div>
              <label class="form-label" for="phone">Phone</label>
              <input id="phone" type="tel" class="form-input" formControlName="phone" placeholder="+1 555-555-5555" />
            </div>
          </div>

          <!-- Address -->
          <div formGroupName="address">
            <h3 class="text-md font-medium text-gray-900 mb-3">Address</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="form-label" for="street">Street Address</label>
                <input id="street" type="text" class="form-input" formControlName="street" placeholder="123 Business Blvd" />
              </div>
              <div>
                <label class="form-label" for="city">City</label>
                <input id="city" type="text" class="form-input" formControlName="city" placeholder="Chicago" />
              </div>
              <div>
                <label class="form-label" for="state">State/Province</label>
                <input id="state" type="text" class="form-input" formControlName="state" placeholder="IL" />
              </div>
              <div>
                <label class="form-label" for="zipCode">ZIP/Postal Code</label>
                <input id="zipCode" type="text" class="form-input" formControlName="zipCode" placeholder="60601" />
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
              <input id="taxId" type="text" class="form-input" formControlName="taxId" placeholder="12-3456789" />
            </div>
            <div>
              <label class="form-label" for="paymentTerms">Payment Terms</label>
              <select id="paymentTerms" class="form-input" formControlName="paymentTerms">
                <option value="net30">Net 30</option>
                <option value="net15">Net 15</option>
                <option value="due_on_receipt">Due on Receipt</option>
                <option value="net60">Net 60</option>
                <option value="net90">Net 90</option>
              </select>
            </div>
            <div>
              <label class="form-label" for="category">Category</label>
              <select id="category" class="form-input" formControlName="category">
                <option value="office_supplies">Office Supplies</option>
                <option value="professional_services">Professional Services</option>
                <option value="technology">Technology</option>
                <option value="utilities">Utilities</option>
                <option value="rent_lease">Rent & Lease</option>
                <option value="marketing">Marketing</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <!-- Account Information -->
          <div>
            <label class="form-label" for="accountNumber">Account Number</label>
            <input id="accountNumber" type="text" class="form-input" formControlName="accountNumber" placeholder="Vendor account number" />
          </div>

          <!-- Notes -->
          <div>
            <label class="form-label" for="notes">Notes</label>
            <textarea id="notes" class="form-input" formControlName="notes" rows="3" placeholder="Additional notes about this vendor..."></textarea>
          </div>

          <!-- Active Status -->
          <div class="flex items-center">
            <input id="isActive" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" formControlName="isActive" />
            <label for="isActive" class="ml-2 block text-sm text-gray-900">Active Vendor</label>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <button type="button" class="btn-outline" (click)="cancelForm()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="vendorForm.invalid || saving">
              {{ saving ? 'Saving...' : (editingVendor ? 'Update Vendor' : 'Create Vendor') }}
            </button>
          </div>
        </form>
      </div>

      <!-- Vendor View -->
      <app-vendor-view *ngIf="viewingVendor" [vendor]="viewingVendor" (back)="backToList()"></app-vendor-view>

      <!-- Vendors List -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200" *ngIf="!showCreateForm && !viewingVendor">
        <div class="p-4 border-b border-gray-200">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                class="w-full border border-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                [(ngModel)]="selectedCategory"
                (change)="filterVendors()">
                <option value="">All Categories</option>
                <option value="office_supplies">Office Supplies</option>
                <option value="professional_services">Professional Services</option>
                <option value="technology">Technology</option>
                <option value="utilities">Utilities</option>
                <option value="rent_lease">Rent & Lease</option>
                <option value="marketing">Marketing</option>
                <option value="travel">Travel</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div class="relative">
                <svg class="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search vendors by company, contact, email or phone..."
                  class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  [(ngModel)]="searchTerm"
                  (input)="filterVendors()" />
              </div>
            </div>
            <div class="flex items-end">
              <button class="btn-secondary w-full" (click)="resetFilters()">Reset</button>
            </div>
          </div>
        </div>

        <div class="p-4">
          <div class="overflow-x-auto" *ngIf="paginatedVendors.length; else emptyVendorState">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('company')">
                    <div class="flex items-center">
                      Company
                      <svg *ngIf="sortColumn === 'company'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('contact')">
                    <div class="flex items-center">
                      Contact
                      <svg *ngIf="sortColumn === 'contact'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('category')">
                    <div class="flex items-center">
                      Category
                      <svg *ngIf="sortColumn === 'category'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                      </svg>
                    </div>
                  </th>
                  <th scope="col" class="px-2 py-2 text-left text-sm font-semibold text-gray-900 cursor-pointer hover:bg-gray-100" (click)="sort('paymentTerms')">
                    <div class="flex items-center">
                      Payment Terms
                      <svg *ngIf="sortColumn === 'paymentTerms'" class="ml-1 w-4 h-4" [class.rotate-180]="sortDirection === 'desc'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                <tr *ngFor="let vendor of paginatedVendors; trackBy: trackByVendor">
                  <td class="px-2 py-2">
                    <div class="flex items-start space-x-3">
        
                      <div>
                        <button class="font-medium text-left text-sm text-gray-900 hover:text-primary-600" (click)="viewVendor(vendor)">{{ vendor.company || vendor.contact || 'Unnamed Vendor' }}</button>
                        <p class="text-sm text-gray-500" *ngIf="vendor.contact && vendor.company">{{ vendor.contact }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-2">
                    <div class="space-y-1">
                      <div class="flex items-center text-gray-900">
                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {{ vendor.email }}
                      </div>
                      <div class="flex items-center text-sm text-gray-500" *ngIf="vendor.phone">
                        <svg class="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h2l2 5-2.5 1.5a11 11 0 005.5 5.5L14 13l5 2v2a2 2 0 01-2 2h-1C9.82 19 5 14.18 5 8V7a2 2 0 00-2-2z" />
                        </svg>
                        {{ vendor.phone }}
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex items-center text-sm text-gray-900">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h10M7 11h6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {{ getCategoryLabel(vendor.category) }}
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex items-center text-sm text-gray-900">
                      <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {{ vendor.paymentTerms | titlecase }}
                    </div>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <span class="status-badge" [ngClass]="getStatusBadgeClass(vendor.isActive)">
                      {{ vendor.isActive ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-2 py-2 whitespace-nowrap">
                    <div class="flex space-x-2">
                      <button class="text-primary-600 hover:text-primary-900" (click)="viewVendor(vendor)" title="View vendor">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button class="text-gray-600 hover:text-gray-900" (click)="editVendor(vendor)" title="Edit vendor">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button class="text-danger-600 hover:text-danger-900" (click)="deleteVendor(vendor)" title="Delete vendor">
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
          <ng-template #emptyVendorState>
            <div class="py-12 px-6 text-center text-gray-500">
              <p class="text-lg font-medium">No vendors found</p>
              <p class="text-sm">Add a vendor to see it listed here.</p>
            </div>
          </ng-template>
        </div>

        <div *ngIf="totalItems > pageSize" class="flex flex-col md:flex-row md:justify-between md:items-center gap-4 border-t border-gray-200 px-4 py-3">
          <p class="text-sm text-gray-700">Showing {{ startItem }} to {{ endItem }} of {{ totalItems }} vendors</p>
          <div class="flex flex-wrap gap-2">
            <button
              class="btn-secondary"
              [disabled]="currentPage === 1"
              [class.opacity-50]="currentPage === 1"
              (click)="previousPage()">
              Previous
            </button>
            <button
              *ngFor="let page of pages"
              [ngClass]="currentPage === page ? 'btn-primary' : 'btn-secondary'"
              (click)="goToPage(page)">
              {{ page }}
            </button>
            <button
              class="btn-secondary"
              [disabled]="currentPage === totalPages"
              [class.opacity-50]="currentPage === totalPages"
              (click)="nextPage()">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rotate-180 {
      transform: rotate(180deg);
    }
  `]
})
export class VendorsComponent implements OnInit {
  private readonly SORT_STORAGE_KEY = 'vendor-list-sort';

  vendorForm: FormGroup;
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  paginatedVendors: Vendor[] = [];
  searchTerm = '';
  selectedCategory = '';
  showCreateForm = false;
  editingVendor: Vendor | null = null;
  viewingVendor: Vendor | null = null;
  saving = false;
  sortColumn: 'company' | 'contact' | 'category' | 'paymentTerms' | 'status' = 'company';
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  pageSize = 10;
  totalItems = 0;

  constructor(private fb: FormBuilder, private vendorService: VendorService, private fileExportService: FileExportService) {
    this.vendorForm = this.fb.group({
      company: ['', Validators.required],
      contact: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: [''],
        country: ['USA'],
      }),
      taxId: [''],
      paymentTerms: ['net30', Validators.required],
      category: ['other', Validators.required],
      accountNumber: [''],
      notes: [''],
      isActive: [true],
    });
  }

  ngOnInit(): void {
    this.loadSortingState();
    this.loadVendors();
  }

  loadVendors(): void {
    this.vendorService.getVendors().subscribe(vendors => {
      this.vendors = vendors;
      this.filterVendors();
    });
  }

  exportVendorsToCsv(): void {
    if (!this.filteredVendors.length) {
      return;
    }

    const headers = ['Company', 'Contact', 'Email', 'Phone', 'Category', 'Payment Terms', 'Status'];
    const rows = this.filteredVendors.map(vendor => [
      vendor.company,
      vendor.contact || '',
      vendor.email,
      vendor.phone || '',
      this.getCategoryLabel(vendor.category),
      this.formatPaymentTerms(vendor.paymentTerms),
      vendor.isActive ? 'Active' : 'Inactive',
    ]);

    const filename = `vendors-${new Date().toISOString().slice(0, 10)}.csv`;
    this.fileExportService.exportToCsv(filename, headers, rows);
  }

  filterVendors(): void {
    let filtered = [...this.vendors];

    if (this.selectedCategory) {
      filtered = filtered.filter(vendor => vendor.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vendor => {
        const company = vendor.company?.toLowerCase() || '';
        const contact = vendor.contact?.toLowerCase() || '';
        const email = vendor.email?.toLowerCase() || '';
        const phone = vendor.phone?.toLowerCase() || '';
        return company.includes(term) || contact.includes(term) || email.includes(term) || phone.includes(term);
      });
    }

    this.filteredVendors = filtered;
    this.totalItems = this.filteredVendors.length;
    this.currentPage = 1;
    this.applySorting();
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'office_supplies': 'Office Supplies',
      'professional_services': 'Professional Services',
      'technology': 'Technology',
      'utilities': 'Utilities',
      'rent_lease': 'Rent & Lease',
      'marketing': 'Marketing',
      'travel': 'Travel',
      'other': 'Other'
    };
    return labels[category] || category;
  }

  private formatPaymentTerms(value?: string | null): string {
    if (!value) {
      return '';
    }
    return value
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
  }

  editVendor(vendor: Vendor): void {
    this.editingVendor = vendor;
    this.vendorForm.patchValue({
      ...vendor,
      address: vendor.address || {}
    });
    this.showCreateForm = true;
    this.viewingVendor = null;
  }

  viewVendor(vendor: Vendor): void {
    this.viewingVendor = vendor;
    this.showCreateForm = false;
    this.editingVendor = null;
  }

  deleteVendor(vendor: Vendor): void {
    const vendorLabel = vendor.company || vendor.contact || 'this vendor';
    if (confirm(`Are you sure you want to delete ${vendorLabel}?`)) {
      this.saving = true;
      this.vendorService.deleteVendor(vendor.id!).subscribe(() => {
        this.vendors = this.vendors.filter(v => v.id !== vendor.id);
        this.filterVendors();
        this.saving = false;
      });
    }
  }

  onSubmit(): void {
    if (this.vendorForm.invalid) {
      return;
    }
    this.saving = true;
    const formValue = this.vendorForm.value;
    if (this.editingVendor) {
      const updated = { ...formValue, id: this.editingVendor.id };
      this.vendorService.updateVendor(updated).subscribe(() => {
        this.loadVendors();
        this.cancelForm();
        this.saving = false;
      });
    } else {
      this.vendorService.createVendor(formValue).subscribe(() => {
        this.loadVendors();
        this.cancelForm();
        this.saving = false;
      });
    }
  }

  cancelForm(): void {
    this.showCreateForm = false;
    this.editingVendor = null;
    this.vendorForm.reset({
      paymentTerms: 'net30',
      category: 'other',
      isActive: true,
      address: { country: 'USA' }
    });
  }

  backToList(): void {
    this.viewingVendor = null;
    this.editingVendor = null;
    this.showCreateForm = false;
  }

  addNewVendor(): void {
    this.editingVendor = null;
    this.viewingVendor = null;
    this.vendorForm.reset({
      paymentTerms: 'net30',
      category: 'other',
      isActive: true,
      address: { country: 'USA' }
    });
    this.showCreateForm = true;
  }

  sort(column: 'company' | 'contact' | 'category' | 'paymentTerms' | 'status'): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.currentPage = 1;
    this.saveSortingState();
    this.applySorting();
  }

  private applySorting(): void {
    const directionMultiplier = this.sortDirection === 'asc' ? 1 : -1;

    this.filteredVendors.sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (this.sortColumn) {
        case 'company':
          aValue = (a.company || a.contact || '').toLowerCase();
          bValue = (b.company || b.contact || '').toLowerCase();
          break;
        case 'contact':
          aValue = (a.email || '').toLowerCase();
          bValue = (b.email || '').toLowerCase();
          break;
        case 'category':
          aValue = (a.category || '').toLowerCase();
          bValue = (b.category || '').toLowerCase();
          break;
        case 'paymentTerms':
          aValue = (a.paymentTerms || '').toLowerCase();
          bValue = (b.paymentTerms || '').toLowerCase();
          break;
        case 'status':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
      }

      if (aValue < bValue) {
        return -1 * directionMultiplier;
      }
      if (aValue > bValue) {
        return 1 * directionMultiplier;
      }
      return 0;
    });

    this.applyPagination();
  }

  private applyPagination(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedVendors = this.filteredVendors.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.applyPagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.applyPagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.applyPagination();
    }
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize) || 1;
  }

  get startItem(): number {
    if (this.totalItems === 0) {
      return 0;
    }
    return (this.currentPage - 1) * this.pageSize + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.pageSize, this.totalItems);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';
    this.filteredVendors = [...this.vendors];
    this.totalItems = this.filteredVendors.length;
    this.currentPage = 1;
    this.applySorting();
  }

  trackByVendor(_: number, vendor: Vendor): number | undefined {
    return vendor.id;
  }

  getStatusBadgeClass(isActive: boolean): string {
    return isActive ? 'status-paid' : 'status-overdue';
  }

  private loadSortingState(): void {
    try {
      const saved = localStorage.getItem(this.SORT_STORAGE_KEY);
      if (saved) {
        const sortState = JSON.parse(saved);
        if (sortState && ['company', 'contact', 'category', 'paymentTerms', 'status'].includes(sortState.column) &&
            (sortState.direction === 'asc' || sortState.direction === 'desc')) {
          this.sortColumn = sortState.column;
          this.sortDirection = sortState.direction;
        }
      }
    } catch (error) {
      console.warn('Failed to load vendor sort state', error);
    }
  }

  private saveSortingState(): void {
    try {
      const sortState = {
        column: this.sortColumn,
        direction: this.sortDirection,
      };
      localStorage.setItem(this.SORT_STORAGE_KEY, JSON.stringify(sortState));
    } catch (error) {
      console.warn('Failed to save vendor sort state', error);
    }
  }
}
