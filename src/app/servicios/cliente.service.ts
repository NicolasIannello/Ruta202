import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  crearPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/crearPedido', dato, {'headers':this.header})
  }
}
