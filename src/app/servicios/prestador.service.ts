import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const base_url=environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PrestadorService {
  header:HttpHeaders;

  constructor(private http: HttpClient) {
    this.header=new HttpHeaders().set('Acces-Control-Allow-Origin','*');
  }

  getPedidos(dato:any):Observable<any>{
    return this.http.post(base_url+'/prestadores/verPedidos', dato, {'headers':this.header})
  }
  ofertaPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/prestadores/ofertaPedido', dato, {'headers':this.header})
  }
  getPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/prestadores/verPedido', dato, {'headers':this.header})
  }
  getOfertaPedido(dato:any):Observable<any>{
    return this.http.post(base_url+'/prestadores/getOfertaPedido', dato, {'headers':this.header})
  }
  getOfertas(dato:any):Observable<any>{
    return this.http.post(base_url+'/prestadores/getOfertas', dato, {'headers':this.header})
  }
}
