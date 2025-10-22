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
    path: 'view/:id',
    loadComponent: () => import('./expense-view/expense-view.component').then(m => m.ExpenseViewComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./expense-create/expense-create.component').then(m => m.ExpenseCreateComponent)
  }
];