import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../main-layout/header.component';
import { FooterComponent } from '../main-layout/footer.component';
import { AuthStore } from '@state/auth.store';

interface AccountLink {
  to: string;
  icon: string;
  label: string;
}

const ACCOUNT_LINKS: AccountLink[] = [
  { to: '/account/orders', icon: 'shopping_bag', label: 'common.nav.orders' },
  { to: '/account/favorites', icon: 'favorite', label: 'common.nav.favorites' },
  { to: '/account/addresses', icon: 'location_on', label: 'common.nav.addresses' },
  { to: '/account/profile', icon: 'person', label: 'common.nav.profile' },
  { to: '/account/reviews', icon: 'star', label: 'common.nav.reviews' },
  { to: '/account/notifications', icon: 'notifications', label: 'common.nav.notifications' },
  { to: '/account/promotions', icon: 'card_giftcard', label: 'common.nav.promotions' },
];

@Component({
  selector: 'app-account-layout',
  standalone: true,
  imports: [
    RouterLink, RouterLinkActive, RouterOutlet, TranslateModule,
    MatIconModule, HeaderComponent, FooterComponent,
  ],
  template: `
    <div class="flex min-h-screen flex-col">
      <app-header />
      <main class="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-6">
        <!-- Sidebar — desktop -->
        <aside class="hidden w-64 shrink-0 md:block">
          <nav class="sticky top-20 space-y-1 rounded-xl border border-border bg-white p-4 shadow-sm">
            @for (link of accountLinks; track link.to) {
              <a [routerLink]="link.to" routerLinkActive="!bg-primary/10 !text-primary"
                 class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
                <mat-icon class="!text-lg">{{ link.icon }}</mat-icon>
                {{ link.label | translate }}
              </a>
            }
            <hr class="my-2 border-border" />
            <button (click)="authStore.logout()"
                    class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-error hover:bg-red-50">
              <mat-icon class="!text-lg">logout</mat-icon>
              {{ 'common.nav.logout' | translate }}
            </button>
          </nav>
        </aside>

        <!-- Mobile horizontal nav -->
        <div class="w-full md:hidden">
          <nav class="mb-4 -mx-4 overflow-x-auto border-b border-border bg-white px-4">
            <div class="flex gap-1 pb-2">
              @for (link of accountLinks; track link.to) {
                <a [routerLink]="link.to" routerLinkActive="!bg-primary !text-white"
                   class="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap bg-accent text-foreground transition-colors">
                  <mat-icon class="!text-sm">{{ link.icon }}</mat-icon>
                  {{ link.label | translate }}
                </a>
              }
            </div>
          </nav>
          <router-outlet />
        </div>

        <!-- Content — desktop -->
        <div class="hidden flex-1 md:block">
          <router-outlet />
        </div>
      </main>
      <app-footer />
    </div>
  `,
})
export class AccountLayoutComponent {
  readonly authStore = inject(AuthStore);
  readonly accountLinks = ACCOUNT_LINKS;
}
