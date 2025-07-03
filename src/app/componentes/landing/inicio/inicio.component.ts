import { Component } from '@angular/core';
import { ServiciosComponent } from "../servicios/servicios.component";
import { NosotrosComponent } from "../nosotros/nosotros.component";
import { ContactoComponent } from "../contacto/contacto.component";
import { CommonModule, ViewportScroller } from '@angular/common';
import { CommonService } from '../../../servicios/common.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ServiciosComponent, NosotrosComponent, ContactoComponent, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(public scroller: ViewportScroller, public common: CommonService) {}

}
