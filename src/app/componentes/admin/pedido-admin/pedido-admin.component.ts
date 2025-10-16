import { Component } from '@angular/core';
import { PedidoComponent } from "../../pedido/crear-pedido/pedido.component";

@Component({
  selector: 'app-pedido-admin',
  standalone: true,
  imports: [PedidoComponent],
  templateUrl: './pedido-admin.component.html',
  styleUrl: '../admin.component.css'
})
export class PedidoAdminComponent {

}
