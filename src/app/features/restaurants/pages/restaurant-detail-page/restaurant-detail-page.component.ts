import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { RestaurantService } from '../../restaurant.service';
import { Restaurant, MenuCategory, MenuItem, SupportedLanguage } from '@core/models';
import { StarRatingComponent } from '@shared/components/star-rating/star-rating.component';
import { CurrencyChfPipe, LocalizedFieldPipe } from '@shared/pipes';
import { CartStore } from '@state/cart.store';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-restaurant-detail-page',
  imports: [
    RouterLink, TranslateModule, MatIconModule, MatButtonModule,
    MatTabsModule, MatProgressSpinnerModule, MatDividerModule,
    StarRatingComponent, CurrencyChfPipe, LocalizedFieldPipe,
  ],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Back link -->
      <a
        routerLink="/restaurants"
        class="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary"
      >
        <mat-icon class="!text-base">arrow_back</mat-icon>
        {{ 'restaurants.detail.backToRestaurants' | translate }}
      </a>

      @if (isLoading()) {
        <!-- Loading skeleton -->
        <div class="space-y-4">
          <div class="h-48 w-full animate-pulse rounded-xl bg-gray-200"></div>
          <div class="h-8 w-2/3 animate-pulse rounded bg-gray-200"></div>
          <div class="h-4 w-1/2 animate-pulse rounded bg-gray-200"></div>
        </div>
      } @else if (!restaurant()) {
        <!-- Not found -->
        <div class="py-16 text-center">
          <mat-icon class="!text-6xl text-gray-300">restaurant</mat-icon>
          <h2 class="mt-4 text-xl font-semibold">Restaurant not found</h2>
          <a mat-stroked-button routerLink="/restaurants" class="mt-4">
            {{ 'restaurants.detail.backToRestaurants' | translate }}
          </a>
        </div>
      } @else {
        <!-- Restaurant Info Header -->
        <div class="mb-6">
          @if (restaurant()!.cover_image_url) {
            <div class="relative mb-4 h-48 overflow-hidden rounded-xl md:h-64">
              <img
                [src]="restaurant()!.cover_image_url"
                [alt]="restaurant()!.name"
                class="h-full w-full object-cover"
              />
            </div>
          }

          <div class="flex items-start gap-4">
            @if (restaurant()!.logo_url) {
              <img
                [src]="restaurant()!.logo_url"
                [alt]="restaurant()!.name"
                class="h-16 w-16 rounded-xl border-2 border-white object-cover shadow-sm"
              />
            }
            <div class="flex-1">
              <h1 class="text-2xl font-bold text-gray-900 md:text-3xl">{{ restaurant()!.name }}</h1>
              @if (restaurant()!.cuisines && restaurant()!.cuisines!.length > 0) {
                <p class="mt-1 text-gray-500">
                  {{ getCuisineNames() }}
                </p>
              }
              <div class="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <div class="flex items-center gap-1">
                  <mat-icon class="!text-base text-amber-500">star</mat-icon>
                  <span class="font-semibold text-gray-900">{{ restaurant()!.average_rating?.toFixed(1) || '0.0' }}</span>
                  <span>({{ restaurant()!.review_count || 0 }} {{ 'restaurants.detail.reviews' | translate }})</span>
                </div>
                @if (restaurant()!.estimated_delivery_time_min) {
                  <div class="flex items-center gap-1">
                    <mat-icon class="!text-base">schedule</mat-icon>
                    <span>{{ restaurant()!.estimated_delivery_time_min }}–{{ restaurant()!.estimated_delivery_time_max }} min</span>
                  </div>
                }
                <div class="flex items-center gap-1">
                  <mat-icon class="!text-base">delivery_dining</mat-icon>
                  @if (restaurant()!.delivery_fee && restaurant()!.delivery_fee! > 0) {
                    <span>{{ restaurant()!.delivery_fee | currencyChf }}</span>
                  } @else {
                    <span class="text-green-600">{{ 'restaurants.detail.freeDelivery' | translate }}</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        <mat-divider class="my-6"></mat-divider>

        <!-- Tabs: Menu / Reviews -->
        <div class="flex flex-col gap-8 lg:flex-row">
          <div class="min-w-0 flex-1">
            <mat-tab-group animationDuration="200ms">
              <!-- Menu Tab -->
              <mat-tab [label]="'restaurants.detail.menu' | translate">
                <div class="py-4">
                  @if (isLoadingMenu()) {
                    <div class="space-y-4">
                      @for (i of [1,2,3,4]; track i) {
                        <div class="h-24 w-full animate-pulse rounded-xl bg-gray-200"></div>
                      }
                    </div>
                  } @else if (categories().length === 0) {
                    <div class="py-12 text-center">
                      <mat-icon class="!text-5xl text-gray-300">restaurant_menu</mat-icon>
                      <h3 class="mt-3 text-lg font-semibold text-gray-500">
                        {{ 'restaurants.detail.noMenu' | translate }}
                      </h3>
                    </div>
                  } @else {
                    <!-- Category navigation -->
                    <div class="mb-4 flex gap-2 overflow-x-auto pb-2">
                      @for (cat of categories(); track cat.id) {
                        <button
                          (click)="scrollToCategory(cat.id)"
                          [class]="activeCategoryId() === cat.id
                            ? 'whitespace-nowrap rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-white'
                            : 'whitespace-nowrap rounded-full bg-gray-100 px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200'"
                        >
                          {{ cat.name | localizedField }}
                        </button>
                      }
                    </div>

                    <!-- Category sections -->
                    <div class="space-y-8">
                      @for (category of categories(); track category.id) {
                        <div [id]="'cat-' + category.id">
                          <h3 class="mb-3 text-lg font-bold text-gray-900">{{ category.name | localizedField }}</h3>
                          <div class="space-y-2">
                            @for (item of category.items ?? []; track item.id) {
                              <div
                                class="flex cursor-pointer gap-4 rounded-xl border border-gray-200 p-3 transition-colors hover:bg-gray-50"
                                (click)="addToCart(item)"
                              >
                                <div class="flex-1">
                                  <h4 class="font-medium text-gray-900">{{ item.name | localizedField }}</h4>
                                  @if (item.description) {
                                    <p class="mt-0.5 line-clamp-2 text-sm text-gray-500">{{ item.description | localizedField }}</p>
                                  }
                                  <p class="mt-1 font-semibold text-primary">{{ item.price | currencyChf }}</p>
                                </div>
                                @if (item.image_url) {
                                  <img
                                    [src]="item.image_url"
                                    [alt]="item.name | localizedField"
                                    class="h-20 w-20 rounded-lg object-cover"
                                    loading="lazy"
                                  />
                                }
                              </div>
                            }
                          </div>
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>

              <!-- Reviews Tab -->
              <mat-tab>
                <ng-template mat-tab-label>
                  {{ 'restaurants.detail.reviews' | translate }}
                  @if (restaurant()!.review_count) {
                    <span class="ml-1 text-xs text-gray-500">({{ restaurant()!.review_count }})</span>
                  }
                </ng-template>
                <div class="py-4">
                  @if (reviews().length === 0) {
                    <div class="py-12 text-center">
                      <mat-icon class="!text-5xl text-gray-300">rate_review</mat-icon>
                      <h3 class="mt-3 text-lg font-semibold text-gray-500">
                        {{ 'restaurants.detail.noReviews' | translate }}
                      </h3>
                    </div>
                  } @else {
                    <div class="space-y-4">
                      @for (review of reviews(); track review.id) {
                        <div class="rounded-xl border border-gray-200 p-4">
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <div class="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                                {{ review.user?.first_name?.charAt(0) || '?' }}
                              </div>
                              <span class="font-medium text-gray-900">
                                {{ review.user?.first_name || 'Anonymous' }}
                              </span>
                            </div>
                            <app-star-rating [rating]="review.rating" />
                          </div>
                          @if (review.comment) {
                            <p class="mt-2 text-sm text-gray-600">{{ review.comment }}</p>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </mat-tab>
            </mat-tab-group>
          </div>

          <!-- Sidebar -->
          <div class="hidden w-80 shrink-0 space-y-4 lg:block">
            <!-- Delivery info card -->
            <div class="rounded-xl border border-gray-200 p-4">
              <h3 class="mb-3 font-semibold text-gray-900">
                {{ 'restaurants.detail.deliveryInfo' | translate }}
              </h3>
              <div class="space-y-2 text-sm text-gray-600">
                @if (restaurant()!.estimated_delivery_time_min) {
                  <div class="flex items-center justify-between">
                    <span>{{ 'restaurants.detail.deliveryTime' | translate }}</span>
                    <span class="font-medium">{{ restaurant()!.estimated_delivery_time_min }}–{{ restaurant()!.estimated_delivery_time_max }} min</span>
                  </div>
                }
                <div class="flex items-center justify-between">
                  <span>{{ 'restaurants.detail.deliveryFee' | translate }}</span>
                  <span class="font-medium">
                    @if (restaurant()!.delivery_fee && restaurant()!.delivery_fee! > 0) {
                      {{ restaurant()!.delivery_fee | currencyChf }}
                    } @else {
                      {{ 'restaurants.detail.free' | translate }}
                    }
                  </span>
                </div>
                @if (restaurant()!.minimum_order && restaurant()!.minimum_order! > 0) {
                  <div class="flex items-center justify-between">
                    <span>{{ 'restaurants.detail.minimumOrder' | translate }}</span>
                    <span class="font-medium">{{ restaurant()!.minimum_order | currencyChf }}</span>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class RestaurantDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly restaurantService = inject(RestaurantService);
  private readonly cartStore = inject(CartStore);

  readonly restaurant = signal<Restaurant | null>(null);
  readonly categories = signal<MenuCategory[]>([]);
  readonly reviews = signal<any[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMenu = signal(true);
  readonly activeCategoryId = signal<string | null>(null);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) return;

    this.restaurantService.getRestaurantBySlug(slug).subscribe({
      next: (res) => {
        this.restaurant.set(res.data ?? null);
        this.isLoading.set(false);
        if (res.data?.id) {
          this.loadMenu(res.data.id);
          this.loadReviews(res.data.id);
        }
      },
      error: () => this.isLoading.set(false),
    });
  }

  private readonly translateSvc = inject(TranslateService);

  getCuisineNames(): string {
    const lang = (this.translateSvc.currentLang || 'de') as SupportedLanguage;
    return (this.restaurant()?.cuisines ?? []).map((c) => {
      const name = c.name;
      if (typeof name === 'string') return name;
      return name[lang] || name['de'] || name['en'] || '';
    }).join(', ');
  }

  scrollToCategory(categoryId: string) {
    this.activeCategoryId.set(categoryId);
    document.getElementById('cat-' + categoryId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  addToCart(item: MenuItem) {
    const rest = this.restaurant();
    if (!rest) return;
    this.cartStore.addItem(item, rest);
  }

  private loadMenu(restaurantId: string) {
    this.restaurantService.getRestaurantMenu(restaurantId).subscribe({
      next: (res) => {
        const cats = res.data?.categories ?? [];
        this.categories.set(cats);
        if (cats.length > 0) {
          this.activeCategoryId.set(cats[0].id);
        }
        this.isLoadingMenu.set(false);
      },
      error: () => this.isLoadingMenu.set(false),
    });
  }

  private loadReviews(restaurantId: string) {
    this.restaurantService.getRestaurantReviews(restaurantId, { limit: 20 }).subscribe({
      next: (res) => {
        this.reviews.set(res.data ?? []);
      },
    });
  }
}
