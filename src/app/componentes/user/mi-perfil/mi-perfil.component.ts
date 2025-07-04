import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './mi-perfil.component.html',
  styleUrl: '../user.component.css'
})
export class MiPerfilComponent {
  @Input() edit:boolean=true;
  @Input() Usuario:{[key: string]: string}={};
  @Input() Usuario2:{[key: string]: string}={};
  @Input() dato:{[key: string]: string}={};
  @Input() dato2:{[key: string]: string}={};
  @Input() otro:{[key: string]: string}={
    CondiciónFiscalOtro: '',
    RubroOtro: '',
    VehículoOtro: '',
  };
}
