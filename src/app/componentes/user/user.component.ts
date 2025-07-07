import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MiPerfilComponent } from "./mi-perfil/mi-perfil.component";
import { SecurityComponent } from "./security/security.component";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [FormsModule, MiPerfilComponent, SecurityComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent{
  edit:boolean=true;
  tab:string='perfil';
  tipoUser:string='';
  empresa:string='';
  mail:string='';
  loading:boolean=false;
  @ViewChild('miPerfil', { static: false }) miPerfil!: MiPerfilComponent;

  constructor() {}

  handleMessage(message: any) {        
    switch (message.tipo) {
      case 'perfil': 
        this.tipoUser=message.data[0]; 
        this.empresa=message.data[1]; 
        this.mail=message.data[2]; 
      break;
      case 'edit': 
        this.edit=message.data; 
      break;
      case 'loading': 
        this.loading=message.data; 
      break;
    }
  }
}
