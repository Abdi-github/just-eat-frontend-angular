import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-app-promotion',
  imports: [TranslateModule, MatIconModule],
  template: `
    <section class="bg-secondary py-12 md:py-16">
      <div class="mx-auto max-w-7xl px-4">
        <div class="flex flex-col items-center gap-8 md:flex-row md:gap-12">
          <!-- Illustration placeholder -->
          <div class="flex flex-1 justify-center">
            <div class="relative">
              <div class="flex h-64 w-40 items-center justify-center rounded-3xl border-4 border-white/20 bg-white/10 shadow-lg backdrop-blur-sm md:h-80 md:w-48">
                <div class="text-center">
                  <span class="text-5xl">📱</span>
                  <p class="mt-2 text-sm font-medium text-white/80">just-eat.ch</p>
                </div>
              </div>
              <!-- Floating badge -->
              <div class="absolute -top-3 -right-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                NEW
              </div>
            </div>
          </div>

          <!-- Content -->
          <div class="flex-1 text-center md:text-left">
            <h2 class="mb-3 text-2xl font-bold text-white md:text-3xl">
              {{ 'home.appPromotion.title' | translate }}
            </h2>
            <p class="mb-6 text-white/80">
              {{ 'home.appPromotion.subtitle' | translate }}
            </p>

            <ul class="mb-8 space-y-3">
              @for (feature of features; track feature.key) {
                <li class="flex items-center gap-3 text-white/90">
                  <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/20">
                    <mat-icon class="!text-base text-primary">{{ feature.icon }}</mat-icon>
                  </div>
                  <span class="text-sm">{{ feature.key | translate }}</span>
                </li>
              }
            </ul>

            <!-- App Store Buttons -->
            <div class="flex flex-wrap justify-center gap-3 md:justify-start">
              <button class="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-white/90">
                <mat-icon>apple</mat-icon>
                {{ 'home.appPromotion.downloadOnAppStore' | translate }}
              </button>
              <button class="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-medium text-secondary transition-colors hover:bg-white/90">
                <mat-icon>shop</mat-icon>
                {{ 'home.appPromotion.getOnGooglePlay' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
})
export class AppPromotionComponent {
  readonly features = [
    { icon: 'smartphone', key: 'home.appPromotion.feature1' },
    { icon: 'location_on', key: 'home.appPromotion.feature2' },
    { icon: 'favorite', key: 'home.appPromotion.feature3' },
  ];
}
