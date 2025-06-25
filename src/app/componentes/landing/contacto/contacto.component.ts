import { Component } from '@angular/core';
import { CommonService } from '../../../servicios/common.service';
import { environment } from '../../../../environments/environment';

const numero=environment.numeroString;

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  mail:string='remolques@ruta202.com.ar';
  numero:string=numero;

  constructor(public common: CommonService) {}
}
