import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { SessionAjaxService } from './services/session.ajax.service';
import { provideHttpClient } from '@angular/common/http';
import { DialogService } from 'primeng/dynamicdialog';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    SessionAjaxService,
    provideHttpClient(),
    DialogService,
    MessageService
  ]
};
