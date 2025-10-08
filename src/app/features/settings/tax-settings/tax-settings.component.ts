import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings-tax',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Tax Settings</h3>
      <p class="text-gray-600">Configure tax rates and rules.</p>
    </div>
  `,
})
export class TaxSettingsComponent {}
