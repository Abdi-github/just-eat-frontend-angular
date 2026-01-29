import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  template: `
    <footer class="border-t border-border bg-secondary text-white" role="contentinfo">
      <div class="mx-auto max-w-7xl px-4 py-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
          <!-- About -->
          <div>
            <h3 class="mb-3 text-lg font-semibold">{{ 'common.footer.about' | translate }}</h3>
            <p class="text-sm text-gray-300">{{ 'common.footer.aboutText' | translate }}</p>
          </div>

          <!-- Quick Links -->
          <div>
            <h3 class="mb-3 text-lg font-semibold">{{ 'common.footer.quickLinks' | translate }}</h3>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a routerLink="/restaurants" class="hover:text-primary">{{ 'common.nav.restaurants' | translate }}</a></li>
              <li><a routerLink="/about" class="hover:text-primary">{{ 'common.nav.about' | translate }}</a></li>
              <li><a routerLink="/contact" class="hover:text-primary">{{ 'common.nav.contact' | translate }}</a></li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="mb-3 text-lg font-semibold">{{ 'common.footer.legal' | translate }}</h3>
            <ul class="space-y-2 text-sm text-gray-300">
              <li><a routerLink="/terms" class="hover:text-primary">{{ 'common.nav.terms' | translate }}</a></li>
              <li><a routerLink="/privacy" class="hover:text-primary">{{ 'common.nav.privacy' | translate }}</a></li>
            </ul>
          </div>

          <!-- Follow -->
          <div>
            <h3 class="mb-3 text-lg font-semibold">{{ 'common.footer.followUs' | translate }}</h3>
            <div class="flex gap-4 text-gray-300">
              <span class="cursor-pointer hover:text-primary">Facebook</span>
              <span class="cursor-pointer hover:text-primary">Instagram</span>
            </div>
          </div>
        </div>

        <div class="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
          {{ 'common.footer.copyright' | translate:{ year: currentYear } }}
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
