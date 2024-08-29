import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FireBaseService } from '@app/services';

export const firebaseResolverGuard: CanActivateFn = async (route, state) => {
  const firebaseService = inject(FireBaseService);
  const router = inject(Router);

  let canActivate = true;

  try {
    // throw new Error('Not implemented');
    await firebaseService.init();
  } catch {
    canActivate = false;
    router.navigate(['/error'])
  }

  return canActivate;
};
