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
  clientes:number=0
  clientesListos:number=0
  prestadores:number=0
  prestadoresListos:number=0
  
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
              let dato={
                'token': localStorage.getItem('token'),
              }
              this.api.inicioData(dato).subscribe({
                next: (value:any) => {
                  if (value.ok) {              
                    this.clientes=value.stats.totalUsers
                    this.prestadores=value.stats.totalPrestadores
                    this.clientesListos = this.clientes > 0 ? (value.stats.totalUsersV / this.clientes) * 100 : 0;  
                    this.prestadoresListos = this.prestadores > 0 ? (value.stats.totalPrestadoresV / this.prestadores) * 100 : 0;  
                  }
                }	
              });
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