import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { VendorService, Vendor } from './vendor.service';
import { VendorViewComponent } from './vendor-view.component';

@Component({
  selector: 'app-vendors',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule, VendorViewComponent],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Vendors</h1>
        <button 
          class="btn-primary  flex items-center"
          (click)="showCreateForm = true"
          *ngIf="!showCreateForm">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Vendor
        </button>
      </div>

      <!-- Create/Edit Vendor Form -->
      <div class="card mb-6" *ngIf="showCreateForm">
        <button class="btn-outline mb-4" (click)="backToList()">Back to the list</button>
        <h2 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingVendor ? 'Edit Vendor' : 'Add New Vendor' }}
        </h2>
        
        <form [formGroup]="vendorForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <!-- Basic Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="form-label" for="name">Vendor Name *</label>
              <input id="name" type="text" class="form-input" formControlName="name" placeholder="ABC Supplies" />
            </div>
            <div>
              <label class="form-label" for="company">Company *</label>
              <input id="company" type="text" class="form-input" formControlName="company" placeholder="ABC Supplies Inc." />
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
      <div class="card" *ngIf="!showCreateForm && !viewingVendor">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">Vendor List</h2>
          <div class="flex space-x-2">
            <select 
              class="form-input w-48"
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
            <input 
              type="text" 
              placeholder="Search vendors..." 
              class="form-input w-64"
              [(ngModel)]="searchTerm"
              (input)="filterVendors()" />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Terms</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr *ngFor="let vendor of filteredVendors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div class="text-sm font-medium text-gray-900 cursor-pointer hover:underline" (click)="viewVendor(vendor)">{{ vendor.name }}</div>
                    <div class="text-sm text-gray-500" *ngIf="vendor.company">{{ vendor.company }}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ vendor.email }}</div>
                  <div class="text-sm text-gray-500" *ngIf="vendor.phone">{{ vendor.phone }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ getCategoryLabel(vendor.category) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ vendor.paymentTerms | titlecase }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        [class]="vendor.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ vendor.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3" (click)="editVendor(vendor)">Edit</button>
                  <button class="text-red-600 hover:text-red-900" (click)="deleteVendor(vendor)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div *ngIf="filteredVendors.length === 0" class="text-center py-8 text-gray-500">
            No vendors found.
          </div>
        </div>
      </div>
    </div>
  `,
})
export class VendorsComponent implements OnInit {
  vendorForm: FormGroup;
  vendors: Vendor[] = [];
  filteredVendors: Vendor[] = [];
  searchTerm = '';
  selectedCategory = '';
  showCreateForm = false;
  editingVendor: Vendor | null = null;
  viewingVendor: Vendor | null = null;
  saving = false;

  constructor(private fb: FormBuilder, private vendorService: VendorService) {
    this.vendorForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company: ['', Validators.required],
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

  ngOnInit() {
    this.loadVendors();
  }

  loadVendors() {
    this.vendorService.getVendors().subscribe(vendors => {
      this.vendors = vendors;
      this.filterVendors();
    });
  }

  filterVendors() {
    let filtered = [...this.vendors];

    if (this.selectedCategory) {
      filtered = filtered.filter(vendor => vendor.category === this.selectedCategory);
    }

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(vendor =>
        vendor.name.toLowerCase().includes(term) ||
        vendor.email.toLowerCase().includes(term) ||
        (vendor.company && vendor.company.toLowerCase().includes(term))
      );
    }

    this.filteredVendors = filtered;
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

  editVendor(vendor: Vendor) {
    this.editingVendor = vendor;
    this.vendorForm.patchValue({
      ...vendor,
      address: vendor.address || {}
    });
    this.showCreateForm = true;
    this.viewingVendor = null;
  }

  viewVendor(vendor: Vendor) {
    this.viewingVendor = vendor;
    this.showCreateForm = false;
    this.editingVendor = null;
  }

  deleteVendor(vendor: Vendor) {
    if (confirm(`Are you sure you want to delete ${vendor.name}?`)) {
      this.saving = true;
      this.vendorService.deleteVendor(vendor.id!).subscribe(() => {
        this.loadVendors();
        this.saving = false;
      });
    }
  }

  onSubmit() {
    if (this.vendorForm.invalid) return;
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

  cancelForm() {
    this.showCreateForm = false;
    this.editingVendor = null;
    this.vendorForm.reset({
      paymentTerms: 'net30',
      category: 'other',
      isActive: true,
      address: { country: 'USA' }
    });
  }

  backToList() {
    this.viewingVendor = null;
    this.editingVendor = null;
    this.showCreateForm = false;
  }
}