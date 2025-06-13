import { CommonModule, ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  servicios:Array<string>=["Aseguradoras","Brokers de Seguros","Productores de Seguros","Estudios Liquidadores de Siniestros",
    "Concesionarios del Automotor","Agencias revendedoras de Autos","Talleres Mecánicos y de Carrocería",]

  constructor(public scroller: ViewportScroller) {}

}
