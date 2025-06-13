import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  servicios:Array<string>=["Aseguradoras","Brokers de Seguros","Productores de Seguros","Estudios Liquidadores de Siniestros",
    "Concesionarios del Automotor","Agencias revendedoras de Autos","Talleres Mecánicos y de Carrocería",]

}
