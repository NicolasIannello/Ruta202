import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const numero=environment.numero;

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor() { }

  openWsp(){
    window.open('https://wa.me/'+numero);
  }
}
