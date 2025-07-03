import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'app',
    children:[
     {
        path: 'world-development-indicator-dashboard',
        loadComponent: () => import('./pages/world-development-indicator-dashboard/world-development-indicator-dashboard.page').then( m => m.WorldDevelopmentIndicatorDashboardPage)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'app/world-development-indicator-dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'app/world-development-indicator-dashboard',
  }
  
];
