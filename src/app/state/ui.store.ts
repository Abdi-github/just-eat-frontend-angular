import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';

interface UiState {
  mobileMenuOpen: boolean;
  cartSheetOpen: boolean;
  theme: 'light' | 'dark';
}

export const UiStore = signalStore(
  { providedIn: 'root' },
  withState<UiState>({
    mobileMenuOpen: false,
    cartSheetOpen: false,
    theme: 'light',
  }),
  withMethods((store) => ({
    toggleMobileMenu(): void {
      patchState(store, { mobileMenuOpen: !store.mobileMenuOpen() });
    },
    closeMobileMenu(): void {
      patchState(store, { mobileMenuOpen: false });
    },
    toggleCartSheet(): void {
      patchState(store, { cartSheetOpen: !store.cartSheetOpen() });
    },
    closeCartSheet(): void {
      patchState(store, { cartSheetOpen: false });
    },
    setTheme(theme: 'light' | 'dark'): void {
      patchState(store, { theme });
    },
  })),
);
