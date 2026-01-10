import { Routes } from '@angular/router';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile-page/profile-page.component').then(m => m.ProfilePageComponent),
  },
  {
    path: 'orders',
    loadComponent: () => import('./pages/orders-page/orders-page.component').then(m => m.OrdersPageComponent),
  },
  {
    path: 'orders/:id',
    loadComponent: () => import('./pages/order-detail-page/order-detail-page.component').then(m => m.OrderDetailPageComponent),
  },
  {
    path: 'addresses',
    loadComponent: () => import('./pages/addresses-page/addresses-page.component').then(m => m.AddressesPageComponent),
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites-page/favorites-page.component').then(m => m.FavoritesPageComponent),
  },
  {
    path: 'reviews',
    loadComponent: () => import('./pages/reviews-page/reviews-page.component').then(m => m.ReviewsPageComponent),
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
  },
  {
    path: 'promotions',
    loadComponent: () => import('./pages/promotions-page/promotions-page.component').then(m => m.PromotionsPageComponent),
  },
];
