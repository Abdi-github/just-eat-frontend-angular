export const environment = {
  production: false,
  apiUrl: '/api/v1',
  defaultLanguage: 'de',
  supportedLanguages: ['de', 'en', 'fr', 'it'] as const,
  storageKeys: {
    authToken: 'je_auth_token',
    refreshToken: 'je_refresh_token',
    user: 'je_user',
    language: 'je_language',
    cart: 'je_cart',
    theme: 'je_theme',
  },
};
