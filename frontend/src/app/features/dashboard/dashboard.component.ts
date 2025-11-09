import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface MetricWithChange {
  amount: number;
  change: number;
}

interface OutstandingInvoicesMetric {
  amount: number;
  count: number;
}

interface DashboardMetrics {
  totalRevenue: MetricWithChange;
  totalExpenses: MetricWithChange;
  outstandingInvoices: OutstandingInvoicesMetric;
  netProfit: MetricWithChange;
}

interface RevenueTrendPoint {
  label: string;
  total: number;
}

interface RecentInvoiceSummary {
  invoiceNumber: string;
  customerName: string;
  total: number;
  status: string;
  dueDate: string | null;
}

interface DashboardData {
  metrics: DashboardMetrics;
  revenueTrend: RevenueTrendPoint[];
  recentInvoices: RecentInvoiceSummary[];
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="dashboardData as data; else loadingState">
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
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(data.metrics.totalRevenue.amount) }}</p>
                <p class="text-sm" [ngClass]="getChangeClasses(data.metrics.totalRevenue.change)">
                  {{ formatChange(data.metrics.totalRevenue.change) }} from last month
                </p>
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
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(data.metrics.totalExpenses.amount) }}</p>
                <p class="text-sm" [ngClass]="getChangeClasses(data.metrics.totalExpenses.change)">
                  {{ formatChange(data.metrics.totalExpenses.change) }} from last month
                </p>
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
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(data.metrics.outstandingInvoices.amount) }}</p>
                <p class="text-sm text-gray-600">{{ data.metrics.outstandingInvoices.count }} invoices pending</p>
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
                <p class="text-2xl font-bold text-gray-900">{{ formatCurrency(data.metrics.netProfit.amount) }}</p>
                <p class="text-sm" [ngClass]="getChangeClasses(data.metrics.netProfit.change)">
                  {{ formatChange(data.metrics.netProfit.change) }} from last month
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts and Recent Activity -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Revenue Trend -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
            <ng-container *ngIf="data.revenueTrend.length; else noTrend">
              <ul class="space-y-2">
                <li *ngFor="let point of data.revenueTrend" class="flex items-center justify-between text-sm">
                  <span class="text-gray-600">{{ point.label }}</span>
                  <span class="font-medium text-gray-900">{{ formatCurrency(point.total) }}</span>
                </li>
              </ul>
            </ng-container>
            <ng-template #noTrend>
              <p class="text-gray-500">No revenue data available yet.</p>
            </ng-template>
          </div>

          <!-- Recent Invoices -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Recent Invoices</h3>
            <ng-container *ngIf="data.recentInvoices.length; else noInvoices">
              <div class="space-y-3">
                <div *ngFor="let invoice of data.recentInvoices" class="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p class="font-medium text-gray-900">{{ invoice.invoiceNumber }}</p>
                    <p class="text-sm text-gray-500">{{ invoice.customerName }}</p>
                    <p class="text-xs text-gray-400" *ngIf="invoice.dueDate">Due {{ invoice.dueDate | date:'MMM d, y' }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-medium text-gray-900">{{ formatCurrency(invoice.total) }}</p>
                    <span class="status-badge" [ngClass]="getStatusBadgeClass(invoice.status)">
                      {{ invoice.status | titlecase }}
                    </span>
                  </div>
                </div>
              </div>
            </ng-container>
            <ng-template #noInvoices>
              <p class="text-gray-500">No invoices available yet.</p>
            </ng-template>
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
    </ng-container>

    <ng-template #loadingState>
      <div class="card" *ngIf="loading">
        <p class="text-gray-600">Loading dashboard data...</p>
      </div>
      <div class="card" *ngIf="!loading && loadError">
        <p class="text-danger-600">We couldn't load the dashboard data. Please try again later.</p>
      </div>
    </ng-template>
  `,
  styles: []
})
export class DashboardComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  dashboardData: DashboardData | null = null;
  loading = true;
  loadError = false;

  ngOnInit(): void {
    this.http.get<DashboardData>('/api/dashboard').subscribe({
      next: (data) => {
        this.dashboardData = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.loadError = true;
        this.loading = false;
      }
    });
  }

  formatCurrency(amount: number | null | undefined): string {
    return this.currencyFormatter.format(amount ?? 0);
  }

  formatChange(change: number | null | undefined): string {
    if (change === null || change === undefined || Number.isNaN(change)) {
      return '+0.0%';
    }
    const absolute = Math.abs(change).toFixed(1);
    const sign = change >= 0 ? '+' : '-';
    return `${sign}${absolute}%`;
  }

  getChangeClasses(change: number | null | undefined): string {
    if (change === null || change === undefined || Number.isNaN(change)) {
      return 'text-gray-500';
    }
    return change >= 0 ? 'text-success-600' : 'text-danger-600';
  }

  getStatusBadgeClass(status: string | null | undefined): string {
    switch ((status || '').toLowerCase()) {
      case 'paid':
        return 'status-paid';
      case 'sent':
        return 'status-pending';
      case 'draft':
        return 'status-draft';
      default:
        return 'status-overdue';
    }
  }
}
