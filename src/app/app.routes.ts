import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';

export const routes: Routes = [
  // Main layout routes
  {
    path: '',
    loadComponent: () => import('@layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
    children: [
      {
        path: '',
        loadChildren: () => import('@features/home/home.routes').then(m => m.HOME_ROUTES),
      },
      {
        path: 'restaurants',
        loadChildren: () => import('@features/restaurants/restaurants.routes').then(m => m.RESTAURANT_ROUTES),
      },
      {
        path: 'search',
        loadChildren: () => import('@features/search/search.routes').then(m => m.SEARCH_ROUTES),
      },
      {
        path: 'cart',
        loadChildren: () => import('@features/cart/cart.routes').then(m => m.CART_ROUTES),
      },
      {
        path: 'checkout',
        canActivate: [authGuard],
        loadChildren: () => import('@features/checkout/checkout.routes').then(m => m.CHECKOUT_ROUTES),
      },
      // Static pages
      {
        path: 'about',
        loadComponent: () => import('@features/static/pages/about-page/about-page.component').then(m => m.AboutPageComponent),
      },
      {
        path: 'terms',
        loadComponent: () => import('@features/static/pages/terms-page/terms-page.component').then(m => m.TermsPageComponent),
      },
      {
        path: 'privacy',
        loadComponent: () => import('@features/static/pages/privacy-page/privacy-page.component').then(m => m.PrivacyPageComponent),
      },
      {
        path: 'contact',
        loadComponent: () => import('@features/static/pages/contact-page/contact-page.component').then(m => m.ContactPageComponent),
      },
    ],
  },
  // Auth layout routes
  {
    path: 'auth',
    loadComponent: () => import('@layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    loadChildren: () => import('@features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  // Account layout routes (requires authentication)
  {
    path: 'account',
    canActivate: [authGuard],
    loadComponent: () => import('@layouts/account-layout/account-layout.component').then(m => m.AccountLayoutComponent),
    loadChildren: () => import('@features/account/account.routes').then(m => m.ACCOUNT_ROUTES),
  },
  // 404
  {
    path: '**',
    loadComponent: () => import('@shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
];
