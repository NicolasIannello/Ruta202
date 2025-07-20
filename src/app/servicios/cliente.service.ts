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
  getPedidos(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/getPedidos', dato, {'headers':this.header})
  }
  getOfertas(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/getOfertas', dato, {'headers':this.header})
  }
  borrarOferta(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/borrarOferta', dato, {'headers':this.header})
  }
  aceptarOferta(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/aceptarOferta', dato, {'headers':this.header})
  }
  geocode(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/geocode', dato, {'headers':this.header})
  }
  geocodeReverse(dato:any):Observable<any>{
    return this.http.post(base_url+'/clientes/geocodeReverse', dato, {'headers':this.header})
  }
}
