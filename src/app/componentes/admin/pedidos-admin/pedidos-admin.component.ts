import { Component } from '@angular/core';
import { VerPedidoComponent } from "../../pedido/ver-pedido/ver-pedido.component";

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [VerPedidoComponent],
  templateUrl: './pedidos-admin.component.html',
  styleUrl: '../admin.component.css'
})
export class PedidosAdminComponent {

}
