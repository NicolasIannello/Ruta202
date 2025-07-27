import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrestadorService } from '../../../servicios/prestador.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [FormsModule, GoogleMapsModule],
  templateUrl: './ver-pedido.component.html',
  styleUrls: ['../../user/user.component.css','../../admin/admin.component.css']
})
export class VerPedidoComponent implements OnInit{
  tab:string='lista'
  pagina:number=0;
  asc:number=1;
  order:string='_id'
  datoTipo:string='tipo'
  datoBuscar:string='';
  Pedidos:any=[]
  Pedido:any={}
  total:number=0
  lastPage:number=0
  loading:boolean=true;
  pages:Array<number>=[]
  disabled:boolean=false;
  text:string='Aceptar pedido'
  oferta:string='';
  miOferta:any={}
  fecha:string='';
  hora1:string=''
  hora2:string=''
  hoy:string=''
  latlng:{lat:number, lng:number}= {lat: -34.6468485, lng: -58.4400179}
  flagloop:boolean=false;
  seguimientoText:string='Empezar seguimiento';
  watchId:number=0;
  mapOptions: google.maps.MapOptions = {
    streetViewControl: false,
    mapTypeControl: false,
  };

  constructor(private api:PrestadorService, @Inject(PLATFORM_ID) private platformId: Object, public ruta:ActivatedRoute, private location: Location, private api2:UsuariosService){}

  ngOnInit(): void {
    let date_time=new Date();
    let date=("0" + date_time.getDate()).slice(-2);
    let month=("0" + (date_time.getMonth() + 1)).slice(-2);
    let year=date_time.getFullYear();
    this.hoy=year+"-"+month+"-"+date;

    this.api2.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
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
            this.api.getPedido(dato).subscribe({
              next: (value:any) => {
                if (value.ok) {
                  this.Pedido=value.pedido
                  this.getOferta();
                }
              },
              error: (err:any) => {
              },		
            });
          }
          this.getPedidos(this.pagina, 10, this.asc, this.order);
        }
      }
    });
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
    this.api.getPedidos(dato).subscribe({
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

  paginacion(int:number){
    this.pagina=int;        
    this.getPedidos(this.pagina, 10, this.asc, this.order);
  }

  trackById(u:any) {
    return u._id;
  }

  verPedido(u:any){
    this.oferta='';
    this.tab='pedido'
    this.Pedido=u    
    this.location.go('verPedidos/'+this.Pedido.UUID); 
    this.getOferta();
  }

  verLista(){
    this.oferta='';
    this.tab='lista';
    this.Pedido={}
    this.location.go('verPedidos');
    this.miOferta={} 
  }

  aceptarPedido(){
    if(this.hora1>this.hora2){
      Swal.fire({title:'Horarios incorrectos', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    if(this.oferta=='' || this.oferta=='' || this.fecha=='' || this.hora1=='' || this.hora2==''){
      Swal.fire({title:'Complete todos los campo', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
    }else{
      this.disabled=true;
      this.text='Aceptar pedido...';

      Swal.fire({
            title: "Esta por crear una Oferta",
            html: "Cantidad: "+this.oferta,
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
                  'idP': this.Pedido._id,
                  'oferta': this.oferta,
                  'fecha': this.fecha,
                  'hora1': this.hora1,
                  'hora2': this.hora2
                }
                this.api.ofertaPedido(dato).subscribe({
                  next: (value:any) => {
                    if (value.ok) {
                      Swal.fire({title:'Oferta creada con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'}).then(() =>{
                        window.location.reload()
                      })
                    }
                    if (!value.ok) Swal.fire({title:value.msg, confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
                    this.disabled=false;
                    this.text='Aceptar pedido';
                  },
                  error: (err:any) => {
                    Swal.fire({title:'Ocurrió un error', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
                    this.disabled=false;
                    this.text='Aceptar pedido';
                  },		
                });   
              } catch (error) {
                Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
              }
            }else{
              this.disabled=false;
              this.text='Aceptar pedido';
            }
          });
    }
  }

  buscarDato(){
    if(this.datoBuscar==''){
      Swal.fire({title:'Complete el dato a buscar',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    this.pagina=0
    this.getPedidos(this.pagina, 10, this.asc, this.order);
  }

  getOferta(){
    let dato2={
      'token': localStorage.getItem('token'),
      'tipo': 1,
      'pedido': this.Pedido.UUID,
      'prestador': this.api2.getUUID()
    }
    this.api.getOfertaPedido(dato2).subscribe({
      next: (value:any) => {
        if (value.ok) {
          this.miOferta=value.oferta[0]
        }
      },
      error: (err:any) => {
      },		
    });
  }

  seguimiento(flag:boolean){
    this.seguimientoText=this.seguimientoText=='Empezar seguimiento' ? 'Detener seguimiento' : 'Empezar seguimiento';
    this.flagloop = flag;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latlng= { lat:position.coords.latitude , lng:position.coords.longitude};
          console.log(this.latlng);
        },
        (err) => {
          Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
          this.flagloop=false;
        },
        { enableHighAccuracy: true }
      );
    } else {
      Swal.fire({title:'Geolocation no es soportada por el navegador',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      this.flagloop=false;
    }

    if(this.flagloop) setTimeout( ()=>this.seguimiento(this.flagloop), 60000);
  }
}
