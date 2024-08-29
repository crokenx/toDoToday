import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { storageResolverGuard } from './storage-resolver.guard';

describe('storageResolverGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => storageResolverGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
