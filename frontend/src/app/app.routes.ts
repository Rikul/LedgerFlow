import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'invoices',
    canActivate: [authGuard],
    loadChildren: () => import('./features/invoicing/invoicing.routes').then(m => m.invoicingRoutes)
  },
  {
    path: 'expenses',
    canActivate: [authGuard],
    loadChildren: () => import('./features/expenses/expenses.routes').then(m => m.expensesRoutes)
  },
  {
    path: 'payments',
    canActivate: [authGuard],
    loadChildren: () => import('./features/payments/payments.routes').then(m => m.paymentsRoutes)
  },
  {
    path: 'customers',
    canActivate: [authGuard],
    loadComponent: () => import('./features/customers/customers.component').then(m => m.CustomersComponent)
  },
  {
    path: 'vendors',
    canActivate: [authGuard],
    loadComponent: () => import('./features/vendors/vendors.component').then(m => m.VendorsComponent)
  },
  {
    path: 'bank-reconciliation',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bank-reconciliation/bank-reconciliation.component').then(m => m.BankReconciliationComponent)
  },
  {
    path: 'reports',
    canActivate: [authGuard],
    loadChildren: () => import('./features/reports/reports.routes').then(m => m.reportsRoutes)
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('./features/settings/settings.routes').then(m => m.settingsRoutes)
      }
    ]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'setup-password',
    loadComponent: () => import('./features/auth/password-setup.component').then(m => m.PasswordSetupComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];