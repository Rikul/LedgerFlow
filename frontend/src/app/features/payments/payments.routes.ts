import { Routes } from '@angular/router';

export const paymentsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./payment-list/payment-list.component').then(m => m.PaymentListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./payment-create/payment-create.component').then(m => m.PaymentCreateComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./payment-view/payment-view.component').then(m => m.PaymentViewComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./payment-create/payment-create.component').then(m => m.PaymentCreateComponent)
  }
];
