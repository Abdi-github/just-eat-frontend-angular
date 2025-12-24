import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthStore } from '@state/auth.store';
import { ApiService } from '@core/services/api.service';
import { environment } from '@env/environment';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authStore = inject(AuthStore);
  const apiService = inject(ApiService);

  const token = authStore.token();
  const language = localStorage.getItem(environment.storageKeys.language) || environment.defaultLanguage;

  let authReq = req.clone({
    setHeaders: {
      'Accept-Language': language,
    },
  });

  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        'Accept-Language': language,
      },
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshing && authStore.refreshToken()) {
        isRefreshing = true;

        return apiService.post<{ access_token: string; refresh_token: string; user: unknown }>(
          '/public/auth/refresh',
          { refresh_token: authStore.refreshToken() }
        ).pipe(
          switchMap((response) => {
            isRefreshing = false;
            authStore.setCredentials({
              token: response.data.access_token,
              refreshToken: response.data.refresh_token,
              user: response.data.user as unknown as ReturnType<typeof authStore.user> & {},
            });

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.data.access_token}`,
                'Accept-Language': language,
              },
            });
            return next(retryReq);
          }),
          catchError((refreshError) => {
            isRefreshing = false;
            authStore.logout();
            return throwError(() => refreshError);
          }),
        );
      }

      return throwError(() => error);
    }),
  );
};
