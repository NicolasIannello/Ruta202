import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css','../navbar/navbar.component.css']
})
export class FooterComponent {
  mail:string='remolques@ruta202.com.ar';

  constructor(public scroller: ViewportScroller) {}
}
