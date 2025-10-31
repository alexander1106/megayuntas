// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
  // ajusta ruta
import { appConfig } from './app/app.config';
import { authInterceptor } from './app/interceptor/auth.interceptor';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),
    provideRouter(routes),
    // En lugar de importar HttpClientModule:
    provideHttpClient(
      withInterceptors([ authInterceptor ])
    )
  ]
}).catch(err => console.error(err));
