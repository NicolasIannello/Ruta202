import { Component } from '@angular/core';
import { Pedido } from '../../data/pedido';
import { funcionalidadData, lugarTipoData, pedidosData, tipoData } from '../../data/pedidoData';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ClienteService } from '../../../servicios/cliente.service';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-pedido',
  standalone: true,
  imports: [FormsModule, GoogleMapsModule],
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
  center = {lat: -34.6468485, lng: -58.4400179};
  center2 = {lat: -34.6468485, lng: -58.4400179};
  zoom = 11;
  zoom2 = 11;
  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
  };

  constructor(private api:ClienteService){}

  onMapClick(event: google.maps.MapMouseEvent,campo:any) {
    if (event.latLng) {
      if(campo=='retiro') this.datosPedido.lugarRetiroLatLng={lat: event.latLng.lat(), lng: event.latLng.lng() };
      if(campo=='entrega') this.datosPedido.lugarEntregaLatLng={lat: event.latLng.lat(), lng: event.latLng.lng() };

      let dato = {
        'lat': campo=='retiro' ? this.datosPedido.lugarRetiroLatLng.lat : this.datosPedido.lugarEntregaLatLng.lat,
        'lng': campo=='retiro' ? this.datosPedido.lugarRetiroLatLng.lng : this.datosPedido.lugarEntregaLatLng.lng,
        'token': localStorage.getItem('token'),
        'tipo': 1
      }

      this.api.geocodeReverse(dato).subscribe({
        next: (value) => {
          if(campo=='retiro') this.datosPedido.lugarRetiro=value.data.results[0].formatted_address
          if(campo=='entrega') this.datosPedido.lugarEntrega=value.data.results[0].formatted_address
        },
        error: (err) => {
          Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        },
      })
    }
  }

  geocode(campo:any){
    if(this.datosPedido.lugarRetiro!=''){
      let dato = {
        'lugar': campo=='retiro' ? this.datosPedido.lugarRetiro : this.datosPedido.lugarEntrega,
        'token': localStorage.getItem('token'),
        'tipo': 1
      }

      this.api.geocode(dato).subscribe({
        next: (value) => {
          if(campo=='retiro'){
            this.datosPedido.lugarRetiro=value.data.results[0].formatted_address;
            this.datosPedido.lugarRetiroLatLng=value.data.results[0].geometry.location;
            this.center=value.data.results[0].geometry.location;
            this.zoom=16;
          }else{
            this.datosPedido.lugarEntrega=value.data.results[0].formatted_address;
            this.datosPedido.lugarEntregaLatLng=value.data.results[0].geometry.location;
            this.center2=value.data.results[0].geometry.location;
            this.zoom2=16;
          }
        },
        error: (err) => {
          Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        },
      })
    }
  }

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

    if(this.datosPedido.lugarEntregaLatLng.lat==0 || this.datosPedido.lugarEntregaLatLng.lng==0 || this.datosPedido.lugarRetiroLatLng.lat==0 || this.datosPedido.lugarRetiroLatLng.lng==0) {
      this.disabled=false;
      this.text='Crear Pedido'
      Swal.fire({title:'Complete todos los campos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      flag=false;
    }

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
