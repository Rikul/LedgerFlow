import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-4">
        <h1 class="text-2xl font-bold text-gray-900">Settings</h1>
        <p class="text-gray-600">Manage your application settings and preferences</p>
      </div>
      
      <!-- Settings Content -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Settings Navigation -->
        <div class="card">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Settings</h3>
          <nav class="space-y-1">
            <a routerLink="/settings/company" routerLinkActive="active" class="settings-link">Company</a>
            <a routerLink="/settings/tax" routerLinkActive="active" class="settings-link">Tax Settings</a>
            <a routerLink="/settings/notifications" routerLinkActive="active" class="settings-link">Notifications</a>
            <a routerLink="/settings/security" routerLinkActive="active" class="settings-link">Security</a>
            <span class="settings-link opacity-50 pointer-events-none select-none" title="Coming soon">Integrations</span>
          </nav>
        </div>
        
        <!-- Settings Routed Content -->
        <div class="lg:col-span-2 space-y-6">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .settings-link {
      @apply block px-3 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200;
    }
    .settings-link.active {
      @apply bg-blue-50 text-blue-700;
    }
    `
  ]
})
export class SettingsComponent {}