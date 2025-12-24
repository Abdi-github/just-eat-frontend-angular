import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let message = 'An unexpected error occurred';

      if (error.error?.error?.message) {
        message = error.error.error.message;
      } else if (error.status === 0) {
        message = 'Network error. Please check your connection.';
      } else if (error.status === 403) {
        message = 'You do not have permission to perform this action.';
      } else if (error.status === 404) {
        message = 'The requested resource was not found.';
      } else if (error.status >= 500) {
        message = 'Server error. Please try again later.';
      }

      const enrichedError = {
        ...error,
        userMessage: message,
      };

      return throwError(() => enrichedError);
    }),
  );
};
