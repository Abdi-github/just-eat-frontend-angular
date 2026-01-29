import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-partner-page',
  imports: [RouterLink, TranslateModule, MatButtonModule, MatIconModule],
  template: `
    <div class="w-full max-w-lg">
      <h1 class="mb-2 text-2xl font-bold text-gray-900">
        {{ 'auth.partner.title' | translate }}
      </h1>
      <p class="mb-6 text-gray-500">
        {{ 'auth.partner.subtitle' | translate }}
      </p>

      <div class="space-y-4">
        <div class="rounded-xl border border-gray-200 p-6 text-center">
          <mat-icon class="!text-5xl text-primary">storefront</mat-icon>
          <h3 class="mt-3 text-lg font-semibold">{{ 'auth.partner.restaurantTitle' | translate }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ 'auth.partner.restaurantDescription' | translate }}</p>
          <a mat-flat-button color="primary" routerLink="/auth/register" [queryParams]="{ type: 'restaurant' }" class="mt-4">
            {{ 'auth.partner.registerRestaurant' | translate }}
          </a>
        </div>

        <div class="rounded-xl border border-gray-200 p-6 text-center">
          <mat-icon class="!text-5xl text-primary">delivery_dining</mat-icon>
          <h3 class="mt-3 text-lg font-semibold">{{ 'auth.partner.courierTitle' | translate }}</h3>
          <p class="mt-1 text-sm text-gray-500">{{ 'auth.partner.courierDescription' | translate }}</p>
          <a mat-flat-button color="primary" routerLink="/auth/become-courier" class="mt-4">
            {{ 'auth.partner.registerCourier' | translate }}
          </a>
        </div>
      </div>

      <p class="mt-6 text-center text-sm text-gray-500">
        <a routerLink="/" class="text-primary hover:underline">
          {{ 'auth.partner.backToHome' | translate }}
        </a>
      </p>
    </div>
  `,
})
export class PartnerPageComponent {}
