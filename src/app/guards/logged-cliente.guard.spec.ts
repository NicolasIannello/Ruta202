import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedClienteGuard } from './logged-cliente.guard';

describe('loggedClienteGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedClienteGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
