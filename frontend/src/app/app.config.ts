import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { GraphQLModule } from './graphql.module';
import { ReactiveFormsModule } from '@angular/forms'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(GraphQLModule),
    importProvidersFrom(ReactiveFormsModule),
  ],
};