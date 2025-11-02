import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppInitializerService } from './shared/services/app-initializer.service';
import { BackendConnectivityInterceptor } from './shared/interceptors/backend-connectivity.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([
        (req, next) => {
          const token = localStorage.getItem('jwtToken');
          if (token) {
            req = req.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`
              }
            });
          }
          return next(req);
        }
      ])
    ),
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: BackendConnectivityInterceptor,
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (appInitializer: AppInitializerService) => () => {
        // This runs during app bootstrap but we handle the actual initialization
        // in the component to have better control over the UI state
        return Promise.resolve();
      },
      deps: [AppInitializerService],
      multi: true
    }
  ]
};