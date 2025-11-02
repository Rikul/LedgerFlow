import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-4">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600">Overview of your business finances</p>
      </div>
      
      <!-- Key Metrics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Revenue -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-success-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Revenue</p>
              <p class="text-2xl font-bold text-gray-900">$24,780</p>
              <p class="text-sm text-success-600">+12% from last month</p>
            </div>
          </div>
        </div>
        
        <!-- Total Expenses -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-danger-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-danger-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Total Expenses</p>
              <p class="text-2xl font-bold text-gray-900">$12,340</p>
              <p class="text-sm text-danger-600">+8% from last month</p>
            </div>
          </div>
        </div>
        
        <!-- Outstanding Invoices -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-warning-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-warning-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Outstanding Invoices</p>
              <p class="text-2xl font-bold text-gray-900">$8,420</p>
              <p class="text-sm text-gray-600">12 invoices pending</p>
            </div>
          </div>
        </div>
        
        <!-- Net Profit -->
        <div class="card">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <p class="text-sm font-medium text-gray-500">Net Profit</p>
              <p class="text-2xl font-bold text-gray-900">$12,440</p>
              <p class="text-sm text-success-600">+15% from last month</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts and Recent Activity -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Revenue Chart -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
          <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p class="text-gray-500">Chart placeholder - Revenue over time</p>
          </div>
        </div>
        
        <!-- Recent Invoices -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Invoices</h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p class="font-medium text-gray-900">INV-001</p>
                <p class="text-sm text-gray-500">Client ABC Corp</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">$2,500</p>
                <span class="status-badge status-paid">Paid</span>
              </div>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p class="font-medium text-gray-900">INV-002</p>
                <p class="text-sm text-gray-500">XYZ Solutions</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">$1,800</p>
                <span class="status-badge status-pending">Pending</span>
              </div>
            </div>
            <div class="flex justify-between items-center py-2">
              <div>
                <p class="font-medium text-gray-900">INV-003</p>
                <p class="text-sm text-gray-500">Tech Innovations</p>
              </div>
              <div class="text-right">
                <p class="font-medium text-gray-900">$3,200</p>
                <span class="status-badge status-overdue">Overdue</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Quick Actions -->
      <div class="card">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="btn-primary flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create Invoice</span>
          </button>
          
          <button class="btn-secondary flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add Expense</span>
          </button>
          
          <button class="btn-secondary flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>View Reports</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class DashboardComponent {}