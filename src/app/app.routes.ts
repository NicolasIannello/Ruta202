import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { ValidacionComponent } from './componentes/validacion/validacion.component';
import { loggedOutGuard } from './guards/logged-out.guard';
import { CambioPasswordComponent } from './componentes/cambio-password/cambio-password.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LoginComponent, canActivate: [loggedOutGuard] },
        { path: 'registro', component: RegistroComponent, canActivate: [loggedOutGuard] },
        { path: 'validacion/:token', component: ValidacionComponent, canActivate: [loggedOutGuard] },
        { path: 'cambioPassword/:token', component: CambioPasswordComponent, canActivate: [loggedOutGuard] },
    ] },
    // { path: 'panelAdmin', component: PanelAdminComponent , children: [
    //     { path: '', component: LoginComponent },
    //     { path: 'usuarios', component: UsuariosComponent, canActivate:[authGuard] },
    //     { path: 'autos', component: AutosComponent, canActivate:[authGuard] },
    //     { path: 'Term&Cond', component: TycComponent, canActivate:[authGuard] },
    //     { path: '**',   redirectTo: '', pathMatch: 'full' },
    // ]},
    { path: '**',   redirectTo: '', pathMatch: 'full' },
];
