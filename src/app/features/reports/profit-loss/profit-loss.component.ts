import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profit-loss',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Profit & Loss Statement</h1>
          <p class="text-gray-600">Income and expense summary for the selected period</p>
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

      <!-- P&L Statement -->
      <div class="card">
        <div class="text-center mb-6">
          <h2 class="text-xl font-bold text-gray-900">LedgerFlow</h2>
          <h3 class="text-lg font-medium text-gray-700">Profit & Loss Statement</h3>
          <p class="text-gray-600">For the period January 1, 2024 to December 31, 2024</p>
        </div>

        <div class="space-y-6">
          <!-- Revenue Section -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">REVENUE</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Sales Revenue</span>
                <span class="font-medium">$145,250.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Service Revenue</span>
                <span class="font-medium">$89,750.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Other Income</span>
                <span class="font-medium">$5,200.00</span>
              </div>
              <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                <span>Total Revenue</span>
                <span>$240,200.00</span>
              </div>
            </div>
          </div>

          <!-- Cost of Goods Sold -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">COST OF GOODS SOLD</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Materials</span>
                <span class="font-medium">$45,600.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Direct Labor</span>
                <span class="font-medium">$32,400.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Manufacturing Overhead</span>
                <span class="font-medium">$12,800.00</span>
              </div>
              <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                <span>Total Cost of Goods Sold</span>
                <span>$90,800.00</span>
              </div>
            </div>
          </div>

          <!-- Gross Profit -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>Gross Profit</span>
              <span class="text-success-600">$149,400.00</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>Gross Profit Margin</span>
              <span>62.2%</span>
            </div>
          </div>

          <!-- Operating Expenses -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">OPERATING EXPENSES</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Salaries & Wages</span>
                <span class="font-medium">$48,000.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Rent</span>
                <span class="font-medium">$24,000.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Utilities</span>
                <span class="font-medium">$6,400.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Marketing & Advertising</span>
                <span class="font-medium">$12,500.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Office Supplies</span>
                <span class="font-medium">$3,200.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Professional Services</span>
                <span class="font-medium">$8,900.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Insurance</span>
                <span class="font-medium">$4,800.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Depreciation</span>
                <span class="font-medium">$7,200.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Other Operating Expenses</span>
                <span class="font-medium">$5,600.00</span>
              </div>
              <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                <span>Total Operating Expenses</span>
                <span>$120,600.00</span>
              </div>
            </div>
          </div>

          <!-- Operating Income -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <div class="flex justify-between items-center text-lg font-bold">
              <span>Operating Income</span>
              <span class="text-success-600">$28,800.00</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600 mt-1">
              <span>Operating Margin</span>
              <span>12.0%</span>
            </div>
          </div>

          <!-- Other Income/Expenses -->
          <div>
            <h4 class="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">OTHER INCOME (EXPENSE)</h4>
            <div class="ml-4 space-y-2">
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Interest Income</span>
                <span class="font-medium">$1,200.00</span>
              </div>
              <div class="flex justify-between items-center py-1">
                <span class="text-gray-700">Interest Expense</span>
                <span class="font-medium">($2,400.00)</span>
              </div>
              <div class="flex justify-between items-center py-2 border-t border-gray-200 font-semibold">
                <span>Total Other Income (Expense)</span>
                <span>($1,200.00)</span>
              </div>
            </div>
          </div>

          <!-- Net Income -->
          <div class="bg-primary-50 p-6 rounded-lg border-2 border-primary-200">
            <div class="flex justify-between items-center text-xl font-bold">
              <span>Net Income</span>
              <span class="text-primary-600">$27,600.00</span>
            </div>
            <div class="flex justify-between items-center text-sm text-gray-600 mt-2">
              <span>Net Profit Margin</span>
              <span>11.5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ProfitLossComponent {}