import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import Swal from 'sweetalert2';
import { UsuariosService } from './usuarios.service';

const numero=environment.numero;
const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private api: UsuariosService) { }

  openWsp(){
    window.open('https://wa.me/'+numero);
  }
  forgotPassword(){
    let email='';

    Swal.fire({
      title: "¿Olvido su contraseña?",
      text: "Ingrese su E-mail y le enviaremos un correo de recuperación",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      inputValue: this.api.getEmail(),
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
            'tipo': 3,
            'email': email
          }

          this.api.forgotPassword(dato).subscribe({
            next: (value:any) => {
              if(value.ok){
                Swal.fire({title:'Email enviado con éxito', text: 'Se ha enviado un mail para el cambio de contraseña al Email: '+email, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
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
  async getImg(dato:string, dato2:string, dato3:string){    
    try {
      const resp = await fetch(base_url+'/imagenes/img'+dato3+'?img='+dato+'&token='+dato2+'&tipo=1',{
        method: 'GET', 
        headers: {'Acces-Control-Allow-Origin':'*'},
      });

      return resp;
    } catch (error) {
      return false;
    }
  }
}
