import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { ApiService } from '@core/services/api.service';
import { Restaurant } from '@core/models';
import { CurrencyChfPipe } from '@shared/pipes';

@Component({
  selector: 'app-search-page',
  imports: [
    RouterLink, TranslateModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatProgressSpinnerModule,
    FormsModule, CurrencyChfPipe,
  ],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'search.title' | translate }}</h1>

      <mat-form-field appearance="outline" class="w-full max-w-lg">
        <mat-label>{{ 'search.placeholder' | translate }}</mat-label>
        <input matInput [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" />
        <mat-icon matPrefix>search</mat-icon>
      </mat-form-field>

      @if (isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="40"></mat-spinner>
        </div>
      } @else if (searchQuery && results().length === 0) {
        <div class="py-12 text-center">
          <mat-icon class="!text-5xl text-gray-300">search_off</mat-icon>
          <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'search.noResults' | translate }}</h2>
        </div>
      } @else if (results().length > 0) {
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          @for (restaurant of results(); track restaurant.id) {
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
                <div class="mt-1 flex items-center gap-2 text-sm text-gray-500">
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
export class SearchPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(ApiService);

  readonly results = signal<Restaurant[]>([]);
  readonly isLoading = signal(false);
  searchQuery = '';
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit() {
    this.searchQuery = this.route.snapshot.queryParamMap.get('q') || '';
    if (this.searchQuery) this.performSearch();
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => this.performSearch(), 300);
  }

  private performSearch() {
    if (!this.searchQuery.trim()) {
      this.results.set([]);
      return;
    }
    this.isLoading.set(true);
    this.api.getList<Restaurant>('/public/restaurants', { search: this.searchQuery, limit: 20 }).subscribe({
      next: (res) => {
        this.results.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
