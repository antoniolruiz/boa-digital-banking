import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="consumer-app">
      <h1>Downstream Consumer App</h1>
      <p>This app consumes @boa-ui/meridian-design-system components.</p>
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .consumer-app {
      padding: 24px;
      font-family: Roboto, 'Helvetica Neue', sans-serif;
    }
    h1 { color: #012169; }
  `]
})
export class AppComponent {
  title = 'downstream-consumer';
}
