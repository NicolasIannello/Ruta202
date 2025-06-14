import { ViewportScroller } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  mail:string='remolques@ruta202.com.ar';
  
  constructor(public scroller: ViewportScroller) {}
}
