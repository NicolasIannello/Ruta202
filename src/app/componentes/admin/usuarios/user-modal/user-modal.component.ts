import { isPlatformBrowser, KeyValuePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { AdminService } from '../../../../servicios/admin.service';
import { CommonService } from '../../../../servicios/common.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [KeyValuePipe, FormsModule],
  templateUrl: './user-modal.component.html',
  styleUrl: './user-modal.component.css'
})
export class UserModalComponent implements OnInit{
  @Output() messageEvent = new EventEmitter<string>();
  @Input() userModal:Record<string, string> = {};
  dato:Record<string, string> = {};
  img:{[key: string]: Array<string>}={
    vehiculo: [],
    frente: [],
    dorso: []
  };
  @Input() edit:boolean=false;
  user2:Record<string, string> = {};
  dato2:Record<string, string> = {};
  sources: Array<any> = [];
  imgs: any = [];
  frente: any = {};
  imgFrente: any = [];
  dorso: any = {};
  imgDorso: any = [];
  loading:boolean=false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: AdminService, private api2:CommonService) {}
    
  ngOnInit(): void {
    if(isPlatformBrowser(this.platformId)){
      if(localStorage.getItem('token')){
        let dato={
          'token': localStorage.getItem('token'),
          'Tipo': this.userModal['Tipo'],
          'UUID': this.userModal['UUID']
        }
        this.api.getUserExtra(dato).subscribe({
          next: (value:any) => {
            if (value.ok) {      
              this.dato=value.datoDB
              this.user2= Object.assign( { }, this.userModal);
              this.dato2= Object.assign( { }, this.dato);
              for (let i = 0; i < value.imgs.length; i++) {
                if(value.imgs[i].tipo=='vehiculo'){
                  this.api2.getImg(value.imgs[i].img, '', '').then(resp=>{
                    if(resp!=false){
                      this.img['vehiculo'].push(resp.url)
                    }
                  })
                }else{
                  this.api.getImgAdmin(value.imgs[i].img, localStorage.getItem('token')!).then(resp=>{
                    if(resp!=false){
                      this.img[value.imgs[i].tipo].push(resp.url)
                    }
                  })
                }
              }
            }
          },
          error: (err:any) => {
          },		
        });
      }
    }
  }

  cancelar(){
    this.edit=false;
    this.user2= Object.assign( { }, this.userModal);
    this.dato2= Object.assign( { }, this.dato);
    this.sources=[];
    this.frente={};
    this.dorso={};
    this.imgs=[];
    this.imgFrente=[];
    this.imgDorso=[];
  }

  showImg(event: Event, int:number){
    if (int==0) this.sources=[];
    if (int==1) this.frente={};
    if (int==2) this.dorso={};

    let element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;

    if(cantidad>4 && int==0) {
      element.value = '';
      this.imgs=[];
      return;
    }
    if (int==0) this.imgs=element.files;
    if (int==1) this.imgFrente=element.files;
    if (int==2) this.imgDorso=element.files;

		if(cantidad==0) {
      if (int==0) this.sources=[];
      if (int==1) this.frente={};
      if (int==2) this.dorso={};
		}else{
			for (let index = 0; index < cantidad; index++) {
				var nombreCortado=element.files![index].name.split('.');
				var extensionArchivo=nombreCortado[nombreCortado.length-1];
				
				if(extensionArchivo!="pdf"){
          setTimeout(() => {
            const reader = new FileReader();
            reader.readAsDataURL(element.files![index]);

            reader.onloadend = ()=>{              
              if (int==0) this.sources[index]=reader.result;
              if (int==1) this.frente=reader.result;
              if (int==2) this.dorso=reader.result;
            }            
          }, index*200);
				}
			}			
		}
	}

  guardarCambios(){
    let flag=true;
    for (const key in this.user2) {
      if(this.user2[key]==='') flag=false;
    }
    for (const key in this.dato2) {
      if(this.dato2[key]==='') flag=false;
    }

    if(!flag){
      Swal.fire({title:'Complete todos los campos',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
    }else{      
      this.loading=true;

      const formData=new FormData();
      formData.append('token', localStorage.getItem('token')!);
      formData.append('UUID', this.userModal['UUID']);

      const changes: Record<string,string> = {};
      for (const key in this.user2) {
        if(this.user2[key]!=this.userModal[key]) changes[key] = this.user2[key];
      }
      const json = JSON.stringify(changes);
      const blob = new Blob([ json ], { type: 'application/json' });
      formData.append('userPayload', blob, 'userPayload.json');

      const changes2: Record<string,string> = {};
      for (const key in this.dato2) {
        if(this.dato[key]!=this.dato2[key]) changes2[key] = this.dato2[key];
      }
      const json2 = JSON.stringify(changes2);
      const blob2 = new Blob([ json2 ], { type: 'application/json' });
      formData.append('datoPayload', blob2, 'datoPayload.json');

      for (let i = 0; i < this.imgs.length; i++) {
        formData.append('img', this.imgs[i]);        
      }
      if(this.imgFrente.length!=0) formData.append('imgFrente', this.imgFrente[0]);
      if(this.imgDorso.length!=0) formData.append('imgDorso', this.imgDorso[0]);

      this.api.changeData(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Datos cambiados con éxito', confirmButtonText:'Aceptar', confirmButtonColor:'#ea580c'})
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
        this.cancelar();
        this.loading=false;
        this.messageEvent.emit('reload');
      }, (err)=>{				
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
        this.cancelar();
        this.loading=false;
        this.messageEvent.emit('reload');
      });
    }
  }
  
}
