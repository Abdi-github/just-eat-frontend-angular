import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-about-page',
  imports: [TranslateModule, MatIconModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-3xl font-bold text-gray-900">{{ 'static.about.title' | translate }}</h1>

      <div class="space-y-8">
        <section>
          <p class="text-lg leading-relaxed text-gray-600">
            {{ 'static.about.intro' | translate }}
          </p>
        </section>

        <section>
          <h2 class="mb-4 text-xl font-semibold text-gray-900">{{ 'static.about.missionTitle' | translate }}</h2>
          <p class="text-gray-600">{{ 'static.about.missionText' | translate }}</p>
        </section>

        <section>
          <h2 class="mb-4 text-xl font-semibold text-gray-900">{{ 'static.about.valuesTitle' | translate }}</h2>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="rounded-xl bg-gray-50 p-6 text-center">
              <mat-icon class="!text-4xl text-primary">speed</mat-icon>
              <h3 class="mt-2 font-semibold text-gray-900">{{ 'static.about.value1Title' | translate }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ 'static.about.value1Text' | translate }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-6 text-center">
              <mat-icon class="!text-4xl text-primary">diversity_3</mat-icon>
              <h3 class="mt-2 font-semibold text-gray-900">{{ 'static.about.value2Title' | translate }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ 'static.about.value2Text' | translate }}</p>
            </div>
            <div class="rounded-xl bg-gray-50 p-6 text-center">
              <mat-icon class="!text-4xl text-primary">eco</mat-icon>
              <h3 class="mt-2 font-semibold text-gray-900">{{ 'static.about.value3Title' | translate }}</h3>
              <p class="mt-1 text-sm text-gray-500">{{ 'static.about.value3Text' | translate }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AboutPageComponent {}
