import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { environment } from '../../../environments/environment';

const numero=environment.numeroString;

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css','../navbar/navbar.component.css']
})
export class FooterComponent {
  mail:string='remolques@ruta202.com.ar';
  numero:string=numero;

  constructor(public scroller: ViewportScroller) {}
}
