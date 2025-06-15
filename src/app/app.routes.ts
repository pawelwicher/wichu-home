import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home').then(m => m.Home)
  },
  {
    path: 'calendar',
    loadComponent: () => import('./components/calendar').then(m => m.Calendar)
  },
  {
    path: 'clock',
    loadComponent: () => import('./components/clock').then(m => m.Clock)
  },
  {
    path: 'contact',
    loadComponent: () => import('./components/contact').then(m => m.Contact)
  }
];
