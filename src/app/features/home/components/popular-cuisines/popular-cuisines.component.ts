import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HomeService } from '../../home.service';
import { Cuisine } from '@core/models';
import { LocalizedFieldPipe } from '@shared/pipes';

const INITIAL_DISPLAY_COUNT = 12;

@Component({
  selector: 'app-popular-cuisines',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule, LocalizedFieldPipe],
  template: `
    @if (!isError()) {
      <section class="py-12 md:py-16">
        <div class="mx-auto max-w-7xl px-4">
          <!-- Section Header -->
          <div class="mb-8 flex items-end justify-between">
            <div>
              <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
                {{ 'home.cuisines.title' | translate }}
              </h2>
              <p class="mt-1 text-gray-500">
                {{ 'home.cuisines.subtitle' | translate }}
              </p>
            </div>
            @if (hasMore()) {
              <button
                (click)="showAll.set(!showAll())"
                class="hidden items-center gap-1 text-sm font-medium text-primary hover:underline md:flex"
              >
                {{ showAll() ? ('home.cuisines.viewLess' | translate) : ('home.cuisines.viewAll' | translate) }}
                <mat-icon class="!text-base">{{ showAll() ? 'expand_less' : 'chevron_right' }}</mat-icon>
              </button>
            }
          </div>

          <!-- Cuisine Grid -->
          @if (isLoading()) {
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              @for (i of skeletons; track i) {
                <div class="flex flex-col items-center gap-3">
                  <div class="h-24 w-24 animate-pulse rounded-full bg-gray-200"></div>
                  <div class="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                </div>
              }
            </div>
          } @else {
            <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              @for (cuisine of displayedCuisines(); track cuisine.id) {
                <a
                  [routerLink]="['/restaurants']"
                  [queryParams]="{ cuisine_id: cuisine.id }"
                  class="group flex flex-col items-center gap-3 rounded-xl p-4 transition-all hover:bg-gray-50"
                >
                  <div class="relative h-24 w-24 overflow-hidden rounded-full bg-gray-100 shadow-sm ring-2 ring-transparent transition-all group-hover:ring-primary group-hover:shadow-md">
                    @if (cuisine.image_url) {
                      <img
                        [src]="cuisine.image_url"
                        [alt]="cuisine.name | localizedField"
                        class="h-full w-full object-cover transition-transform group-hover:scale-110"
                        loading="lazy"
                      />
                    } @else {
                      <div class="flex h-full w-full items-center justify-center bg-primary/10 text-2xl">🍽️</div>
                    }
                  </div>
                  <span class="text-center text-sm font-medium text-gray-900 group-hover:text-primary">
                    {{ cuisine.name | localizedField }}
                  </span>
                </a>
              }
            </div>
          }

          <!-- Mobile View All -->
          @if (hasMore()) {
            <div class="mt-6 text-center md:hidden">
              <button
                mat-button
                (click)="showAll.set(!showAll())"
                class="text-primary"
              >
                {{ showAll() ? ('home.cuisines.viewLess' | translate) : ('home.cuisines.viewAll' | translate) }}
                <mat-icon class="!text-base">{{ showAll() ? 'expand_less' : 'chevron_right' }}</mat-icon>
              </button>
            </div>
          }
        </div>
      </section>
    }
  `,
})
export class PopularCuisinesComponent {
  private readonly homeService = inject(HomeService);

  readonly isLoading = signal(true);
  readonly isError = signal(false);
  readonly showAll = signal(false);
  readonly allCuisines = signal<Cuisine[]>([]);

  readonly skeletons = Array.from({ length: INITIAL_DISPLAY_COUNT }, (_, i) => i);

  readonly hasMore = () => this.allCuisines().length > INITIAL_DISPLAY_COUNT;
  readonly displayedCuisines = () =>
    this.showAll() ? this.allCuisines() : this.allCuisines().slice(0, INITIAL_DISPLAY_COUNT);

  constructor() {
    this.homeService.getPopularCuisines().subscribe({
      next: (res) => {
        this.allCuisines.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => {
        this.isError.set(true);
        this.isLoading.set(false);
      },
    });
  }
}
