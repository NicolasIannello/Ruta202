import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedPrestadorGuard } from './logged-prestador.guard';

describe('loggedPrestadorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedPrestadorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
