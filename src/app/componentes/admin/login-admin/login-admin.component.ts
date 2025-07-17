import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../servicios/admin.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login-admin.component.html',
  styleUrl: '../../login/login.component.css'
})
export class LoginAdminComponent {
  email:string='';
  password:string='';
  showPassword:string='password';
  texto:string='Ingresar'

  constructor(private api:AdminService, private router: Router) {}

  login(){
    if(this.email==''  || this.password==''){
      Swal.fire({title:'Complete todos los campos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    this.texto='Iniciando session';

    let dato = {
      'admin' : this.email,
      'password' : this.password,
    }

    this.api.login(dato).subscribe({
      next: (value) => {
        if(value.ok){
          localStorage.setItem('token',value.token);
          this.api.setAdmin(value.nombre);
          this.api.setID(value.id);
          this.router.navigate(['/panelAdmin/inicio'])
        }else{
          Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
        this.texto='Ingresar'
      },
      error: (err) => {
        this.texto='Ingresar'
        Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      },
    })
  }
}
