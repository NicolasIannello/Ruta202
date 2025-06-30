import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../servicios/common.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
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
    CondiciónFiscalOtro: ['',''],
    Contraseña: ['',''],
    Contraseña2: ['',''],
  };
  cliente:{[key: string]: [string,string]}={
    DNI: ['',''],
    Cargo: ['',''],
    Rubro: ['',''],
    RubroOtro: ['',''],
  };
  prestador:{[key: string]: [string,string]}={
    EmailOperativo: ['',''],
    Vehículo: ['',''],
    VehículoOtro: ['',''],
    Marca: ['',''],
    Modelo: ['',''],
    Año: ['',''],
    Ejes: ['',''],
    Patente: ['',''],
    CapacidadCarga: ['',''],
  };
  sources: Array<any> = [];
  frente: any = {id: '', link: '', name: ''};
  dorso: any = {id: '', link: '', name: ''};

  constructor(public common: CommonService) {}

  showImg(event: Event, int:number){
    if (int==0) this.sources=[];
    if (int==1) this.frente={id: '', link:'', name: ''};
    if (int==2) this.dorso={id: '', link:'', name: ''};

    const element = event.currentTarget as HTMLInputElement;
		let cantidad = element.files?.length || 0;    
    
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
              console.log(int);
              
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
      CondiciónFiscalOtro: ['',''],
      Contraseña: ['',''],
      Contraseña2: ['',''],
    };
    if(i==0){
      this.prestador={
        EmailOperativo: ['',''],
        Vehículo: ['',''],
        VehículoOtro: ['',''],
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
        RubroOtro: ['',''],
      };
    }
  }
}
