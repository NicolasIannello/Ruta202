import { Component } from '@angular/core';
import { CommonService } from '../../../servicios/common.service';
import { environment } from '../../../../environments/environment';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

const numero=environment.numeroString;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  mail:string='remolques@ruta202.com.ar';
  numero:string=numero;
  nombre:string='';
  email:string='';
  mensaje:string='';
  telefono:string='';
  text:string='Enviar Mensaje';
  disable:boolean=false;

  constructor(public common: CommonService) {}

  enviar(){
    if(this.nombre=='' && this.email=='' && this.mensaje=='' && this.telefono==''){
      Swal.fire({title:'Complete todos los campos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    this.text='Enviar Mensaje...';
    this.disable=true;

    let dato={
      'nombre':this.nombre,
      'email':this.email,
      'mensaje':this.mensaje,
      'telefono':this.telefono
    }

    this.common.mensaje(dato).subscribe({
      next: (value) => {
        if(value.ok){
          Swal.fire({title:'Mensaje enviado con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }else{
          Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
        this.text='Enviar Mensaje';
        this.disable=false;
        this.nombre='';
        this.email='';
        this.mensaje='';
        this.telefono='';
      },
      error: (err) => {
        this.text='Enviar Mensaje';
        this.disable=false;
        this.nombre='';
        this.email='';
        this.mensaje='';
        this.telefono='';
        Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      },
    })
  }
}
