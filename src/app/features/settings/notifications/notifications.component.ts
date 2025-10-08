import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
      <p class="text-gray-600">Set your notification preferences.</p>
    </div>
  `,
})
export class NotificationsComponent {}
