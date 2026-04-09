import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

// Import the shared library module — this is the key integration point.
// When the library is upgraded to Angular 18, this import must still work.
import { BoaUiModule } from '@boa-ui/meridian-design-system';

import { AppComponent } from './app.component';
import { ConsumerPageComponent } from './consumer-page.component';

/**
 * Downstream consumer app that imports BoaUiModule from the shared library.
 * This simulates a downstream team's application that depends on
 * @boa-ui/meridian-design-system.
 *
 * Critical for demo: This app's ng build must continue to pass after
 * the library is upgraded, proving backward compatibility.
 */
@NgModule({
  declarations: [
    AppComponent,
    ConsumerPageComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    BoaUiModule,
    RouterModule.forRoot([
      { path: '', component: ConsumerPageComponent },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
