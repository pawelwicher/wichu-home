import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterModule,
    RouterOutlet
  ],
  template: `
    <nav class="nav">
      <a routerLink="/" class="nav-link">Home</a>
      <a routerLink="/clock" class="nav-link">Zegar</a>
      <a routerLink="/calendar" class="nav-link">Kalendarz</a>
      <a routerLink="/contact" class="nav-link">Kontakt</a>
    </nav>
    <main class="main">
      <router-outlet />
    </main>
    <footer class="footer">
      &copy; 2025 All rights reserved
    </footer>
  `,
  styles: `
    :host {
      --color-bg-dark: #222;
      --color-bg-light: #f9f9f9;
      --color-text-light: #fff;
      --color-text-dark: #222;
      --color-accent:rgb(22, 132, 222);
      --color-border: #ccc;
      --padding-main: 2rem;
      --padding-main-mobile: 1rem;
      --padding-nav-footer: 0.5rem;
      --font-size-nav: 1rem;
      --font-size-nav-mobile: 1rem;
      height: 100vh;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    .nav {
      background: var(--color-bg-dark);
      color: var(--color-text-light);
      padding: var(--padding-nav-footer);
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-bottom: 1px solid var(--color-border);
    }
    .nav-link {
      color: var(--color-text-light);
      margin-right: 1rem;
      text-decoration: none;
      transition: color 0.2s;
    }
    .nav-link:last-child {
      margin-right: 0;
    }
    .nav-link:hover {
      color: var(--color-accent);
    }
    .main {
      flex: 1 0 auto;
      padding: var(--padding-main);
      background: var(--color-bg-light);
      width: 100%;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-left: 1px solid var(--color-border);
      border-right: 1px solid var(--color-border);
      color: var(--color-text-dark);
    }
    .footer {
      background: var(--color-bg-dark);
      color: var(--color-text-light);
      text-align: center;
      padding: var(--padding-nav-footer);
      flex-shrink: 0;
      border-top: 1px solid var(--color-border);
    }
    @media (max-width: 600px) {
      .main {
        padding: var(--padding-main-mobile);
        border-left: none;
        border-right: none;
      }
      .nav {
        flex-direction: column;
        align-items: flex-start;
      }
      .nav-link {
        margin: 0 0 0.5rem 0;
        font-size: var(--font-size-nav-mobile);
      }
      .theme-toggle {
        margin-left: 0;
        margin-top: 0.5rem;
      }
    }
  `,
})
export class App { }
