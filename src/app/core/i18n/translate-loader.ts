import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const NAMESPACES = [
  'common',
  'home',
  'restaurants',
  'search',
  'cart',
  'auth',
  'checkout',
  'orders',
  'profile',
  'addresses',
  'favorites',
  'reviews',
  'restaurant-dashboard',
  'courier-dashboard',
  'notifications',
  'promotions',
  'static',
];

export class MultiFileTranslateLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<TranslationObject> {
    const requests = NAMESPACES.map((ns) =>
      this.http.get<TranslationObject>(`/assets/i18n/${lang}/${ns}.json`).pipe(
        map((data) => ({ [ns]: data }) as TranslationObject),
        catchError(() => of({ [ns]: {} } as TranslationObject)),
      ),
    );

    return forkJoin(requests).pipe(
      map((results) => Object.assign({}, ...results)),
    );
  }
}

export function createTranslateLoader(http: HttpClient): MultiFileTranslateLoader {
  return new MultiFileTranslateLoader(http);
}
