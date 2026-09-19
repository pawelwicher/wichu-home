import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { installMockModelContext } from './app/webmcp/model-context';

// Atrapa musi istniec zanim Angular zarejestruje narzedzia podczas bootstrapu.
installMockModelContext();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));
