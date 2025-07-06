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
  styleUrls: ['../user.component.css','../../login/login.component.css']
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
  }

  guardarCambios(){
    let flag=true;
    for (const key in this.Usuario) {
      if(this.Usuario[key]=='') flag=false;
      if(this.Usuario[key]=='Otro' && this.otro[key+'Otro']=='') flag=false;
    }
    for (const key in this.dato) {
      if(this.dato[key]=='') flag=false;
      if(this.dato[key]=='Otro' && this.otro[key+'Otro']=='') flag=false;
    }

    if(!flag){
      Swal.fire({title:'Complete todos los campos',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
    }else{
      this.messageEvent.emit({data: true, tipo: 'loading'});

      TODO

      this.messageEvent.emit({data: true, tipo: 'edit'});
      this.messageEvent.emit({data: false, tipo: 'loading'});
    }
  }

  getUserData(){
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
      },
      error: (err:any) => {
        this.api.logOut()
      },		
    });
  }

  showImg(event: Event, int:number){
    if (int==0) this.sources=[];
    if (int==1) this.frente={id: '', link:'', name: ''};
    if (int==2) this.dorso={id: '', link:'', name: ''};

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
      if (int==1) this.frente={id: '', link: '', name: ''};
      if (int==2) this.dorso={id: '', link: '', name: ''};
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
