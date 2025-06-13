import { Routes } from '@angular/router';
import { LandingComponent } from './componentes/landing/landing.component';

export const routes: Routes = [
    { path: '', component: LandingComponent, children: [
        //{ path: '', component: InicioComponent },
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
