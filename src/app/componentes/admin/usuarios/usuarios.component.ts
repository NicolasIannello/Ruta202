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
  pagina:number=0;
  lastPage:number=0
  order:string='_id'
  asc:number=1;
  pages:Array<number>=[]
  iterator:Array<number>=[1,2,3]

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService) {}
  
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        this.getUsuarios(this.pagina, 10, this.asc, this.order);
      }
    }
  }

  handleMessage(message:string) {        
    this.menuOpen=false;
    this.userModal=[];
    if(message=='reload') this.getUsuarios(this.pagina, 10, this.asc, this.order);
  }

  paginacion(int:number){
    this.pagina=int;        
    console.log(this.pagina);
    
    this.getUsuarios(this.pagina, 10, this.asc, this.order);
  }

  getUsuarios(desde:number, limit:number, orden:number, order:string){
    let dato={
      'token': localStorage.getItem('token'),
      'desde': desde,
      'limit': limit,
      'orden': orden,
      'order': order
    }
    this.api.getUsers(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {      
          this.Usuarios=value.users      
          this.total=value.total  
          this.lastPage=Math.trunc(this.total/10)
          this.loading=false;
          this.pages=Array.from({ length: this.total/10 }, (_, i) => i + 1)
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
                this.getUsuarios(this.pagina, 10, this.asc, this.order);
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
