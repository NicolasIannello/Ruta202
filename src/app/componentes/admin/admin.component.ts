import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginAdminComponent } from "./login-admin/login-admin.component";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {

}
