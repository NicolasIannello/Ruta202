import { CommonModule, isPlatformBrowser, ViewportScroller } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UsuariosService } from '../../servicios/usuarios.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{
  pagina:string='/';
  nav:string='';
  menuOpen:boolean=false;
  menuOpenUser:boolean=false;
  Empresa:string='';
  Email:string='';
  Tipo:string='';
  ready$: Observable<boolean>;

  constructor(public scroller: ViewportScroller, private router: Router, @Inject(PLATFORM_ID) private platformId: Object,
  private api: UsuariosService, private changeDetector: ChangeDetectorRef) {
    this.pagina=router.url   
    this.ready$ = this.api.ready$; 
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.pagina=event.urlAfterRedirects;
      this.nav='';      
    });
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        let dato={
            'token': localStorage.getItem('token'),
            'tipo': 1
          }
        this.api.renewToken(dato).subscribe({
          next: (value:any) => {
            if (value.ok) {
              localStorage.setItem('token',value.token);
              this.Empresa=value.nombre;
              this.api.setEmpresa(value.nombre)
              this.Email=value.mail
              this.api.setEmail(value.mail)
              this.api.setID(value.id)
              this.api.setUUID(value.UUID)
              this.Tipo=value.tipo;
              this.api.setTipo(value.tipo)
              this.api.ready$.next(true);
            }else{
              localStorage.removeItem('token')
              this.api.logOut()
            }
            this.changeDetector.detectChanges();
          },
          error: (err:any) => {
            localStorage.removeItem('token')
            this.api.logOut()
          },		
        });
      }else{
        this.api.ready$.next(true);
      }
    }
  }

  open(){
    this.menuOpen=!this.menuOpen;
  }

  cerrarSession(){
    this.api.logOut();
  }
}