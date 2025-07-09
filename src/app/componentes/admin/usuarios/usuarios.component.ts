import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { isPlatformBrowser } from '@angular/common';
import { UserModalComponent } from "./user-modal/user-modal.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [UserModalComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: '../admin.component.css'
})
export class UsuariosComponent implements OnInit{
  loading:boolean=true;
  Usuarios:any=[]
  total:number=0
  menuOpen:boolean=false;
  userModal:any;
  edit:boolean=false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService) {}
  
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        this.getUsuarios(0, 20, 1);
      }
    }
  }

  handleMessage(message:string) {        
    this.menuOpen=false;
    this.userModal=[];
    if(message=='reload') this.getUsuarios(0, 20, 1);
  }

  getUsuarios(desde:number, limit:number, order:number){
    let dato={
      'token': localStorage.getItem('token'),
      'desde': desde,
      'limit': limit,
      'order': order
    }
    this.api.getUsers(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {      
          this.Usuarios=value.users      
          this.total=value.total  
          this.loading=false;
        }
      },
      error: (err:any) => {
      },		
    });
  }

  borrarUsuario(name:string,mail:string,id:string){
    Swal.fire({
      title: "Esta por borrar un Usuario",
      html: "Usuario: "+name+"<br>Email: "+mail,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor:'#ea580c',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let dato={
            'token': localStorage.getItem('token'),
            'id': id,
          }

          this.api.borrarUser(dato).subscribe({
            next: (value) => {
              if(value.ok){
                Swal.fire({title:'Usuario eliminado con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
                this.getUsuarios(0, 20, 1);
              }else{
                Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            },
            error: (err) => {
              Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            },
          })
          
        } catch (error) {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }
    });
  }
}
