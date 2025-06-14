import { Component } from '@angular/core';
import { ServiciosComponent } from "../servicios/servicios.component";
import { NosotrosComponent } from "../nosotros/nosotros.component";
import { ContactoComponent } from "../contacto/contacto.component";
import { CommonModule, ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ServiciosComponent, NosotrosComponent, ContactoComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {
  constructor(public scroller: ViewportScroller) {}

}
