import { Component } from '@angular/core';
import { UsuariosService } from '../../servicios/usuarios.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmergencyNoticeComponent } from "../things/emergency-notice/emergency-notice.component";

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [FormsModule, EmergencyNoticeComponent],
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css', '../login/login.component.css']
})
export class CambioPasswordComponent {
  showPassword:String='password';
  text:string='Cambiar Contraseña';
  password:String='';
  password2:String='';

  constructor(private api:UsuariosService, public ruta:ActivatedRoute, private router: Router) {}

  cambiarPassword(){
    this.text='...';
    if(this.password=='' || this.password2==''){
      Swal.fire({title:'Complete todos los campos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      this.text='Cambiar Contraseña';
      return;
    }
    if(this.password!=this.password2){
      Swal.fire({title:'Las contraseñas no coinciden', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      this.text='Cambiar Contraseña';
      return;
    }

    let dato={
      'token':this.ruta.snapshot.paramMap.get('token'),
      'tipo':3,
      'password': this.password,
    }

    this.api.changePassword(dato).subscribe({
      next: (value:any) => {
        if(value.ok){
          Swal.fire({title:'Se ha cambiado la contraseña correctamente', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
          this.router.navigate(['/'])
        }else{
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
        this.text='Cambiar Contraseña';
      },
      error: (err:any) => {
        this.text='Cambiar Contraseña';
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      },
    })
  }
}
