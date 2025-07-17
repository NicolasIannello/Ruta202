import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { CommonService } from '../../../servicios/common.service';
import { filter, first } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['../user.component.css','../../login/login.component.css','../../validacion/validacion.component.css']
})
export class MiPerfilComponent implements AfterViewInit{
  @Input() edit:boolean=true;
  Usuario:{[key: string]: string}={};
  Usuario2:{[key: string]: string}={};
  dato:{[key: string]: string}={};
  dato2:{[key: string]: string}={};
  otro:{[key: string]: string}={
    CondicioFiscalOtro: '',
    RubroOtro: '',
    VehiculoOtro: '',
  };
  img:{[key: string]: Array<string>}={
    vehiculo: [],
    frente: [],
    dorso: []
  };
  sources: Array<any> = [];
  imgs: any = [];
  frente: any = {};
  imgFrente: any = [];
  dorso: any = {};
  imgDorso: any = [];
  @Output() messageEvent = new EventEmitter<{ data: any; tipo: string }>();
  loading:boolean=false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private api: UsuariosService, private api2:CommonService) {}

  ngAfterViewInit(): void {
    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      if(isPlatformBrowser(this.platformId) && localStorage.getItem('token')){
        this.getUserData();
      }
    });
  }

  cancelarEdit(){
    this.messageEvent.emit({data: true, tipo: 'edit'});

    this.Usuario= Object.assign( { }, this.Usuario2);
    this.dato= Object.assign( { }, this.dato2);
    this.img={
      vehiculo: [],
      frente: [],
      dorso: []
    };
    this.imgs=[];
    this.imgFrente=[];
    this.imgDorso=[];
    this.sources=[];
    this.frente={};
    this.dorso={};
  }

  guardarCambios(){
    let flag=true;
    for (const key in this.Usuario) {
      if(this.Usuario[key]=='') flag=false;
      if(this.Usuario[key]=='Otro' && (this.otro[key+'Otro']=='' || this.otro[key+'Otro']==undefined)) flag=false;
    }
    for (const key in this.dato) {
      if(this.dato[key]=='') flag=false;
      if(this.dato[key]=='Otro' && (this.otro[key+'Otro']=='' || this.otro[key+'Otro']==undefined)) flag=false;
    }

    if(!flag){
      Swal.fire({title:'Complete todos los campos',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
    }else{
      this.messageEvent.emit({data: true, tipo: 'loading'});

      const formData=new FormData();
      formData.append('token', localStorage.getItem('token')!);
      formData.append('tipo', '1');

      const changes: Record<string,string> = {};
      for (const key in this.Usuario) {
        if(this.Usuario[key]!=this.Usuario2[key]) changes[key] = this.Usuario[key] == 'Otro' ? this.otro[`${key}Otro`] : this.Usuario[key];
      }
      const json = JSON.stringify(changes);
      const blob = new Blob([ json ], { type: 'application/json' });
      formData.append('userPayload', blob, 'userPayload.json');

      const changes2: Record<string,string> = {};
      for (const key in this.dato) {
        if(this.dato[key]!=this.dato2[key]) changes2[key] = this.dato[key] == 'Otro' ? this.otro[`${key}Otro`] : this.dato[key];
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
          this.getUserData();
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
        this.cancelarEdit();
        this.messageEvent.emit({data: false, tipo: 'loading'});
      }, (err)=>{				
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
        this.cancelarEdit();
        this.messageEvent.emit({data: false, tipo: 'loading'});
      });
    }
  }

  getUserData(){
    this.loading=false;
    let dato={
      'token': localStorage.getItem('token'),
      'tipo': 1
    }
    this.api.getUserData(dato).subscribe({
      next: (value:any) => {
        if (value.ok) {
          this.messageEvent.emit({data: [value.usuarioDB.tipo,value.usuarioDB.Empresa,value.usuarioDB.EmailResponsable], tipo: 'perfil'});

          this.Usuario= Object.assign( { }, value.usuarioDB);
          this.Usuario2= Object.assign( { }, value.usuarioDB);
          this.dato= Object.assign( { }, value.datoDB);
          this.dato2= Object.assign( { }, value.datoDB);
          this.loading=true;
          if(value.imgs){
            for (let i = 0; i < value.imgs.length; i++) {
              if(value.imgs[i].tipo=='vehiculo'){
                this.api2.getImg(value.imgs[i].img, '', '').then(resp=>{
                  if(resp!=false){
                    this.img['vehiculo'].push(resp.url)
                  }
                })
              }else{
                this.api2.getImg(value.imgs[i].img, localStorage.getItem('token')!, 'Carnet').then(resp=>{
                  if(resp!=false){
                    this.img[value.imgs[i].tipo].push(resp.url)
                  }
                })
              }
            }
          }
        }
      },
      error: (err:any) => {
        this.api.logOut()
      },		
    });
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
}
