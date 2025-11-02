import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: 'company',
    loadComponent: () => import('./company/company.component').then(m => m.CompanyComponent)
  },
  {
    path: 'tax',
    loadComponent: () => import('./tax-settings/tax-settings.component').then(m => m.TaxSettingsComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'security',
    loadComponent: () => import('./security/security.component').then(m => m.SecurityComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'company'
  }
];