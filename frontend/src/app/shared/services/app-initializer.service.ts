import { Injectable } from '@angular/core';
import { BackendHealthService } from './backend-health.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  private isBackendHealthy = false;

  constructor(private healthService: BackendHealthService) {}

  /**
   * Initialize the application by checking backend connectivity
   * This will be called during app bootstrap
   */
  initializeApp(): Observable<boolean> {
    return this.healthService.performInitialHealthCheck().pipe(
      map((isHealthy: boolean) => {
        this.isBackendHealthy = isHealthy;
        if (!isHealthy) {
          console.error('Backend is not available. Application will show error screen.');
        }
        return isHealthy;
      }),
      catchError((error) => {
        console.error('Failed to check backend health during app initialization:', error);
        this.isBackendHealthy = false;
        return of(false);
      })
    );
  }

  /**
   * Get the current backend health status
   */
  getBackendHealthStatus(): boolean {
    return this.isBackendHealthy;
  }

  /**
   * Update the backend health status
   */
  setBackendHealthStatus(isHealthy: boolean): void {
    this.isBackendHealthy = isHealthy;
  }
}