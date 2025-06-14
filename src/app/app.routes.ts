import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home').then(m => m.Home)
  },
  {
    path: 'ceidg',
    loadComponent: () => import('./components/ceidg').then(m => m.Ceidg)
  }
];
