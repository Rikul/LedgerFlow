import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cash-flow',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Cash Flow Statement</h1>
          <p class="text-gray-600">Track cash movement in and out of your business</p>
        </div>
        <div class="flex space-x-3">
          <button routerLink="/reports" class="btn btn-outline">Back to Reports</button>
          <button class="btn btn-outline">Export PDF</button>
          <button class="btn btn-primary">Print</button>
        </div>
      </div>

      <!-- Date Range Selector -->
      <div class="card">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label class="form-label">Report Period</label>
            <select class="form-input">
              <option>Current Month</option>
              <option>Last Month</option>
              <option>Current Quarter</option>
              <option>Last Quarter</option>
              <option>Current Year</option>
              <option>Last Year</option>
              <option>Custom Range</option>
            </select>
          </div>
          <div>
            <label class="form-label">From Date</label>
            <input type="date" class="form-input" value="2024-01-01">
          </div>
          <div>
            <label class="form-label">To Date</label>
            <input type="date" class="form-input" value="2024-12-31">
          </div>
          <div class="flex items-end">
            <button class="btn btn-primary w-full">Update Report</button>
          </div>
        </div>
      </div>

      <!-- Cash Flow Statement -->
      <div class="card">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">LedgerFlow</h2>
          <h3 class="text-lg font-medium text-gray-700">Cash Flow Statement</h3>
          <p class="text-gray-600">For the period January 1, 2024 to December 31, 2024</p>
        </div>

        <div class="space-y-8">
          <!-- Operating Activities -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">CASH FLOWS FROM OPERATING ACTIVITIES</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Net Income</span>
                <span class="font-medium">$27,600.00</span>
              </div>
              <div class="mt-3 mb-2">
                <span class="text-gray-900 font-medium">Adjustments to reconcile net income:</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Depreciation</span>
                <span class="font-medium">$7,200.00</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Amortization</span>
                <span class="font-medium">$1,800.00</span>
              </div>
              <div class="mt-3 mb-2">
                <span class="text-gray-900 font-medium">Changes in working capital:</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Increase in Accounts Receivable</span>
                <span class="font-medium">($5,200.00)</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Increase in Inventory</span>
                <span class="font-medium">($3,400.00)</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Increase in Prepaid Expenses</span>
                <span class="font-medium">($1,200.00)</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Increase in Accounts Payable</span>
                <span class="font-medium">$2,800.00</span>
              </div>
              <div class="flex justify-between items-center py-1 ml-4">
                <span class="text-gray-700">Increase in Accrued Expenses</span>
                <span class="font-medium">$1,900.00</span>
              </div>
              <div class="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-lg bg-success-50 px-2 rounded">
                <span>Net Cash from Operating Activities</span>
                <span class="text-success-600">$31,500.00</span>
              </div>
            </div>
          </div>

          <!-- Investing Activities -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">CASH FLOWS FROM INVESTING ACTIVITIES</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Purchase of Equipment</span>
                <span class="font-medium">($15,000.00)</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Purchase of Investments</span>
                <span class="font-medium">($5,000.00)</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Sale of Old Equipment</span>
                <span class="font-medium">$3,500.00</span>
              </div>
              <div class="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-lg bg-warning-50 px-2 rounded">
                <span>Net Cash used in Investing Activities</span>
                <span class="text-warning-600">($16,500.00)</span>
              </div>
            </div>
          </div>

          <!-- Financing Activities -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">CASH FLOWS FROM FINANCING ACTIVITIES</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Owner's Capital Contribution</span>
                <span class="font-medium">$25,000.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Proceeds from Long-term Debt</span>
                <span class="font-medium">$20,000.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Repayment of Short-term Debt</span>
                <span class="font-medium">($10,000.00)</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Owner's Drawings</span>
                <span class="font-medium">($18,000.00)</span>
              </div>
              <div class="flex justify-between items-center py-3 border-t border-gray-200 font-semibold text-lg bg-primary-50 px-2 rounded">
                <span>Net Cash from Financing Activities</span>
                <span class="text-primary-600">$17,000.00</span>
              </div>
            </div>
          </div>

          <!-- Net Change in Cash -->
          <div class="bg-gray-100 p-6 rounded-lg border-2 border-gray-300">
            <div class="space-y-3">
              <div class="flex justify-between items-center text-lg font-semibold">
                <span>Net Change in Cash and Cash Equivalents</span>
                <span>$32,000.00</span>
              </div>
              <div class="flex justify-between items-center text-gray-700">
                <span>Cash and Cash Equivalents, Beginning of Period</span>
                <span>$53,420.00</span>
              </div>
              <div class="border-t border-gray-400 pt-3">
                <div class="flex justify-between items-center text-xl font-bold">
                  <span>Cash and Cash Equivalents, End of Period</span>
                  <span class="text-success-600">$85,420.00</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Supplemental Information -->
          <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 class="text-lg font-semibold text-gray-900 mb-4">Supplemental Cash Flow Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 class="font-medium text-gray-900 mb-2">Cash Paid During the Period for:</h5>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-700">Interest</span>
                    <span>$2,400.00</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-700">Income Taxes</span>
                    <span>$8,200.00</span>
                  </div>
                </div>
              </div>
              <div>
                <h5 class="font-medium text-gray-900 mb-2">Non-cash Investing and Financing Activities:</h5>
                <div class="space-y-1 text-sm">
                  <div class="flex justify-between">
                    <span class="text-gray-700">Equipment Purchased on Credit</span>
                    <span>$12,000.00</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-gray-700">Stock Issued for Services</span>
                    <span>$5,000.00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cash Flow Analysis -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="card bg-success-50 border-success-200">
              <div class="text-center">
                <div class="w-12 h-12 bg-success-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h4 class="font-semibold text-success-900">Operating Cash Flow</h4>
                <p class="text-2xl font-bold text-success-600">$31,500</p>
                <p class="text-sm text-success-700">Positive - Good operational health</p>
              </div>
            </div>

            <div class="card bg-warning-50 border-warning-200">
              <div class="text-center">
                <div class="w-12 h-12 bg-warning-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                </div>
                <h4 class="font-semibold text-warning-900">Investing Cash Flow</h4>
                <p class="text-2xl font-bold text-warning-600">-$16,500</p>
                <p class="text-sm text-warning-700">Growth investments</p>
              </div>
            </div>

            <div class="card bg-primary-50 border-primary-200">
              <div class="text-center">
                <div class="w-12 h-12 bg-primary-600 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h4 class="font-semibold text-primary-900">Financing Cash Flow</h4>
                <p class="text-2xl font-bold text-primary-600">$17,000</p>
                <p class="text-sm text-primary-700">Capital and debt activity</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class CashFlowComponent {}