import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-inicio-admin',
  standalone: true,
  imports: [],
  templateUrl: './inicio-admin.component.html',
  styleUrl: '../admin.component.css'
})
export class InicioAdminComponent implements OnInit{
  Admin:string=''
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService) {}

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        let dato={
          'token': localStorage.getItem('token'),
        }
        this.api.renewToken(dato).subscribe({
          next: (value:any) => {
            if (value.ok) {              
              localStorage.setItem('token',value.token);
              this.Admin=value.nombre;
              this.api.setAdmin(value.nombre)
              this.api.setID(value.id)
            }else{              
              localStorage.removeItem('token')
              this.api.logOut()
            }
          },
          error: (err:any) => {
            localStorage.removeItem('token')
            this.api.logOut()
          },		
        });
      }
    }
  }

}