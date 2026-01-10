import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-promotions-page',
  imports: [TranslateModule, MatIconModule],
  template: `
    <div>
      <h1 class="mb-6 text-2xl font-bold text-gray-900">{{ 'promotions.title' | translate }}</h1>
      <div class="py-12 text-center">
        <mat-icon class="!text-5xl text-gray-300">card_giftcard</mat-icon>
        <h2 class="mt-3 text-lg font-semibold text-gray-500">{{ 'promotions.noPromotions' | translate }}</h2>
        <p class="mt-1 text-sm text-gray-400">{{ 'promotions.checkBack' | translate }}</p>
      </div>
    </div>
  `,
})
export class PromotionsPageComponent {}
