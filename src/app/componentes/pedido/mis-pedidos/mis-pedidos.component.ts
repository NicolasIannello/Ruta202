import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';
import { ClienteService } from '../../../servicios/cliente.service';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mis-pedidos',
  standalone: true,
  imports: [RouterModule, FormsModule],
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

  constructor(private api: UsuariosService, private api2: ClienteService) {}

  ngOnInit(): void {
    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
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
}
