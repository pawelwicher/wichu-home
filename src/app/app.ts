import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet
  ],
  template: `
    <header>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/clock">Zegar</a>
        <a routerLink="/calendar">Kalendarz</a>
        <a routerLink="/contact">Kontakt</a>
      </nav>
    </header>
    <main>
      <router-outlet />
    </main>
    <footer>
      &copy; 2025 All rights reserved
    </footer>
  `,
  styles: `
    :host {
      display: grid;
      grid-template-areas:
        "header"
        "main"
        "footer";
      grid-template-rows: auto 1fr auto;
      gap: 10px;
      height: 100vh;
      color: var(--color-text-dark);
    }
    nav {
      background: var(--color-bg-dark);
      color: var(--color-text-light);
      padding: var(--padding-nav);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
    }
    nav > a {
      color: var(--color-text-light);
      margin-right: 1rem;
      text-decoration: none;
      transition: color 0.2s;
    }
    nav > a:last-child {
      margin-right: 0;
    }
    nav > a:hover {
      color: var(--color-accent);
    }
    header {
      grid-area: header;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 1000;
      background: var(--color-bg-dark);
      color: var(--color-text-light);
    }
    main {
      grid-area: main;
      margin-top: 25px;
      padding: var(--padding-main);
      background: var(--color-bg-light);
    }
    footer {
      grid-area: footer;
      background: var(--color-bg-dark);
      padding: var(--padding-footer);
      color: var(--color-text-light);
      text-align: center;
      border-top: 1px solid var(--color-border);
    }
  `,
})
export class App { }
