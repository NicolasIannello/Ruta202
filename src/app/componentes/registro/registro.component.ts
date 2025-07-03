import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import Swal from 'sweetalert2';
import { EmergencyNoticeComponent } from "../things/emergency-notice/emergency-notice.component";

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule, EmergencyNoticeComponent],
  templateUrl: './registro.component.html',
  styleUrl: '../login/login.component.css'
})
export class RegistroComponent {
  type:number=0
  registro:{[key: string]: [string,string]}={
    Empresa: ['',''],
    CUIT: ['',''],
    Dirección: ['',''],
    Celular: ['',''],
    Nombre: ['',''],
    Apellido: ['',''],
    EmailResponsable: ['',''],
    CondiciónFiscal: ['',''],
    Contraseña: ['',''],
    Contraseña2: ['',''],
  };
  cliente:{[key: string]: [string,string]}={
    DNI: ['',''],
    Cargo: ['',''],
    Rubro: ['',''],
  };
  prestador:{[key: string]: [string,string]}={
    EmailOperativo: ['',''],
    Vehículo: ['',''],
    Marca: ['',''],
    Modelo: ['',''],
    Año: ['',''],
    Ejes: ['',''],
    Patente: ['',''],
    CapacidadCarga: ['',''],
  };
  otro:{[key: string]: [string,string]}={
    CondiciónFiscalOtro: ['',''],
    RubroOtro: ['',''],
    VehículoOtro: ['',''],
  };
  sources: Array<any> = [];
  img: any = [];
  imgAlerta: string = '';
  frente: any = {id: '', link: '', name: ''};
  imgFrente: any = [];
  imgFrenteAlerta: string = '';
  dorso: any = {id: '', link: '', name: ''};
  imgDorso: any = [];
  imgDorsoAlerta: string = '';
  tyc: boolean=false;
  showPassword: string = 'password';
  flag:boolean=true;

  constructor(private api:UsuariosService) {}

  showImg(event: Event, int:number){
    if (int==0) this.sources=[];
    if (int==1) this.frente={id: '', link:'', name: ''};
    if (int==2) this.dorso={id: '', link:'', name: ''};

    let element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;

    if(cantidad>4 && int==0) {
      element.value = '';
      this.img=[];
      return;
    }
    if (int==0) this.img=element.files;
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
              if (int==0) this.sources[index]={id: (index+1), link: reader.result, name: element.files![index].name};
              if (int==1) this.frente={id: (index+1), link: reader.result, name: element.files![index].name};
              if (int==2) this.dorso={id: (index+1), link: reader.result, name: element.files![index].name};
            }            
          }, index*200);
				}
			}			
		}
	}

  reset(i:number){
    this.registro={
      Empresa: ['',''],
      CUIT: ['',''],
      Dirección: ['',''],
      Celular: ['',''],
      Nombre: ['',''],
      Apellido: ['',''],
      EmailResponsable: ['',''],
      CondiciónFiscal: ['',''],
      Contraseña: ['',''],
      Contraseña2: ['',''],
    };
    this.otro={
      CondiciónFiscalOtro: ['',''],
      RubroOtro: ['',''],
      VehículoOtro: ['',''],
    };
    if(i==0){
      this.prestador={
        EmailOperativo: ['',''],
        Vehículo: ['',''],
        Marca: ['',''],
        Modelo: ['',''],
        Año: ['',''],
        Ejes: ['',''],
        Patente: ['',''],
        CapacidadCarga: ['',''],
      };
    }else{
      this.cliente={
        DNI: ['',''],
        Cargo: ['',''],
        Rubro: ['',''],
      };
    }
  }

  crearCuenta(type:number){    
    if(!this.tyc) {
      Swal.fire({title:'Acepte los Términos & Condiciones',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }

    this.checkCampos(this.registro)
    if(type==0) this.checkCampos(this.cliente)
    if(type==1) {
      this.checkCampos(this.prestador)
      if(this.img.length==0) this.flag = false;
      if(this.imgFrente.length==0) this.flag = false;
      if(this.imgDorso.length==0) this.flag = false;
      this.imgAlerta= this.img.length==0 ? '*Campo Obligatorio' : '';
      this.imgFrenteAlerta= this.imgFrente.length==0 ? '*Campo Obligatorio' : '';
      this.imgDorsoAlerta= this.imgDorso.length==0 ? '*Campo Obligatorio' : '';      
    }
    if(this.registro['Contraseña'][0]!=this.registro['Contraseña2'][0]) {
      this.flag=false;
      Swal.fire({title:'Las contraseñas no coinciden',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }
    
    if(!this.flag){
      Swal.fire({title:'Complete todos los campos',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
      return;
    }else{
      const formData = new FormData();

      // let datos:{[key: string]: string|number}={
      //   'Empresa': this.registro['Empresa'][0],
      //   'CUIT': this.registro['CUIT'][0],
      //   'Dirección': this.registro['Dirección'][0],
      //   'Celular': this.registro['Celular'][0],
      //   'Nombre': this.registro['Nombre'][0],
      //   'Apellido': this.registro['Apellido'][0],
      //   'EmailResponsable': this.registro['EmailResponsable'][0],
      //   'CondiciónFiscal': this.registro['CondiciónFiscal'][0]=='Otro' ? this.registro['CondiciónFiscalOtro'][0] : this.registro['CondiciónFiscal'][0],
      //   'Contraseña': this.registro['Contraseña'][0],
      //   'Tipo': this.type
      // }
      formData.append('Empresa', this.registro['Empresa'][0])
      formData.append('CUIT', this.registro['CUIT'][0])
      formData.append('Direccion', this.registro['Dirección'][0])
      formData.append('Celular', this.registro['Celular'][0])
      formData.append('Nombre', this.registro['Nombre'][0])
      formData.append('Apellido', this.registro['Apellido'][0])
      formData.append('EmailResponsable', this.registro['EmailResponsable'][0])
      formData.append('CondicionFiscal', this.registro['CondiciónFiscal'][0]=='Otro' ? this.otro['CondiciónFiscalOtro'][0] : this.registro['CondiciónFiscal'][0])
      formData.append('Contrasena', this.registro['Contraseña'][0])
      formData.append('Tipo', String(this.type))

      if(this.type==0){
        formData.append('DNI', this.cliente['DNI'][0]);
        formData.append('Cargo', this.cliente['Cargo'][0]);
        formData.append('Rubro', this.cliente['Rubro'][0]=='Otro' ? this.otro['RubroOtro'][0] : this.cliente['Rubro'][0]);
      }else{
        formData.append('EmailOperativo', this.prestador['EmailOperativo'][0])
        formData.append('Vehiculo', this.prestador['Vehículo'][0]=='Otro' ? this.otro['VehículoOtro'][0] : this.prestador['Vehículo'][0])
        formData.append('Marca', this.prestador['Marca'][0])
        formData.append('Modelo', this.prestador['Modelo'][0])
        formData.append('Ano', this.prestador['Año'][0])
        formData.append('Ejes', this.prestador['Ejes'][0])
        formData.append('Patente', this.prestador['Patente'][0])
        formData.append('CapacidadCarga', this.prestador['CapacidadCarga'][0])
        for (let i = 0; i < this.img.length; i++) {
				  formData.append('img', this.img[i]);
			  }
        formData.append('imgFrente', this.imgFrente[0]);
        formData.append('imgDorso', this.imgDorso[0]);
      }

      this.api.crearUsuario(formData).then(resp =>{
        if(resp.ok){
          Swal.fire({title:'Cuenta creada con éxito', text: 'Se ha enviado un mail de confirmación al Email: '+resp.EmailResponsable,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }else{
          Swal.fire({title:resp.msg,confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'})
        }
      }, (err)=>{				
        Swal.fire({title:'Ocurrió un error',confirmButtonText:'Aceptar',confirmButtonColor:'#ea580c'});
      });
    }
  }

  checkCampos(campos:any){
    for (const key in campos) {
      if(campos[key][0]=='') this.flag=false;
      if(campos[key][0]=='Otro' && this.otro[key+'Otro'][0]=='') this.flag=false;
      campos[key][1] = campos[key][0]=='' ? '*Campo Obligatorio' : (campos[key][0]=='Otro' && this.otro[key+'Otro'][0]=='') ? '*Campo Obligatorio' : '';
    }    
  }
}
