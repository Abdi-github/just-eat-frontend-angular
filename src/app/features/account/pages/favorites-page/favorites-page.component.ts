import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';
import { Restaurant } from '@core/models';

@Component({
  selector: 'app-favorites-page',
  imports: [RouterLink, TranslateModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'favorites.title' | translate }}</h1>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (favorites().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">favorite_border</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'favorites.noFavorites' | translate }}</h2>
          <a mat-flat-button color="primary" routerLink="/restaurants" class="mt-4">
            {{ 'favorites.browseRestaurants' | translate }}
          </a>
        </div>
      } @else {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (restaurant of favorites(); track restaurant.id) {
            <a
              [routerLink]="['/restaurants', restaurant.slug]"
              class="group block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div class="relative aspect-[16/10] overflow-hidden bg-gray-100">
                @if (restaurant.cover_image_url || restaurant.logo_url) {
                  <img [src]="restaurant.cover_image_url ?? restaurant.logo_url" [alt]="restaurant.name"
                    class="h-full w-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                } @else {
                  <div class="flex h-full w-full items-center justify-center bg-primary/5">
                    <span class="text-4xl">🍽️</span>
                  </div>
                }
              </div>
              <div class="p-3">
                <h3 class="truncate font-semibold text-gray-900 group-hover:text-primary">{{ restaurant.name }}</h3>
                <div class="mt-1 flex items-center gap-1 text-sm text-gray-500">
                  <mat-icon class="!text-sm text-amber-500">star</mat-icon>
                  <span>{{ restaurant.average_rating?.toFixed(1) || '0.0' }}</span>
                </div>
              </div>
            </a>
          }
        </div>
      }
    </div>
  `,
})
export class FavoritesPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  readonly favorites = signal<Restaurant[]>([]);
  readonly isLoading = signal(true);

  ngOnInit() {
    this.api.getList<Restaurant>('/public/favorites').subscribe({
      next: (res) => {
        this.favorites.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
