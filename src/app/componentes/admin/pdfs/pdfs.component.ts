import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../servicios/admin.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { CommonService } from '../../../servicios/common.service';
import { HttpClient } from '@angular/common/http';

type PdfInput = string | ArrayBuffer | Blob | Uint8Array| URL;

@Component({
  selector: 'app-pdfs',
  standalone: true,
  imports: [FormsModule, NgxExtendedPdfViewerModule],
  templateUrl: './pdfs.component.html',
  styleUrls: ['../admin.component.css','../usuarios/user-modal/user-modal.component.css']
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
  matricula:string=''
  pdf2:PdfInput='';

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object, private api: AdminService, public api4:CommonService) {}
  
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
      'matricula': this.matricula,
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
    this.pdf2 = '';
    this.api4.getPDF2(orden).then(resp=>{
        if(resp!=false){
          this.http.get(resp.url, {
            responseType: 'blob',
            withCredentials: false
          }).subscribe({
            next: (blob) => {
              if (blob.type && !blob.type.includes('pdf')) return;
              this.pdf2 = blob;
            },
            error: (e) => {
              console.error(e);
            }
          });        
        }
      })
  }

  cerrar(){
    this.menuOpen=false;
    this.pdf2 = '';
  }
}
