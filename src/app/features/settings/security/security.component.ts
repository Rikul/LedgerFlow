import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-security',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Security</h3>
      <p class="text-gray-600">Manage passwords, 2FA, and sessions.</p>
    </div>
  `,
})
export class SecurityComponent {}
