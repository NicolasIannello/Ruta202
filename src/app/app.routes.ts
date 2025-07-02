import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';
import { LoginComponent } from './componentes/login/login.component';
import { RegistroComponent } from './componentes/registro/registro.component';
import { InicioComponent } from './componentes/landing/inicio/inicio.component';
import { ValidacionComponent } from './componentes/validacion/validacion.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        { path: '', component: InicioComponent },
        { path: 'login', component: LoginComponent },
        { path: 'registro', component: RegistroComponent },
        { path: 'validacion/:token', component: ValidacionComponent },
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
