import { Routes } from '@angular/router';

export const RESTAURANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/restaurant-list-page/restaurant-list-page.component').then(m => m.RestaurantListPageComponent),
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/restaurant-explore-page/restaurant-explore-page.component').then(m => m.RestaurantExplorePageComponent),
  },
  {
    path: ':slug',
    loadComponent: () => import('./pages/restaurant-detail-page/restaurant-detail-page.component').then(m => m.RestaurantDetailPageComponent),
  },
];
