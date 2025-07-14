import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { UsuariosService } from '../servicios/usuarios.service';
import { filter, first } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class loggedClienteGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object, private api:UsuariosService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (isPlatformBrowser(this.platformId)) {
      if(localStorage.getItem('token')) {
        this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
          let tipo = this.api.getTipo()
          if(tipo!='0'){
            this.router.navigate(['/']).then(() => {
              this.api.logOut()
            });
          }
        });
      }else{
        this.router.navigate(['/']).then(() => {
          this.api.logOut()
        });
      }
    }
  }
}