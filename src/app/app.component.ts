import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SidebarComponent } from './shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, SidebarComponent],
  template: `
    <div class="min-h-screen bg-gray-50">
      <!-- Header -->
      <app-header *ngIf="showLayout" class="fixed top-0 left-0 right-0 z-50"></app-header>
      <!-- Main Layout -->
      <div class="flex" [class.pt-16]="showLayout">
        <!-- Sidebar -->
        <app-sidebar *ngIf="showLayout" class="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-sm overflow-y-auto"></app-sidebar>
        <!-- Main Content -->
        <main [class.ml-64]="showLayout" class="flex-1 p-6 min-h-[calc(100vh-4rem)]">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'LedgerFlow';
  showLayout = false;
  router: Router;

  constructor(router: Router) {
    this.router = router;
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.showLayout = !(url.startsWith('/login') || url.startsWith('/setup-password'));
      }
    });
  }
}