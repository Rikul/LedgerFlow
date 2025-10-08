import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Invoices</h1>
          <p class="text-gray-600">Manage and track your invoices</p>
        </div>
        <button routerLink="/invoices/create" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Create Invoice
        </button>
      </div>
      
      <!-- Filters and Search -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" placeholder="Search invoices..." class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select class="input-field">
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date Range</label>
            <select class="input-field">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
          </div>
          <div class="flex items-end">
            <button class="btn-secondary w-full">Apply Filters</button>
          </div>
        </div>
      </div>
      
      <!-- Invoice Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">24</p>
            <p class="text-sm text-gray-500">Total Invoices</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-success-600">18</p>
            <p class="text-sm text-gray-500">Paid</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-warning-600">4</p>
            <p class="text-sm text-gray-500">Pending</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-danger-600">2</p>
            <p class="text-sm text-gray-500">Overdue</p>
          </div>
        </div>
      </div>
      
      <!-- Invoice Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Client</th>
                <th>Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="font-medium text-primary-600">INV-001</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">ABC Corporation</p>
                    <p class="text-sm text-gray-500">abc&#64;corp.com</p>
                  </div>
                </td>
                <td>Oct 1, 2024</td>
                <td>Oct 15, 2024</td>
                <td class="font-medium">$2,500.00</td>
                <td><span class="status-badge status-paid">Paid</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/invoices/view/1" class="text-primary-600 hover:text-primary-900">View</button>
                    <button routerLink="/invoices/edit/1" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="font-medium text-primary-600">INV-002</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">XYZ Solutions</p>
                    <p class="text-sm text-gray-500">contact&#64;xyz.com</p>
                  </div>
                </td>
                <td>Oct 5, 2024</td>
                <td>Oct 20, 2024</td>
                <td class="font-medium">$1,800.00</td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/invoices/view/2" class="text-primary-600 hover:text-primary-900">View</button>
                    <button routerLink="/invoices/edit/2" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="font-medium text-primary-600">INV-003</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">Tech Innovations</p>
                    <p class="text-sm text-gray-500">info&#64;techinno.com</p>
                  </div>
                </td>
                <td>Sep 25, 2024</td>
                <td>Oct 10, 2024</td>
                <td class="font-medium">$3,200.00</td>
                <td><span class="status-badge status-overdue">Overdue</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/invoices/view/3" class="text-primary-600 hover:text-primary-900">View</button>
                    <button routerLink="/invoices/edit/3" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-700">Showing 1 to 3 of 24 results</p>
          <div class="flex space-x-2">
            <button class="btn-secondary">Previous</button>
            <button class="btn-primary">1</button>
            <button class="btn-secondary">2</button>
            <button class="btn-secondary">3</button>
            <button class="btn-secondary">Next</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class InvoiceListComponent {}