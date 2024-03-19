import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { APP_INITIALIZER } from '@angular/core';

platformBrowserDynamic().bootstrapModule(AppModule, {
  providers: [
    { provide: APP_INITIALIZER, useFactory: () => appConfig, multi: true}
  ]
})
  .catch((err) => console.error(err));
