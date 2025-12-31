import { Component, inject, signal, ElementRef, viewChild, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HomeService } from '../../home.service';
import { City } from '@core/models';

@Component({
  selector: 'app-hero-search',
  imports: [TranslateModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <section class="relative overflow-hidden bg-gradient-to-br from-primary to-orange-600 py-16 md:py-24">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/20"></div>
        <div class="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/15"></div>
      </div>

      <div class="relative mx-auto max-w-4xl px-4 text-center">
        <h1 class="mb-4 text-4xl font-extrabold text-white md:text-5xl lg:text-6xl">
          {{ 'home.hero.title' | translate }}
        </h1>
        <p class="mb-8 text-lg text-white/90 md:text-xl">
          {{ 'home.hero.subtitle' | translate }}
        </p>

        <!-- Delivery / Pickup Toggle -->
        <div class="mb-6 inline-flex rounded-full bg-white/20 p-1">
          <button
            (click)="orderType.set('delivery')"
            [class]="orderType() === 'delivery'
              ? 'rounded-full px-6 py-2 text-sm font-medium transition-all bg-white text-primary shadow-sm'
              : 'rounded-full px-6 py-2 text-sm font-medium transition-all text-white hover:bg-white/10'"
          >
            {{ 'home.hero.delivery' | translate }}
          </button>
          <button
            (click)="orderType.set('pickup')"
            [class]="orderType() === 'pickup'
              ? 'rounded-full px-6 py-2 text-sm font-medium transition-all bg-white text-primary shadow-sm'
              : 'rounded-full px-6 py-2 text-sm font-medium transition-all text-white hover:bg-white/10'"
          >
            {{ 'home.hero.pickup' | translate }}
          </button>
        </div>

        <!-- Search Bar -->
        <div class="relative mx-auto max-w-2xl">
          <div class="flex items-center overflow-hidden rounded-xl bg-white shadow-lg">
            <div class="flex flex-1 items-center px-4">
              <mat-icon class="mr-3 shrink-0 text-gray-400">location_on</mat-icon>
              <input
                #searchInput
                type="text"
                [placeholder]="'home.hero.searchPlaceholder' | translate"
                [value]="query()"
                (input)="onQueryChange($event)"
                (focus)="onFocus()"
                (keydown.enter)="handleSearch()"
                class="w-full bg-transparent py-4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <button
              mat-flat-button
              color="primary"
              (click)="handleSearch()"
              class="m-1.5 !rounded-lg !px-6"
            >
              <mat-icon class="mr-2">search</mat-icon>
              <span class="hidden sm:inline">{{ 'home.hero.findRestaurants' | translate }}</span>
            </button>
          </div>

          <!-- Suggestions Dropdown -->
          @if (showSuggestions() && query().length >= 2) {
            <div
              #suggestionsRef
              class="absolute z-50 mt-2 w-full rounded-xl border border-gray-200 bg-white shadow-lg"
            >
              @if (isSearching()) {
                <div class="flex items-center justify-center py-8">
                  <mat-spinner diameter="20"></mat-spinner>
                </div>
              } @else {
                <div class="max-h-72 overflow-y-auto">
                  @if (searchCities().length > 0) {
                    <div class="px-4 py-2">
                      <p class="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Cities</p>
                      @for (city of searchCities(); track city.id) {
                        <button
                          (click)="handleCitySelect(city)"
                          class="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-gray-50"
                        >
                          <mat-icon class="text-primary !text-base">location_on</mat-icon>
                          <div>
                            <p class="text-sm font-medium">{{ city.name }}</p>
                          </div>
                          <mat-icon class="ml-auto !text-base text-gray-400">chevron_right</mat-icon>
                        </button>
                      }
                    </div>
                  }
                  @if (searchCities().length === 0) {
                    <div class="py-8 text-center text-sm text-gray-500">
                      No locations found
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Popular Cities -->
        @if (popularCities().length > 0) {
          <div class="mt-6">
            <p class="mb-3 text-sm text-white/80">
              {{ 'home.hero.popularCities' | translate }}
            </p>
            <div class="flex flex-wrap items-center justify-center gap-2">
              @for (city of popularCities(); track city.id) {
                <button
                  (click)="handlePopularCityClick(city)"
                  class="rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {{ city.name }}
                </button>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
})
export class HeroSearchComponent {
  private readonly router = inject(Router);
  private readonly homeService = inject(HomeService);

  readonly query = signal('');
  readonly orderType = signal<'delivery' | 'pickup'>('delivery');
  readonly showSuggestions = signal(false);
  readonly isSearching = signal(false);
  readonly searchCities = signal<City[]>([]);
  readonly popularCities = signal<City[]>([]);

  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  readonly suggestionsRef = viewChild<ElementRef>('suggestionsRef');
  readonly searchInput = viewChild<ElementRef>('searchInput');

  constructor() {
    this.homeService.getCities().subscribe({
      next: (res) => this.popularCities.set(res.data ?? []),
    });
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const suggestionsEl = this.suggestionsRef()?.nativeElement;
    const inputEl = this.searchInput()?.nativeElement;
    if (
      suggestionsEl && !suggestionsEl.contains(event.target as Node) &&
      inputEl && !inputEl.contains(event.target as Node)
    ) {
      this.showSuggestions.set(false);
    }
  }

  onQueryChange(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    if (value.length >= 2) {
      this.showSuggestions.set(true);
      this.debouncedSearch(value);
    } else {
      this.showSuggestions.set(false);
    }
  }

  onFocus() {
    if (this.query().length >= 2) {
      this.showSuggestions.set(true);
    }
  }

  handleSearch() {
    const params = new URLSearchParams();
    if (this.query()) {
      params.set('q', this.query());
    }
    params.set('order_type', this.orderType());
    this.router.navigateByUrl(`/restaurants?${params.toString()}`);
  }

  handleCitySelect(city: City) {
    this.query.set(city.name);
    this.showSuggestions.set(false);
    this.router.navigateByUrl(`/restaurants?city_id=${city.id}&order_type=${this.orderType()}`);
  }

  handlePopularCityClick(city: City) {
    this.router.navigateByUrl(`/restaurants?city_id=${city.id}&order_type=${this.orderType()}`);
  }

  private debouncedSearch(query: string) {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.isSearching.set(true);
      this.homeService.searchLocations(query).subscribe({
        next: (res) => {
          this.searchCities.set(res.data?.cities ?? []);
          this.isSearching.set(false);
        },
        error: () => this.isSearching.set(false),
      });
    }, 300);
  }
}
