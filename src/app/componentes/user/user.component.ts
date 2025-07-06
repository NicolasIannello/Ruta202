import { AfterViewInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiPerfilComponent } from "./mi-perfil/mi-perfil.component";
import Swal from 'sweetalert2';
import { CommonService } from '../../servicios/common.service';
import { filter, first } from 'rxjs/operators';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, MiPerfilComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements AfterViewInit{
  edit:boolean=true;
  Usuario:{[key: string]: string}={};
  Usuario2:{[key: string]: string}={};
  dato:{[key: string]: string}={};
  dato2:{[key: string]: string}={};
  otro:{[key: string]: string}={
    CondicionFiscalOtro: '',
    RubroOtro: '',
    VehiculoOtro: '',
  };
  img:{[key: string]: Array<string>}={
    vehiculo: [],
    frente: [],
    dorso: []
  };
  tab:string='perfil';
  loading:boolean=false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: UsuariosService, private api2:CommonService) {}
  
  ngAfterViewInit(): void {
    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      if(isPlatformBrowser(this.platformId) && localStorage.getItem('token')){
        this.getUserData();
      }
    });
  }

  cancelarEdit(){
    this.edit=true;
    this.Usuario= Object.assign( { }, this.Usuario2);
    this.dato= Object.assign( { }, this.dato2);
  }

  guardarCambios(){
    let flag=true;
    for (const key in this.Usuario) {
      if(this.Usuario[key]=='') flag=false;
      if(this.Usuario[key]=='Otro' && this.otro[key+'Otro']=='') flag=false;
    }
    for (const key in this.dato) {
      if(this.dato[key]=='') flag=false;
      if(this.dato[key]=='Otro' && this.otro[key+'Otro']=='') flag=false;
    }

    if(!flag){
      Swal.fire({title:'Complete todos los campos',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
    }else{
      this.loading=true;

      TODO

      this.edit=true;
      this.loading=false;
    }
  }

  getUserData(){
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.getUserData(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {
          this.Usuario= Object.assign( { }, value.usuarioDB);
          this.Usuario2= Object.assign( { }, value.usuarioDB);
          this.dato= Object.assign( { }, value.datoDB);
          this.dato2= Object.assign( { }, value.datoDB);
          for (let i = 0; i < value.imgs.length; i++) {
            if(value.imgs[i].tipo=='vehiculo'){
              this.api2.getImg(value.imgs[i].img, '', '').then(resp=>{
                if(resp!=false){
                  this.img['vehiculo'].push(resp.url)
                }
              })
            }else{
              this.api2.getImg(value.imgs[i].img, localStorage.getItem('token')!, 'Carnet').then(resp=>{
                if(resp!=false){
                  this.img[value.imgs[i].tipo].push(resp.url)
                }
              })
            }
          }
        }
      },
      error: (err:any) => {
        this.api.logOut()
      },		
    });
  }
}
