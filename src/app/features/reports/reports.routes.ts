import { Routes } from '@angular/router';

export const reportsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./reports-dashboard/reports-dashboard.component').then(m => m.ReportsDashboardComponent)
  },
  {
    path: 'profit-loss',
    loadComponent: () => import('./profit-loss/profit-loss.component').then(m => m.ProfitLossComponent)
  },
  {
    path: 'balance-sheet',
    loadComponent: () => import('./balance-sheet/balance-sheet.component').then(m => m.BalanceSheetComponent)
  },
  {
    path: 'cash-flow',
    loadComponent: () => import('./cash-flow/cash-flow.component').then(m => m.CashFlowComponent)
  }
];