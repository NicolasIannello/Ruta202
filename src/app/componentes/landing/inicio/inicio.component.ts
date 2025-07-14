import { AfterViewInit, Component } from '@angular/core';
import { ServiciosComponent } from "../servicios/servicios.component";
import { NosotrosComponent } from "../nosotros/nosotros.component";
import { ContactoComponent } from "../contacto/contacto.component";
import { CommonModule, ViewportScroller } from '@angular/common';
import { CommonService } from '../../../servicios/common.service';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../../servicios/usuarios.service';
import { filter, first } from 'rxjs';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, ServiciosComponent, NosotrosComponent, ContactoComponent, RouterModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent implements AfterViewInit{
  flag:string='2';

  constructor(public scroller: ViewportScroller, public common: CommonService, private api: UsuariosService) {}

  ngAfterViewInit(): void {
    this.api.ready$.pipe(filter(isReady => isReady),first()).subscribe(() => {
      this.flag=this.api.getTipo()=='' ? '2' : this.api.getTipo();
    });
  }
}
