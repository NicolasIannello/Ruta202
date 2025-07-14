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
import { PedidoComponent } from './componentes/pedido/pedido.component';
import { loggedClienteGuard } from './guards/logged-cliente.guard';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LoginComponent, canActivate: [loggedOutGuard] },
        { path: 'registro', component: RegistroComponent, canActivate: [loggedOutGuard] },
        { path: 'validacion/:token', component: ValidacionComponent, canActivate: [loggedOutGuard] },
        { path: 'cambioPassword/:token', component: CambioPasswordComponent, canActivate: [loggedOutGuard] },
        { path: 'perfil', component: UserComponent, canActivate: [loggedGuard] },
        { path: 'crearPedido', component: PedidoComponent, canActivate: [loggedClienteGuard] },
    ] },
    { path: 'panelAdmin', component: AdminComponent , children: [
        { path: '', component: LoginAdminComponent, canActivate: [loggedOutAdminGuard] },
        { path: 'inicio', component: InicioAdminComponent, canActivate: [loggedGuard] },
        { path: 'usuarios', component: UsuariosComponent, canActivate: [loggedGuard] },
        { path: '**',   redirectTo: 'inicio', pathMatch: 'full' },
    ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
