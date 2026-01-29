import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { SupportedLanguage } from '@core/models';
import { environment } from '@env/environment';

interface LanguageState {
  current: SupportedLanguage;
}

function loadInitialLanguage(): SupportedLanguage {
  const stored = localStorage.getItem(environment.storageKeys.language);
  if (stored && environment.supportedLanguages.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }

  const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
  if (environment.supportedLanguages.includes(browserLang)) {
    return browserLang;
  }

  return environment.defaultLanguage as SupportedLanguage;
}

export const LanguageStore = signalStore(
  { providedIn: 'root' },
  withState<LanguageState>({ current: loadInitialLanguage() }),
  withMethods((store) => ({
    changeLanguage(lang: SupportedLanguage): void {
      patchState(store, { current: lang });
      localStorage.setItem(environment.storageKeys.language, lang);
      document.documentElement.lang = lang;
    },
  })),
);
