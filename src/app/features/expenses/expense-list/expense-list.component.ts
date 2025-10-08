import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Expenses</h1>
          <p class="text-gray-600">Track and manage your business expenses</p>
        </div>
        <button routerLink="/expenses/create" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add Expense
        </button>
      </div>
      
      <!-- Expense Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">$12,340</p>
            <p class="text-sm text-gray-500">Total This Month</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">56</p>
            <p class="text-sm text-gray-500">Total Expenses</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-warning-600">8</p>
            <p class="text-sm text-gray-500">Pending Approval</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">$2,450</p>
            <p class="text-sm text-gray-500">Average Monthly</p>
          </div>
        </div>
      </div>
      
      <!-- Filters -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input type="text" placeholder="Search expenses..." class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select class="input-field">
              <option value="">All Categories</option>
              <option value="meals">Business Meals</option>
              <option value="travel">Travel</option>
              <option value="office">Office Supplies</option>
              <option value="software">Software</option>
              <option value="marketing">Marketing</option>
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
      
      <!-- Expense Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Receipt</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Oct 6, 2024</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">Business Lunch</p>
                    <p class="text-sm text-gray-500">Meeting with potential client</p>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Business Meals
                  </span>
                </td>
                <td class="font-medium">$85.50</td>
                <td>
                  <button class="text-primary-600 hover:text-primary-900">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                    </svg>
                  </button>
                </td>
                <td><span class="status-badge status-paid">Approved</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/expenses/edit/1" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Oct 5, 2024</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">Office Supplies</p>
                    <p class="text-sm text-gray-500">Pens, notebooks, and folders</p>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Office Supplies
                  </span>
                </td>
                <td class="font-medium">$24.99</td>
                <td>
                  <button class="text-primary-600 hover:text-primary-900">
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.586-6.586a2 2 0 00-2.828-2.828z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16" />
                    </svg>
                  </button>
                </td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/expenses/edit/2" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Oct 3, 2024</td>
                <td>
                  <div>
                    <p class="font-medium text-gray-900">Software License</p>
                    <p class="text-sm text-gray-500">Adobe Creative Suite subscription</p>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Software
                  </span>
                </td>
                <td class="font-medium">$52.99</td>
                <td>
                  <span class="text-gray-400">No receipt</span>
                </td>
                <td><span class="status-badge status-paid">Approved</span></td>
                <td>
                  <div class="flex space-x-2">
                    <button routerLink="/expenses/edit/3" class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
          <p class="text-sm text-gray-700">Showing 1 to 3 of 56 results</p>
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
export class ExpenseListComponent {}