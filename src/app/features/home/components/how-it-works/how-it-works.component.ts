import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-how-it-works',
  imports: [TranslateModule, MatIconModule],
  template: `
    <section class="py-12 md:py-16">
      <div class="mx-auto max-w-7xl px-4">
        <div class="mb-10 text-center">
          <h2 class="text-2xl font-bold text-gray-900 md:text-3xl">
            {{ 'home.howItWorks.title' | translate }}
          </h2>
          <p class="mt-2 text-gray-500">
            {{ 'home.howItWorks.subtitle' | translate }}
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-3">
          @for (step of steps; track step.titleKey; let i = $index) {
            <div class="flex flex-col items-center text-center">
              <!-- Step number + icon -->
              <div class="relative mb-4">
                <div [class]="'flex h-16 w-16 items-center justify-center rounded-2xl ' + step.colorClass">
                  <mat-icon class="!text-3xl">{{ step.icon }}</mat-icon>
                </div>
                <div class="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {{ i + 1 }}
                </div>
              </div>

              <h3 class="mb-2 text-lg font-semibold text-gray-900">
                {{ step.titleKey | translate }}
              </h3>
              <p class="max-w-xs text-sm text-gray-500">
                {{ step.descKey | translate }}
              </p>

              <!-- Connector line (desktop only) -->
              @if (i < steps.length - 1) {
                <div class="mt-4 hidden h-0.5 w-full max-w-[200px] bg-gradient-to-r from-transparent via-gray-200 to-transparent md:block"></div>
              }
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class HowItWorksComponent {
  readonly steps = [
    {
      icon: 'search',
      titleKey: 'home.howItWorks.step1Title',
      descKey: 'home.howItWorks.step1Description',
      colorClass: 'bg-primary/10 text-primary',
    },
    {
      icon: 'restaurant',
      titleKey: 'home.howItWorks.step2Title',
      descKey: 'home.howItWorks.step2Description',
      colorClass: 'bg-green-100 text-green-600',
    },
    {
      icon: 'delivery_dining',
      titleKey: 'home.howItWorks.step3Title',
      descKey: 'home.howItWorks.step3Description',
      colorClass: 'bg-blue-100 text-blue-600',
    },
  ];
}
