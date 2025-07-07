import { Component } from '@angular/core';
import { CommonService } from '../../../servicios/common.service';

@Component({
  selector: 'app-security',
  standalone: true,
  imports: [],
  templateUrl: './security.component.html',
  styleUrls: ['../user.component.css','../../login/login.component.css']

})
export class SecurityComponent{

  constructor(public api:CommonService) {}
}