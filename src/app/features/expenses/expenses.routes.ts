import { Routes } from '@angular/router';

export const expensesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./expense-list/expense-list.component').then(m => m.ExpenseListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./expense-create/expense-create.component').then(m => m.ExpenseCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./expense-create/expense-create.component').then(m => m.ExpenseCreateComponent)
  }
];