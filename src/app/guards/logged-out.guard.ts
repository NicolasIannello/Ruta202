import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class loggedOutGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (isPlatformBrowser(this.platformId)) {
      // if(localStorage.getItem('token')){
      //   this.router.navigate(['/']);    
      //   return false;
      // }
      localStorage.removeItem('token');
    }
  }
}