import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
import { BoaUiModule } from 'boa-ui';

/**
 * HttpClientModule is imported directly in AppModule.
 * This is deprecated in Angular 18 in favor of provideHttpClient().
 *
 * Also note: TranslateModule.forRoot() is configured at the app level,
 * which is the Angular 14 pattern.
 */
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Root Application Module - NgModule-heavy architecture.
 * This is the primary migration target for standalone components in Angular 18.
 *
 * Key patterns present:
 * - Heavy NgModule imports (SharedModule, CoreModule, BoaUiModule)
 * - HttpClientModule imported at root (deprecated in Angular 18)
 * - CoreModule.forRoot() pattern
 * - TranslateModule.forRoot() configuration
 */
@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,  // Deprecated in Angular 18 → provideHttpClient()
    AppRoutingModule,
    CoreModule.forRoot(),
    SharedModule,
    BoaUiModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
