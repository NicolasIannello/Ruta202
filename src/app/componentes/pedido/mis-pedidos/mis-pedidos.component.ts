import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';
import { ClienteService } from '../../../servicios/cliente.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../../servicios/socket.service';
import { GoogleMapsModule } from '@angular/google-maps';
import { isPlatformBrowser, Location } from '@angular/common';
import { PrestadorService } from '../../../servicios/prestador.service';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [RouterModule, FormsModule, GoogleMapsModule],
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['../../user/user.component.css','../../admin/admin.component.css']
})
export class MisPedidosComponent implements OnInit{
  tab:string='lista'
  empresa:string='';
  mail:string='';
  loading:boolean=true;
  pagina:number=0;
  Pedido:any={}
  asc:number=1;
  order:string='_id'
  datoTipo:string='tipo'
  datoBuscar:string='';
  lastPage:number=0
  total:number=0
  Pedidos:any=[]
  pages:Array<number>=[]
  Ofertas:any=[]
  loading2:boolean=true;
  hoy:string=''
  latlng:{lat:number, lng:number}= {lat: -34.6468485, lng: -58.4400179}
  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
  };
  act:string='-';
  terminarText:string='Dar como terminado'

  constructor(private api: UsuariosService, private api2: ClienteService, private api3: PrestadorService, private socketIo:SocketService, private location: Location, @Inject(PLATFORM_ID) private platformId: Object, public ruta:ActivatedRoute) {}

  ngOnInit(): void {
    let date_time=new Date();
    let date=("0" + date_time.getDate()).slice(-2);
    let month=("0" + (date_time.getMonth() + 1)).slice(-2);
    let year=date_time.getFullYear();
    this.hoy=year+"-"+month+"-"+date;

    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      if(isPlatformBrowser(this.platformId)){
        if(localStorage.getItem('token')){
          let id = this.ruta.snapshot.paramMap.get('id')
          if(id){
            this.tab='pedido'
            let dato={
              'token': localStorage.getItem('token'),
              'tipo': 1,
              'id': id
            }
            this.api3.getPedido(dato).subscribe({
              next: (value:any) => {
                if (value.ok) {
                  this.verPedido(value.pedido)
                }
              },
              error: (err:any) => {
              },		
            });
          }
        }
      }
      this.empresa=this.api.getEmpresa()
      this.mail=this.api.getEmail()
      this.getPedidos(this.pagina, 10, this.asc, this.order);
    });
  }

  paginacion(int:number){
    this.pagina=int;        
    this.getPedidos(this.pagina, 10, this.asc, this.order);
  }

  trackById(u:any) {
    return u._id;
  }

  verPedido(u:any){
    this.tab='pedido'
    this.Pedido=u
    this.location.go('misPedidos/'+this.Pedido.UUID); 
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1,
      '_id': this.Pedido._id
    }
    this.api2.getOfertas(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {
          this.loading2=false;
          this.Ofertas=value.ofertasDB
          
          if(!this.Pedido.disponible && this.hoy==this.Ofertas[0].fecha && this.Ofertas[0].estado=='Aceptada'){
            this.socketIo.connect()
            this.socketIo.onMessage().subscribe((message:any) => {      
              this.act=message.last;
              this.latlng= { lat:message.lat , lng: message.lng}
            });
            this.socketIo.sendMessage(this.Pedido.UUID);
          }
        }
      },
      error: (err:any) => {
      },		
    });
  }

  disconnect(){
    this.location.go('misPedidos');
    this.socketIo.disconnect()
  }

  getPedidos(desde:number, limit:number, orden:number, order:string){
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1,
      'desde': desde,
      'limit': limit,
      'orden': orden,
      'order': order,
      'datoTipo': this.datoTipo,
      'datoBuscar': this.datoBuscar
    }
    this.api2.getPedidos(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {          
          this.Pedidos=value.pedidos      
          this.total=value.total  
          this.lastPage=Math.trunc(this.total/10)
          this.loading=false;
          this.pages=Array.from({ length: this.total/10 }, (_, i) => i + 1)
        }
      },
      error: (err:any) => {
      },		
    });
  }

  aceptarOferta(oferta:any){
    Swal.fire({
      title: "Esta por aceptar una Oferta",
      html: "Cantidad: "+oferta.oferta+"<br>Empresa: "+oferta.dato_prestador.Empresa,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor:'#ea580c',
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let dato={
            'token': localStorage.getItem('token'),
            'tipo': 1,
            '_id': oferta._id
          }

          this.api2.aceptarOferta(dato).subscribe({
            next: (value) => {
              if(value.ok){
                Swal.fire({title:'Oferta aceptada con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'}).then( () => {
                  window.location.reload()
                }); 
              }else{
                Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            },
            error: (err) => {
              Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            },
          })
          
        } catch (error) {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }
    });
  }

  cancelarOferta(oferta:any){
    Swal.fire({
      title: "Esta por borrar una Oferta",
      html: "Cantidad: "+oferta.oferta+"<br>Empresa: "+oferta.dato_prestador.Empresa,
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor:'#ea580c',
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let dato={
            'token': localStorage.getItem('token'),
            'tipo': 1,
            '_id': oferta._id
          }

          this.api2.borrarOferta(dato).subscribe({
            next: (value) => {
              if(value.ok){
                Swal.fire({title:'Oferta eliminada con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
                let dato={
                  'token': localStorage.getItem('token'),
                  'tipo': 1,
                  '_id': this.Pedido._id
                }
                this.api2.getOfertas(dato).subscribe({
                  next: (value:any) => {
                    if (value.ok) {
                      this.loading2=false;
                      this.Ofertas=value.ofertasDB
                    }
                  },
                  error: (err:any) => {
                  },		
                });
              }else{
                Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            },
            error: (err) => {
              Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            },
          })
          
        } catch (error) {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }
    });
  }

  buscarDato(){
    if(this.datoBuscar==''){
      Swal.fire({title:'Complete el dato a buscar',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    this.pagina=0
    this.getPedidos(this.pagina, 10, this.asc, this.order);
  }

  terminar(){
    Swal.fire({
      title: "Esta por dar por terminado el pedido",
      showCancelButton: true,
      confirmButtonText: "Aceptar",
      confirmButtonColor:'#ea580c',
      showLoaderOnConfirm: true,
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          let dato={
            'token': localStorage.getItem('token'),
            'tipo': 1,
            'id': this.Pedido._id,
          }

          this.api2.terminar(dato).subscribe({
            next: (value) => {
              if(value.ok){
                Swal.fire({title:'Pedido terminado con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }else{
                Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            },
            error: (err) => {
              Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
            },
          })
          
        } catch (error) {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }
    });
  }
}
