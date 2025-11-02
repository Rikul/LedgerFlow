import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, timer } from 'rxjs';
import { map, catchError, timeout, retry, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BackendHealthService {
  private readonly healthCheckUrl = '/api/health';
  private readonly timeoutMs = 5000; // 5 seconds timeout
  private readonly maxRetries = 3;

  constructor(private http: HttpClient) {}

  /**
   * Check if the backend is healthy and responsive
   */
  checkBackendHealth(): Observable<boolean> {
    return this.http.get(this.healthCheckUrl, { 
      responseType: 'json',
      observe: 'response'
    }).pipe(
      timeout(this.timeoutMs),
      retry(this.maxRetries),
      map(response => {
        // Backend is healthy if we get a successful response
        return response.status >= 200 && response.status < 300;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Backend health check failed:', error);
        return of(false);
      })
    );
  }

  /**
   * Perform initial connectivity check with extended timeout for app startup
   */
  performInitialHealthCheck(): Observable<boolean> {
    return this.http.get(this.healthCheckUrl, { 
      responseType: 'json',
      observe: 'response'
    }).pipe(
      timeout(10000), // 10 seconds for initial check
      map(response => response.status >= 200 && response.status < 300),
      catchError((error: HttpErrorResponse) => {
        console.error('Initial backend health check failed:', error);
        return of(false);
      })
    );
  }

  /**
   * Start periodic health monitoring
   */
  startPeriodicHealthCheck(intervalMs: number = 30000): Observable<boolean> {
    return timer(0, intervalMs).pipe(
      switchMap(() => this.checkBackendHealth())
    );
  }
}