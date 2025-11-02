import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AppInitializerService } from '../services/app-initializer.service';

@Injectable()
export class BackendConnectivityInterceptor implements HttpInterceptor {
  constructor(private appInitializer: AppInitializerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Check if this is a connectivity issue to the backend
        if (this.isBackendConnectivityError(error)) {
          console.warn('Backend connectivity lost during request:', error);
          // Update the app state to show backend is unhealthy
          this.appInitializer.setBackendHealthStatus(false);
        }
        
        return throwError(() => error);
      })
    );
  }

  private isBackendConnectivityError(error: HttpErrorResponse): boolean {
    // Check for network errors, connection refused, timeout, etc.
    return (
      error.status === 0 || // Network error
      error.status === 504 || // Gateway timeout
      error.status === 502 || // Bad gateway
      error.status === 503 || // Service unavailable
      (error.error instanceof ProgressEvent && error.error.type === 'error') // Network error
    );
  }
}