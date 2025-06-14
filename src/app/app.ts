import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  template: `
    <router-outlet />
  `,
  styles: `
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    margin: 0;
  }`
})
export class App {

  protected title = 'wichu-home';

}
