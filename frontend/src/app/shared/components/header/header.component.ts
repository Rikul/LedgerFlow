import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SecurityService } from '../../../features/settings/security/security.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo and Brand -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-primary-600">LedgerFlow</h1>
            </div>
          </div>
          
          <!-- Navigation and User Menu -->
          <div class="flex items-center space-x-4">

            <!-- Search Bar 
            <div class="hidden md:block">
              <div class="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  class="input-field pl-10 pr-4 py-2 w-80"
                >
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
            </div> -->
            
            <!-- Notifications 
            <button class="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5 5l-5-5h5zm0 0V3" />
              </svg>
              <span class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
            </button>
            -->

            
            <!-- Logout -->
            <button (click)="logout()" class="p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg" title="Logout">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>

          </div>
        </div>
      </div>
    </header>
  `,
  styles: []
})
export class HeaderComponent {
  constructor(private router: Router, private securityService: SecurityService) {}
  logout() {
    this.securityService.logout();
    this.router.navigate(['/login']);
  }
}