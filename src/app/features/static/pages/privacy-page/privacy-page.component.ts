import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-privacy-page',
  imports: [TranslateModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-3xl font-bold text-gray-900">{{ 'static.privacy.title' | translate }}</h1>
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600">{{ 'static.privacy.lastUpdated' | translate }}</p>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.privacy.section1Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.privacy.section1Text' | translate }}</p>
        </section>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.privacy.section2Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.privacy.section2Text' | translate }}</p>
        </section>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.privacy.section3Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.privacy.section3Text' | translate }}</p>
        </section>
      </div>
    </div>
  `,
})
export class PrivacyPageComponent {}
