import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonService } from '../../servicios/common.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { UsuariosService } from '../../servicios/usuarios.service';
import { isPlatformBrowser } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-validacion',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './validacion.component.html',
  styleUrl: './validacion.component.css'
})
export class ValidacionComponent implements OnInit{
  verificationStatus:string='loading'
  email:string='';

  constructor(public common:CommonService, public ruta:ActivatedRoute, public api:UsuariosService,  @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      let dato={
        'token':this.ruta.snapshot.paramMap.get('token'),
        'tipo':2
      }
      setTimeout(() => {
        this.api.validarCuenta(dato).subscribe({
        next: (value:any) => {
          if(value.ok){
            this.verificationStatus='success'
            this.email=value.mail;
          }else{
            this.verificationStatus='error'
          }
        },
        error: (err:any) => {
          this.verificationStatus='error'
        },		
      });
      }, 1500);
    }
  }

  reValidar(){
    let email='';

    Swal.fire({
      title: "Ingrese su E-mail",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: "Enviar E-mail",
      confirmButtonColor:'#ea580c',
      showLoaderOnConfirm: true,
      preConfirm: async (mail) => {
        email=mail;
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let dato={
            'token': this.ruta.snapshot.paramMap.get('token'),
            'tipo': 2,
            'email': email
          }

          this.api.reValidarCuenta(dato).subscribe({
            next: (value:any) => {
              if(value.ok){
                Swal.fire({title:'Email enviado con éxito', text: 'Se ha enviado un mail de confirmación al Email: '+email, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }else{
                Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            },
            error: (err:any) => {
              Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            },
          })
        } catch (error) {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }
    });
  }
}
