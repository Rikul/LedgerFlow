import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">User Management</h1>
          <p class="text-gray-600">Manage user accounts and permissions</p>
        </div>
        <button class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add User
        </button>
      </div>
      
      <!-- User Statistics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">5</p>
            <p class="text-sm text-gray-500">Total Users</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-success-600">4</p>
            <p class="text-sm text-gray-500">Active</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-warning-600">1</p>
            <p class="text-sm text-gray-500">Pending</p>
          </div>
        </div>
        <div class="card">
          <div class="text-center">
            <p class="text-2xl font-bold text-gray-900">2</p>
            <p class="text-sm text-gray-500">Admins</p>
          </div>
        </div>
      </div>
      
      <!-- User Table -->
      <div class="card">
        <div class="overflow-x-auto">
          <table class="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-sm font-medium">JD</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">John Doe</p>
                      <p class="text-sm text-gray-500">john&#64;example.com</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Admin
                  </span>
                </td>
                <td><span class="status-badge status-paid">Active</span></td>
                <td>Oct 6, 2024</td>
                <td>Jan 15, 2024</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Deactivate</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-sm font-medium">JS</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Jane Smith</p>
                      <p class="text-sm text-gray-500">jane&#64;example.com</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Accountant
                  </span>
                </td>
                <td><span class="status-badge status-paid">Active</span></td>
                <td>Oct 5, 2024</td>
                <td>Feb 20, 2024</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-gray-600 hover:text-gray-900">Edit</button>
                    <button class="text-danger-600 hover:text-danger-900">Deactivate</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="flex items-center">
                    <div class="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center mr-3">
                      <span class="text-white text-sm font-medium">MB</span>
                    </div>
                    <div>
                      <p class="font-medium text-gray-900">Mike Brown</p>
                      <p class="text-sm text-gray-500">mike&#64;example.com</p>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    Employee
                  </span>
                </td>
                <td><span class="status-badge status-pending">Pending</span></td>
                <td>Never</td>
                <td>Oct 1, 2024</td>
                <td>
                  <div class="flex space-x-2">
                    <button class="text-primary-600 hover:text-primary-900">Activate</button>
                    <button class="text-danger-600 hover:text-danger-900">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class UserManagementComponent {}