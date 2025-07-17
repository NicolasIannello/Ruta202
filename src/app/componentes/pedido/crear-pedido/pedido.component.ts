import { Component } from '@angular/core';
import { Pedido } from '../../data/pedido';
import { funcionalidadData, lugarTipoData, pedidosData, tipoData } from '../../data/pedidoData';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../servicios/cliente.service';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pedido.component.html',
  styleUrl: '../../user/user.component.css'
})
export class PedidoComponent {
  datosPedido:Pedido= Object.assign({}, pedidosData);
  disabled:boolean=false;
  text:string='Crear Pedido';
  tipos:Array<string>=tipoData;
  funcionalidad:Array<string>=funcionalidadData;
  lugarTipo:Array<string>=lugarTipoData

  constructor(private api:ClienteService){}

  crearPedido(){
    let flag=true;
    this.disabled=true;
    this.text='Crear Pedido...'    

    Object.entries(this.datosPedido).forEach(([key, value]) => {
        if(value==''){          
          this.disabled=false;
          this.text='Crear Pedido'
          Swal.fire({title:'Complete todos los campos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
          flag=false;
        }
    });

    if(flag){
      let dato={
        'pedido': this.datosPedido,
        'token': localStorage.getItem('token'),
        'tipo': 1
      }

      this.api.crearPedido(dato).subscribe({
        next: (value) => {
          if(value.ok){
            Swal.fire({title:'Pedido creado con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            this.datosPedido= Object.assign({}, pedidosData);
          }else{
            Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
          }
          this.disabled=false;
          this.text='Crear Pedido'
        },
        error: (err) => {
          this.disabled=false;
          this.text='Crear Pedido'
          Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        },
      })
    }
  }
}
