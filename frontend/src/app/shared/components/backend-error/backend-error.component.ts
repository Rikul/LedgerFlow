import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendHealthService } from '../../services/backend-health.service';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-backend-error',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-red-50 flex items-center justify-center px-4">
      <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
        <!-- Error Icon -->
        <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
          <svg class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <!-- Error Title -->
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Backend Connection Error
        </h1>

        <!-- Error Message -->
        <p class="text-gray-600 mb-6">
          Unable to connect to the LedgerFlow backend server. Please ensure the backend is running and try again.
        </p>

        <!-- Status Indicator -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Backend Status:</span>
            <div class="flex items-center">
              <div class="h-2 w-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
              <span class="text-sm text-red-600 font-medium">Disconnected</span>
            </div>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Checking every:</span>
            <span class="text-sm text-gray-600">{{ retryInterval / 1000 }}s</span>
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-sm font-medium text-gray-700">Next retry in:</span>
            <span class="text-sm text-gray-600">{{ countdown }}s</span>
          </div>
        </div>

        <!-- Retry Button -->
        <button 
          (click)="manualRetry()"
          [disabled]="isRetrying"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
          <span *ngIf="!isRetrying">Retry Connection</span>
          <span *ngIf="isRetrying" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Checking...
          </span>
        </button>

      </div>
    </div>
  `,
  styles: []
})
export class BackendErrorComponent implements OnInit, OnDestroy {
  retryInterval = 5000; // 5 seconds
  countdown = 0;
  isRetrying = false;
  
  private subscriptions: Subscription[] = [];
  private countdownSubscription?: Subscription;

  constructor(private healthService: BackendHealthService) {}

  ngOnInit() {
    this.startCountdown();
    this.startPeriodicRetry();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.countdownSubscription?.unsubscribe();
  }

  private startCountdown() {
    this.countdown = this.retryInterval / 1000;
    this.countdownSubscription?.unsubscribe();
    
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.countdown = this.retryInterval / 1000;
      }
    });
  }

  private startPeriodicRetry() {
    const retrySub = interval(this.retryInterval).subscribe(() => {
      this.checkConnection();
    });
    this.subscriptions.push(retrySub);
  }

  manualRetry() {
    this.isRetrying = true;
    this.checkConnection();
  }

  private checkConnection() {
    const healthSub = this.healthService.performInitialHealthCheck().subscribe({
      next: (isHealthy: boolean) => {
        this.isRetrying = false;
        if (isHealthy) {
          // Reload the app when backend becomes available
          window.location.reload();
        }
      },
      error: () => {
        this.isRetrying = false;
      }
    });
    this.subscriptions.push(healthSub);
  }
}