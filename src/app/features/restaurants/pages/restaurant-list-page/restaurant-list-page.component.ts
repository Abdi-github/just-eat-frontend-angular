import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { RestaurantService } from '../../restaurant.service';
import { Restaurant, Cuisine, TranslatedField, SupportedLanguage } from '@core/models';
import { CurrencyChfPipe, LocalizedFieldPipe } from '@shared/pipes';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-restaurant-list-page',
  imports: [
    RouterLink, TranslateModule, MatIconModule, MatButtonModule,
    MatSelectModule, MatFormFieldModule, MatInputModule,
    MatProgressSpinnerModule, MatChipsModule, FormsModule, CurrencyChfPipe, LocalizedFieldPipe,
  ],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900 sm:text-3xl">
          {{ 'restaurants.list.title' | translate }}
        </h1>
        <p class="mt-1 text-gray-500">{{ 'restaurants.list.subtitle' | translate }}</p>
      </div>

      <!-- Filters -->
      <div class="mb-6 flex flex-wrap items-center gap-3">
        <mat-form-field appearance="outline" class="w-full sm:w-64">
          <mat-label>{{ 'restaurants.list.search' | translate }}</mat-label>
          <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onFilterChange()" />
          <mat-icon matPrefix>search</mat-icon>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full sm:w-48">
          <mat-label>{{ 'restaurants.list.cuisine' | translate }}</mat-label>
          <mat-select [(ngModel)]="selectedCuisine" (ngModelChange)="onFilterChange()">
            <mat-option value="">{{ 'restaurants.list.allCuisines' | translate }}</mat-option>
            @for (cuisine of cuisines(); track cuisine.id) {
              <mat-option [value]="cuisine.id">{{ cuisine.name | localizedField }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full sm:w-48">
          <mat-label>{{ 'restaurants.list.sort' | translate }}</mat-label>
          <mat-select [(ngModel)]="sortBy" (ngModelChange)="onFilterChange()">
            <mat-option value="-rating">{{ 'restaurants.list.sortRating' | translate }}</mat-option>
            <mat-option value="name">{{ 'restaurants.list.sortName' | translate }}</mat-option>
            <mat-option value="delivery_fee">{{ 'restaurants.list.sortDeliveryFee' | translate }}</mat-option>
            <mat-option value="-review_count">{{ 'restaurants.list.sortPopularity' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <!-- Results count -->
      @if (!isLoading() && total() > 0) {
        <p class="mb-4 text-sm text-gray-500">
          {{ 'restaurants.list.showing' | translate:{ count: restaurants().length, total: total() } }}
        </p>
      }

      <!-- Loading -->
      @if (isLoading()) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (i of skeletons; track i) {
            <div class="overflow-hidden rounded-xl border border-gray-200 bg-white">
              <div class="aspect-[16/10] w-full animate-pulse bg-gray-200"></div>
              <div class="space-y-2 p-4">
                <div class="h-5 w-3/4 animate-pulse rounded bg-gray-200"></div>
                <div class="h-3 w-1/2 animate-pulse rounded bg-gray-200"></div>
                <div class="h-3 w-2/3 animate-pulse rounded bg-gray-200"></div>
              </div>
            </div>
          }
        </div>
      } @else if (restaurants().length === 0) {
        <!-- Empty state -->
        <div class="flex flex-col items-center justify-center py-16">
          <mat-icon class="!text-6xl text-gray-300">restaurant</mat-icon>
          <h2 class="mt-4 text-xl font-semibold text-gray-500">
            {{ 'restaurants.list.noResults' | translate }}
          </h2>
          <p class="mt-1 text-sm text-gray-400">
            {{ 'restaurants.list.noResultsDescription' | translate }}
          </p>
          <button mat-stroked-button class="mt-4" (click)="clearFilters()">
            {{ 'restaurants.list.clearFilters' | translate }}
          </button>
        </div>
      } @else {
        <!-- Restaurant Grid -->
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (restaurant of restaurants(); track restaurant.id) {
            <a
              [routerLink]="['/restaurants', restaurant.slug]"
              class="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <!-- Cover -->
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
                    {{ 'restaurants.card.featured' | translate }}
                  </span>
                }
                <!-- Delivery fee badge -->
                <span class="absolute bottom-2 right-2 rounded-full bg-white/90 px-2 py-0.5 text-xs font-medium shadow-sm">
                  @if (restaurant.delivery_fee === 0 || !restaurant.delivery_fee) {
                    {{ 'restaurants.card.freeDelivery' | translate }}
                  } @else {
                    {{ restaurant.delivery_fee | currencyChf }}
                  }
                </span>
              </div>

              <div class="p-4">
                <h3 class="truncate text-lg font-semibold text-gray-900 group-hover:text-primary">
                  {{ restaurant.name }}
                </h3>
                @if (restaurant.cuisines && restaurant.cuisines.length > 0) {
                  <p class="mt-0.5 truncate text-xs text-gray-500">
                    {{ getCuisineNames(restaurant) }}
                  </p>
                }
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
              </div>
            </a>
          }
        </div>

        <!-- Load More -->
        @if (hasMore()) {
          <div class="mt-8 text-center">
            <button
              mat-flat-button
              color="primary"
              (click)="loadMore()"
              [disabled]="isLoadingMore()"
            >
              @if (isLoadingMore()) {
                <mat-spinner diameter="20" class="mr-2 inline-block"></mat-spinner>
              }
              {{ 'restaurants.list.loadMore' | translate }}
            </button>
          </div>
        }
      }
    </div>
  `,
})
export class RestaurantListPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly restaurantService = inject(RestaurantService);

  readonly restaurants = signal<Restaurant[]>([]);
  readonly cuisines = signal<Cuisine[]>([]);
  readonly isLoading = signal(true);
  readonly isLoadingMore = signal(false);
  readonly total = signal(0);
  readonly hasMore = signal(false);

  searchQuery = '';
  selectedCuisine = '';
  selectedCityId = '';
  sortBy = '-rating';
  private page = 1;

  readonly skeletons = Array.from({ length: 12 }, (_, i) => i);

  ngOnInit() {
    // Read query params
    this.route.queryParams.subscribe((params) => {
      this.searchQuery = params['q'] || params['search'] || '';
      this.selectedCuisine = params['cuisine_id'] || params['cuisine'] || '';
      this.selectedCityId = params['city_id'] || '';
      this.sortBy = params['sort'] || '-rating';
      this.loadRestaurants();
    });

    // Load cuisines
    this.restaurantService.getCuisines().subscribe({
      next: (res) => this.cuisines.set(res.data ?? []),
    });
  }

  onFilterChange() {
    this.page = 1;
    this.restaurants.set([]);
    this.loadRestaurants();
    // Update URL
    this.router.navigate([], {
      queryParams: {
        search: this.searchQuery || null,
        cuisine: this.selectedCuisine || null,
        sort: this.sortBy !== '-rating' ? this.sortBy : null,
      },
      queryParamsHandling: 'merge',
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCuisine = '';
    this.sortBy = '-rating';
    this.onFilterChange();
  }

  loadMore() {
    this.page++;
    this.isLoadingMore.set(true);
    this.restaurantService.getRestaurants(this.buildParams()).subscribe({
      next: (res) => {
        this.restaurants.update((prev) => [...prev, ...(res.data ?? [])]);
        this.hasMore.set((res.data ?? []).length >= 12);
        this.isLoadingMore.set(false);
      },
      error: () => this.isLoadingMore.set(false),
    });
  }

  private readonly translateService = inject(TranslateService);

  getCuisineNames(restaurant: Restaurant): string {
    const lang = (this.translateService.currentLang || 'de') as SupportedLanguage;
    return (restaurant.cuisines ?? []).slice(0, 3).map((c) => {
      const name = c.name;
      if (typeof name === 'string') return name;
      return name[lang] || name['de'] || name['en'] || '';
    }).join(' · ');
  }

  private loadRestaurants() {
    this.isLoading.set(true);
    this.page = 1;
    this.restaurantService.getRestaurants(this.buildParams()).subscribe({
      next: (res) => {
        this.restaurants.set(res.data ?? []);
        this.total.set(res.pagination?.total ?? res.data?.length ?? 0);
        this.hasMore.set((res.data ?? []).length >= 12);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  private buildParams(): Record<string, string | number | boolean> {
    const params: Record<string, string | number | boolean> = {
      page: this.page,
      sort: this.sortBy,
    };
    if (this.searchQuery) params['search'] = this.searchQuery;
    if (this.selectedCuisine) params['cuisine_id'] = this.selectedCuisine;
    if (this.selectedCityId) params['city_id'] = this.selectedCityId;
    return params;
  }
}
