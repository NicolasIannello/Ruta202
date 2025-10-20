import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrestadorService } from '../../../servicios/prestador.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';
import { GoogleMapsModule } from '@angular/google-maps';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CommonService } from '../../../servicios/common.service';
import { AdminService } from '../../../servicios/admin.service';

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
  Orden:any={}
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
  terminarText:string='Dar como terminado';
  pdf:SafeResourceUrl|null=null;
  ordenRetiro:any=null;
  taburl:string='';
  id:string=''

  constructor(private sanitizer: DomSanitizer, private api:PrestadorService, @Inject(PLATFORM_ID) private platformId: Object, public ruta:ActivatedRoute, private location: Location, private api2:UsuariosService, private api3:CommonService, private router: Router, private api4:AdminService){
    this.taburl=router.url
    if(this.taburl.includes('/pedido/'))this.tab='pedido'
  }

  ngOnInit(): void {
    let date_time=new Date();
    let date=("0" + date_time.getDate()).slice(-2);
    let month=("0" + (date_time.getMonth() + 1)).slice(-2);
    let year=date_time.getFullYear();
    this.hoy=year+"-"+month+"-"+date;

    this.api2.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      if(isPlatformBrowser(this.platformId)){
        let id = this.ruta.snapshot.paramMap.get('id')
        if(localStorage.getItem('token')){
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
                  this.Orden=value.ordenDB
                  this.getPDF();
                  this.getOferta();
                }
              },
              error: (err:any) => {
              },		
            });
          }
          this.getPedidos(this.pagina, 10, this.asc, this.order);
        }else{
            let dato={
              'id': id
            }
            this.api2.getPedido(dato).subscribe({
              next: (value:any) => {
                if (value.ok) {
                  this.Pedido=value.pedido
                  this.Orden=value.ordenDB
                  this.getPDF();
                  this.getOferta();
                }
              },
              error: (err:any) => {
              },		
            });
        }
      }
    });

    if(this.taburl.includes('/panelAdmin/pedidos')){
      if(isPlatformBrowser(this.platformId)){
        if(localStorage.getItem('token')){
          let id = this.ruta.snapshot.paramMap.get('id')
          if(id){
            this.id=id;
            this.tab='pedido'
            let dato={
              'token': localStorage.getItem('token'),
              'tipo': 1,
              'id': id
            }
            this.api4.getPedidoAdmin(dato).subscribe({
              next: (value:any) => {
                if (value.ok) {
                  this.Pedido=value.pedido
                  this.Orden=value.ordenDB
                  this.getPDF();
                  this.getOferta();
                }
              },
              error: (err:any) => {
              },		
            });
          }
        }
        this.getPedidos(this.pagina, 10, this.asc, this.order);
      }
    }
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
    if(this.taburl.includes('/panelAdmin/pedidos')){      
      this.api4.getPedidosAdmin(dato).subscribe({
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
    }else{
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
    let tab= this.taburl.includes('/panelAdmin/pedidos') ? '/panelAdmin/pedidos/' :  'verPedidos/';
    this.location.go(tab+this.Pedido.UUID); 
    this.getOferta();
  }

  verLista(){
    this.oferta='';
    this.tab='lista';
    this.Pedido={}
    let tab= this.taburl.includes('/panelAdmin/pedidos') ? '/panelAdmin/pedidos' :  'verPedidos';
    this.location.go(tab);
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
    if(this.taburl.includes('/panelAdmin/pedidos')){      
      let dato2={
        'token': localStorage.getItem('token'),
        'tipo': 1,
        'pedido': this.Pedido.UUID,
      }
      this.id=this.Pedido.UUID
      this.api4.getOfertaPedidoAdmin(dato2).subscribe({
        next: (value:any) => {
          if (value.ok) {
            this.miOferta=value.oferta[0]
          }
        },
        error: (err:any) => {
        },		
      });
    }else if(this.taburl.includes('/pedido/')){
      let dato2={
        'pedido': this.Pedido.UUID,
      }
      this.api2.getOfertaPedido(dato2).subscribe({
        next: (value:any) => {
          if (value.ok) {
            this.miOferta=value.oferta[0]
          }
        },
        error: (err:any) => {
        },		
      });
    }else{
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
  }

  seguimiento(flag:boolean){
    this.seguimientoText=this.seguimientoText=='Empezar seguimiento' ? 'Detener seguimiento' : 'Empezar seguimiento';
    this.flagloop = flag;
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.latlng= { lat:position.coords.latitude , lng:position.coords.longitude};
          let dato={
            'token': localStorage.getItem('token'),
            'tipo': 1,
            'UUID': this.Pedido.UUID,
            'lat': position.coords.latitude,
            'lng': position.coords.longitude
          }
          this.api.emitCords(dato).subscribe({
            next: (value:any) => { },
            error: (err:any) => { },		
          });
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

    if(this.flagloop) setTimeout( ()=>this.seguimiento(this.flagloop), 30000);
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

          this.api.terminar(dato).subscribe({
            next: (value) => {
              if(value.ok){
                Swal.fire({title:'Pedido terminado con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'}).then( () => {
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

  showPDF(event: Event){
    this.pdf=null;
    this.ordenRetiro=null;
    const element = event.currentTarget as HTMLInputElement;    
    if(element.files?.length!=undefined && element.files?.length>0){ 
      this.pdf= this.transform(URL.createObjectURL(element.files[0]));
      this.ordenRetiro=element.files;
    }    
	}

  transform(url: any) {
		return this.sanitizer.bypassSecurityTrustResourceUrl(url);
	}

  subirOrden(){    
    if(this.ordenRetiro!=null && !this.taburl.includes('/pedido/')){
      const formData = new FormData();

      formData.append('token', localStorage.getItem('token')!)
      formData.append('tipo', '1')
      formData.append('orden', this.ordenRetiro[0])
      formData.append('pedido', this.Pedido.UUID)

      this.api.subirOrden(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Orden de retiro cargado con éxito',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'}).then(()=>{
            window.location.reload();
          });
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }, (err)=>{				
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
      });
    }else if(this.ordenRetiro!=null && this.taburl.includes('/pedido/')){
      const formData = new FormData();

      formData.append('orden', this.ordenRetiro[0])
      formData.append('pedido', this.Pedido.UUID)

      this.api2.subirOrden(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Orden de retiro cargado con éxito',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'}).then(()=>{
            window.location.reload();
          });
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }, (err)=>{				
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
      });
    }else{
      Swal.fire({title:'Seleccione un archivo pdf',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
    }

  }

  getPDF(){
    if(this.Pedido.ordenRetiro!='' && !this.taburl.includes('/pedido/')){
      this.api3.getPDF(this.Pedido.ordenRetiro,localStorage.getItem('token')!).then(resp=>{
        if(resp!=false){
          this.pdf=this.transform(resp.url)
        }
      })
    }else if(this.Pedido.ordenRetiro!='' && this.taburl.includes('/pedido/')){
      this.api3.getPDF2(this.Pedido.ordenRetiro).then(resp=>{
        if(resp!=false){
          this.pdf=this.transform(resp.url)
        }
      })
    }
  }
}
