import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'invoices',
    loadChildren: () => import('./features/invoicing/invoicing.routes').then(m => m.invoicingRoutes)
  },
  {
    path: 'expenses',
    loadChildren: () => import('./features/expenses/expenses.routes').then(m => m.expensesRoutes)
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'vendors',
    loadComponent: () => import('./features/vendors/vendors.component').then(m => m.VendorsComponent)
  },
  {
    path: 'bank-reconciliation',
    loadComponent: () => import('./features/bank-reconciliation/bank-reconciliation.component').then(m => m.BankReconciliationComponent)
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.reportsRoutes)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];