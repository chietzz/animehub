import { bootstrapApplication } from '@angular/platform-browser';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient } from '@angular/common/http';
import { PreloadAllModules, RouteReuseStrategy, provideRouter, withPreloading } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

// Deixa o DatePipe em português (ex.: "5 de abril de 2009").
registerLocaleData(localePt);

// Arquitetura Standalone: não existe AppModule, tudo é configurado aqui.
bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    provideIonicAngular({ mode: 'md' }), // mesmo visual em qualquer aparelho
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(), // necessário para o HttpClient funcionar nos services
  ],
}).catch((erro) => console.error(erro));
