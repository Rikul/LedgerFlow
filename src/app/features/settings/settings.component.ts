import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
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
            <a href="#" class="sidebar-link active">General</a>
            <a href="#" class="sidebar-link">Company</a>
            <a href="#" class="sidebar-link">Tax Settings</a>
            <a href="#" class="sidebar-link">Notifications</a>
            <a href="#" class="sidebar-link">Security</a>
            <a href="#" class="sidebar-link">Integrations</a>
          </nav>
        </div>
        
        <!-- Settings Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- General Settings -->
          <div class="card">
            <h3 class="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Application Name</label>
                <input type="text" value="LedgerFlow" class="input-field">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Time Zone</label>
                <select class="input-field">
                  <option>UTC-5 (Eastern Time)</option>
                  <option>UTC-6 (Central Time)</option>
                  <option>UTC-7 (Mountain Time)</option>
                  <option>UTC-8 (Pacific Time)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select class="input-field">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select class="input-field">
                  <option>USD - US Dollar</option>
                  <option>EUR - Euro</option>
                  <option>GBP - British Pound</option>
                  <option>CAD - Canadian Dollar</option>
                </select>
              </div>
            </div>
          </div>
          
          <!-- Save Button -->
          <div class="flex justify-end">
            <button class="btn-primary">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class SettingsComponent {}