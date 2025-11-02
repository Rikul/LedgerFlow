import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-balance-sheet',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Balance Sheet</h1>
          <p class="text-gray-600">Financial position as of a specific date</p>
        </div>
        <div class="flex space-x-3">
          <button routerLink="/reports" class="btn btn-outline">Back to Reports</button>
          <button class="btn btn-outline">Export PDF</button>
          <button class="btn btn-primary">Print</button>
        </div>
      </div>

      <!-- Date Selector -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="form-label">As of Date</label>
            <input type="date" class="form-input" value="2024-12-31">
          </div>
          <div>
            <label class="form-label">Comparison Date (Optional)</label>
            <input type="date" class="form-input" value="2023-12-31">
          </div>
          <div class="flex items-end">
            <button class="btn btn-primary w-full">Update Report</button>
          </div>
        </div>
      </div>

      <!-- Balance Sheet -->
      <div class="card">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">LedgerFlow</h2>
          <h3 class="text-lg font-medium text-gray-700">Balance Sheet</h3>
          <p class="text-gray-600">As of December 31, 2024</p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Assets -->
          <div>
            <h4 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">ASSETS</h4>
            
            <!-- Current Assets -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Current Assets</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Cash and Cash Equivalents</span>
                  <span class="font-medium">$85,420.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Accounts Receivable</span>
                  <span class="font-medium">$24,680.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Inventory</span>
                  <span class="font-medium">$18,900.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Prepaid Expenses</span>
                  <span class="font-medium">$3,500.00</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Current Assets</span>
                  <span>$132,500.00</span>
                </div>
              </div>
            </div>

            <!-- Fixed Assets -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Fixed Assets</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Property, Plant & Equipment</span>
                  <span class="font-medium">$125,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Less: Accumulated Depreciation</span>
                  <span class="font-medium">($35,000.00)</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Equipment</span>
                  <span class="font-medium">$45,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Less: Accumulated Depreciation</span>
                  <span class="font-medium">($12,000.00)</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Fixed Assets</span>
                  <span>$123,000.00</span>
                </div>
              </div>
            </div>

            <!-- Other Assets -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Other Assets</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Investments</span>
                  <span class="font-medium">$15,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Intangible Assets</span>
                  <span class="font-medium">$8,500.00</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Other Assets</span>
                  <span>$23,500.00</span>
                </div>
              </div>
            </div>

            <!-- Total Assets -->
            <div class="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
              <div class="flex justify-between items-center text-xl font-bold">
                <span>TOTAL ASSETS</span>
                <span class="text-primary-600">$279,000.00</span>
              </div>
            </div>
          </div>

          <!-- Liabilities & Equity -->
          <div>
            <h4 class="text-xl font-bold text-gray-900 mb-6 border-b-2 border-gray-300 pb-2">LIABILITIES & EQUITY</h4>
            
            <!-- Current Liabilities -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Current Liabilities</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Accounts Payable</span>
                  <span class="font-medium">$12,450.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Accrued Expenses</span>
                  <span class="font-medium">$8,200.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Short-term Debt</span>
                  <span class="font-medium">$15,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Current Portion of Long-term Debt</span>
                  <span class="font-medium">$6,000.00</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Current Liabilities</span>
                  <span>$41,650.00</span>
                </div>
              </div>
            </div>

            <!-- Long-term Liabilities -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Long-term Liabilities</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Long-term Debt</span>
                  <span class="font-medium">$45,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Deferred Tax Liabilities</span>
                  <span class="font-medium">$3,500.00</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Long-term Liabilities</span>
                  <span>$48,500.00</span>
                </div>
              </div>
            </div>

            <!-- Total Liabilities -->
            <div class="mb-6 bg-gray-50 p-4 rounded-lg">
              <div class="flex justify-between items-center text-lg font-bold">
                <span>TOTAL LIABILITIES</span>
                <span>$90,150.00</span>
              </div>
            </div>

            <!-- Equity -->
            <div class="mb-6">
              <h5 class="text-lg font-semibold text-gray-900 mb-3">Owner's Equity</h5>
              <div class="ml-4 space-y-2">
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Owner's Capital</span>
                  <span class="font-medium">$150,000.00</span>
                </div>
                <div class="flex justify-between items-center py-1">
                  <span class="text-gray-700">Retained Earnings</span>
                  <span class="font-medium">$38,850.00</span>
                </div>
                <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                  <span>Total Owner's Equity</span>
                  <span>$188,850.00</span>
                </div>
              </div>
            </div>

            <!-- Total Liabilities & Equity -->
            <div class="bg-primary-50 p-4 rounded-lg border-2 border-primary-200">
              <div class="flex justify-between items-center text-xl font-bold">
                <span>TOTAL LIABILITIES & EQUITY</span>
                <span class="text-primary-600">$279,000.00</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Balance Check -->
        <div class="mt-8 p-4 bg-success-50 border border-success-200 rounded-lg">
          <div class="flex items-center justify-center">
            <svg class="w-5 h-5 text-success-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span class="text-success-800 font-medium">Balance Sheet is balanced - Assets equal Liabilities + Equity</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class BalanceSheetComponent {}