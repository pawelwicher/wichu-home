import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { homeLinks } from '../models/home-links';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule
  ],
  template: `
  <div class="container">
    @for (cell of cells; track cell.icon) {
      <div class="cell">
        <i class="material-icons">{{cell.icon}}</i>
        @for (link of cell.links; track link.url) {
          @if (isAngularLink(link.url)) {
            <a [routerLink]="link.url">{{link.label}}</a>
          } @else {
            <a [href]="link.url" target="_blank">{{link.label}}</a>
          }
        }
      </div>
    }
  </div>
  `,
  styles: `
  .container {
    display: grid;
    grid-template-rows: repeat(3, auto);
    grid-template-columns: repeat(7, auto);
    gap: 1rem;
    width: 90vw;
    height: 90vh;
  }
  .cell {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    overflow-y: auto;
  }
  .material-icons {
    font-size: 1.2rem;
    color: #0d4e8e;
  }
  a {
    text-decoration: none;
    color: #000;
    margin: 0.5rem 0;
    cursor: pointer;
  }
  a:hover {
    color: #0d4e8e;
  }`,
})
export class Home {

  protected cells = homeLinks;

  protected isAngularLink(url: string): boolean {
    return url.startsWith('/');
  }

}
