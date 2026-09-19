import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { RouterModule } from '@angular/router';
import { homeLinks } from '../models/home-links';

@Component({
  selector: 'app-home',
  imports: [
    RouterModule
  ],
  template: `
    <div class="container">
      @for (cell of cells(); track cell.icon) {
        <div class="cell">
          <i class="material-icons">{{cell.icon}}</i>
          @for (link of cell.links; track link.url) {
            <a [href]="link.url" target="_blank">{{link.label}}</a>
          }
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .container {
      display: grid;
      grid-template-rows: repeat(3, auto);
      grid-template-columns: repeat(7, auto);
      row-gap: 5rem;
    }
    .cell {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      align-items: flex-start;
      overflow-y: auto;
    }
    .material-icons {
      font-size: 1.2rem;
      color: var(--color-text-blue);
    }
    a {
      text-decoration: none;
      color: var(--color-text-dark);
      margin: 0.5rem 0;
      cursor: pointer;
      outline: none;
    }
    a:hover {
      color: var(--color-text-blue);
    }
    a:focus-visible {
      color: var(--color-text-blue);
      text-decoration: underline;
    }
  `
})
export class Home {

  protected cells = signal(homeLinks);

}
