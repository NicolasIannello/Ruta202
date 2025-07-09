import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { isPlatformBrowser } from '@angular/common';
import { UserModalComponent } from "./user-modal/user-modal.component";

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

  handleMessage() {        
    this.menuOpen=false;
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

}
