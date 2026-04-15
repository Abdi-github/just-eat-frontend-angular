import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthStore } from '@state/auth.store';
import { CartStore } from '@state/cart.store';
import { UiStore } from '@state/ui.store';
import { LanguageSwitcherComponent } from './language-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, TranslateModule,
    MatToolbarModule, MatButtonModule, MatIconModule,
    MatBadgeModule, MatMenuModule, MatDividerModule,
    LanguageSwitcherComponent,
  ],
  template: `
    <header class="sticky top-0 z-50 border-b border-border bg-white shadow-sm">
      <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <!-- Logo -->
        <a routerLink="/" class="flex items-center gap-2" [attr.aria-label]="'common.app.name' | translate">
          <img src="/logo.svg" alt="just-eat.ch" class="h-8" />
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          <a routerLink="/restaurants" routerLinkActive="!text-primary"
             class="text-sm font-medium text-foreground hover:text-primary">
            {{ 'common.nav.restaurants' | translate }}
          </a>

          @if (!authStore.isAuthenticated()) {
            <a routerLink="/auth/partner" class="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary">
              <mat-icon class="!text-base">storefront</mat-icon>
              {{ 'common.nav.partnerWithUs' | translate }}
            </a>
            <a routerLink="/auth/become-courier" class="flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary">
              <mat-icon class="!text-base">delivery_dining</mat-icon>
              {{ 'common.nav.becomeCourier' | translate }}
            </a>
          }

          <app-language-switcher />

          <!-- Cart -->
          <a routerLink="/cart" class="relative text-foreground hover:text-primary"
             [attr.aria-label]="'common.nav.cart' | translate">
            <mat-icon [matBadge]="cartStore.itemCount() || null"
                      matBadgeColor="primary"
                      matBadgeSize="small"
                      [matBadgeHidden]="cartStore.isEmpty()">
              shopping_cart
            </mat-icon>
          </a>

          @if (authStore.isAuthenticated()) {
            <a routerLink="/account/profile" class="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary">
              <mat-icon class="!text-xl">person</mat-icon>
              <span class="hidden lg:inline">{{ authStore.user()?.first_name }}</span>
            </a>

            <button mat-icon-button [matMenuTriggerFor]="userMenu" class="!text-muted-foreground">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #userMenu="matMenu">
              <a mat-menu-item routerLink="/account/orders">
                <mat-icon>receipt_long</mat-icon>
                <span>{{ 'common.nav.orders' | translate }}</span>
              </a>
              <a mat-menu-item routerLink="/account/favorites">
                <mat-icon>favorite</mat-icon>
                <span>{{ 'common.nav.favorites' | translate }}</span>
              </a>
              <a mat-menu-item routerLink="/account/addresses">
                <mat-icon>location_on</mat-icon>
                <span>{{ 'common.nav.addresses' | translate }}</span>
              </a>
              <a mat-menu-item routerLink="/account/reviews">
                <mat-icon>star</mat-icon>
                <span>{{ 'common.nav.reviews' | translate }}</span>
              </a>
              @if (authStore.isRestaurantOwner()) {
                <mat-divider />
                <a mat-menu-item routerLink="/restaurant/dashboard">
                  <span>{{ 'common.nav.restaurantDashboard' | translate }}</span>
                </a>
              }
              @if (authStore.isCourier()) {
                <mat-divider />
                <a mat-menu-item routerLink="/courier/dashboard">
                  <span>{{ 'common.nav.courierDashboard' | translate }}</span>
                </a>
              }
              <mat-divider />
              <button mat-menu-item class="!text-error" (click)="onLogout()">
                <mat-icon class="!text-error">logout</mat-icon>
                <span>{{ 'common.nav.logout' | translate }}</span>
              </button>
            </mat-menu>
          } @else {
            <a routerLink="/auth/login" class="text-sm font-medium text-foreground hover:text-primary">
              {{ 'common.nav.login' | translate }}
            </a>
            <a routerLink="/auth/register"
               class="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover">
              {{ 'common.nav.register' | translate }}
            </a>
          }
        </nav>

        <!-- Mobile menu toggle -->
        <button class="md:hidden" (click)="uiStore.toggleMobileMenu()" aria-label="Toggle menu">
          <mat-icon>{{ uiStore.mobileMenuOpen() ? 'close' : 'menu' }}</mat-icon>
        </button>
      </div>

      <!-- Mobile Menu -->
      @if (uiStore.mobileMenuOpen()) {
        <div class="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav class="flex flex-col gap-3" aria-label="Mobile navigation">
            <a routerLink="/restaurants" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">
              {{ 'common.nav.restaurants' | translate }}
            </a>
            <a routerLink="/cart" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">
              {{ 'common.nav.cart' | translate }}
              @if (cartStore.itemCount() > 0) {
                <span> ({{ cartStore.itemCount() }})</span>
              }
            </a>

            @if (authStore.isAuthenticated()) {
              <a routerLink="/account/orders" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.orders' | translate }}</a>
              <a routerLink="/account/favorites" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.favorites' | translate }}</a>
              <a routerLink="/account/addresses" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.addresses' | translate }}</a>
              <a routerLink="/account/reviews" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.reviews' | translate }}</a>
              <a routerLink="/account/notifications" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.notifications' | translate }}</a>
              <a routerLink="/account/profile" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.profile' | translate }}</a>
              @if (authStore.isRestaurantOwner()) {
                <hr class="border-border" />
                <a routerLink="/restaurant/dashboard" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.restaurantDashboard' | translate }}</a>
              }
              @if (authStore.isCourier()) {
                <hr class="border-border" />
                <a routerLink="/courier/dashboard" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.courierDashboard' | translate }}</a>
              }
              <hr class="border-border" />
              <button class="text-left text-sm font-medium text-error" (click)="uiStore.closeMobileMenu(); onLogout()">
                {{ 'common.nav.logout' | translate }}
              </button>
            } @else {
              <a routerLink="/auth/login" class="text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.login' | translate }}</a>
              <a routerLink="/auth/register" class="text-sm font-medium text-primary" (click)="uiStore.closeMobileMenu()">{{ 'common.nav.register' | translate }}</a>
              <hr class="border-border" />
              <a routerLink="/auth/partner" class="flex items-center gap-2 text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">
                <mat-icon class="!text-base">storefront</mat-icon>
                {{ 'common.nav.partnerWithUs' | translate }}
              </a>
              <a routerLink="/auth/become-courier" class="flex items-center gap-2 text-sm font-medium text-foreground" (click)="uiStore.closeMobileMenu()">
                <mat-icon class="!text-base">delivery_dining</mat-icon>
                {{ 'common.nav.becomeCourier' | translate }}
              </a>
            }
            <div class="pt-2">
              <app-language-switcher />
            </div>
          </nav>
        </div>
      }
    </header>
  `,
})
export class HeaderComponent {
  readonly authStore = inject(AuthStore);
  readonly cartStore = inject(CartStore);
  readonly uiStore = inject(UiStore);

  onLogout(): void {
    this.authStore.logout();
  }
}
