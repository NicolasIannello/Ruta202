import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PrestadorService } from '../../../servicios/prestador.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-ver-pedido',
  standalone: true,
  imports: [],
  templateUrl: './ver-pedido.component.html',
  styleUrls: ['../../user/user.component.css','../../admin/admin.component.css']
})
export class VerPedidoComponent implements OnInit{
  tab:string='lista'
  pagina:number=0;
  asc:number=1;
  order:string='_id'
  datoTipo:string='_id'
  datoBuscar:string='';
  Pedidos:any=[]
  total:number=0
  lastPage:number=0
  loading:boolean=true;
  pages:Array<number>=[]

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
          console.log(value);
          
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
}
