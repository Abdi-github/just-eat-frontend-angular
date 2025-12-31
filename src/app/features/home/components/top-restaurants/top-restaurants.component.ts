import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { HomeService } from '../../home.service';
import { Restaurant, SupportedLanguage } from '@core/models';
import { CurrencyChfPipe, LocalizedFieldPipe } from '@shared/pipes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-top-restaurants',
  imports: [RouterLink, TranslateModule, MatIconModule, CurrencyChfPipe, LocalizedFieldPipe],
  template: `
    @if (!isError()) {
      <section class="bg-gray-50 py-12 md:py-16">
        <div class="mx-auto max-w-7xl px-4">
          <!-- Section Header -->
          <div class="mb-8 flex items-end justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
                {{ 'home.topRestaurants.title' | translate }}
              </h2>
              <p class="mt-1 text-gray-500">
                {{ 'home.topRestaurants.subtitle' | translate }}
              </p>
            </div>
            <a
              routerLink="/restaurants"
              class="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
            >
              {{ 'home.topRestaurants.viewAll' | translate }}
              <mat-icon class="!text-base">chevron_right</mat-icon>
            </a>
          </div>

          <!-- Restaurant Grid -->
          @if (isLoading()) {
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              @for (i of skeletons; track i) {
                <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div class="aspect-[16/10] w-full animate-pulse bg-gray-200"></div>
                  <div class="space-y-2 p-3">
                    <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                    <div class="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                    <div class="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
                    <div class="h-3 w-1/3 animate-pulse rounded bg-gray-200"></div>
                  </div>
                </div>
              }
            </div>
          } @else {
            <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              @for (restaurant of restaurants(); track restaurant.id) {
                <a
                  [routerLink]="['/restaurants', restaurant.slug]"
                  class="group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
                >
                  <!-- Cover Image -->
                  <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
                    @if (restaurant.cover_image_url || restaurant.logo_url) {
                      <img
                        [src]="restaurant.cover_image_url ?? restaurant.logo_url ?? ''"
                        [alt]="restaurant.name"
                        class="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    } @else {
                      <div class="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
                        <span class="text-4xl">🍽️</span>
                      </div>
                    }
                    @if (restaurant.is_featured) {
                      <span class="absolute top-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-white">
                        {{ 'home.topRestaurants.featured' | translate }}
                      </span>
                    }
                    @if (restaurant.logo_url && restaurant.cover_image_url) {
                      <div class="absolute bottom-2 left-2 h-10 w-10 overflow-hidden rounded-lg border-2 border-white bg-white shadow-sm">
                        <img [src]="restaurant.logo_url" alt="" class="h-full w-full object-cover" />
                      </div>
                    }
                  </div>

                  <!-- Card Content -->
                  <div class="p-3">
                    <h3 class="truncate text-base font-semibold text-gray-900 group-hover:text-primary">
                      {{ restaurant.name }}
                    </h3>

                    @if (restaurant.cuisines && restaurant.cuisines.length > 0) {
                      <p class="mt-0.5 truncate text-xs text-gray-500">
                        {{ getCuisineNames(restaurant) }}
                      </p>
                    }

                    <!-- Rating + Delivery Info -->
                    <div class="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      <div class="flex items-center gap-1">
                        <mat-icon class="!text-sm text-amber-500">star</mat-icon>
                        <span class="font-semibold text-gray-900">{{ restaurant.average_rating?.toFixed(1) || '0.0' }}</span>
                        <span>({{ restaurant.review_count || 0 }})</span>
                      </div>
                      @if (restaurant.estimated_delivery_time_min) {
                        <div class="flex items-center gap-1">
                          <mat-icon class="!text-sm">schedule</mat-icon>
                          <span>{{ restaurant.estimated_delivery_time_min }}–{{ restaurant.estimated_delivery_time_max }} min</span>
                        </div>
                      }
                    </div>

                    <!-- Delivery Fee -->
                    <div class="mt-2 flex items-center gap-2">
                      <mat-icon class="!text-sm text-gray-400">delivery_dining</mat-icon>
                      <span class="text-xs font-medium">
                        @if (restaurant.delivery_fee != null && restaurant.delivery_fee > 0) {
                          {{ restaurant.delivery_fee | currencyChf }}
                        } @else {
                          {{ 'home.topRestaurants.freeDelivery' | translate }}
                        }
                      </span>
                      @if (restaurant.minimum_order != null && restaurant.minimum_order > 0) {
                        <span class="text-xs text-gray-500">
                          · Min. {{ restaurant.minimum_order | currencyChf }}
                        </span>
                      }
                    </div>
                  </div>
                </a>
              }
            </div>
          }

          <!-- Mobile View All -->
          <div class="mt-6 text-center md:hidden">
            <a
              routerLink="/restaurants"
              class="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {{ 'home.topRestaurants.viewAll' | translate }}
              <mat-icon class="!text-base">chevron_right</mat-icon>
            </a>
          </div>
        </div>
      </section>
    }
  `,
})
export class TopRestaurantsComponent {
  private readonly homeService = inject(HomeService);

  readonly isLoading = signal(true);
  readonly isError = signal(false);
  readonly restaurants = signal<Restaurant[]>([]);

  readonly skeletons = Array.from({ length: 8 }, (_, i) => i);

  constructor() {
    this.homeService.getTopRestaurants().subscribe({
      next: (res) => {
        this.restaurants.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }

  private readonly translateSvc = inject(TranslateService);

  getCuisineNames(restaurant: Restaurant): string {
    const lang = (this.translateSvc.currentLang || 'de') as SupportedLanguage;
    return (restaurant.cuisines ?? []).slice(0, 3).map((c) => {
      const name = c.name;
      if (typeof name === 'string') return name;
      return name[lang] || name['de'] || name['en'] || '';
    }).join(' · ');
  }
}
