import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-view',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoice INV-001</h1>
          <p class="text-gray-600">View and manage invoice details</p>
        </div>
        <div class="flex space-x-3">
          <button routerLink="/invoices" class="btn-secondary">Back to List</button>
          <button routerLink="/invoices/edit/1" class="btn-secondary">Edit</button>
          <button class="btn-primary">Send</button>
          <button class="btn-success">Download PDF</button>
        </div>
      </div>
      
      <!-- Invoice Status -->
      <div class="card">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="text-lg font-medium text-gray-900">Status</h3>
            <span class="status-badge status-paid mt-2">Paid</span>
          </div>
          <div class="text-right">
            <p class="text-sm text-gray-500">Last updated</p>
            <p class="font-medium text-gray-900">Oct 12, 2024</p>
          </div>
        </div>
      </div>
      
      <!-- Invoice Preview -->
      <div class="card bg-white">
        <!-- Invoice Header -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <h1 class="text-3xl font-bold text-primary-600">LedgerFlow</h1>
              <p class="text-gray-600 mt-1">Professional Accounting Software</p>
              <div class="mt-4 text-sm text-gray-600">
                <p>123 Business Street</p>
                <p>City, State 12345</p>
                <p>contact&#64;ledgerflow.com</p>
                <p>+1 (555) 123-4567</p>
              </div>
            </div>
            <div class="text-right">
              <h2 class="text-2xl font-bold text-gray-900">INVOICE</h2>
              <p class="text-lg font-medium text-gray-600 mt-1">INV-001</p>
              <div class="mt-4 text-sm">
                <p><span class="font-medium">Date:</span> Oct 1, 2024</p>
                <p><span class="font-medium">Due Date:</span> Oct 15, 2024</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bill To -->
        <div class="mb-6">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Bill To:</h3>
          <div class="text-gray-700">
            <p class="font-medium text-lg">ABC Corporation</p>
            <p>456 Client Avenue</p>
            <p>Business City, State 67890</p>
            <p>abc&#64;corp.com</p>
          </div>
        </div>
        
        <!-- Invoice Items -->
        <div class="mb-6">
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
              <tr class="border-b border-gray-100">
                <td class="py-4">
                  <p class="font-medium text-gray-900">Web Development Services</p>
                  <p class="text-sm text-gray-600">Custom website development and deployment</p>
                </td>
                <td class="text-center py-4">1</td>
                <td class="text-right py-4">$2,000.00</td>
                <td class="text-right py-4 font-medium">$2,000.00</td>
              </tr>
              <tr class="border-b border-gray-100">
                <td class="py-4">
                  <p class="font-medium text-gray-900">SEO Optimization</p>
                  <p class="text-sm text-gray-600">Search engine optimization package</p>
                </td>
                <td class="text-center py-4">1</td>
                <td class="text-right py-4">$500.00</td>
                <td class="text-right py-4 font-medium">$500.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Invoice Total -->
        <div class="border-t border-gray-200 pt-6">
          <div class="flex justify-end">
            <div class="w-64">
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Subtotal:</span>
                <span class="font-medium">$2,500.00</span>
              </div>
              <div class="flex justify-between py-2">
                <span class="text-gray-600">Tax (0%):</span>
                <span class="font-medium">$0.00</span>
              </div>
              <div class="flex justify-between py-2 border-t border-gray-200">
                <span class="text-lg font-semibold text-gray-900">Total:</span>
                <span class="text-lg font-bold text-gray-900">$2,500.00</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Payment Information -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h3 class="text-lg font-medium text-gray-900 mb-3">Payment Information</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Payment Terms</h4>
              <p class="text-gray-600">Net 15 days</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 mb-2">Payment Methods</h4>
              <p class="text-gray-600">Bank transfer, Credit card, PayPal</p>
            </div>
          </div>
          <div class="mt-4">
            <h4 class="font-medium text-gray-900 mb-2">Notes</h4>
            <p class="text-gray-600">Thank you for your business. Please contact us if you have any questions regarding this invoice.</p>
          </div>
        </div>
      </div>
      
      <!-- Payment History -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
        <div class="space-y-3">
          <div class="flex justify-between items-center p-3 bg-success-50 rounded-lg">
            <div>
              <p class="font-medium text-success-900">Payment Received</p>
              <p class="text-sm text-success-700">Oct 12, 2024 - Bank Transfer</p>
            </div>
            <span class="font-bold text-success-900">$2,500.00</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceViewComponent {}