import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonService } from '../../servicios/common.service';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword: string = 'password';
  email:string = '';
  password:string = '';
  rememberMe:boolean = false;

  constructor(public common: CommonService, private api:UsuariosService, private router: Router) {}

  login(){
    let dato = {
      'email' : this.email,
      'password' : this.password,
      'rememberMe' : this.rememberMe
    }

    this.api.login(dato).subscribe({
      next: (value) => {
        if(value.ok){
          if(value.validado && value.habilitado){
            localStorage.setItem('token',value.token);
            this.api.setEmail(value.mail);
            this.api.setEmpresa(value.nombre);
            this.api.setID(value.id);
            this.router.navigate(['/']);
          }
          if(!value.validado) Swal.fire({title:'Se requiere validación', text: 'Se ha enviado un mail de confirmación al Email: '+this.email, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
          if(value.validado && !value.habilitado) Swal.fire({title:'Su cuenta espera ser habilitada por un Administrador', text: 'Este proceso puede demorar unas horas', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }else{
          Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      },
      error(err) {
        Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      },
    })
  }
}
