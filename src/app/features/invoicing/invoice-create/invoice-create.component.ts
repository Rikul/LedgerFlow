import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Create Invoice</h1>
          <p class="text-gray-600">Create a new invoice for your client</p>
        </div>
        <div class="flex space-x-3">
          <button routerLink="/invoices" class="btn-secondary">Cancel</button>
          <button class="btn-primary">Save Draft</button>
          <button class="btn-success">Send Invoice</button>
        </div>
      </div>
      
      <!-- Invoice Form -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Invoice Details -->
        <div class="space-y-6">
          <!-- Client Information -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Client Information</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                <input type="text" class="input-field" placeholder="Enter client name">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" class="input-field" placeholder="client@example.com">
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <textarea class="input-field" rows="3" placeholder="Client address"></textarea>
              </div>
            </div>
          </div>
          
          <!-- Invoice Details -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Details</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                <input type="text" class="input-field" value="INV-004" readonly>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Issue Date</label>
                <input type="date" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                <input type="date" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                <select class="input-field">
                  <option>Net 15 days</option>
                  <option>Net 30 days</option>
                  <option>Net 60 days</option>
                  <option>Due on receipt</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Additional Notes -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea class="input-field" rows="3" placeholder="Additional notes for the client"></textarea>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                <textarea class="input-field" rows="3" placeholder="Payment terms and conditions"></textarea>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Right Column - Line Items -->
        <div class="space-y-6">
          <!-- Line Items -->
          <div class="card">
            <div class="flex justify-between items-center mb-4">
              <h3 class="text-lg font-medium text-gray-900">Line Items</h3>
              <button class="btn-secondary">Add Item</button>
            </div>
            
            <!-- Item Table -->
            <div class="space-y-4">
              <div class="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700">
                <div class="col-span-4">Description</div>
                <div class="col-span-2">Qty</div>
                <div class="col-span-2">Rate</div>
                <div class="col-span-2">Tax</div>
                <div class="col-span-2">Amount</div>
              </div>
              
              <!-- Sample Line Item -->
              <div class="grid grid-cols-12 gap-2 items-center">
                <div class="col-span-4">
                  <input type="text" class="input-field" placeholder="Item description">
                </div>
                <div class="col-span-2">
                  <input type="number" class="input-field" placeholder="1">
                </div>
                <div class="col-span-2">
                  <input type="number" class="input-field" placeholder="0.00">
                </div>
                <div class="col-span-2">
                  <select class="input-field">
                    <option>No Tax</option>
                    <option>10% VAT</option>
                    <option>20% VAT</option>
                  </select>
                </div>
                <div class="col-span-2 flex items-center justify-between">
                  <span class="font-medium">$0.00</span>
                  <button class="text-danger-600 hover:text-danger-900">
                    <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Invoice Summary -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Invoice Summary</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">$0.00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Tax:</span>
                <span class="font-medium">$0.00</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-600">Discount:</span>
                <span class="font-medium">$0.00</span>
              </div>
              <hr class="border-gray-200">
              <div class="flex justify-between text-lg">
                <span class="font-semibold text-gray-900">Total:</span>
                <span class="font-bold text-gray-900">$0.00</span>
              </div>
            </div>
          </div>
          
          <!-- Template Settings -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Template & Branding</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Template</label>
                <select class="input-field">
                  <option>Default Template</option>
                  <option>Professional Template</option>
                  <option>Modern Template</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <button class="btn-secondary w-full">Upload Logo</button>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                <div class="flex space-x-2">
                  <div class="w-8 h-8 bg-blue-600 rounded cursor-pointer"></div>
                  <div class="w-8 h-8 bg-green-600 rounded cursor-pointer"></div>
                  <div class="w-8 h-8 bg-purple-600 rounded cursor-pointer"></div>
                  <div class="w-8 h-8 bg-red-600 rounded cursor-pointer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceCreateComponent {}