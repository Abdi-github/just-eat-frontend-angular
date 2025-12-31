import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-restaurant-explore-page',
  imports: [RouterLink, TranslateModule],
  template: `
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-bold text-gray-900">{{ 'restaurants.explore.title' | translate }}</h1>
      <p class="mt-1 text-gray-500">{{ 'restaurants.explore.subtitle' | translate }}</p>
      <div class="mt-8">
        <a routerLink="/restaurants" class="text-primary hover:underline">
          ← {{ 'restaurants.explore.backToList' | translate }}
        </a>
      </div>
    </div>
  `,
})
export class RestaurantExplorePageComponent {}
