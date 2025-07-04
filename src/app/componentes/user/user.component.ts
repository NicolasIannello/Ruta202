import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MiPerfilComponent } from "./mi-perfil/mi-perfil.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, MiPerfilComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  edit:boolean=true;
  Usuario:{[key: string]: string}={};
  Usuario2:{[key: string]: string}={};
  dato:{[key: string]: string}={};
  dato2:{[key: string]: string}={};
  otro:{[key: string]: string}={
    CondiciónFiscalOtro: '',
    RubroOtro: '',
    VehículoOtro: '',
  };
  tab:number=0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: UsuariosService) {}
  
  ngOnInit() {
    if(isPlatformBrowser(this.platformId) && localStorage.getItem('token')){
      this.getUserData()
    }
  }

  cancelarEdit(){
    this.edit=true;
    this.Usuario= Object.assign( { }, this.Usuario2);
    this.dato= Object.assign( { }, this.dato2);
  }

  guardarCambios(){
    this.edit=true;
    console.log(this.Usuario);
    console.log(this.otro);
  }

  getUserData(){
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.getUserData(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {
          console.log(value);
          this.Usuario= Object.assign( { }, value.usuarioDB);
          this.Usuario2= Object.assign( { }, value.usuarioDB);
          this.dato= Object.assign( { }, value.datoDB);
          this.dato2= Object.assign( { }, value.datoDB);
        }
      },
      error: (err:any) => {
        this.api.logOut()
      },		
    });
  }
}
