import { Component } from '@angular/core';

@Component({
  selector: 'app-cambio-password',
  standalone: true,
  imports: [],
  templateUrl: './cambio-password.component.html',
  styleUrls: ['./cambio-password.component.css', '../login/login.component.css']
})
export class CambioPasswordComponent {
  showPassword:String='password';
}
