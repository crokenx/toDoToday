import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '@app/services';

export const storageResolverGuard: CanActivateFn = async (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  let canActivate = true;

  try {
    await storageService.init();
  } catch {
    canActivate = false;
    router.navigate(['/error'])
  }

  return canActivate;
};
