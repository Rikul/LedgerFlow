import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bank-reconciliation',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Page Header -->
      <div class="border-b border-gray-200 pb-4">
        <h1 class="text-2xl font-bold text-gray-900">Bank Reconciliation</h1>
        <p class="text-gray-600">Match your bank transactions with your records</p>
      </div>
      
      <!-- Coming Soon Message -->
      <div class="card text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Bank Reconciliation</h3>
        <p class="text-gray-600 mb-6">This feature is coming soon. You'll be able to reconcile your bank statements with your accounting records.</p>
        <button class="btn-primary">Get Notified When Available</button>
      </div>
    </div>
  `,
  styles: []
})
export class BankReconciliationComponent {}