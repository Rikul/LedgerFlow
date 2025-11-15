import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';
import { BackendErrorComponent } from './shared/components/backend-error/backend-error.component';
import { AppInitializerService } from './shared/services/app-initializer.service';
import { BackendHealthService } from './shared/services/backend-health.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent, BackendErrorComponent],
  template: `
    <!-- Backend Error Screen -->
    <app-backend-error *ngIf="!isBackendHealthy && !isCheckingBackend"></app-backend-error>
    
    <!-- Loading Screen -->
    <div *ngIf="isCheckingBackend" class="min-h-screen bg-gray-50 flex items-center justify-center">
      <div class="text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Connecting to LedgerFlow...</p>
      </div>
    </div>

    <!-- Main Application -->
    <div *ngIf="isBackendHealthy && !isCheckingBackend" class="min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header *ngIf="showLayout" class="fixed top-0 left-0 right-0 z-50"></app-header>
      <!-- Main Layout -->
      <div class="flex" [class.pt-16]="showLayout">
        <!-- Sidebar -->
        <app-sidebar *ngIf="showLayout" class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm overflow-y-auto"></app-sidebar>
        <!-- Main Content -->
        <main [class.ml-64]="showLayout" class="flex-1 p-6 min-h-[calc(100vh-4rem)] overflow-x-hidden">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'LedgerFlow';
  showLayout = false;
  isBackendHealthy = false;
  isCheckingBackend = true;
  
  private subscriptions: Subscription[] = [];
  private router: Router;

  constructor(
    router: Router,
    private appInitializer: AppInitializerService,
    private healthService: BackendHealthService
  ) {
    this.router = router;
  }

  ngOnInit() {
    // Check backend connectivity on app startup
    this.initializeApp();
    
    // Set up router event handling
    this.setupRouterEvents();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private initializeApp() {
    const initSub = this.appInitializer.initializeApp().subscribe({
      next: (isHealthy: boolean) => {
        this.isBackendHealthy = isHealthy;
        this.isCheckingBackend = false;
        
        if (isHealthy) {
          // Start periodic health monitoring
          this.startPeriodicHealthMonitoring();
        }
      },
      error: (error) => {
        console.error('App initialization failed:', error);
        this.isBackendHealthy = false;
        this.isCheckingBackend = false;
      }
    });
    this.subscriptions.push(initSub);
  }

  private setupRouterEvents() {
    const routerSub = this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.showLayout = !(url.startsWith('/login') || url.startsWith('/setup'));
      }
    });
    this.subscriptions.push(routerSub);
  }

  private startPeriodicHealthMonitoring() {
    const healthSub = this.healthService.startPeriodicHealthCheck(30000).subscribe({
      next: (isHealthy: boolean) => {
        if (!isHealthy && this.isBackendHealthy) {
          // Backend became unhealthy
          this.isBackendHealthy = false;
          console.warn('Backend became unavailable during app execution');
        } else if (isHealthy && !this.isBackendHealthy) {
          // Backend became healthy again
          this.isBackendHealthy = true;
          console.log('Backend connectivity restored');
        }
      },
      error: (error) => {
        console.error('Periodic health check failed:', error);
        this.isBackendHealthy = false;
      }
    });
    this.subscriptions.push(healthSub);
  }
}