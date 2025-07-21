import { Component } from '@angular/core';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';
import { PrestadorService } from '../../../servicios/prestador.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-ofertas',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './ofertas.component.html',
  styleUrls: ['../../user/user.component.css','../../admin/admin.component.css']
})
export class OfertasComponent {
  empresa:string='';
  mail:string='';
  loading:boolean=true;
  pagina:number=0;
  asc:number=1;
  order:string='_id'
  datoTipo:string='tipo'
  datoBuscar:string='';
  lastPage:number=0
  total:number=0
  Pedidos:any=[]
  pages:Array<number>=[]
  Ofertas:any=[]

  constructor(private api: UsuariosService, private api2: PrestadorService) {}

  ngOnInit(): void {
    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      this.empresa=this.api.getEmpresa()
      this.mail=this.api.getEmail()
      this.getOfertas(this.pagina, 10, this.asc, this.order);
    });
  }

  paginacion(int:number){
    this.pagina=int;        
    this.getOfertas(this.pagina, 10, this.asc, this.order);
  }

  trackById(u:any) {
    return u._id;
  }

  getOfertas(desde:number, limit:number, orden:number, order:string){
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1,
      'desde': desde,
      'limit': limit,
      'orden': orden,
      'order': order,
      'datoTipo': this.datoTipo,
      'datoBuscar': this.datoBuscar,
      'UUID': this.api.getUUID()
    }
    this.api2.getOfertas(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {          
          this.Ofertas=value.ofertas      
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
