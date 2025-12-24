import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '@state/auth.store';
import { UserRole } from '@core/models';

export const roleGuard: CanActivateFn = (route) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);

  const allowedRoles = route.data?.['allowedRoles'] as UserRole[] | undefined;

  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const user = authStore.user();
  if (user && user.roles.some((role) => allowedRoles.includes(role))) {
    return true;
  }

  return router.createUrlTree(['/']);
};
