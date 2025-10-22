import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import Swal from 'sweetalert2';
import { AdminService } from '../../../servicios/admin.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pdfs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pdfs.component.html',
  styleUrl: '../admin.component.css'
})
export class PdfsComponent implements OnInit{
  loading:boolean=true;
  Ordenes:any=[]
  total:number=0
  menuOpen:boolean=false;
  pagina:number=0;
  lastPage:number=0
  pages:Array<number>=[]
  iterator:Array<number>=[1,2,3]
  usuario:string=''
  prestador:string=''

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService) {}
  
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        this.getOrdenes(this.pagina, 10);
      }
    }
  }

  paginacion(int:number){
    this.pagina=int;        
    this.getOrdenes(this.pagina, 10);
  }

  getOrdenes(desde:number, limit:number){
    let dato={
      'token': localStorage.getItem('token'),
      'desde': desde,
      'limit': limit,
      'usuario': this.usuario,
      'prestador': this.prestador,
    }
    this.api.getOrdenes(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {      
          this.Ordenes=value.ordenes
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

  buscarDato(){
    this.pagina=0
    this.getOrdenes(this.pagina, 10);
  }
  
  ver(orden:string){
    this.menuOpen=true;
  }
}
