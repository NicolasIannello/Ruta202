import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonService } from '../../servicios/common.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  showPassword: string = 'password';

  constructor(public common: CommonService) {}
}
