import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { LanguageStore } from '@state/language.store';
import { TranslateService } from '@ngx-translate/core';
import { SupportedLanguage } from '@core/models';
import { UpperCasePipe } from '@angular/common';

const LANGUAGES: { code: SupportedLanguage; flag: string; label: string }[] = [
  { code: 'de', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'en', flag: '🇬🇧', label: 'English' },
  { code: 'fr', flag: '🇫🇷', label: 'Français' },
  { code: 'it', flag: '🇮🇹', label: 'Italiano' },
];

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule, MatIconModule, TranslateModule, UpperCasePipe],
  template: `
    <button mat-button [matMenuTriggerFor]="langMenu"
            class="!text-foreground hover:!text-primary !text-sm !font-medium"
            [attr.aria-label]="'common.language.select' | translate">
      <mat-icon class="!text-base mr-1">language</mat-icon>
      {{ currentFlag }} {{ languageStore.current() | uppercase }}
    </button>
    <mat-menu #langMenu="matMenu">
      @for (lang of languages; track lang.code) {
        <button mat-menu-item
                (click)="switchLanguage(lang.code)"
                [class.!font-semibold]="languageStore.current() === lang.code"
                [class.!bg-accent]="languageStore.current() === lang.code">
          <span class="mr-2">{{ lang.flag }}</span>
          {{ lang.label }}
          @if (languageStore.current() === lang.code) {
            <span class="ml-auto text-primary">✓</span>
          }
        </button>
      }
    </mat-menu>
  `,
})
export class LanguageSwitcherComponent {
  readonly languageStore = inject(LanguageStore);
  private readonly translate = inject(TranslateService);
  readonly languages = LANGUAGES;

  get currentFlag(): string {
    return LANGUAGES.find((l) => l.code === this.languageStore.current())?.flag || '🇩🇪';
  }

  switchLanguage(lang: SupportedLanguage): void {
    this.languageStore.changeLanguage(lang);
    this.translate.use(lang);
  }
}
