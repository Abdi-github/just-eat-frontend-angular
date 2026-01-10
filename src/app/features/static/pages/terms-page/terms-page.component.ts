import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-terms-page',
  imports: [TranslateModule],
  template: `
    <div class="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 class="mb-6 text-3xl font-bold text-gray-900">{{ 'static.terms.title' | translate }}</h1>
      <div class="prose prose-gray max-w-none">
        <p class="text-gray-600">{{ 'static.terms.lastUpdated' | translate }}</p>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.terms.section1Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.terms.section1Text' | translate }}</p>
        </section>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.terms.section2Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.terms.section2Text' | translate }}</p>
        </section>
        <section class="mt-6">
          <h2 class="text-xl font-semibold text-gray-900">{{ 'static.terms.section3Title' | translate }}</h2>
          <p class="mt-2 text-gray-600">{{ 'static.terms.section3Text' | translate }}</p>
        </section>
      </div>
    </div>
  `,
})
export class TermsPageComponent {}
