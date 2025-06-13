import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { ServiciosComponent } from "./servicios/servicios.component";
import { NosotrosComponent } from "./nosotros/nosotros.component";
import { ContactoComponent } from "./contacto/contacto.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ServiciosComponent, NosotrosComponent, ContactoComponent],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(public scroller: ViewportScroller) {}

}
