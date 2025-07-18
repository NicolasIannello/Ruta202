import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrestadorService } from '../../../servicios/prestador.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [FormsModule],
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
  oferta:number|null=null;

  constructor(private api:PrestadorService, @Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
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
    this.oferta=null;
    this.tab='pedido'
    this.Pedido=u
  }

  aceptarPedido(){
    if(this.oferta==null || this.oferta<1){
      Swal.fire({title:'Ingrese una oferta valida', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
    }else{
      this.disabled=true;
      this.text='Aceptar pedido...';

      Swal.fire({
            title: "Esta crear una Oferta",
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
                  '_id': this.Pedido._id,
                  'oferta': this.oferta
                }
                this.api.ofertaPedido(dato).subscribe({
                  next: (value:any) => {
                    if (value.ok) Swal.fire({title:'Oferta creada con éxito', confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
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
}
