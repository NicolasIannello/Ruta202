import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { ValidacionComponent } from './componentes/validacion/validacion.component';
import { loggedOutGuard } from './guards/logged-out.guard';
import { CambioPasswordComponent } from './componentes/cambio-password/cambio-password.component';
import { loggedGuard } from './guards/logged.guard';
import { UserComponent } from './componentes/user/user.component';
import { AdminComponent } from './componentes/admin/admin.component';
import { LoginAdminComponent } from './componentes/admin/login-admin/login-admin.component';
import { loggedOutAdminGuard } from './guards/logged-out-admin.guard';
import { InicioAdminComponent } from './componentes/admin/inicio-admin/inicio-admin.component';
import { UsuariosComponent } from './componentes/admin/usuarios/usuarios.component';
import { PedidoComponent } from './componentes/pedido/crear-pedido/pedido.component';
import { loggedClienteGuard } from './guards/logged-cliente.guard';
import { loggedPrestadorGuard } from './guards/logged-prestador.guard';
import { VerPedidoComponent } from './componentes/pedido/ver-pedido/ver-pedido.component';
import { MisPedidosComponent } from './componentes/pedido/mis-pedidos/mis-pedidos.component';
import { OfertasComponent } from './componentes/pedido/ofertas/ofertas.component';
import { PedidoAdminComponent } from './componentes/admin/pedido-admin/pedido-admin.component';
import { PedidosAdminComponent } from './componentes/admin/pedidos-admin/pedidos-admin.component';
import { PdfsComponent } from './componentes/admin/pdfs/pdfs.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LoginComponent, canActivate: [loggedOutGuard] },
        { path: 'registro', component: RegistroComponent, canActivate: [loggedOutGuard] },
        { path: 'validacion/:token', component: ValidacionComponent, canActivate: [loggedOutGuard] },
        { path: 'cambioPassword/:token', component: CambioPasswordComponent, canActivate: [loggedOutGuard] },
        { path: 'perfil', component: UserComponent, canActivate: [loggedGuard] },
        { path: 'crearPedido', component: PedidoComponent, canActivate: [loggedClienteGuard] },
        { path: 'verPedidos', component: VerPedidoComponent, canActivate: [loggedPrestadorGuard] },
        { path: 'verPedidos/:id', component: VerPedidoComponent, canActivate: [loggedPrestadorGuard] },
        { path: 'misPedidos', component: MisPedidosComponent, canActivate: [loggedClienteGuard] },
        { path: 'misPedidos/:id', component: MisPedidosComponent, canActivate: [loggedClienteGuard] },
        { path: 'misOfertas', component: OfertasComponent, canActivate: [loggedPrestadorGuard] },
        { path: 'pedido/:id/2', component: VerPedidoComponent, canActivate: [loggedOutGuard] },
        { path: 'pedido/:id/1', component: MisPedidosComponent, canActivate: [loggedOutGuard] },
    ] },
    { path: 'panelAdmin', component: AdminComponent , children: [
        { path: '', component: LoginAdminComponent, canActivate: [loggedOutAdminGuard] },
        { path: 'inicio', component: InicioAdminComponent, canActivate: [loggedGuard] },
        { path: 'usuarios', component: UsuariosComponent, canActivate: [loggedGuard] },
        { path: 'crearPedido', component: PedidoAdminComponent, canActivate: [loggedGuard] },
        { path: 'pedidos', component: PedidosAdminComponent, canActivate: [loggedGuard] },
        { path: 'pedidos/:id', component: PedidosAdminComponent, canActivate: [loggedGuard] },
        { path: 'pdfs', component: PdfsComponent, canActivate: [loggedGuard] },
        { path: '**',   redirectTo: 'inicio', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
