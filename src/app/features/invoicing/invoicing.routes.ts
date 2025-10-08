import { Routes } from '@angular/router';

export const invoicingRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./invoice-list/invoice-list.component').then(m => m.InvoiceListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./invoice-create/invoice-create.component').then(m => m.InvoiceCreateComponent)
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./invoice-create/invoice-create.component').then(m => m.InvoiceCreateComponent)
  },
  {
    path: 'view/:id',
    loadComponent: () => import('./invoice-view/invoice-view.component').then(m => m.InvoiceViewComponent)
  }
];